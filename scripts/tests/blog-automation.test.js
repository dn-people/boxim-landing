const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const sharp = require("sharp");

const projectDir = path.join(__dirname, "..", "..");
const {
  computeMergeMode,
  evaluateDate,
  loadRunGate,
  parsePublishedRows,
} = require("../check-blog-run-gates");
const { generateThumbnail } = require("../generate-blog-thumbnail");
const {
  validateArticle,
  validatePublicationDiff,
  validatePublicationFiles,
} = require("../verify-blog");

const policy = JSON.parse(fs.readFileSync(
  path.join(projectDir, "docs", "blog", "AUTOMATION_POLICY.json"),
  "utf8",
));
const calendar = JSON.parse(fs.readFileSync(
  path.join(projectDir, "docs", "blog", "holidays", "2026.json"),
  "utf8",
));
const publicationSlug = "esim-device-id-check";

const createPublicationFixture = () => {
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "dnbn-publication-"));
  const copy = (relativePath) => {
    const source = path.join(projectDir, relativePath);
    const destination = path.join(fixtureDir, relativePath);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  };

  [
    "docs/blog/AUTOMATION_POLICY.json",
    "docs/blog/TOPICS.md",
    "public/blog/index.html",
    `public/blog/${publicationSlug}/index.html`,
    `public/blog/assets/${publicationSlug}.png`,
    "public/sitemap.xml",
  ].forEach(copy);
  return fixtureDir;
};

const publicationChanges = () => [
  { status: "A", path: `public/blog/${publicationSlug}/index.html` },
  { status: "A", path: `public/blog/assets/${publicationSlug}.png` },
  { status: "M", path: "public/blog/index.html" },
  { status: "M", path: "public/sitemap.xml" },
  { status: "M", path: "docs/blog/TOPICS.md" },
];

test("run gate distinguishes weekends, holidays, and business days", () => {
  assert.equal(evaluateDate("2026-07-18", calendar).status, "SKIPPED_WEEKEND");
  assert.equal(evaluateDate("2026-07-17", calendar).status, "SKIPPED_HOLIDAY");
  assert.equal(evaluateDate("2026-07-16", calendar).status, "ELIGIBLE_BUSINESS_DAY");
});

test("run gate fails closed when an annual calendar is missing", () => {
  const result = loadRunGate({ projectDir, date: "2027-01-04" });
  assert.equal(result.status, "BLOCKED");
  assert.match(result.reason, /calendar missing/);
});

test("run gate detects an already published date", () => {
  const result = loadRunGate({ projectDir, date: "2026-07-15" });
  assert.equal(result.status, "NO_OP_ALREADY_PUBLISHED");
});

test("manual review switches after five post-rollout publications", () => {
  const topics = fs.readFileSync(path.join(projectDir, "docs", "blog", "TOPICS.md"), "utf8");
  const baselineRows = parsePublishedRows(topics);
  assert.equal(computeMergeMode(baselineRows, policy).mergeMode, "MANUAL_REVIEW");
  const newRows = Array.from({ length: 5 }, (_, index) => ({
    date: `2026-07-${20 + index}`,
    slug: `new-topic-guide-${index}`,
  }));
  const result = computeMergeMode([...baselineRows, ...newRows], policy);
  assert.equal(result.mergeMode, "AUTO_MERGE_ELIGIBLE");
  assert.equal(result.remainingManualReviews, 0);
});

test("deterministic thumbnail fallback creates an exact PNG", async () => {
  const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), "dnbn-thumbnail-"));
  const output = path.join(temporaryDir, "sample-topic-guide.png");
  try {
    await generateThumbnail({
      slug: "sample-topic-guide",
      pillar: "요금제 선택",
      output,
      projectDir,
    });
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
  } finally {
    fs.rmSync(temporaryDir, { recursive: true, force: true });
  }
});

test("current automated article satisfies the new blog validator", async () => {
  const result = await validatePublicationFiles({
    projectDir,
    slug: publicationSlug,
  });
  assert.deepEqual(result.errors, []);
});

test("publication validation accepts exactly five controlled artifacts", async () => {
  const fixtureDir = createPublicationFixture();
  try {
    const result = await validatePublicationDiff({
      projectDir: fixtureDir,
      changes: publicationChanges(),
    });
    assert.deepEqual(result.errors, []);
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test("publication validation rejects a committed source RSS change", async () => {
  const fixtureDir = createPublicationFixture();
  try {
    const result = await validatePublicationDiff({
      projectDir: fixtureDir,
      changes: [...publicationChanges(), { status: "M", path: "public/rss.xml" }],
    });
    assert.ok(result.errors.some((error) =>
      error.includes("unexpected publication paths: public/rss.xml")));
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test("publication validation rejects a non-1200x630 thumbnail", async () => {
  const fixtureDir = createPublicationFixture();
  const imageFile = path.join(fixtureDir, "public", "blog", "assets", `${publicationSlug}.png`);
  try {
    fs.rmSync(imageFile);
    await sharp({
      create: { width: 1200, height: 629, channels: 4, background: "#0159fb" },
    }).png().toFile(imageFile);
    const result = await validatePublicationFiles({ projectDir: fixtureDir, slug: publicationSlug });
    assert.ok(result.errors.some((error) => error.includes("1200x630 PNG")));
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test("publication validation rejects an unexpected changed file", async () => {
  const fixtureDir = createPublicationFixture();
  try {
    const result = await validatePublicationDiff({
      projectDir: fixtureDir,
      changes: [...publicationChanges(), { status: "A", path: "docs/blog/unexpected.md" }],
    });
    assert.ok(result.errors.some((error) => error.includes("unexpected publication paths")));
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
});

test("publication validation rejects multiple new articles", async () => {
  const result = await validatePublicationDiff({
    projectDir,
    changes: [
      { status: "A", path: `public/blog/${publicationSlug}/index.html` },
      { status: "A", path: "public/blog/second-topic-guide/index.html" },
    ],
  });
  assert.deepEqual(result.errors, ["publication diff adds 2 articles; expected one"]);
});

test("FAQ JSON-LD mismatch is rejected", () => {
  const articleFile = path.join(
    projectDir,
    "public",
    "blog",
    publicationSlug,
    "index.html",
  );
  const html = fs.readFileSync(articleFile, "utf8");
  const broken = html.replace(
    '"text":"EID만으로 항상 신청이 끝나는 것은 아닙니다.',
    '"text":"본문과 다른 답변입니다.',
  );
  assert.notEqual(broken, html);
  const result = validateArticle({ html: broken, slug: publicationSlug, policy });
  assert.ok(result.errors.some((error) => error.includes("FAQ JSON-LD mismatch")));
});
