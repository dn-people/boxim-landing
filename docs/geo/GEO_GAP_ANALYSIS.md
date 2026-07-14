# dnbn-landing(dn-people.com) GEO 갭 분석

- **작성일**: 2026-07-14
- **대상**: dn-people.com (dnbn-landing 리포지토리 빌드 결과물, CRA SPA + 정적 블로그)
- **비교 기준**: 위키독스 「생성형 엔진 최적화(GEO) 실전 교과서」(15부 95챕터) 전수 조사 결과. 원본 조사 자료·종합 분석은 자매 리포지토리 `D:\app\dnbn`의 `GEO_교과서_챕터별_수집자료_2026-07-14.md`, `GEO_적용분석_dnbn_2026-07-14.md`, `dnbn_AEO진단_작업계획서_2026-07-14.md` 참고(이 문서와 중복 서술하지 않고 발췌 인용만 함).

## 0. 결론 먼저

dnbn.co.kr(자매 서비스, `D:\app\dnbn` 리포지토리)은 JSON-LD가 전무해 AEO 진단 60/100점, Gemini가 브랜드를 완전히 다른 정체로 오인하는 상태였다. **이 리포지토리(dn-people.com)는 정반대다** — GEO 교과서가 권장하는 항목 대부분을 이미 구현했고, 빌드 시점에 `scripts/verify-aeo.js`로 구조 정합성을 자동 검증하는 파이프라인까지 갖췄다. 오늘(2026-07-14) 최신 커밋도 "Improve homepage AEO and crawler access"로, 이미 자체적으로 GEO를 챙기고 있는 프로젝트다.

따라서 이 문서의 초점은 "무엇이 없는가"가 아니라 **(1) 이미 갖춘 것 중 재확인이 필요한 부분, (2) 두 사이트(dn-people.com ↔ dnbn.co.kr) 사이의 엔티티 신호 비대칭이라는, 코드만 봐서는 안 보이는 교차 리포지토리 문제, (3) 구조는 맞지만 "측정 루프"가 없는 부분**이다.

---

## 1. 이미 구현된 것 (재작업 불필요, 확인만)

실제 파일을 직접 읽어 확인한 내용:

| 항목 | 상태 | 근거 |
|---|---|---|
| robots.txt | GPTBot/OAI-SearchBot/ChatGPT-User/ClaudeBot/Claude-SearchBot/Claude-User/PerplexityBot/Perplexity-User/Google-Extended/Applebot-Extended/Yeti/Daumoa/Daum 전부 명시적 허용 + `User-agent: *` 전체 허용 | `public/robots.txt` |
| llms.txt | 사이트 정의, 핵심 페이지, 제공 범위, 주요 가이드 4건, 신뢰·운영사 정보, 최종 업데이트 날짜까지 완비 | `public/llms.txt` |
| JSON-LD | 홈: Organization(legalName·taxID·주소·연락처·sameAs)+WebSite+WebPage(speakable 포함)+Service+FAQPage(5문항)+HowTo(3단계) `@graph`. 블로그 글: Article+FAQPage | `public/index.html`, `public/blog/openbox-phone-grade-guide/index.html` |
| noscript-safe SEO fallback | `#aeo-answer` 직접답변 문단, 비교표, 순서형 스텝, FAQ, byline/저자, 사업자정보, 연락처를 JS 없이도 초기 HTML에 노출 | `public/index.html` body |
| canonical / hreflang / OG / Twitter | 홈·블로그 글 모두 존재 | 상동 |
| RSS | `scripts/generate-rss.js`가 빌드 prebuild 단계에서 자동 생성 | `package.json`, `public/rss.xml` |
| security.txt | 존재 | `.well-known/security.txt` (verify-aeo.js가 존재 검증) |
| 빌드타임 AEO 회귀 테스트 | H1 1개/H2 3개 이상/질문형 헤딩/표/순서목록/직접답변/저자신호/연락처/사업자정보/가시적 갱신일/canonical/noindex 여부/JSON-LD 6종 타입/FAQ 텍스트 화면 일치/robots.txt 필수 크롤러/사이트맵 URL/RSS 슬러그 매칭까지 자동 검증 | `scripts/verify-aeo.js` |
| 블로그 콘텐츠 중복 관리 | `docs/blog/TOPICS.md`가 발행 전 키워드/검색의도 중복 검사 대장 역할 | `docs/blog/TOPICS.md` |

이 항목들은 GEO 교과서 06장(테크니컬 GEO), 04장(Answer-first/schema)이 권장하는 내용과 거의 1:1로 일치한다. 추가 작업 불필요.

---

## 2. 핵심 발견 — dn-people.com ↔ dnbn.co.kr 엔티티 신호 비대칭 (신규, 최우선)

`public/index.html`의 Organization JSON-LD를 보면:

```json
"@type": "Organization",
"url": "https://dnbn.co.kr/",
"sameAs": ["https://dn-people.com/", "https://dnbn.co.kr/", "https://www.instagram.com/dnbn_official/"]
```

즉 이 사이트는 **자기 자신(dn-people.com)이 아니라 dnbn.co.kr을 브랜드 엔티티의 대표 URL로 선언**하고 있다. 본문의 저자·회사소개 링크(`rel="author"`, `<a href="https://dnbn.co.kr/company">회사소개</a>`)도 전부 dnbn.co.kr을 가리킨다. 블로그 글의 Article `author`/`publisher` 역시 `"url": "https://dnbn.co.kr/"`.

그런데 `D:\app\dnbn`(dnbn.co.kr 실제 코드)의 `/company` 페이지(`app\Views\pc\pages\company.php`)를 직접 확인한 결과, **JSON-LD가 전혀 없고 dn-people.com이나 dnbn.co.kr로의 sameAs/역링크도 없다.** dnbn.co.kr 전체가 JSON-LD 0/5라는 사실은 이미 `dnbn_AEO진단_작업계획서_2026-07-14.md`에서 확인됐다.

**의미**: 검색엔진/AI가 dn-people.com을 크롤링하면 "dnbn.co.kr이 이 Organization의 공식 URL"이라는 신호를 받지만, 정작 dnbn.co.kr 자체를 크롤링하면 이를 뒷받침할 아무 근거도 찾지 못한다. 엔티티 합의 신호가 **한쪽 방향으로만** 존재하는 상태 — GEO 교과서(01-08, 05-02, A-03; `GEO_적용분석_dnbn_2026-07-14.md` 2장 참고)가 경고하는 "여러 채널이 브랜드를 다르게(또는 한쪽만) 설명하면 AI가 엔티티를 혼동한다"의 정확한 사례이며, dnbn.co.kr에서 Gemini가 브랜드를 완전히 다른 정체로 오인하는 현상과 구조적으로 연결돼 있을 가능성이 높다.

**제안 (별도 승인 필요, `D:\app\dnbn` 리포지토리 작업)**:
- dnbn.co.kr `/company` 페이지에 최소 Organization JSON-LD 추가: 이 문서의 Organization과 **동일한 `legalName`/`taxID`/주소/연락처**를 쓰고, `sameAs`에 `https://dn-people.com/`과 `https://dnbn.co.kr/`를 포함
- dnbn.co.kr 홈페이지에도 최소 WebSite/Organization JSON-LD 추가 (기존 AEO 진단 문서의 액션 플랜과 동일 항목이지만, 이 발견 덕분에 "무엇을 sameAs에 넣을지"가 이미 정해짐 — dn-people.com의 값을 그대로 재사용하면 됨)
- 이 작업은 이 리포지토리(dnbn-landing)가 아니라 `D:\app\dnbn`에서 수행해야 함 — 본 문서는 그 필요성의 근거만 기록

---

## 3. 구조는 있으나 "측정 루프"가 없는 부분

`verify-aeo.js`는 **구조가 규격에 맞는지**(H1 개수, JSON-LD 타입 존재, robots.txt 크롤러 목록 등)만 빌드타임에 검증한다. GEO 교과서가 반복 강조하는 **"AI가 실제로 뭐라고 답하는지"를 질문셋 기반으로 재측정하는 루프**(01-09, 02-01, 05-10, Part 10)는 이 리포지토리 어디에도 없다.

- [ ] 브랜드형 질문("동네방네는 어떤 회사인가요?", "동네방네 믿을만한가요?") + 비브랜드형 질문("오픈박스폰 잘 사는 법", "알뜰폰 번호이동 방법") 각 10~20개를 고정 질문셋으로 만들어, ChatGPT/Gemini/Perplexity에서 월 1회 같은 조건으로 재측정
- [ ] 오늘 커밋("Improve homepage AEO and crawler access") 같은 구조 변경 이후, 같은 질문셋으로 전/후 비교 기록 — 무엇을 고쳐서 무엇이 달라졌는지 변경로그화
- [ ] 이 재측정은 dn-people.com 단독이 아니라 dnbn.co.kr과 묶어서(같은 브랜드 엔티티이므로) 수행해야 함 — 2장의 비대칭이 해소됐는지도 함께 확인 가능

---

## 4. 블로그 콘텐츠의 확정적 수치 리스크 (경미하지만 신규)

`unlocked-vs-carrier-cost`(자급제폰 vs 통신사 약정 2년 총비용 계산법) 같은 글은 구체적 비용 숫자를 다룰 가능성이 높다(내용 미확인, 제목 기준 추정). GEO 교과서 12-06/A-05가 지적하듯, 통신 요금·지원금처럼 **시점에 따라 바뀌는 숫자를 담은 글은 "확정 표현"이 시간이 지나면 AI에 의해 오답으로 재인용될 위험**이 있다.

- [ ] 비용/가격 관련 블로그 글에 "예시 기준 시점" 또는 "실제 요금제·지원금은 변동될 수 있으니 dnbn.co.kr에서 최신 조건을 확인하라"는 조건부 문구가 본문에 명시돼 있는지 확인 (홈페이지 FAQ에는 이미 이런 문구가 있음 — 블로그 글에도 동일 원칙이 적용되는지 점검 필요)
- [ ] `article:modified_time`이 실제 수치 변경 시점마다 갱신되는 프로세스가 있는지 확인 — 없다면 도입

---

## 5. 우선순위 요약

| 우선순위 | 항목 | 작업 위치 |
|---|---|---|
| P0 | dnbn.co.kr `/company` + 홈에 Organization/WebSite JSON-LD 추가, dn-people.com과 sameAs로 상호 연결 | `D:\app\dnbn` (별도 리포지토리, 승인 필요) |
| P1 | 브랜드/비브랜드 고정 질문셋으로 월간 mention/source/citation 재측정 루프 도입 | 운영 프로세스 (두 사이트 공통) |
| P2 | 비용/가격 다루는 블로그 글의 확정적 표현 점검·조건부 문구 보강 | dnbn-landing (`public/blog/*/index.html`) |
| 참고 | 이 리포지토리 자체의 구조적 AEO 구현은 이미 GEO 교과서 기준을 충족 — 추가 스키마/robots/llms.txt 작업 불필요 | - |

---
