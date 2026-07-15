const fs = require("fs");
const path = require("path");

const PROJECT_DIR = path.join(__dirname, "..");

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

const seoulDate = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const assertIsoDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`invalid ISO date: ${date}`);
  const parsed = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date)
    throw new Error(`invalid calendar date: ${date}`);
  return parsed;
};

const evaluateDate = (date, calendar) => {
  const parsed = assertIsoDate(date);
  const day = parsed.getUTCDay();
  if (day === 0 || day === 6) {
    return { status: "SKIPPED_WEEKEND", date, reason: day === 0 ? "Sunday" : "Saturday" };
  }
  const holiday = calendar.holidays.find((entry) => entry.date === date);
  if (holiday) {
    return {
      status: "SKIPPED_HOLIDAY",
      date,
      reason: holiday.name,
      holidayType: holiday.type,
    };
  }
  return { status: "ELIGIBLE_BUSINESS_DAY", date };
};

const parsePublishedRows = (topics) => [...topics.matchAll(
  /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([a-z0-9-]+)\s*\|/gm,
)].map((match) => ({ date: match[1], slug: match[2] }));

const computeMergeMode = (publishedRows, policy) => {
  const baseline = new Set(policy.manualReview.baselinePublishedSlugs);
  const publishedSinceRollout = publishedRows.filter(({ slug }) => !baseline.has(slug)).length;
  const required = policy.manualReview.requiredPublishedPosts;
  return {
    mergeMode: publishedSinceRollout < required ? "MANUAL_REVIEW" : "AUTO_MERGE_ELIGIBLE",
    publishedSinceRollout,
    remainingManualReviews: Math.max(0, required - publishedSinceRollout),
  };
};

const loadRunGate = ({ projectDir = PROJECT_DIR, date = seoulDate() } = {}) => {
  const parsed = assertIsoDate(date);
  const year = parsed.getUTCFullYear();
  const calendarFile = path.join(projectDir, "docs", "blog", "holidays", `${year}.json`);
  const policyFile = path.join(projectDir, "docs", "blog", "AUTOMATION_POLICY.json");
  const topicsFile = path.join(projectDir, "docs", "blog", "TOPICS.md");

  if (!fs.existsSync(calendarFile)) {
    return {
      status: "BLOCKED",
      date,
      reason: `holiday calendar missing: docs/blog/holidays/${year}.json`,
    };
  }

  const calendar = JSON.parse(fs.readFileSync(calendarFile, "utf8"));
  const policy = JSON.parse(fs.readFileSync(policyFile, "utf8"));
  if (calendar.year !== year || calendar.timezone !== policy.timezone) {
    return { status: "BLOCKED", date, reason: "holiday calendar metadata mismatch" };
  }

  const dates = calendar.holidays.map(({ date: holidayDate }) => holidayDate);
  if (new Set(dates).size !== dates.length) {
    return { status: "BLOCKED", date, reason: "holiday calendar contains duplicate dates" };
  }

  const dateGate = evaluateDate(date, calendar);
  if (dateGate.status !== "ELIGIBLE_BUSINESS_DAY") return dateGate;

  const publishedRows = parsePublishedRows(fs.readFileSync(topicsFile, "utf8"));
  if (publishedRows.some((row) => row.date === date)) {
    return { status: "NO_OP_ALREADY_PUBLISHED", date, reason: "TOPICS.md already has today's post" };
  }

  return {
    ...dateGate,
    ...computeMergeMode(publishedRows, policy),
    holidayCalendarVerifiedAt: calendar.verifiedAt,
    requiresLiveTemporaryHolidayCheck: Boolean(calendar.requiresLiveTemporaryHolidayCheck),
    officialHolidaySources: calendar.sources,
  };
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = loadRunGate({ date: args.date || seoulDate() });
    console.log(JSON.stringify(result, null, 2));
    if (result.status === "BLOCKED") process.exitCode = 2;
  } catch (error) {
    console.error(JSON.stringify({ status: "BLOCKED", reason: error.message }, null, 2));
    process.exitCode = 2;
  }
}

module.exports = {
  assertIsoDate,
  computeMergeMode,
  evaluateDate,
  loadRunGate,
  parsePublishedRows,
  seoulDate,
};
