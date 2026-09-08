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
const {
  computeCategoryDiversity,
  parseBacklogRows,
  parsePublishedRows: parseCategorizedRows,
  validateCategoryPlan,
} = require("../blog-categories");
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
const publicationSlug = "used-iphone-activation-lock";

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
    `public/blog/assets/${publicationSlug}-setup.png`,
    `public/blog/assets/${publicationSlug}-checklist.png`,
    "public/sitemap.xml",
    "public/rss.xml",
  ].forEach(copy);
  const articleFile = path.join(fixtureDir, "public", "blog", publicationSlug, "index.html");
  const originalArticle = fs.readFileSync(articleFile, "utf8");
  const categorizedArticle = originalArticle
    .replace(
      '<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />',
      '<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />\n    <meta name="dnbn:category" content="it-tech" />',
    )
    .replace(
      '"image":"https://dn-people.com/blog/assets/used-iphone-activation-lock.png",',
      '"image":"https://dn-people.com/blog/assets/used-iphone-activation-lock.png",\n            "articleSection":"IT·테크",',
    );
  assert.notEqual(categorizedArticle, originalArticle);
  fs.writeFileSync(articleFile, categorizedArticle);
  return fixtureDir;
};

const publicationChanges = () => [
  { status: "A", path: `public/blog/${publicationSlug}/index.html` },
  { status: "A", path: `public/blog/assets/${publicationSlug}.png` },
  { status: "A", path: `public/blog/assets/${publicationSlug}-setup.png` },
  { status: "A", path: `public/blog/assets/${publicationSlug}-checklist.png` },
  { status: "M", path: "public/blog/index.html" },
  { status: "M", path: "public/sitemap.xml" },
  { status: "M", path: "docs/blog/TOPICS.md" },
  { status: "M", path: "public/rss.xml" },
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

test("category plan covers every published card and keeps two backlog topics per category", () => {
  const topics = fs.readFileSync(path.join(projectDir, "docs", "blog", "TOPICS.md"), "utf8");
  const listing = fs.readFileSync(path.join(projectDir, "public", "blog", "index.html"), "utf8");
  const result = validateCategoryPlan({ topics, listing, policy });
  assert.deepEqual(result.errors, []);
  assert.equal(result.publishedRows.length, 33);
  assert.deepEqual(result.backlogCounts, {
    "it-tech": 2,
    "carrier-issues": 2,
    rental: 2,
    "product-reviews": 2,
    "buying-guides": 2,
  });
});

test("category diversity prioritizes rental and product reviews in the current window", () => {
  const topics = fs.readFileSync(path.join(projectDir, "docs", "blog", "TOPICS.md"), "utf8");
  const rows = parseCategorizedRows(topics);
  const diversity = computeCategoryDiversity(rows, policy);
  assert.deepEqual(diversity.counts, {
    "it-tech": 3,
    "carrier-issues": 4,
    rental: 0,
    "product-reviews": 0,
    "buying-guides": 3,
  });
  assert.deepEqual(diversity.recommendedCategories, ["rental", "product-reviews"]);
  assert.equal(diversity.nextCategory, "rental");
  assert.equal(parseBacklogRows(topics, policy).length, 10);
});

test("category diversity excludes a category after two consecutive publications", () => {
  const rows = [
    { slug: "latest-rental-guide", category: "rental" },
    { slug: "previous-rental-guide", category: "rental" },
    { slug: "older-buying-guide", category: "buying-guides" },
  ];
  const diversity = computeCategoryDiversity(rows, policy);
  assert.equal(diversity.consecutiveCount, 2);
  assert.ok(!diversity.recommendedCategories.includes("rental"));
});

test("category plan rejects a listing card assigned to a different category", () => {
  const topics = fs.readFileSync(path.join(projectDir, "docs", "blog", "TOPICS.md"), "utf8");
  const listing = fs.readFileSync(path.join(projectDir, "public", "blog", "index.html"), "utf8")
    .replace('data-category="it-tech" href="/blog/galaxy-battery-self-check/"',
      'data-category="rental" href="/blog/galaxy-battery-self-check/"');
  const result = validateCategoryPlan({ topics, listing, policy });
  assert.ok(result.errors.some((error) => error.includes("galaxy-battery-self-check")));
});

test("manual review switches after the configured post-rollout publications", () => {
  const baselineRows = policy.manualReview.baselinePublishedSlugs.map((slug, index) => ({
    date: `2026-06-${String(index + 1).padStart(2, "0")}`,
    slug,
  }));
  assert.equal(computeMergeMode(baselineRows, policy).mergeMode, "MANUAL_REVIEW");
  const newRows = Array.from({ length: policy.manualReview.requiredPublishedPosts }, (_, index) => ({
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
    requireInlineImages: true,
  });
  assert.deepEqual(result.errors, []);
});

test("publication validation accepts six core artifacts and two inline visuals", async () => {
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

test("publication validation requires the published source RSS change", async () => {
  const fixtureDir = createPublicationFixture();
  try {
    const result = await validatePublicationDiff({
      projectDir: fixtureDir,
      changes: publicationChanges().filter(({ path: changedPath }) => changedPath !== "public/rss.xml"),
    });
    assert.ok(result.errors.some((error) =>
      error.includes("missing publication paths: public/rss.xml")));
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
    '"text":"아니요. 나의 찾기로 활성화 잠금이 켜진 기기는 단순히 지워도 이전 소유자의 계정 연결이 남을 수 있습니다.',
    '"text":"본문과 다른 답변입니다.',
  );
  assert.notEqual(broken, html);
  const result = validateArticle({ html: broken, slug: publicationSlug, policy });
  assert.ok(result.errors.some((error) => error.includes("FAQ JSON-LD mismatch")));
});
