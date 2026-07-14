---
name: publish-dnbn-blog
description: Publish exactly one SEO/AEO blog post for dn-people/dnbn-landing, from current-source research and thumbnail creation through repository updates, validation, a pull request, guarded merge, GitHub Pages deployment, and live verification. Use for scheduled or one-off 동네방네 blog publishing; do not use for landing-page edits, existing-post rewrites, or unreviewed direct production pushes.
---

# Publish dnbn Blog

Publish at most one post per run. Treat `main` as the only production source and use a dedicated worktree or a clean task branch.

## Preconditions

1. Work from the `dn-people/dnbn-landing` repository root.
2. Confirm GitHub access can fetch, push a branch, create a PR, inspect checks, merge, and inspect Actions. If any required permission or authentication is missing, stop before mutation and report the exact blocker.
3. Fetch `origin` and start from current `origin/main`. Never build a new post from a stale local `main`.
4. Inspect `git status`. Preserve unrelated changes; never stage them. Prefer a Scheduled-task worktree.
5. Search for an open blog-publishing PR. Stop rather than race another publication.
6. Compare the live blog index with `origin/main`. If production contains a current post that is absent from `main`, stop and report source drift instead of creating a second post.

## Prepare the post

1. Read these files completely before choosing a topic:
   - `docs/blog/AGENT_PROMPT.md`
   - `docs/blog/TOPICS.md`
   - `docs/blog/TEMPLATE.html`
   - `public/blog/index.html`
   - `public/sitemap.xml`
2. If `TOPICS.md` already records a post dated today in Asia/Seoul, make no changes and report a no-op.
3. Select one backlog topic or a clearly distinct topic. Apply every duplicate-keyword, duplicate-intent, and cannibalization check in `AGENT_PROMPT.md`.
4. Browse current primary official sources for every time-sensitive price, policy, law, eligibility rule, or procedure. Do not rely on memory for unstable facts. Use conservative wording when a claim cannot be verified.
5. Derive a lowercase 3–5 word kebab-case slug and create branch `automation/blog-YYYY-MM-DD-<slug>` from `origin/main`.

## Create exactly five publication artifacts

Follow `docs/blog/AGENT_PROMPT.md` and `docs/blog/TEMPLATE.html` exactly:

1. Create `public/blog/<slug>/index.html` with no remaining `{{...}}` placeholders.
2. Create an original, self-hosted 1200×630 PNG at `public/blog/assets/<slug>.png`. Keep important text away from crop edges and do not use a third-party hotlink.
3. Prepend one card to `public/blog/index.html`.
4. Add the article URL and update only the blog-list date in `public/sitemap.xml`.
5. Add one published row and remove any consumed backlog item in `docs/blog/TOPICS.md`.

Do not modify `src/`, an existing article, the shared template structure, `CNAME`, or any unrelated file.

## Validate before publishing

Run all checks from the repository root:

```bash
npm ci
npm run build
node scripts/verify-build.js
git diff --check
```

Also inspect the final diff and confirm it contains only the five expected publication artifacts. Do not publish if any check fails, any factual source is unresolved, or the generated image is missing/corrupt.

## Publish, merge, and deploy

1. Stage only the five explicit paths. Commit as `[blog] Add post: <slug>`.
2. Push the task branch without force and open a ready-for-review PR to `main`. Describe the topic, sources, five artifacts, and validation results.
3. Wait for the PR validation workflow. Merge only when all required checks succeed, the PR is mergeable, and the expected head SHA has not moved. If the branch is stale, update it safely and rerun checks.
4. Never push directly to `main` or `gh-pages`. Never run `npm run deploy`; merging to `main` is the deployment trigger.
5. After merge, wait for both the `main` deployment workflow and the GitHub Pages publication to succeed.
6. Verify `https://dn-people.com/blog/` and the new canonical article URL return HTTP 200, the article appears in the list, and the live canonical points to the exact slug.

## Failure behavior

- Leave a failed or pending PR unmerged and report the PR URL plus the failing step.
- Do not hide partial success: distinguish branch pushed, PR opened, PR merged, Actions deployed, and live URL verified.
- Do not retry content generation into a second post on the same run.
- If production fails after merge, report it immediately and preserve logs; do not bypass the workflow with a local deployment.
