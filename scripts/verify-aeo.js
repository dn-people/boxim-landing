const fs = require("fs");
const path = require("path");

const projectDir = path.join(__dirname, "..");
const buildDir = path.join(projectDir, "build");
let failed = false;

const fail = (message) => {
  console.error(`AEO FAIL: ${message}`);
  failed = true;
};

const read = (relativePath) =>
  fs.readFileSync(path.join(buildDir, relativePath), "utf8");

for (const file of [
  "index.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "rss.xml",
  ".well-known/security.txt",
]) {
  if (!fs.existsSync(path.join(buildDir, file))) fail(`missing ${file}`);
}

if (!fs.existsSync(path.join(buildDir, "index.html"))) process.exit(1);

const html = read("index.html");
const h1Count = (html.match(/<h1\b/gi) || []).length;
const h2Count = (html.match(/<h2\b/gi) || []).length;
if (h1Count !== 1) fail(`initial HTML must contain one h1 (found ${h1Count})`);
if (h2Count < 3) fail(`initial HTML needs meaningful h2 sections (found ${h2Count})`);
if (!/<h[23][^>]*>[^<]*(무엇|어떤|어떻게|언제)/i.test(html))
  fail("question-form heading missing");
if (!/<table\b/i.test(html)) fail("service comparison table missing");
if (!/<ol\b/i.test(html)) fail("ordered service steps missing");
if (!/id="aeo-answer"/i.test(html)) fail("direct answer paragraph missing");
if (!/name="author"/i.test(html) || !/rel="author"/i.test(html))
  fail("author signals missing");
if (!/href="tel:16002891"/i.test(html) || !/href="mailto:help@dn-people\.com"/i.test(html))
  fail("telephone/email contact links missing");
if (!html.includes("사업자등록번호 432-81-02257") || !html.includes("https://dnbn.co.kr/company"))
  fail("operator or company profile signal missing");
if (!/<time\b[^>]*datetime="2026-07-14"/i.test(html))
  fail("visible update date missing");
if (!/rel="canonical"\s+href="https:\/\/dn-people\.com\/"/i.test(html))
  fail("homepage canonical mismatch");
if (/noindex/i.test(html)) fail("homepage contains noindex");

const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || ["", ""])[1]
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
if (body.length < 1000) fail(`initial HTML body is too short (${body.length} chars)`);

const jsonLdBlocks = [...html.matchAll(
  /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
)];
const jsonLdValues = [];
for (const [index, block] of jsonLdBlocks.entries()) {
  try {
    jsonLdValues.push(JSON.parse(block[1].trim()));
  } catch (error) {
    fail(`invalid JSON-LD block ${index + 1}: ${error.message}`);
  }
}
const graph = jsonLdValues.flatMap((value) => value["@graph"] || [value]);
const hasType = (expected) => graph.some((value) => {
  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  return types.includes(expected);
});
for (const type of ["Organization", "WebSite", "WebPage", "BreadcrumbList", "Service", "FAQPage", "HowTo"])
  if (!hasType(type)) fail(`JSON-LD ${type} missing`);

const webPage = graph.find((value) => {
  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  return types.includes("WebPage");
});
if (!webPage?.datePublished || webPage.dateModified !== "2026-07-14")
  fail("WebPage publication/update dates missing");
if (webPage?.speakable?.["@type"] !== "SpeakableSpecification")
  fail("WebPage speakable metadata missing");

const faqPage = graph.find((value) => value["@type"] === "FAQPage");
for (const question of faqPage?.mainEntity || []) {
  if (!html.includes(question.name)) fail(`FAQ question not visible: ${question.name}`);
  if (!html.includes(question.acceptedAnswer?.text || "__missing_answer__"))
    fail(`FAQ answer not visible: ${question.name}`);
}

if (fs.existsSync(path.join(buildDir, "robots.txt"))) {
  const robots = read("robots.txt");
  for (const agent of ["Yeti", "Daum", "Daumoa", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"])
    if (!new RegExp(`User-agent:\\s*${agent}`, "i").test(robots)) fail(`robots.txt missing ${agent}`);
  if (!/User-agent:\s*\*[\s\S]*?Allow:\s*\//i.test(robots))
    fail("robots.txt wildcard allow missing");
  if (!/Sitemap:\s*https:\/\/dn-people\.com\/sitemap\.xml/i.test(robots))
    fail("robots.txt sitemap URL mismatch");
}

if (fs.existsSync(path.join(buildDir, "rss.xml"))) {
  const rss = read("rss.xml");
  const blogSlugs = fs.readdirSync(path.join(buildDir, "blog"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()
      && fs.existsSync(path.join(buildDir, "blog", entry.name, "index.html")))
    .map((entry) => entry.name);
  for (const slug of blogSlugs)
    if (!rss.includes(`https://dn-people.com/blog/${slug}/`)) fail(`RSS missing ${slug}`);
}

if (failed) process.exit(1);
console.log(`AEO VERIFY OK: ${body.length} initial body chars, ${jsonLdBlocks.length} JSON-LD block`);
