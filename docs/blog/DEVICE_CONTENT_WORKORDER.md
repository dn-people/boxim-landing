# 작업지시서 — dnbn 블로그 "기기 스펙 정리" 콘텐츠 타입(2단계) 도입

> **상태:** 설계 완료 · 구현 보류(2026-07-23). 조율/설계 fable, 1차 검토 opus.
> **선행조건:** 발행 산출물 six→five 정합화 PR(`fix/blog-docs-five-artifacts`)이 `main`에 먼저 병합돼야 함.
> 이 문서는 구현 착수 시 sonnet이 그대로 따르고 opus가 1차 검토하기 위한 지시서다. 아직 구현하지 않았다.

대상 구현자: sonnet / 1차 검토: opus / 조율: fable
레포: `dn-people/boxim-landing`, 기준 브랜치: `origin/main`

## 0. 범위·전제·의존성

- **전제 1 (선행 PR):** 발행 산출물 six→five 정합화(SKILL.md·AGENT_PROMPT.md·SCHEDULED_TASK.md 문구 수정)가 먼저 `main`에 병합된다. 이 지시서는 **five-artifact 모델**(`public/blog/<slug>/index.html`, `public/blog/assets/<slug>.png`, `public/blog/index.html`, `public/sitemap.xml`, `docs/blog/TOPICS.md`)을 전제한다. `scripts/verify-blog.js`의 `validatePublicationDiff`는 origin/main에 이미 five 모델로 반영되어 있으므로 **diff 산출물 목록은 변경하지 않는다.** 선행 PR 미병합 상태에서 시작하면 해당 문서들과 충돌 확인 후 리베이스한다.
- **전제 2:** device 타입 글도 발행 산출물은 기존과 동일한 5개 경로다. 새 산출물 경로를 추가하지 않는다.
- **작업 브랜치:** `feat/blog-device-content-type` (main 대상 인프라 PR 1개). 발행 커밋이 아니므로 `verify:blog`는 `BLOG VERIFY SKIP` 이 정상이다.
- **변경 파일(전부):** `docs/blog/AUTOMATION_POLICY.json`, `docs/blog/TOPICS.md`, `scripts/check-blog-run-gates.js`, `docs/blog/TEMPLATE-DEVICE.html`(신규), `scripts/verify-blog.js`, `scripts/tests/blog-automation.test.js`, `scripts/tests/fixtures/device-spec-valid.html`(신규), `scripts/tests/fixtures/device-compare-valid.html`(신규), `docs/blog/AGENT_PROMPT.md`, `.agents/skills/publish-dnbn-blog/SKILL.md`, `docs/blog/SCHEDULED_TASK.md`.
- **변경 금지(명시):** `scripts/verify-build.js`, `scripts/generate-rss.js`, `scripts/generate-blog-thumbnail.js`, `docs/blog/TEMPLATE.html`, `public/**` 전체, `src/**`, 워크플로, CNAME. (device 글은 Article JSON-LD를 유지하므로 generate-rss.js가 그대로 동작하고, verify-build.js의 글 공통 검사도 그대로 통과해야 한다.)

## 1. 공통 설계 결정 (모든 파일이 이 어휘를 공유)

| 항목 | 값 |
|---|---|
| 타입 토큰 | `howto`(기존 절차형, 마커 없음=기본), `device-spec`(단일 기기 스펙 정리), `device-compare`(기기 2대 비교) |
| HTML 타입 마커 | `<meta name="dnbn:content-type" content="device-spec" />` (howto 글에는 마커를 넣지 않는다) |
| 기기 키 마커 | `<meta name="dnbn:device-keys" content="galaxy-s26-ultra" />` — kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$`, compare는 **알파벳 오름차순 정렬 후 쉼표 결합**(공백 없음), spec=1개, compare=2개 |
| 기기 키 표기 규칙 | 제조사명 제외 모델명 기반: `galaxy-s26-ultra`, `iphone-17-pro`, `galaxy-z-flip7` |
| 리뷰그룹 | `device-spec`·`device-compare` → 리뷰그룹 `device`. 사람검토 카운터는 리뷰그룹 단위 |
| 금지어(디바이스 글 전용 린트) | `최고`, `최초`, `1위`, `유일`, `압도적`, `역대급`, `최저가`, `리뷰`, `루머`, `유출` |
| 브랜드 허용표 | `"삼성전자" → samsung.com`, `"Apple" → apple.com` (Product `brand.name`은 이 키 문자열과 **정확히 일치**) |
| 가격 정책 | 스펙표의 `공식 출시가` 행 + 기준일만. 실시간가·판매가·할인가 서술 금지, CTA로 dnbn 위임 |
| 스키마 정책 | `@graph` = Article + BreadcrumbList + FAQPage + **Product(1~2)**. Product에 `offers`·`aggregateRating`·`review`·`image` **금지** |

## 1.5 발행 케이던스 — 이벤트 구동 (중요, 2026-07-23 사용자 확정)

device 타입은 **일간 예약 파이프라인에 넣지 않는다.** 신기기는 매일 나오지 않으므로 일간 강제 발행은 억지 주제·낡은 재탕을 유발한다.

- **트리거:** 삼성/애플 신기기의 **제조사 공식 정식 발표**가 확인된 날에만, 수동/온디맨드 Codex 실행으로 device 글 1편(필요 시 spec + compare)을 발행한다. 예약(RRULE)은 만들지 않거나, 만든다면 알려진 발표 창(1~2월·여름 삼성 언팩, 9월 애플) 부근에만 한시적으로 켠다.
- **일간 예약 run은 `howto` 타입만 선택한다.** §2.7의 주제 선택 규칙에서 device 타입을 일간 자동 선택 풀에서 제외한다(TOPICS.md의 device 후보는 "이벤트 대기" 상태로 두고, 일간 run이 자동으로 집어가지 않는다).
- **대상 범위:** 당분간 **삼성·애플만**(§1의 `deviceBrands`와 일치). 타 제조사는 브랜드 허용표 확장 전까지 제외.
- **evergreen 스펙 리터러시 글**("스펙 읽는 법", "용도별 우선순위" 등, 특정 기기 무관)은 device 타입이 아니라 **`howto`**로 분류하며 일간 파이프라인에서 정상 발행한다 — 이벤트 구동 대상이 아니다.
- **첫 device 글은 예약이 아닌 수동 실행으로 1회 리허설**한 뒤에만 이후 발표 이벤트에 적용한다(§5 리스크표와 동일).

## 2. 파일별 변경 명세

### 2.1 `docs/blog/AUTOMATION_POLICY.json`

기존 키는 **한 글자도 바꾸지 않고** 아래 키를 추가한다 (`version`은 2로 올린다 — 현재 어떤 코드도 version을 읽지 않으므로 안전).

```json
{
  "version": 2,
  "manualReviewByType": {
    "device": { "requiredPublishedPosts": 5, "baselinePublishedSlugs": [] }
  },
  "contentTypes": {
    "howto": { "reviewGroup": "default" },
    "device-spec": { "reviewGroup": "device" },
    "device-compare": { "reviewGroup": "device" }
  },
  "deviceBrands": { "삼성전자": "samsung.com", "Apple": "apple.com" },
  "deviceBannedTerms": ["최고", "최초", "1위", "유일", "압도적", "역대급", "최저가", "리뷰", "루머", "유출"]
}
```

- 기존 `manualReview`는 `default` 리뷰그룹 전용으로 의미가 좁아진다(스키마는 그대로).
- `officialSourceDomains`에 samsung.com·apple.com은 이미 있으므로 추가 불필요.

### 2.2 `docs/blog/TOPICS.md`

발행 표의 **오른쪽 끝에 열 2개 추가**: `유형`, `대상 기기`. 헤더·구분행·기존 전 행을 일괄 마이그레이션한다.

```
| 날짜 | slug | 제목 | 타깃 키워드 | 검색 의도 | 유형 | 대상 기기 |
|---|---|---|---|---|---|---|
| 2026-07-23 | esim-device-id-check | ... | ... | ... | howto | - |
```

- 기존 10개 행 전부: `유형=howto`, `대상 기기=-`.
- device 행 예: `| 2026-08-03 | galaxy-s26-spec-guide | ... | ... | 스펙 확인 | device-spec | galaxy-s26 |`, compare 행의 대상 기기는 `galaxy-s26,iphone-17` (정렬·쉼표·공백없음 — HTML 마커와 바이트 동일해야 함).
- **하위호환 근거:** 현행 `parsePublishedRows`와 `verify-blog.js`의 TOPICS 행 검사는 `| 날짜 | slug |` 접두만 보므로 뒤쪽 열 추가는 기존 코드와 호환된다. 문서 머리에 dedup 복합키 규칙 1문단 추가: *"device 글은 (유형, 대상 기기) 복합키가 기존 행과 중복되면 탈락. 단일 스펙글은 기기당 1개, 비교글은 기기쌍당 1개."*

### 2.3 `scripts/check-blog-run-gates.js`

1. **`parsePublishedRows` 재구현** — 정규식 대신 셀 분해:
   ```js
   const parsePublishedRows = (topics) => topics.split(/\r?\n/)
     .map((line) => line.split("|").map((cell) => cell.trim()))
     .filter((cells) => cells.length >= 3
       && /^\d{4}-\d{2}-\d{2}$/.test(cells[1]) && /^[a-z0-9-]+$/.test(cells[2]))
     .map((cells) => ({ date: cells[1], slug: cells[2], type: cells[6] || "howto", devices: cells[7] || "-" }));
   ```
   반환 shape에 `type`, `devices` 추가. **type 누락 행은 `howto`로 기본 처리** (기존 테스트가 `{date, slug}`만 넘기므로 필수).
2. **`computeMergeMode(publishedRows, policy)` 확장** — 리뷰그룹별 계산:
   - 행의 그룹 = `policy.contentTypes?.[row.type]?.reviewGroup ?? "default"`.
   - `default` 그룹: 기존 로직 그대로, 단 **집계 대상을 default 그룹 행으로 한정** (`policy.manualReview` 기준).
   - `device` 그룹: `policy.manualReviewByType.device` 기준으로 동일 계산.
   - 반환(기존 3필드는 default 그룹 값으로 유지 = 하위호환):
   ```js
   { mergeMode, publishedSinceRollout, remainingManualReviews,
     mergeModeByType: { default: {...동일 3필드}, device: {...동일 3필드} } }
   ```
   `policy.manualReviewByType`가 없으면 `mergeModeByType.device`를 생략(구 정책 파일 호환).
3. `loadRunGate` 출력은 spread라 자동 반영됨 — 별도 수정 없음.

### 2.4 `docs/blog/TEMPLATE-DEVICE.html` (신규)

**작성 방법: `docs/blog/TEMPLATE.html`을 통째로 복사한 뒤 아래 델타만 적용한다. `<style>` 블록·`<header>`·`<footer>`·breadcrumb·JSON-LD의 Article/BreadcrumbList/FAQPage 노드는 바이트 단위로 동일하게 유지(신규 CSS 클래스 추가 금지 — 기존 클래스만 조합).**

**head 델타** (robots meta 다음 줄에 삽입):
```html
<meta name="dnbn:content-type" content="{{CONTENT_TYPE}}" />
<meta name="dnbn:device-keys" content="{{DEVICE_KEYS}}" />
```

**JSON-LD 델타:** `@graph` 배열의 FAQPage 노드 뒤에 `,{{PRODUCT_JSONLD_ITEMS}}` 삽입. 확장 결과는 Product 객체 1개(spec) 또는 2개(compare, 쉼표 구분). Product 노드 형식(필수 필드 고정):
```json
{
  "@type": "Product",
  "@id": "https://dn-people.com/blog/{{SLUG}}/#product-{{DEVICE_KEY}}",
  "name": "갤럭시 S26 울트라",
  "brand": { "@type": "Brand", "name": "삼성전자" },
  "model": "SM-S948N",
  "category": "스마트폰",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "디스플레이", "value": "..." }
  ]
}
```
`offers`·`aggregateRating`·`review`·`image` 키는 어떤 깊이에도 넣지 않는다(verify-build.js가 JSON-LD 내 image 계열 URL을 외부 핫링크로 판정할 수 있고, 표시광고법·구글 리뷰 정책 리스크 회피가 설계 결정임). `additionalProperty`는 기기당 5개 이상이며 각 `name`은 스펙표 1열 라벨의 부분집합이어야 한다.

**`<article>` 본문 골격** (섹션 순서 고정, h2 문구는 예시이되 물음표 유무는 유지 권장):
```html
<article>
  <h1>{{TITLE}}</h1>
  <p class="post-meta">{{PUBLISHED_DATE_KR}} · 동네방네 {{CATEGORY}}</p>
  <img class="hero-image" src="{{THUMB_URL}}" alt="{{THUMB_ALT}}" loading="lazy" />

  <div class="summary-box">
    <p><strong>한 줄 적합 요약</strong></p>
    {{SUMMARY_HTML}}            <!-- "누구에게 맞는 기기인가" 80~150자, p 태그만. div 중첩 금지 -->
    <p class="small">기준일: {{PUBLISHED_DATE_KR}}</p>
  </div>

  <h2>공식 스펙은 어떻게 되나요?</h2>
  {{SPEC_INTRO_HTML}}
  <div class="table-scroll">
    <table class="spec-table">
      <tr><th>항목</th><th>{{DEVICE_NAME_A}}</th></tr>   <!-- compare는 th 3개 -->
      {{SPEC_TABLE_ROWS}}
    </table>
  </div>
  <p class="small">출처: 제조사 공식 제원 페이지 · 공식 출시가 기준일: {{PUBLISHED_DATE_KR}}</p>

  <h2>수치로 보는 트레이드오프</h2>
  {{TRADEOFF_HTML}}             <!-- 제원 수치 기반 객관 진술만. 체감·주관 표현 금지 -->

  <h2>어떤 사용자에게 맞나요?</h2>
  {{FIT_HTML}}                  <!-- note-box 2개: "맞는 경우" ul / "맞지 않는 경우" ul -->

  <h2>구매 전 확인 순서는 어떻게 되나요?</h2>
  <div class="check-list"><ol>{{PURCHASE_CHECKLIST_ITEMS}}</ol></div>
  {{PURCHASE_HTML}}             <!-- 자급제/오픈박스/알뜰폰 개통 경로 + 관련 글 내부링크 1개 이상.
                                     실시간 가격·재고 비교는 dnbn으로 위임하는 문장 포함 -->

  <div class="divider"></div>
  <h2>자주 묻는 질문</h2>
  {{FAQ_HTML}}                  <!-- faq-item 5~6개, 내부 div 중첩 금지 -->

  <h2>참고할 공식 사이트</h2>
  <div class="source-list">{{SOURCES_HTML}}</div>

  <div class="brand-cta">
    이 기기의 실시간 가격과 자급제·오픈박스·알뜰폰 조합 비교는<br />
    핸드폰 살 땐 동네방네 <a href="https://dnbn.co.kr/" target="_blank" rel="noopener">dnbn.co.kr</a>
  </div>
</article>
```

**플레이스홀더 전체 목록:** `{{TITLE}}`, `{{SLUG}}`, `{{DESCRIPTION}}`, `{{OG_DESCRIPTION}}`, `{{THUMB_URL}}`, `{{THUMB_ALT}}`, `{{PUBLISHED_DATE}}`, `{{PUBLISHED_DATE_KR}}`, `{{CATEGORY}}`, `{{CONTENT_TYPE}}`, `{{DEVICE_KEYS}}`, `{{DEVICE_NAME_A}}`(+compare시 `{{DEVICE_NAME_B}}`), `{{SUMMARY_HTML}}`, `{{SPEC_INTRO_HTML}}`, `{{SPEC_TABLE_ROWS}}`, `{{TRADEOFF_HTML}}`, `{{FIT_HTML}}`, `{{PURCHASE_CHECKLIST_ITEMS}}`, `{{PURCHASE_HTML}}`, `{{FAQ_HTML}}`, `{{FAQ_JSONLD_ITEMS}}`, `{{PRODUCT_JSONLD_ITEMS}}`, `{{SOURCES_HTML}}`.

**템플릿 하드 제약(검증기 정규식 한계에서 옴):** `summary-box`·`faq-item` 내부에 `<div>` 중첩 금지(현행 비탐욕 `</div>` 매칭이 조기 종료됨). breadcrumb의 `/blog/` 링크가 "blog-list internal link" 검사를 충족하므로 유지 필수.

### 2.5 `scripts/verify-blog.js`

**원칙: howto 경로의 기존 동작은 바이트 동일하게 유지**(기존 발행글·기존 테스트가 계속 통과해야 함). 아래를 추가한다.

1. **타입 판별 함수** (export):
   ```js
   const detectContentType = (html) => {
     const marker = findMeta(html, "name", "dnbn:content-type");
     if (marker === null) return { type: "howto" };
     if (!["device-spec", "device-compare"].includes(marker))
       return { type: null, error: `unknown dnbn:content-type: ${marker}` };
     return { type: marker };
   };
   ```
2. **`validateArticle` 분기:** 시작부에서 `detectContentType(html)` 호출. 오류면 errors에 추가 후 howto 검사 진행. 타입별로 다음 3개 검사만 교체하고 **나머지 공통 검사(slug, `{{` 잔존, noindex, canonical/og:url, meta description 70~110, summary-box 80~150+기준일, Article JSON-LD 정합, FAQ 5~6+JSON-LD 미러, source-list 도메인 허용목록+`target=_blank rel=noopener`, 내부링크 2종, 썸네일 참조, `<table>`≥1, `<ol>`≥1)는 두 타입 공용으로 그대로 실행:**

   | 검사 | howto(기존 유지) | device-spec | device-compare |
   |---|---|---|---|
   | h1 길이 | 20~35 | 20~45 | 20~45 |
   | 본문 길이(공백 제외) | 2500~4000 | 2000~3500 | 2500~4500 |
   | 질문형 h2 수 | 6~9 | 2~7 | 2~7 |
3. **device 전용 추가 검사** (device 타입일 때만):
   - **기기 키 마커:** `dnbn:device-keys` 존재, 각 키 `^[a-z0-9]+(-[a-z0-9]+)*$`, 정렬 상태(`keys.join(",") === [...keys].sort().join(",")`), 개수 = spec:1 / compare:2.
   - **금지어 린트:** 검사 범위 = `normalizeText(<title>)` + meta description + `normalizeText(article 내부)`. `policy.deviceBannedTerms`의 각 항목이 포함되면 `device article contains banned term: <term>` 오류. (태그 제거 후 텍스트만 보므로 `href="/#review-section"` 같은 속성은 걸리지 않음.)
   - **스펙표:** `<table class="spec-table">`(class 매칭은 기존 summary-box 패턴 재사용)가 article 내 **정확히 1개**. 첫 `<tr>`의 `<th>` 수 = 1+기기수(spec:2, compare:3). 데이터 행(`<tr>` 중 첫 행 제외) ≥ 8. 1열 셀 텍스트 집합이 `["출시일","공식 출시가","디스플레이","배터리","저장용량","무게"]`를 모두 포함. `공식 출시가` 행에 `/\d[\d,]*원/` 매치 수 ≥ 기기수.
   - **Product JSON-LD:** `@graph`에서 `hasType(v,"Product")` 노드 수 = 기기수. 각 노드: `name` 비어있지 않음, `brand.name`이 `policy.deviceBrands`의 키(불일치 시 `unknown device brand`), `model` 비어있지 않음, `additionalProperty` 배열 길이 ≥5이고 각 항목이 `PropertyValue`+`name`+`value` 보유, 각 `name`이 스펙표 1열 라벨 집합의 부분집합. Product 서브트리를 재귀 순회해 키 이름 `offers`/`aggregateRating`/`review`/`image` 발견 시 오류.
   - **제조사 출처:** 각 Product의 `deviceBrands[brand.name]` 도메인에 대해 source-list 링크 중 `domainAllowed(hostname, [도메인])` 참인 링크 ≥1 (기존 `domainAllowed` 재사용).
4. **`validatePublicationFiles` 확장** (device일 때만): TOPICS.md에서 해당 slug 행을 셀 분해로 읽어 (a) `유형` 셀 == 마커 타입, (b) `대상 기기` 셀 == `dnbn:device-keys` content와 바이트 동일, (c) 발행 표 전체에서 `(유형, 대상 기기)` 복합키가 이 행 포함 정확히 1회(중복 시 `duplicate device topic key`) — 를 검사. howto 경로의 기존 날짜 행 검사는 무변경.
5. **metadata 반환 확장:** `contentType`, `deviceKeys` 필드 추가(테스트·로그용).
6. `module.exports`에 `detectContentType` 추가.

### 2.6 `scripts/tests/blog-automation.test.js` + fixtures

**Fixture 2개 신규 커밋** (public/ 밖에 두어 verify-build 대상에서 제외):
- `scripts/tests/fixtures/device-spec-valid.html` — TEMPLATE-DEVICE를 실데이터(예: 갤럭시 S26 가상 확정 제원)로 채운 **완전 유효** 문서. slug는 `galaxy-s26-spec-guide` 가정, 모든 device 검사+공통 검사를 통과하도록 길이 2000자(공백 제외) 이상 확보.
- `scripts/tests/fixtures/device-compare-valid.html` — compare 버전(`galaxy-s26,iphone-17`).

**추가 테스트 케이스(기존 패턴 = fixture 읽고 `replace` 변이 후 단정):**

Positive:
1. `device-spec fixture passes validateArticle with no errors` — `validateArticle({html, slug, policy})` → `errors deepEqual []`, `metadata.contentType === "device-spec"`.
2. `device-compare fixture passes` — 동일.
3. `mergeModeByType: device rows stay MANUAL_REVIEW while default is unaffected` — 합성 rows(howto 5 + device 2)로 `computeMergeMode` 호출, `mergeModeByType.device.mergeMode === "MANUAL_REVIEW"`, device 5개 추가 시 `AUTO_MERGE_ELIGIBLE`.
4. `legacy rows without type default to howto` — `{date, slug}`만 있는 rows가 default 그룹으로 집계됨.
5. `parsePublishedRows reads type and devices columns` — 마이그레이션된 실제 TOPICS.md에서 `type === "howto"`, `devices === "-"` 확인.

Negative (각각 특정 오류 문자열 `errors.some(includes(...))` 단정):
6. 마커 제거 → howto 규칙으로 판정되어 길이/질문 h2 오류 발생(분기 증명).
7. 알 수 없는 마커 값(`device-review`) → `unknown dnbn:content-type`.
8. `<title>`·h1에 "리뷰" 삽입 → banned term 오류.
9. 본문에 "최저가" 삽입 → banned term 오류.
10. 스펙표에서 `공식 출시가` 행 제거 → 필수 라벨 오류.
11. Product에 `"offers": {...}` 삽입 → forbidden key 오류.
12. `brand.name`을 "샤오미"로 변경 → `unknown device brand`.
13. compare fixture의 `dnbn:device-keys`를 1개로 변경 → 키 개수 불일치 오류.
14. source-list에서 제조사 도메인 링크 제거 → 제조사 출처 오류.
15. compare fixture에서 Product 노드 1개 삭제 → Product 수 불일치 오류.
16. `validatePublicationFiles` fixture-dir 케이스: TOPICS 행 `대상 기기`를 다른 키로 바꿔 mismatch 오류(기존 `createPublicationFixture` 패턴으로 임시 디렉터리 구성 — device slug용 article/thumbnail/listing/sitemap/TOPICS 행을 fixture로 합성).

기존 테스트는 **수정 없이 전부 통과해야 한다** (특히 `current automated article satisfies the new blog validator`, five-artifact diff 테스트).

### 2.7 `docs/blog/AGENT_PROMPT.md`

§1 필러 목록에 `기기 스펙` 추가. 새 섹션 **"7. 기기 스펙 글(device 타입) 전용 규칙"** 추가(§5·§6 뒤, 기존 섹션 본문 무변경 — 단 §6의 "첫 5개 게시물" 문장에 "타입별로 각각 적용된다" 1구 추가):

```
## 7. 기기 스펙 글(device 타입) 전용 규칙

- 템플릿은 `docs/blog/TEMPLATE-DEVICE.html`만 사용하고 `dnbn:content-type`(device-spec |
  device-compare)과 `dnbn:device-keys`(kebab-case, 비교글은 알파벳 정렬 후 쉼표 결합)를 채운다.
- 대상은 제조사 공식 제원 페이지(samsung.com, apple.com)가 존재하는 정식 발표 기기만 허용한다.
  출시 전 루머·유출·예상 사양은 전면 금지한다.
- 제목: 20~45자. "리뷰" 단어 금지. 스펙 정리형("<기기명> 스펙 정리: <관심 축>") 또는
  비교형("<A> vs <B>, <축> 차이는?")으로 쓴다. 실사용 경험을 암시하는 표현을 쓰지 않는다.
- 분량(공백 제외): device-spec 2,000~3,500자, device-compare 2,500~4,500자. 질문형 h2 2~7개.
- 스펙표: `spec-table` 1개 필수. 출시일·공식 출시가·디스플레이·배터리·저장용량·무게를 포함해
  8행 이상. 모든 수치는 제조사 공식 제원 페이지에서 발행 당일 확인한다.
- 가격: 공식 출시가와 기준일만 적는다. 실시간 가격·할인가·판매가·가격 전망을 쓰지 않고
  실시간 비교는 dnbn CTA로 위임한다.
- 트레이드오프 섹션은 제원 수치의 객관 비교만 쓴다. 체감·추천 강도·순위 표현을 쓰지 않는다.
- 금지어: 최고, 최초, 1위, 유일, 압도적, 역대급, 최저가, 리뷰, 루머, 유출 (제목·본문·설명 전체).
- 스키마: Product에 offers·aggregateRating·review·image를 넣지 않는다. additionalProperty의
  name은 스펙표 1열 라벨과 일치시킨다. brand.name은 "삼성전자" 또는 "Apple"로만 쓴다.
- 중복 방지: TOPICS.md의 (유형, 대상 기기) 복합키 기준. 단일 스펙글은 기기당 1개,
  비교글은 기기쌍당 1개만 허용한다. 같은 기기라도 의도(스펙정리/비교)가 다르면 별개 글이다.
- 무인 실행 허용 범위: 공식 제원 정리(device-spec)와 2개 기기 제원 비교(device-compare)만.
  TOP N·순위·추천·베스트·가격 전망·구매 시점 판단 콘텐츠는 자동 파이프라인에서 생성하지 않는다.
- 출처: source-list에 대상 기기 브랜드의 공식 제원 페이지 링크를 기기(브랜드)별 1개 이상 넣는다.
- 발행 케이던스: device 타입은 이벤트 구동이다. 일간 예약 실행에서는 device 주제를 선택하지 않고
  `howto`만 발행한다. device 글은 삼성·애플 신기기의 제조사 공식 정식 발표가 확인된 날에만
  수동/온디맨드로 발행한다(§1.5). 발표 전 기기는 다루지 않는다.
```

### 2.8 `.agents/skills/publish-dnbn-blog/SKILL.md` · `docs/blog/SCHEDULED_TASK.md`

- **SKILL.md** (five 정합화 후 텍스트 기준 최소 델타 3곳):
  1. "Load the rules" 절 읽기 목록에 `docs/blog/TEMPLATE-DEVICE.html` 추가.
  2. Create 절에 1문장: *"Device-type posts (`device-spec`, `device-compare`) use `TEMPLATE-DEVICE.html` and follow AGENT_PROMPT §7; all other paths and the five controlled artifacts are identical."*
  3. mergeMode 절 교체: *"Read `mergeModeByType` from `check:blog-gates` and apply the entry matching the published post's review group (`default` for howto, `device` for device types). Top-level `mergeMode` is the default group's value."*
- **SCHEDULED_TASK.md**: "공식 검증·GitHub·운영 확인 도메인" 목록에 `samsung.com`, `apple.com` 추가(현재는 발굴 전용 목록에만 있어 무인 실행 시 제원 재검증이 차단될 수 있음). 초기 5회 사람 승인 문구에 "(타입별 각각)" 추가.

### 2.9 변경 불필요 확인 목록 (구현 후 체크)

- `verify-build.js`: device 글도 공통 검사(canonical 1개, h1 1개, JSON-LD 파싱, 외부 이미지 0건)를 그대로 통과해야 하며 **수정하지 않는다.** Product에 image 금지 규칙이 이 통과를 보장한다.
- `generate-rss.js`: Article 노드 유지로 무변경.
- `public/blog/index.html` 카드·sitemap 규칙: device 글도 동일 절차(카드 1개 추가, URL 1개 추가).
- 썸네일: 기존 파이프라인 그대로(`--pillar "기기 스펙"` 사용 가능 — pillar는 해시 시드일 뿐 제약 없음). 이미지 내 글자 금지 규칙 동일.

## 3. 무인 적합 경계 (요약표 — AGENT_PROMPT §7과 일치해야 함)

| 콘텐츠 | 무인 발행 | 근거 |
|---|---|---|
| 단일 기기 공식 제원 정리(device-spec) | 허용 (단, 그룹 첫 5편은 MANUAL_REVIEW) | 제조사 제원 페이지로 결정론적 검증 가능 |
| 기기 2대 제원 비교(device-compare) | 허용 (동일 카운터 공유) | 동일 |
| TOP N·순위·추천·베스트 | **파이프라인 생성 금지** | 주관 판단·검증 불가, 표시광고 리스크 |
| 가격 전망·구매 시점 판단 | **파이프라인 생성 금지** | 가격 책임은 dnbn 서비스, 블로그 범위 밖 |
| 미발표 기기·루머 | **전면 금지** | 설계 원칙 6, 금지어 린트로 부분 강제 |

## 4. 구현 순서와 검증 절차

순서(각 단계 후 `npm run test:blog-automation`으로 회귀 확인):
1. `AUTOMATION_POLICY.json` 키 추가 (단독으로는 무해).
2. `TOPICS.md` 열 마이그레이션.
3. `check-blog-run-gates.js` (parsePublishedRows → computeMergeMode).
4. `TEMPLATE-DEVICE.html` 작성.
5. `verify-blog.js` 분기 구현.
6. fixture 2개 작성 → 테스트 추가 (fixture는 5번 구현된 검증기로 자기검증하며 다듬는다).
7. `AGENT_PROMPT.md` §7 + 필러 추가.
8. `SKILL.md`·`SCHEDULED_TASK.md` 델타.

최종 검증(전부 통과 필수):
```bash
npm ci
npm run test:blog-automation        # 기존+신규 테스트 전부
npm run build
node scripts/verify-build.js        # VERIFY OK
npm run verify:blog -- --base-ref origin/main   # 인프라 PR이므로 "BLOG VERIFY SKIP" 이 정상
node scripts/check-blog-run-gates.js --date 2026-07-27   # mergeModeByType.default/.device 출력 확인
git diff --check
```
추가 수동 스모크: `node -e` 로 `validateArticle`에 device fixture를 통과시켜 `errors: []`와 `metadata.contentType` 출력 확인.

## 5. 파일별 리스크·주의점

| 파일 | 리스크 | 완화 |
|---|---|---|
| TOPICS.md | 열 추가 시 셀 수 불일치·파이프 이스케이프로 파서 오탐 | 셀 내 `\|` 문자 금지(규칙 문단에 명기), 마이그레이션 후 `parsePublishedRows` 결과 수=10 확인 테스트(2.6-5) |
| check-blog-run-gates.js | 기존 `mergeMode` 의미 변화로 예약 실행 오동작 | top-level 3필드를 default 그룹 값으로 유지, 합성 rows 하위호환 테스트(2.6-4) |
| verify-blog.js | howto 경로 회귀(기존 발행글 10개 실패) | 공용/타입별 검사 분리 시 howto 상수·순서 무변경, 기존 테스트 무수정 통과를 완료 조건으로 |
| TEMPLATE-DEVICE.html | summary-box/faq-item 정규식이 중첩 div에서 조기 종료 | 템플릿 하드 제약 주석으로 명기, fixture가 실검증기로 자기검증 |
| Product JSON-LD | image/offers 삽입 시 verify-build 외부이미지 검사·리뷰정책 위반 | 재귀 forbidden-key 검사(2.5-3) + negative 테스트 11 |
| AUTOMATION_POLICY.json | 구버전 gates 스크립트와 신 정책 파일 조합 | 추가 키만 사용(기존 키 무변경), `manualReviewByType` 부재 시 graceful 생략 |
| SKILL/SCHEDULED_TASK | six→five 정합화 PR과 텍스트 충돌 | 선행 PR 병합 후 리베이스를 착수 조건으로(§0 전제 1) |
| 발행 리허설 | 첫 device 글이 실전에서 게이트에 걸릴 가능성 | 첫 device 발행은 예약이 아닌 수동 트리거로 1회 리허설 후 예약 대상에 포함 |

---

## 부록: Opus 1차 검토 메모 (2026-07-23)

Fable이 근거로 든 3개 레포 제약을 origin/main 코드로 직접 검증함 — 전부 사실:
- `verify-blog.js:246` TOPICS 행 검사가 `^\|date\|slug\|` 접두매칭 → **열 뒤쪽 추가는 하위호환**(2.2 근거 확인).
- `verify-blog.js:127,155` summary-box/faq-item 정규식이 `([\s\S]*?)</div>` 비탐욕 → **중첩 div 조기종료**(2.4 하드제약 확인).
- `verify-build.js:156` 외부 핫링크 검사가 JSON-LD `["image","images","thumbnailurl","contenturl"]` 키를 수집 → **Product.image 금지가 유일 안전값**(2.4 근거 확인).
- `verify-blog.js:268` `articles.length === 0 → skipped` → 이 인프라 PR(새 글 0개)은 `BLOG VERIFY SKIP`으로 CI 통과.

판정: 설계가 실제 코드 제약 위에 정확히 서 있음. 구현 착수 시 그대로 진행 가능.
