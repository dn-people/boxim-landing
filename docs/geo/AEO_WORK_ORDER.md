# AEO/GEO 개선 작업 지시서 (dn-people.com)

## 1. 개요

`docs/geo/GEO_GAP_ANALYSIS.md`에서 확정된 갭 중 이번 리포(dnbn-landing) 범위의 G1~G4를 실행한다.
파일 수정까지만 수행하고 **커밋/푸시/PR은 하지 않는다.** 아래 스키마·문구를 그대로 사용하고 새로운 스키마를 발명하지 않는다.

- 운영 도메인: `https://dn-people.com/` / 브랜드: 동네방네 / 공식 서비스: `https://dnbn.co.kr/`
- 블로그는 `public/blog/` 아래 정적 HTML (CRA 빌드 시 그대로 복사됨)

---

## 2. 작업 항목

### G1 — 블로그 목록 페이지에 구조화 데이터 추가

| 항목 | 내용 |
| --- | --- |
| 대상 파일 | `public/blog/index.html` |
| 현재 상태 | JSON-LD 0개 |
| 할 일 | `<head>` 내부(`</style>` 뒤, `</head>` 앞 권장)에 아래 `application/ld+json` `@graph` 블록 1개를 추가 |

추가할 블록 (아래 내용 그대로 사용. 제목/URL은 이 파일의 기존 카드에서 그대로 옮긴 값이며, 임의로 바꾸지 말 것):

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://dn-people.com/blog/#webpage",
        "name": "동네방네 블로그",
        "url": "https://dn-people.com/blog/",
        "inLanguage": "ko-KR",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://dn-people.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://dn-people.com/blog/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": "https://dn-people.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "블로그",
            "item": "https://dn-people.com/blog/"
          }
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://dn-people.com/blog/#itemlist",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "url": "https://dn-people.com/blog/used-phone-imei-check/",
            "name": "중고폰 IMEI 조회는 어떻게 하나요? 분실·도난 확인 순서"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "url": "https://dn-people.com/blog/openbox-phone-grade-guide/",
            "name": "오픈박스폰 등급은 어떻게 보나요? 상태 확인 체크리스트"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "url": "https://dn-people.com/blog/unlocked-vs-carrier-cost/",
            "name": "자급제폰 vs 통신사 약정, 2년 총비용 계산법"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "url": "https://dn-people.com/blog/mvno-number-transfer-guide/",
            "name": "알뜰폰 번호이동은 어떻게 하나요? 단계별 절차"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "url": "https://dn-people.com/blog/best-phone-buying-site/",
            "name": "핸드폰 살 땐 어디가 좋나요? 목적별 구매 사이트 비교"
          }
        ]
      }
    ]
  }
</script>
```

완료 기준 (acceptance):

- [ ] `public/blog/index.html`에 `application/ld+json` 블록이 정확히 1개 존재
- [ ] `@graph`에 `CollectionPage` + `BreadcrumbList` + `ItemList` 3개 노드
- [ ] `ItemList`의 position 1~5 순서가 페이지의 카드(`.post-card`) 순서와 동일 (imei → openbox → unlocked → mvno → best)
- [ ] name 값이 각 카드의 `<h3 class="post-title">` 텍스트와 글자 단위로 동일
- [ ] JSON이 `JSON.parse`로 파싱 가능 (트레일링 콤마·주석 금지)
- [ ] 기존 HTML(카드 마크업, 메타태그, 스타일)은 변경하지 않음

### G2 — 기존 글 4편에 BreadcrumbList 추가

| 항목 | 내용 |
| --- | --- |
| 대상 파일 | `public/blog/best-phone-buying-site/index.html`<br>`public/blog/mvno-number-transfer-guide/index.html`<br>`public/blog/openbox-phone-grade-guide/index.html`<br>`public/blog/unlocked-vs-carrier-cost/index.html` |
| 제외 | `public/blog/used-phone-imei-check/index.html` — 이미 BreadcrumbList 보유. **이 파일이 정답 레퍼런스**(해당 파일 100~123행 부근의 BreadcrumbList 노드 형태를 그대로 따를 것) |
| 삽입 위치 | 각 글의 JSON-LD `@graph` 배열 안, **`Article` 노드의 닫는 `},` 와 `FAQPage` 노드(`{ "@type": "FAQPage"...`) 사이** |

삽입할 노드 템플릿 (`<slug>`, `<그 글 제목>`만 아래 표의 값으로 치환. 들여쓰기는 주변 노드와 동일하게 맞출 것):

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://dn-people.com/blog/<slug>/#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://dn-people.com/" },
    { "@type": "ListItem", "position": 2, "name": "블로그", "item": "https://dn-people.com/blog/" },
    { "@type": "ListItem", "position": 3, "name": "<그 글 제목>", "item": "https://dn-people.com/blog/<slug>/" }
  ]
}
```

slug별 3번째 ListItem 값 (name은 각 파일 내 `Article.headline` 값과 동일해야 하며, 아래는 실제 파일에서 확인한 값):

| slug | name (= Article.headline) | item |
| --- | --- | --- |
| `best-phone-buying-site` | 핸드폰 살 땐 어디가 좋나요? 목적별 구매 사이트 비교 | `https://dn-people.com/blog/best-phone-buying-site/` |
| `mvno-number-transfer-guide` | 알뜰폰 번호이동은 어떻게 하나요? 단계별 절차 | `https://dn-people.com/blog/mvno-number-transfer-guide/` |
| `openbox-phone-grade-guide` | 오픈박스폰 등급은 어떻게 보나요? 상태 확인 체크리스트 | `https://dn-people.com/blog/openbox-phone-grade-guide/` |
| `unlocked-vs-carrier-cost` | 자급제폰 vs 통신사 약정, 2년 총비용 계산법 | `https://dn-people.com/blog/unlocked-vs-carrier-cost/` |

완료 기준 (acceptance):

- [ ] 4개 파일 각각의 `@graph`가 `Article` → `BreadcrumbList` → `FAQPage` 순서
- [ ] `@id`가 `https://dn-people.com/blog/<slug>/#breadcrumb` 형식으로 slug와 일치
- [ ] position 3의 name이 같은 파일의 `Article.headline`과 글자 단위로 동일
- [ ] JSON 파싱 가능 (`node scripts/verify-build.js`가 각 글의 JSON-LD를 `JSON.parse`로 검사하므로 문법 오류 시 FAIL)
- [ ] Article/FAQPage 등 기존 노드의 내용은 일절 변경하지 않음

### G3 — llms.txt 주요 가이드에 최신글 추가

| 항목 | 내용 |
| --- | --- |
| 대상 파일 | `public/llms.txt` |
| 할 일 | `## 주요 가이드` 섹션(현재 4개 항목)의 **맨 위(첫 항목)** 에 아래 한 줄을 추가해 5개로 만든다 |

추가할 줄 (그대로 사용):

```
- [중고폰 IMEI 조회 가이드](https://dn-people.com/blog/used-phone-imei-check/): 분실·도난 여부와 선택약정 대상 조회 순서
```

완료 기준 (acceptance):

- [ ] `## 주요 가이드` 아래 항목이 5개이며 첫 항목이 `used-phone-imei-check` 링크
- [ ] 기존 4개 항목과 다른 섹션은 변경하지 않음
- [ ] 형식(`- [제목](URL): 설명`)이 기존 항목과 동일

### G4 — 비용/가격 글 시점 조건부 문구 점검

| 항목 | 내용 |
| --- | --- |
| 대상 파일 | `public/blog/unlocked-vs-carrier-cost/index.html` (요금·수치 최다, 이미 "기준일/시점/달라질 수" 문구 있음 — 유무 재확인만)<br>그 외 점검 대상: `public/blog/best-phone-buying-site/index.html`, `public/blog/mvno-number-transfer-guide/index.html`, `public/blog/openbox-phone-grade-guide/index.html`, `public/blog/used-phone-imei-check/index.html` |
| 할 일 | 각 글 본문에서 요금·지원금 등 **시점에 따라 바뀌는 수치를 "확정 표현"으로 쓴 곳**이 있는지 점검. 그리고 본문(또는 하단)에 "요금제·지원금 등 조건은 시점에 따라 달라질 수 있으니 최종 신청 전 공식 서비스에서 확인하세요" 취지의 조건부 안내 문구가 있는지 확인하고, **빠진 글에만** 자연스럽게 보강 |

규칙:

- **본문 수치를 바꾸지 말 것.** 조건부 안내 문구의 유무만 점검·보강한다.
- 이미 취지가 같은 문구가 있는 글은 수정하지 않고 "확인됨"으로 결과만 기록한다.
- 문구를 추가할 때는 각 글의 기존 톤(존댓말, 안내형 문장)과 마크업 스타일에 맞춰 본문 하단에 문단 1개 수준으로 넣는다.

완료 기준 (acceptance):

- [ ] 5개 글 전부에 시점 조건부 안내 문구가 존재 (기존 보유 글은 무수정 통과)
- [ ] 어떤 글에서도 숫자·요금·표 데이터가 변경되지 않음
- [ ] 추가한 문구가 FAQ 질문/답변 텍스트와 충돌하지 않음 (JSON-LD FAQ 텍스트는 건드리지 않음)

---

## 3. 검증 절차

작업 완료 후 아래를 순서대로 실행하고 모두 통과해야 한다.

```
npm run build
node scripts/verify-aeo.js     # 마지막 줄에 "AEO VERIFY OK ..." 출력 확인
node scripts/verify-build.js   # 마지막 줄에 "VERIFY OK" 출력 확인
```

참고:

- `verify-aeo.js`는 루트 `index.html`(SPA) 중심 검사라 이번 블로그 수정과 직접 충돌하지 않지만, 회귀 방지를 위해 반드시 통과 확인.
- `verify-build.js`는 **모든 블로그 글의 `application/ld+json`을 `JSON.parse`로 파싱**하고, canonical 1개, h1 1개, 외부 이미지 핫링크 금지 등을 검사한다. G1/G2에서 JSON 문법 오류(트레일링 콤마 등)를 내면 여기서 FAIL 난다.
- 실패 시 출력된 `FAIL:` / `AEO FAIL:` 메시지를 보고 해당 항목만 수정 후 재실행.

## 4. 범위 밖 (이번 작업에서 하지 않음)

- **P0 — dnbn.co.kr `/company`·홈의 Organization/WebSite JSON-LD, 엔티티 sameAs 상호연결**: 별도 리포 `D:\app\dnbn` 소관이며 사용자 승인 필요 → 제외.
- **신규 블로그 글 발행** (`docs/blog/dnbn-migration/*.md` 활용): 별도 파이프라인 → 제외.
- **커밋/푸시/PR**: 별도 지시 없음 → 하지 않는다. 파일 수정까지만.

---

## 5. 완료 확인 (2026-07-15)

G1~G4 완료 기준을 파일 단위로 재대조한 결과, **미충족 항목 없음**. 전 변경은 6개 파일 171줄 순수 추가(삭제 0줄)이며 지시서 범위와 정확히 일치한다.

- **G1 — 완료**: `public/blog/index.html`에 `application/ld+json` 정확히 1블록, `@graph` = CollectionPage → BreadcrumbList → ItemList. ItemList position 1~5가 카드 순서(imei → openbox → unlocked → mvno → best)와 동일하고, name이 각 카드 `<h3 class="post-title">` 텍스트와 글자 단위 일치. JSON.parse 통과, 기존 마크업 무변경(diff 순수 추가).
- **G2 — 완료**: 4개 글(best/mvno/openbox/unlocked) 모두 `@graph`가 Article → BreadcrumbList → FAQPage 순서. `@id`가 `https://dn-people.com/blog/<slug>/#breadcrumb` 형식으로 slug와 일치하고, position 3 name이 같은 파일의 `Article.headline`과 글자 단위 동일. 레퍼런스(used-phone-imei-check) 무수정, 기존 Article/FAQPage 노드 무변경.
- **G3 — 완료**: `public/llms.txt` `## 주요 가이드` 항목 5개(4→5), 첫 항목이 지정된 `used-phone-imei-check` 라인과 정확히 일치(형식 `- [제목](URL): 설명` 동일). 다른 섹션 무변경(1줄 추가, 0줄 삭제).
- **G4 — 완료**: 5편 전부 시점 조건부 안내 문구 존재 확인 — unlocked·mvno·used는 기존 문구로 무수정 통과, best(363행)·openbox(318행)는 기존 톤에 맞춘 1문단 보강. 숫자·요금·표 데이터 및 FAQ JSON-LD 텍스트 무변경(diff 삭제 0줄).

**검증 3종**: `npm run build` 성공, `node scripts/verify-aeo.js` → "AEO VERIFY OK: 1576 initial body chars, 1 JSON-LD block", `node scripts/verify-build.js` → "VERIFY OK" — 3종 모두 그린(exit 0), 조율자 독립 재실행에서도 동일하게 그린.

**범위 준수**: 커밋/푸시/PR 미수행(지시서 §4 준수).

서명: 구현 sonnet · 1차 검토 opus · 조율/검토 fable
