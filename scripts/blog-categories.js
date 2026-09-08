const splitMarkdownRow = (line) => line
  .split("|")
  .slice(1, -1)
  .map((cell) => cell.trim());

const parsePublishedRows = (topics) => topics.split(/\r?\n/)
  .map(splitMarkdownRow)
  .filter((cells) => cells.length >= 6
    && /^\d{4}-\d{2}-\d{2}$/.test(cells[0])
    && /^[a-z0-9-]+$/.test(cells[1]))
  .map((cells) => ({
    date: cells[0],
    slug: cells[1],
    title: cells[2],
    keywords: cells[3],
    intent: cells[4],
    category: cells[5],
  }));

const parseBacklogRows = (topics, policy) => {
  const categories = new Set(Object.keys(policy.categories || {}));
  return topics.split(/\r?\n/)
    .map(splitMarkdownRow)
    .filter((cells) => cells.length >= 4 && categories.has(cells[0]))
    .map((cells) => ({
      category: cells[0],
      topic: cells[1],
      intent: cells[2],
      source: cells[3],
    }));
};

const computeCategoryDiversity = (publishedRows, policy) => {
  const categoryIds = Object.keys(policy.categories || {});
  const diversity = policy.contentDiversity || {};
  const windowSize = diversity.windowSize || 10;
  const targetPerCategory = diversity.targetPerCategory || 2;
  const priorityOrder = diversity.priorityOrder || categoryIds;
  const priority = new Map(priorityOrder.map((category, index) => [category, index]));
  const counts = Object.fromEntries(categoryIds.map((category) => [category, 0]));
  const windowRows = publishedRows.slice(0, windowSize);

  for (const row of windowRows) {
    if (Object.hasOwn(counts, row.category)) counts[row.category] += 1;
  }

  const latestCategory = publishedRows[0]?.category || null;
  let consecutiveCount = 0;
  for (const row of publishedRows) {
    if (row.category !== latestCategory) break;
    consecutiveCount += 1;
  }

  const deficits = Object.fromEntries(categoryIds.map((category) => [
    category,
    Math.max(0, targetPerCategory - counts[category]),
  ]));
  const maxConsecutive = diversity.maxConsecutive || 2;
  const eligibleCategories = consecutiveCount >= maxConsecutive && categoryIds.length > 1
    ? categoryIds.filter((category) => category !== latestCategory)
    : categoryIds;
  const largestDeficit = Math.max(0, ...eligibleCategories.map((category) => deficits[category]));
  const smallestCount = Math.min(...eligibleCategories.map((category) => counts[category]));
  const recommendedCategories = eligibleCategories.filter((category) => (
    largestDeficit > 0 ? deficits[category] === largestDeficit : counts[category] === smallestCount
  ));

  recommendedCategories.sort((left, right) => (
    (priority.get(left) ?? Number.MAX_SAFE_INTEGER)
      - (priority.get(right) ?? Number.MAX_SAFE_INTEGER)
      || left.localeCompare(right)
  ));

  return {
    windowSize,
    windowCount: windowRows.length,
    targetPerCategory,
    counts,
    deficits,
    latestCategory,
    consecutiveCount,
    recommendedCategories,
    nextCategory: recommendedCategories[0] || null,
  };
};

const validateCategoryPlan = ({ topics, listing, policy }) => {
  const errors = [];
  const categoryIds = new Set(Object.keys(policy.categories || {}));
  const publishedRows = parsePublishedRows(topics);
  const backlogRows = parseBacklogRows(topics, policy);
  const seenSlugs = new Set();

  for (const row of publishedRows) {
    if (seenSlugs.has(row.slug)) errors.push(`duplicate published slug: ${row.slug}`);
    seenSlugs.add(row.slug);
    if (!categoryIds.has(row.category)) {
      errors.push(`published slug has an invalid category: ${row.slug} (${row.category || "missing"})`);
    }
  }

  const backlogCounts = Object.fromEntries([...categoryIds].map((category) => [category, 0]));
  for (const row of backlogRows) backlogCounts[row.category] += 1;
  const minimumBacklog = policy.contentDiversity?.minimumBacklogPerCategory || 0;
  for (const [category, count] of Object.entries(backlogCounts)) {
    if (count < minimumBacklog) {
      errors.push(`category backlog is below ${minimumBacklog}: ${category} (${count})`);
    }
  }

  if (listing !== undefined) {
    const cards = [...listing.matchAll(/<a\b[^>]*>/gi)]
      .filter((match) => /(?:^|\s)post-card(?:\s|$)/.test(
        (match[0].match(/class\s*=\s*["']([^"']*)["']/i)?.[1] || ""),
      ))
      .map((match) => ({
        slug: match[0].match(/href\s*=\s*["']\/blog\/([a-z0-9-]+)\/["']/i)?.[1],
        category: match[0].match(/data-category\s*=\s*["']([a-z0-9-]+)["']/i)?.[1],
      }));
    const cardBySlug = new Map(cards.map((card) => [card.slug, card]));
    for (const row of publishedRows) {
      const card = cardBySlug.get(row.slug);
      if (!card) errors.push(`blog index card is missing: ${row.slug}`);
      else if (card.category !== row.category) {
        errors.push(`blog index category mismatch: ${row.slug} (${card.category || "missing"} != ${row.category})`);
      }
    }
    for (const card of cards) {
      if (!seenSlugs.has(card.slug)) errors.push(`blog index has an unregistered card: ${card.slug}`);
    }
  }

  return {
    errors,
    publishedRows,
    backlogRows,
    backlogCounts,
    diversity: computeCategoryDiversity(publishedRows, policy),
  };
};

module.exports = {
  computeCategoryDiversity,
  parseBacklogRows,
  parsePublishedRows,
  validateCategoryPlan,
};
