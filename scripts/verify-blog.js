const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");

const PROJECT_DIR = path.join(__dirname, "..");
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

const parseArgs = (argv) => {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) args[key] = true;
    else {
      args[key] = value;
      index += 1;
    }
  }
  return args;
};

const decodeEntities = (value) => value
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16)))
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'");

const stripTags = (value) => decodeEntities(value
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " "));

const normalizeText = (value) => stripTags(String(value || "")).replace(/\s+/g, " ").trim();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAttribute = (tag, name) => {
  const attribute = escapeRegExp(name);
  const quoted = tag.match(new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "i"));
  if (quoted) return quoted[2];
  const unquoted = tag.match(new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*([^\\s"'=<>]+)`, "i"));
  return unquoted ? unquoted[1] : null;
};

const extractTagTexts = (html, tag) => [...html.matchAll(
  new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"),
)].map((match) => normalizeText(match[1]));

const extractJsonLd = (html, errors) => {
  const values = [];
  const blocks = [...html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )];
  if (blocks.length === 0) errors.push("application/ld+json is missing");
  blocks.forEach((block, index) => {
    try {
      values.push(JSON.parse(block[1].trim()));
    } catch (error) {
      errors.push(`invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  });
  return values.flatMap((value) => value["@graph"] || [value]);
};

const hasType = (value, type) => {
  const types = Array.isArray(value?.["@type"]) ? value["@type"] : [value?.["@type"]];
  return types.includes(type);
};

const findMeta = (html, key, expected) => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    if ((getAttribute(match[0], key) || "").toLowerCase() === expected.toLowerCase())
      return getAttribute(match[0], "content");
  }
  return null;
};

const findCanonical = (html) => [...html.matchAll(/<link\b[^>]*>/gi)]
  .filter((match) => (getAttribute(match[0], "rel") || "").toLowerCase().split(/\s+/).includes("canonical"))
  .map((match) => getAttribute(match[0], "href"));

const domainAllowed = (hostname, domains) => domains.some(
  (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
);

const validateArticle = ({ html, slug, policy }) => {
  const errors = [];
  const expectedUrl = `https://dn-people.com/blog/${slug}/`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+){2,4}$/.test(slug)) errors.push("slug must contain 3-5 kebab-case words");
  if (html.includes("{{")) errors.push("unresolved template placeholder remains");
  if (/noindex/i.test(html)) errors.push("article contains noindex");

  const h1Values = extractTagTexts(html, "h1");
  if (h1Values.length !== 1) errors.push(`article must contain one h1 (found ${h1Values.length})`);
  const headline = h1Values[0] || "";
  if (headline.length < 20 || headline.length > 35)
    errors.push(`h1 must be 20-35 characters (found ${headline.length})`);

  const description = findMeta(html, "name", "description") || "";
  if (description.length < 70 || description.length > 110)
    errors.push(`meta description must be 70-110 characters (found ${description.length})`);

  const canonical = findCanonical(html);
  if (canonical.length !== 1 || canonical[0] !== expectedUrl)
    errors.push(`canonical must appear once and equal ${expectedUrl}`);
  if (findMeta(html, "property", "og:url") !== expectedUrl) errors.push("og:url does not match canonical");

  const articleMatch = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const compactArticleLength = normalizeText(articleMatch?.[1] || "").replace(/\s/g, "").length;
  if (compactArticleLength < 2500 || compactArticleLength > 4000)
    errors.push(`article visible text must be 2500-4000 characters (found ${compactArticleLength})`);
  if (!/<table\b/i.test(articleMatch?.[1] || "")) errors.push("article comparison table is missing");
  if (!/<ol\b/i.test(articleMatch?.[1] || "")) errors.push("article ordered checklist is missing");

  const questionHeadings = extractTagTexts(articleMatch?.[1] || "", "h2")
    .filter((heading) => /[?？]$/.test(heading));
  if (questionHeadings.length < 6 || questionHeadings.length > 9)
    errors.push(`article needs 6-9 question-form h2 headings (found ${questionHeadings.length})`);

  const summaryMatch = html.match(/<div\b[^>]*class=["'][^"']*\bsummary-box\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  if (!summaryMatch) errors.push("summary-box is missing");
  else {
    const summaryParagraphs = extractTagTexts(summaryMatch[1], "p")
      .filter((text) => text !== "요약 답변" && !text.startsWith("기준일:"));
    const summary = summaryParagraphs.join(" ");
    if (summary.length < 80 || summary.length > 150)
      errors.push(`summary answer must be 80-150 characters (found ${summary.length})`);
    if (!/기준일:\s*\d{4}년\s*\d{1,2}월\s*\d{1,2}일/.test(normalizeText(summaryMatch[1])))
      errors.push("summary-box reference date is missing");
  }

  const graph = extractJsonLd(html, errors);
  const articleJson = graph.find((value) => hasType(value, "Article") || hasType(value, "BlogPosting"));
  if (!articleJson) errors.push("Article JSON-LD is missing");
  else {
    if (normalizeText(articleJson.headline) !== headline) errors.push("Article headline does not match h1");
    if (articleJson.mainEntityOfPage?.["@id"] !== expectedUrl) errors.push("Article mainEntityOfPage mismatch");
    if (articleJson.image !== `${expectedUrl.replace(`/blog/${slug}/`, "")}/blog/assets/${slug}.png`
      && articleJson.image !== `https://dn-people.com/blog/assets/${slug}.png`)
      errors.push("Article image URL mismatch");
    for (const role of ["author", "publisher"]) {
      if (articleJson[role]?.name !== "동네방네" || articleJson[role]?.url !== "https://dnbn.co.kr/")
        errors.push(`Article ${role} organization mismatch`);
    }
  }

  const faqItems = [...html.matchAll(
    /<div\b[^>]*class=["'][^"']*\bfaq-item\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
  )].map((match) => ({
    question: extractTagTexts(match[1], "h3")[0] || "",
    answer: extractTagTexts(match[1], "p").join(" "),
  }));
  if (faqItems.length < 5 || faqItems.length > 6)
    errors.push(`visible FAQ needs 5-6 items (found ${faqItems.length})`);

  const faqPage = graph.find((value) => hasType(value, "FAQPage"));
  const faqJsonItems = faqPage?.mainEntity || [];
  if (faqJsonItems.length !== faqItems.length) errors.push("FAQ JSON-LD item count differs from visible FAQ");
  faqItems.forEach((item, index) => {
    const jsonItem = faqJsonItems[index];
    if (!jsonItem || normalizeText(jsonItem.name) !== item.question
      || normalizeText(jsonItem.acceptedAnswer?.text) !== item.answer)
      errors.push(`FAQ JSON-LD mismatch at item ${index + 1}`);
  });

  const sourceMatch = html.match(/<div\b[^>]*class=["'][^"']*\bsource-list\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const sourceLinks = sourceMatch ? [...sourceMatch[1].matchAll(/<a\b[^>]*>/gi)] : [];
  if (sourceLinks.length === 0) errors.push("official source links are missing");
  for (const link of sourceLinks) {
    const href = getAttribute(link[0], "href") || "";
    try {
      const url = new URL(href);
      if (!domainAllowed(url.hostname.toLowerCase(), policy.officialSourceDomains))
        errors.push(`source domain is not allowed: ${url.hostname}`);
    } catch {
      errors.push(`invalid official source URL: ${href}`);
    }
    const rel = (getAttribute(link[0], "rel") || "").toLowerCase().split(/\s+/);
    if (getAttribute(link[0], "target") !== "_blank" || !rel.includes("noopener"))
      errors.push(`official source link must use target=_blank and rel=noopener: ${href}`);
  }

  const hrefs = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => getAttribute(match[0], "href"));
  if (!hrefs.includes("/blog/")) errors.push("blog-list internal link is missing");
  if (!hrefs.some((href) => /^\/blog\/[a-z0-9-]+\/$/.test(href || "") && href !== `/blog/${slug}/`))
    errors.push("related-post internal link is missing");
  if (!html.includes(`/blog/assets/${slug}.png`)) errors.push("matching self-hosted thumbnail reference is missing");

  return {
    errors,
    metadata: {
      compactArticleLength,
      datePublished: articleJson?.datePublished,
      faqCount: faqItems.length,
      headline,
      questionHeadingCount: questionHeadings.length,
    },
  };
};

const readPolicy = (projectDir = PROJECT_DIR) => JSON.parse(fs.readFileSync(
  path.join(projectDir, "docs", "blog", "AUTOMATION_POLICY.json"),
  "utf8",
));

const validatePublicationFiles = async ({ projectDir = PROJECT_DIR, slug }) => {
  const errors = [];
  const articleFile = path.join(projectDir, "public", "blog", slug, "index.html");
  if (!fs.existsSync(articleFile)) return { errors: [`article missing: ${articleFile}`], metadata: {} };
  const html = fs.readFileSync(articleFile, "utf8");
  const articleResult = validateArticle({ html, slug, policy: readPolicy(projectDir) });
  errors.push(...articleResult.errors);

  const imageFile = path.join(projectDir, "public", "blog", "assets", `${slug}.png`);
  if (!fs.existsSync(imageFile)) errors.push("matching thumbnail is missing");
  else {
    try {
      const image = await sharp(imageFile).metadata();
      if (image.format !== "png" || image.width !== EXPECTED_WIDTH || image.height !== EXPECTED_HEIGHT)
        errors.push(`new thumbnail must be ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} PNG`);
    } catch (error) {
      errors.push(`thumbnail cannot be read: ${error.message}`);
    }
  }

  const expectedPath = `/blog/${slug}/`;
  const expectedUrl = `https://dn-people.com${expectedPath}`;
  const listing = fs.readFileSync(path.join(projectDir, "public", "blog", "index.html"), "utf8");
  const listingLinks = [...listing.matchAll(/<a\b[^>]*>/gi)].map((match) => getAttribute(match[0], "href"));
  if (listingLinks.filter((href) => href === expectedPath).length !== 1)
    errors.push("blog listing must contain exactly one new-post link");

  const sitemap = fs.readFileSync(path.join(projectDir, "public", "sitemap.xml"), "utf8");
  if ((sitemap.match(new RegExp(`<loc>${escapeRegExp(expectedUrl)}</loc>`, "g")) || []).length !== 1)
    errors.push("sitemap must contain exactly one new-post URL");

  const date = articleResult.metadata.datePublished;
  const topics = fs.readFileSync(path.join(projectDir, "docs", "blog", "TOPICS.md"), "utf8");
  if (!date || !new RegExp(`^\\|\\s*${escapeRegExp(date)}\\s*\\|\\s*${escapeRegExp(slug)}\\s*\\|`, "m").test(topics))
    errors.push("TOPICS.md published row is missing or has the wrong date");

  const rss = fs.readFileSync(path.join(projectDir, "public", "rss.xml"), "utf8");
  if (!rss.includes(`<link>${expectedUrl}</link>`) || !rss.includes(`<guid isPermaLink="true">${expectedUrl}</guid>`))
    errors.push("RSS item is missing");

  return { errors, metadata: articleResult.metadata };
};

const changedFiles = (projectDir, baseRef) => {
  const output = execFileSync(
    "git",
    ["diff", "--name-status", "--find-renames", `${baseRef}...HEAD`, "--"],
    { cwd: projectDir, encoding: "utf8" },
  ).trim();
  if (!output) return [];
  return output.split(/\r?\n/).map((line) => {
    const fields = line.split("\t");
    return { status: fields[0], path: fields[fields.length - 1].replace(/\\/g, "/") };
  });
};

const validatePublicationDiff = async ({ projectDir = PROJECT_DIR, changes }) => {
  const articles = changes.filter(({ status, path: changedPath }) =>
    status.startsWith("A") && /^public\/blog\/([a-z0-9-]+)\/index\.html$/.test(changedPath));
  if (articles.length === 0) return { skipped: true, message: "no new blog article in diff" };
  if (articles.length !== 1) return { errors: [`publication diff adds ${articles.length} articles; expected one`] };

  const slug = articles[0].path.split("/")[2];
  const expected = new Set([
    `public/blog/${slug}/index.html`,
    `public/blog/assets/${slug}.png`,
    "public/blog/index.html",
    "public/sitemap.xml",
    "docs/blog/TOPICS.md",
    "public/rss.xml",
  ]);
  const actual = new Set(changes.map(({ path: changedPath }) => changedPath));
  const unexpected = [...actual].filter((changedPath) => !expected.has(changedPath));
  const missing = [...expected].filter((expectedPath) => !actual.has(expectedPath));
  const errors = [];
  if (unexpected.length) errors.push(`unexpected publication paths: ${unexpected.join(", ")}`);
  if (missing.length) errors.push(`missing publication paths: ${missing.join(", ")}`);

  const result = await validatePublicationFiles({ projectDir, slug });
  errors.push(...result.errors);
  return { errors, metadata: result.metadata, slug };
};

const validateChangedPublication = async ({ projectDir = PROJECT_DIR, baseRef }) => {
  if (!baseRef) return { skipped: true, message: "no base ref supplied" };
  return validatePublicationDiff({ projectDir, changes: changedFiles(projectDir, baseRef) });
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  (async () => {
    const result = args.slug
      ? await validatePublicationFiles({ slug: args.slug })
      : await validateChangedPublication({ baseRef: args["base-ref"] || process.env.BLOG_BASE_REF });
    if (result.skipped) {
      console.log(`BLOG VERIFY SKIP: ${result.message}`);
      return;
    }
    if (result.errors?.length) {
      result.errors.forEach((error) => console.error(`BLOG FAIL: ${error}`));
      process.exitCode = 1;
      return;
    }
    console.log(`BLOG VERIFY OK: ${result.slug || args.slug}`);
  })().catch((error) => {
    console.error(`BLOG FAIL: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  changedFiles,
  domainAllowed,
  normalizeText,
  validateArticle,
  validateChangedPublication,
  validatePublicationDiff,
  validatePublicationFiles,
};
