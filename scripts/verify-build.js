const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "..", "build");
let failed = false;
const fail = (msg) => { console.error("FAIL: " + msg); failed = true; };
const read = (p) => fs.readFileSync(path.join(buildDir, p), "utf8");
// CRA 번들은 한글을 \uXXXX로 이스케이프하므로 디코드 후 검색한다
const decode = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

// 1. 필수 산출물 존재
const mustExist = [
  "index.html", "CNAME", "robots.txt", "sitemap.xml",
  "blog/index.html", "blog/best-phone-buying-site/index.html",
  "hero.jpeg", "end.jpeg", "history.jpeg", "boxim-wallpaper.jpeg", "ogImage.jpg",
  "intro-1.jpeg", "intro-2.jpeg", "intro-3.jpeg",
  "mission-1.png", "mission-2.png", "why-1.png", "why-2.png", "why-3.png",
  "icon-phone.png", "icon-box.png", "icon-tablet.png", "icon-watch.png",
  "icon-usim.png", "icon-setupbox.png", "icon-plan.png", "icon-accs.png",
  "favicon.ico", "favicon-16x16.png", "favicon-32x32.png",
  "logo-dnbn.svg",
];
for (const f of mustExist)
  if (!fs.existsSync(path.join(buildDir, f))) fail(`missing build file: ${f}`);

// 2. 커스텀 도메인 보존
if (fs.existsSync(path.join(buildDir, "CNAME")) && read("CNAME").trim() !== "dn-people.com")
  fail("CNAME content changed");

// 3. 핵심 카피 보존 (특성화)
const jsDir = path.join(buildDir, "static", "js");
const mainJs = fs.existsSync(jsDir) && fs.readdirSync(jsDir).find((f) => /^main\..*\.js$/.test(f));
if (!mainJs) fail("main js bundle not found");
else {
  const bundle = decode(fs.readFileSync(path.join(jsDir, mainJs), "utf8"));
  const mustContain = [
    "통신생활 원스톱 솔루션",
    "현명한 통신생활 3대 원칙",
    "저렴하고, 간편하고, 쉬울까요?",
    "동네방네 이용자의",
    "https://boxim.io",
    "ark****",
    "ddin****",
    "누적 매출액",
    "삼성전자판매 공식 입찰협력사 선정",
    // R11: 데이터화된 concept/why/type 카피 보존
    "중간 유통구조 생략",
    "최신 자급제폰",
    "인터넷 / TV 요금제",
    // R12: 데이터화된 hero/intro/stats/history 카피 보존
    "스마트폰 구매",
    "유심 구매",
    "200억 +",
    "2024년",
  ];
  for (const s of mustContain) if (!bundle.includes(s)) fail(`bundle missing copy: ${s}`);
}

// 4. sitemap의 모든 URL이 실제 파일로 존재
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>https:\/\/dn-people\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
if (locs.length < 3) fail("sitemap must list at least 3 URLs");
for (const loc of locs) {
  const rel = loc === "/" ? "index.html" : loc.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
  if (!fs.existsSync(path.join(buildDir, rel))) fail(`sitemap URL has no file: ${loc}`);
}

// 5. index.html 기본 무결성
const html = read("index.html");
if (!html.includes("동네방네팀")) fail("homepage title text missing");
if (!html.includes('name="description"')) fail("meta description missing");
// (이후 항목들이 이 아래에 검증 라인을 누적 추가한다)
// R1: 깨진/중복 참조 제거 유지
if ((html.match(/<title/g) || []).length !== 1) fail("title must appear exactly once");
for (const bad of ["React App", "logo192", "manifest.json", "/public/pc/"])
  if (html.includes(bad)) fail(`index.html must not contain: ${bad}`);
// R2: Tailwind CDN 정확한 버전 고정 유지
if (!/@tailwindcss\/browser@\d+\.\d+\.\d+/.test(html)) fail("tailwind CDN version must be pinned exactly");
// R3: canonical + twitter card 정합 유지
if (!html.includes('rel="canonical"')) fail("canonical link missing");
if (html.includes('content="summary"') && !html.includes("summary_large_image")) fail("twitter card should be summary_large_image");
// R4: 홈페이지 JSON-LD 유지
if (!html.includes('"@type": "Organization"') && !html.includes('"@type":"Organization"'))
  fail("homepage JSON-LD Organization missing");

// R19: 블로그 썸네일 자가 호스팅 (외부 핫링크 제거)
for (const f of ["blog/index.html", "blog/best-phone-buying-site/index.html"])
  if (read(f).includes("shopby-images")) fail(`external hotlink remains in ${f}`);
if (!fs.existsSync(path.join(buildDir, "blog/assets/best-phone-buying-site.png")))
  fail("self-hosted blog thumbnail missing");

// 6. CSS 무결성 (R5: font-family 폴백 체인 정상)
const cssDir = path.join(buildDir, "static", "css");
const mainCss = fs.readdirSync(cssDir).find((f) => /^main\..*\.css$/.test(f));
const css = fs.readFileSync(path.join(cssDir, mainCss), "utf8");
if (/font-family:\s*"Pretendard,/.test(css)) fail("font-family still a single quoted string");
if (!css.includes("Pretendard")) fail("Pretendard missing from css");

if (failed) { console.error("VERIFY FAILED"); process.exit(1); }
console.log("VERIFY OK");
