# 동네방네 블로그 예약 발행

Codex/ChatGPT 데스크톱의 Scheduled에서 아래 설정으로 독립 실행 작업을 만든다.

- 프로젝트: 이 저장소 루트
- 실행 방식: 새 worktree
- 권장 주기: 매주 월요일 오전 9시(Asia/Seoul)
- RRULE: `RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0`
- 스킬: `$publish-dnbn-blog`

예약 작업 프롬프트:

```text
Use $publish-dnbn-blog in this repository. Publish at most one new 동네방네 blog post.
Start from the latest origin/main in a new worktree, preserve unrelated work, and stop with no
changes if a post was already published today or another blog publication PR is open. Research
current facts from primary official sources, create the article and original 1200x630 thumbnail,
update all five publication artifacts, and run every required validation. Open a ready PR, merge
only after its checks pass and the expected head is still mergeable, then wait for the main Pages
deployment and verify the blog index and canonical article URL in production. Never push directly
to main or gh-pages and never bypass a failed check. Report each completed stage or the exact blocker.
```

예약 실행은 컴퓨터가 켜져 있고 ChatGPT 데스크톱 앱이 실행 중이어야 로컬 프로젝트를 사용할 수 있다.
처음 2~3회 결과를 확인한 뒤 주기나 프롬프트를 조정한다.
