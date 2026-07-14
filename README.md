# dnbn-landing (dn-people.com)

통신상품 원스톱 서비스 "동네방네" 랜딩 페이지 + "동네방네" 블로그(정적 HTML).
react-scripts(CRA) 기반이며, 랜딩은 React SPA, 블로그(`/blog/`)는
`public/blog/` 아래 정적 HTML로 서빙된다.

## 개발

```bash
npm ci          # 락파일 기준 클린 설치
npm start       # 개발 서버 (http://localhost:3000)
npm run build   # 프로덕션 빌드 → build/
```

빌드 검증:

```bash
npm run build
node scripts/verify-build.js   # "VERIFY OK" 확인
```

`scripts/verify-build.js`는 빌드 산출물에 필수 파일·커스텀 도메인·핵심 카피·sitemap
정합성이 유지되는지 검사하는 특성화 테스트다. 변경 후 반드시 통과해야 한다.

## 배포

운영 배포의 단일 경로는 `PR 검증 → main 머지 → GitHub Actions → gh-pages`다.
`.github/workflows/deploy.yml`은 `main` 대상 PR에서 빌드와 특성화 검증을 실행하고,
검증된 변경이 `main`에 들어온 경우에만 GitHub Pages를 배포한다. 기능 브랜치나
로컬의 `npm run deploy`로 운영을 덮어쓰지 않는다.

커스텀 도메인 `dn-people.com`은 `public/CNAME`이 빌드에 복사되어 유지된다.
`public/CNAME`과 루트 `CNAME`은 수정하지 않는다.

## 구조

```
public/
  index.html              SPA 셸 (SEO 메타 + Organization/WebSite JSON-LD)
  blog/index.html         블로그 목록 (정적 HTML)
  blog/<slug>/index.html  블로그 글 (Article + FAQPage JSON-LD)
  blog/assets/            블로그 이미지 (자가 호스팅)
  sitemap.xml, robots.txt SEO
src/
  App.js                  조합 루트 (screen/scroll 상태 + 섹션 나열)
  hooks/use-active-section.js  스크롤 기반 활성 섹션 감지
  sections/               섹션별 컴포넌트 (hero/intro/concept/mission/why/
                          type/dnbn/history/review/end)
  components/             Header, Text, Button, Star, ReviewCard
  data/                   content.js(섹션 카피), reviews.js(후기 데이터)
  constants.js            공유 상수 (URL, 스크롤 마진)
docs/
  blog/                   블로그 발행 템플릿·자동화 프롬프트·토픽 원장
  refactor/               리팩토링 수동 체크리스트
.agents/skills/
  publish-dnbn-blog/     글 작성부터 PR·머지·운영 확인까지 수행하는 Codex 스킬
```

## 블로그 발행

새 글 발행은 `docs/blog/AGENT_PROMPT.md`의 절차를 따른다. 한 편 발행 =
글 HTML과 자체 호스팅 썸네일 생성 + 목록 카드 추가 + `sitemap.xml` 갱신 +
`docs/blog/TOPICS.md` 기록의 5개 발행 경로를 한 커밋에 담는다. 템플릿은
`docs/blog/TEMPLATE.html`이다.

예약 발행은 Codex에서 `$publish-dnbn-blog` 스킬을 호출한다. 권장 Scheduled 설정과
복사 가능한 실행 프롬프트는 `docs/blog/SCHEDULED_TASK.md`에 있다. 루틴은 새 worktree에서
한 편만 작성하고, 검증 성공 시 PR을 머지한 뒤 운영 URL까지 확인한다.
