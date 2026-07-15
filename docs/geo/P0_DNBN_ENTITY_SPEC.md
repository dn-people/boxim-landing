# P0 — dnbn.co.kr 엔티티 신호 비대칭 해소 작업 스펙

- **작성일**: 2026-07-15 (Opus 분석, 실제 코드 대조)
- **작업 위치**: `D:\app\boxim` (dnbn.co.kr 실서비스 코드, CodeIgniter형 PHP)
  - ※ `GEO_GAP_ANALYSIS.md`가 참조한 `D:\app\dnbn` 경로는 **리네이밍 전 표기**이며, 현재 실제 경로는 `D:\app\boxim`이다. (이 리포 `boxim-landing`이 아님)
- **선행 조건**: 이 작업은 **별도 리포 수정**이므로 사용자 승인 후 진행. 본 문서는 "무엇을/어디에/어떻게"만 확정한다.

---

## 1. 문제 (왜 하는가)

`dn-people.com`(랜딩)의 Organization JSON-LD는 브랜드 대표 URL을 `https://dnbn.co.kr/`로 선언하고, `sameAs`에 dn-people.com·dnbn.co.kr·인스타그램을 넣어 **"이 둘은 같은 엔티티"라고 주장**한다.

그런데 실제 `dnbn.co.kr`(=`D:\app\boxim`)을 직접 확인한 결과:

- **JSON-LD가 전 페이지에 전무** — `grep`으로 `app/Views` 전체에서 `application/ld+json`/`schema.org`/`sameAs`를 찾았으나 실제 페이지에는 0건(무관한 contract_phone JS 1건 제외).
- **canonical 태그도 없음.**
- 즉 dnbn.co.kr을 크롤링하면 dn-people.com의 주장(sameAs)을 **뒷받침할 근거가 한쪽에도 없다** → 엔티티 합의 신호가 **단방향**. GEO 교과서가 경고하는 "채널마다 브랜드를 다르게/한쪽만 설명하면 AI가 엔티티를 혼동"의 정확한 사례이며, Gemini가 dnbn 브랜드를 오인하는 현상과 구조적으로 연결된다.

**목표**: dnbn.co.kr에도 Organization/WebSite JSON-LD를 넣고 `sameAs`로 dn-people.com을 **역방향 확인**시켜 신호를 양방향으로 만든다. 조인 키는 실제 식별자인 **사업자등록번호(taxID) `432-81-02257`** — 두 사이트가 동일 값을 쓰면 AI/검색엔진이 같은 법인으로 확정할 수 있다.

---

## 2. 대상 파일 (실제 확인됨)

| 파일 | 역할 | 처리 |
|---|---|---|
| `app/Views/pc/layout.php` | PC 공용 `<head>` (홈 등 대부분 페이지가 사용, `$meta[...]` 변수 기반) | **Organization + WebSite** 블록 주입 |
| `app/Views/pc/pages/company.php` | 회사소개(자체 완결형 HTML, layout 미사용, 자체 `<head>` 보유) | **Organization** 블록 주입 |
| `app/Views/mobile/layout.php` | 모바일 공용 `<head>` | PC와 동일 **Organization + WebSite** 주입 |
| `app/Views/mobile/pages/company.php` | 모바일 회사소개(자체 완결형) | **Organization** 주입 |

> 핵심은 "홈(대표 URL) + 회사소개 페이지"에 Organization이 있는 것. 공용 layout에 넣으면 사이트 전역에 적용되므로 가장 효율적이다. company.php는 layout을 쓰지 않는 독립 페이지라 **별도로** 넣어야 한다.

---

## 3. 주입할 JSON-LD (그대로 사용)

### 3-1. 홈/공용 layout (`pc/layout.php`, `mobile/layout.php`)

각 파일의 `<head>` 안(닫는 `</head>` 직전 권장, GTM 스크립트 뒤 아무 곳)에 삽입:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dnbn.co.kr/#organization",
      "name": "동네방네",
      "legalName": "주식회사 동네사람들",
      "url": "https://dnbn.co.kr/",
      "description": "스마트폰 단말기 구매부터 모바일 요금제와 인터넷·TV 가입까지 안내하는 통신생활 원스톱 서비스",
      "taxID": "432-81-02257",
      "email": "help@dn-people.com",
      "telephone": "1600-2891",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "광나루로56길 85(구의동), 테크노마트 사무동 6층 2-1호",
        "addressLocality": "광진구",
        "addressRegion": "서울특별시",
        "addressCountry": "KR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "고객지원",
        "telephone": "1600-2891",
        "email": "help@dn-people.com",
        "availableLanguage": "Korean"
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://dnbn.co.kr/faviconicon/android-icon-192x192.png"
      },
      "sameAs": [
        "https://dn-people.com/",
        "https://dnbn.co.kr/",
        "https://www.instagram.com/dnbn_official/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://dnbn.co.kr/#website",
      "url": "https://dnbn.co.kr/",
      "name": "동네방네",
      "alternateName": "동네방네팀",
      "inLanguage": "ko-KR",
      "publisher": { "@id": "https://dnbn.co.kr/#organization" }
    }
  ]
}
</script>
```

### 3-2. 회사소개 (`pc/pages/company.php`, `mobile/pages/company.php`)

자체 `<head>` 안에 **Organization 노드만** 삽입(3-1의 `@graph`에서 Organization 객체 하나만, `@context` 포함):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://dnbn.co.kr/#organization",
  "name": "동네방네",
  "legalName": "주식회사 동네사람들",
  "url": "https://dnbn.co.kr/",
  "taxID": "432-81-02257",
  "email": "help@dn-people.com",
  "telephone": "1600-2891",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "광나루로56길 85(구의동), 테크노마트 사무동 6층 2-1호",
    "addressLocality": "광진구",
    "addressRegion": "서울특별시",
    "addressCountry": "KR"
  },
  "sameAs": [
    "https://dn-people.com/",
    "https://dnbn.co.kr/",
    "https://www.instagram.com/dnbn_official/"
  ]
}
</script>
```

> **불변 규칙**: `legalName`, `taxID`, `address`, `telephone`, `email`, `sameAs` 값은 dn-people.com의 Organization과 **글자 단위로 동일**해야 한다(현재 dn-people.com `public/index.html` 90~124행 값 그대로). 여기서 한 글자라도 달라지면 조인 신호가 약해진다. `logo` URL만 각 사이트가 실제 호스팅하는 이미지로 맞춘다(위 예시는 dnbn.co.kr 실제 파비콘 경로).

---

## 4. 함께 하면 좋은 보조 항목 (선택, 저비용)

P0 본 작업과 같은 파일을 건드리는 김에 낮은 비용으로 얻는 것:

1. **canonical 추가** — 두 layout `<head>`에 `<link rel="canonical" href="현재 페이지 절대 URL">`. 현재 canonical이 전무하다. (`$meta['url']` 변수를 이미 og:url에 쓰고 있으므로 재사용 가능.)
2. **`<html lang="kr">` → `<html lang="ko">`** — `kr`은 유효한 언어 subtag가 아니다(국가코드). 한국어는 `ko`(또는 `ko-KR`). layout·company 상단 `<html>` 태그 수정.
3. 회사소개 본문에 **운영사·사업자등록번호·주소·대표·연락처를 텍스트로** 노출(이미 있으면 생략). Organization JSON-LD와 화면 텍스트가 일치하면 신뢰 신호가 강해진다.

> 위 3항목은 P0(엔티티 비대칭)의 핵심은 아니므로, 승인·리스크에 따라 별도로 판단. JSON-LD 주입이 최우선.

---

## 5. 검증 절차 (dnbn.co.kr 배포 후)

1. 각 페이지 **소스 보기**로 `<script type="application/ld+json">` 블록이 렌더링되는지 확인(PHP `<?= ?>` 변수 섞임 없이 순수 JSON이어야 함 — 위 블록은 변수 미사용이라 안전).
2. **JSON 유효성**: 브라우저 콘솔이나 `JSON.parse`, 또는 [Schema.org Validator](https://validator.schema.org/), Google [Rich Results Test](https://search.google.com/test/rich-results)로 파싱·타입 확인.
3. **sameAs 양방향 확인**: dn-people.com과 dnbn.co.kr 두 소스 모두 `sameAs`에 상대 도메인 + 동일 `taxID`가 들어갔는지 대조.
4. 배포 후 재크롤링을 위해 Google Search Console에서 홈·회사소개 URL **색인 요청**.
5. **효과 측정은 P1 측정 루프**(`docs/geo/GEO_MEASUREMENT_LOOP.md`)의 브랜드형 질문셋으로, 적용 전/후를 같은 조건에서 비교한다. 특히 "동네방네는 어떤 회사인가요?"에 Gemini가 올바른 정체(주식회사 동네사람들, 통신생활 원스톱)를 답하는지 전/후 기록.

---

## 6. 요약 (한 줄)

`D:\app\boxim`의 PC/모바일 **공용 layout 2개 + 회사소개 2개** `<head>`에, dn-people.com과 **동일한 taxID·주소·연락처·sameAs**를 가진 Organization(+홈은 WebSite) JSON-LD를 넣어, 지금은 dn-people.com→dnbn.co.kr 한 방향뿐인 엔티티 신호를 **양방향**으로 만든다. 승인되면 이 리포와 동일한 역할분담(fable 지시·검토 / sonnet 구현 / opus 1차 검토)으로 실행 가능.
