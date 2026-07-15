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
const { validateArticle, validatePublicationFiles } = require("../verify-blog");

const policy = JSON.parse(fs.readFileSync(
  path.join(projectDir, "docs", "blog", "AUTOMATION_POLICY.json"),
  "utf8",
));
const calendar = JSON.parse(fs.readFileSync(
  path.join(projectDir, "docs", "blog", "holidays", "2026.json"),
  "utf8",
));

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
    slug: "internet-tv-bundle-guide",
  });
  assert.deepEqual(result.errors, []);
});

test("FAQ JSON-LD mismatch is rejected", () => {
  const articleFile = path.join(
    projectDir,
    "public",
    "blog",
    "internet-tv-bundle-guide",
    "index.html",
  );
  const html = fs.readFileSync(articleFile, "utf8");
  const broken = html.replace(
    '"text": "항상 그런 것은 아닙니다.',
    '"text": "본문과 다른 답변입니다.',
  );
  const result = validateArticle({ html: broken, slug: "internet-tv-bundle-guide", policy });
  assert.ok(result.errors.some((error) => error.includes("FAQ JSON-LD mismatch")));
});
