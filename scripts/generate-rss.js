const fs = require("fs");
const path = require("path");

const projectDir = path.join(__dirname, "..");
const blogDir = path.join(projectDir, "public", "blog");
const outputFile = path.join(projectDir, "public", "rss.xml");

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${weekdays[date.getUTCDay()]}, ${String(date.getUTCDate()).padStart(2, "0")} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} 09:00:00 +0900`;
};

const entries = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const articleFile = path.join(blogDir, entry.name, "index.html");
    if (!fs.existsSync(articleFile)) return null;

    const html = fs.readFileSync(articleFile, "utf8");
    const jsonLdBlocks = [...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    )];
    const values = jsonLdBlocks.map((match) => JSON.parse(match[1].trim()));
    const graph = values.flatMap((value) => value["@graph"] || [value]);
    const article = graph.find((value) => {
      const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
      return types.some((type) => ["Article", "BlogPosting", "NewsArticle"].includes(type));
    });

    if (!article?.headline || !article?.datePublished) {
      throw new Error(`Article JSON-LD is incomplete: ${articleFile}`);
    }

    return {
      slug: entry.name,
      title: article.headline,
      description: article.description || "동네방네 통신생활 가이드",
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

if (entries.length === 0) {
  throw new Error("No blog articles found for RSS generation");
}

const latestDate = entries.reduce(
  (latest, entry) => entry.dateModified > latest ? entry.dateModified : latest,
  entries[0].dateModified,
);

const items = entries.map((entry) => {
  const link = `https://dn-people.com/blog/${entry.slug}/`;
  return [
    "    <item>",
    `      <title>${escapeXml(entry.title)}</title>`,
    `      <link>${link}</link>`,
    `      <guid isPermaLink="true">${link}</guid>`,
    `      <description>${escapeXml(entry.description)}</description>`,
    `      <pubDate>${toRfc822(entry.datePublished)}</pubDate>`,
    "    </item>",
  ].join("\n");
}).join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>동네방네 통신생활 가이드</title>
    <link>https://dn-people.com/blog/</link>
    <description>스마트폰 구매, 요금제, 번호이동을 이해하기 쉽게 설명하는 동네방네 공식 가이드</description>
    <language>ko-KR</language>
    <lastBuildDate>${toRfc822(latestDate)}</lastBuildDate>
    <atom:link href="https://dn-people.com/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

fs.writeFileSync(outputFile, rss, "utf8");
console.log(`RSS generated: ${entries.length} articles`);
