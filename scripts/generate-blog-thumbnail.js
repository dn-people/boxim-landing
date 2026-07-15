const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PROJECT_DIR = path.join(__dirname, "..");
const WIDTH = 1200;
const HEIGHT = 630;

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

const assertOutputPath = (output, projectDir = PROJECT_DIR) => {
  if (!output) throw new Error("--output is required");
  const resolved = path.resolve(projectDir, output);
  const assetsDir = path.join(projectDir, "public", "blog", "assets");
  if (resolved !== assetsDir && !resolved.startsWith(`${assetsDir}${path.sep}`))
    throw new Error("thumbnail output must stay under public/blog/assets");
  if (path.extname(resolved).toLowerCase() !== ".png") throw new Error("thumbnail must be a PNG");
  return resolved;
};

const validateThumbnail = async (output) => {
  if (!fs.existsSync(output)) throw new Error(`thumbnail missing: ${output}`);
  const metadata = await sharp(output).metadata();
  if (metadata.format !== "png") throw new Error(`thumbnail format must be PNG, got ${metadata.format}`);
  if (metadata.width !== WIDTH || metadata.height !== HEIGHT)
    throw new Error(`thumbnail must be ${WIDTH}x${HEIGHT}, got ${metadata.width}x${metadata.height}`);
  return metadata;
};

const PALETTES = [
  ["#E9F1FF", "#C9DCFF", "#0159FB", "#72A5FF"],
  ["#E8FBF5", "#C9F1E4", "#047857", "#5FD0AA"],
  ["#FFF4E5", "#FFE0B2", "#C2410C", "#FB923C"],
  ["#F4EDFF", "#DDCAFF", "#6D28D9", "#A78BFA"],
];

const generateThumbnail = async ({ slug, pillar = "general", output, projectDir = PROJECT_DIR }) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+){2,4}$/.test(slug || ""))
    throw new Error("--slug must be a lowercase 3-5-word kebab-case value");

  const digest = crypto.createHash("sha256").update(`${pillar}:${slug}`).digest();
  const palette = PALETTES[digest[0] % PALETTES.length];
  const circles = Array.from({ length: 7 }, (_, index) => {
    const x = 690 + (digest[index + 1] / 255) * 470;
    const y = 45 + (digest[index + 8] / 255) * 540;
    const radius = 28 + (digest[index + 15] / 255) * 105;
    const color = index % 2 === 0 ? palette[2] : palette[3];
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" opacity="0.16"/>`;
  }).join("");

  const background = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${palette[0]}"/>
          <stop offset="1" stop-color="${palette[1]}"/>
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
      <path d="M690 630 C760 390 900 230 1200 150 L1200 630 Z" fill="${palette[2]}" opacity="0.09"/>
      ${circles}
      <rect x="70" y="92" width="485" height="446" rx="42" fill="#FFFFFF" opacity="0.94"/>
      <rect x="70" y="92" width="14" height="446" rx="7" fill="${palette[2]}"/>
      <circle cx="650" cy="315" r="10" fill="${palette[2]}" opacity="0.75"/>
      <circle cx="650" cy="315" r="34" fill="none" stroke="${palette[2]}" stroke-width="4" opacity="0.25"/>
    </svg>
  `);

  const logoFile = path.join(projectDir, "public", "logo-dnbn.svg");
  const logo = await sharp(logoFile).resize({ width: 390, height: 210, fit: "inside" }).png().toBuffer();
  const logoMetadata = await sharp(logo).metadata();
  const left = 70 + Math.round((485 - logoMetadata.width) / 2);
  const top = 92 + Math.round((446 - logoMetadata.height) / 2);

  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(background)
    .composite([{ input: logo, left, top }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
  return validateThumbnail(output);
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  (async () => {
    const output = assertOutputPath(args.output);
    const metadata = args["validate-only"]
      ? await validateThumbnail(output)
      : await generateThumbnail({ slug: args.slug, pillar: args.pillar, output });
    console.log(`THUMBNAIL OK: ${output} (${metadata.width}x${metadata.height} ${metadata.format})`);
  })().catch((error) => {
    console.error(`THUMBNAIL FAIL: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { HEIGHT, WIDTH, generateThumbnail, validateThumbnail };
