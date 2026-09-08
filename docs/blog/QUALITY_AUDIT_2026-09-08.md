# 동네방네 블로그 SEO·AEO·GEO 콘텐츠 품질 감사

- 감사일: 2026-09-08 (Asia/Seoul)
- 기준 커밋: `5bda99c378e36a97143bf0cea623f610b94065ec`
- 범위: `public/blog/*/index.html` 33편, 블로그 목록, sitemap, RSS, robots.txt, llms.txt, 이미지 51개
- 방법: 저장소 정적 검사, 글별 `verify-blog --slug` 실행, 이미지 메타데이터·해시 검사, 공개 URL 응답 확인, 공식 자료 표본 대조
- 제외: Google Search Console, Bing Webmaster Tools, GA4, 백링크 도구, 실제 AI 답변의 월별 인용률. 따라서 노출·순위·클릭 성과는 이 감사만으로 판정하지 않는다.

## 종합 판정

| 영역 | 판정 | 근거 |
|---|---|---|
| 기술 SEO | 양호 | 33/33 canonical·og:url 일치, index/follow, 고유 title·description, H1 1개, sitemap·RSS·목록 포함 |
| AEO 추출성 | 양호 | 33/33 요약 답변, 질문형 섹션, 표, 순서형 체크리스트, 5~6개 FAQ와 FAQPage JSON-LD 보유 |
| GEO 인용 준비 | 보완 필요 | 27/33은 주장을 본문 가까이에서 출처와 연결하지 않고, 33/33 작성·검수 방식이 표시되지 않으며 `articleSection`이 없음 |
| 내부 정보 구조 | 보완 필요 | 20편은 문맥형 관련 글 링크가 1개뿐이고 16편은 다른 글에서 들어오는 문맥형 링크가 없음 |
| 이미지 품질·성능 | 우선 개선 | 24/33은 본문 이미지가 없고, 이미지 총량 48.82MB, 대표 이미지 33개 모두 크기 속성 없이 lazy load, 9편은 주제 정보가 없는 로고형 이미지 |
| 크롤러 접근 | 양호 | 공개 robots.txt가 Google, Bing, OAI, ChatGPT, Claude, Perplexity 등 검색·AI 크롤러를 허용하고 sitemap을 안내 |

구조는 이미 일정한 수준에 도달했다. 다음 단계의 효과는 FAQ 수를 늘리는 방식보다 **주장과 공식 근거의 연결, 글별 고유 형식, 실제 수정일·검수 방식, 내부 주제 연결, 의미가 맞는 경량 이미지**에서 나온다.

## 전수 검사 결과

- Article·FAQPage JSON-LD: 33/33
- canonical·og:url·sitemap·RSS·목록 일치: 33/33
- 요약·표·체크리스트·FAQ: 33/33
- `dnbn:category`와 Article `articleSection`: 0/33
- BreadcrumbList: 29/33
- 정확히 2개의 본문 이미지: 9/33
- 대표 이미지 1200×630: 22/33
- 대표 이미지의 `width`·`height`: 0/33
- 대표 이미지 eager 로딩: 0/33
- 직접 validator 통과: 28/33

직접 validator 실패 글은 다음 5편이다.

1. `best-phone-buying-site`: 요약 길이, FAQ 6개 불일치, 관련 글 링크, 대표 이미지 규격
2. `mvno-number-transfer-guide`: FAQ 6개 불일치, 대표 이미지 규격
3. `openbox-phone-grade-guide`: FAQ 6개 불일치, 대표 이미지 규격
4. `unlocked-vs-carrier-cost`: FAQ 6개 불일치, 대표 이미지 규격
5. `used-phone-imei-check`: 요약 답변 1자 초과

FAQ 불일치 4편은 화면 질문에만 `Q.`가 붙어 있고 JSON-LD에는 없는 형태다. 검색엔진이 JSON-LD를 파싱할 수 있는 것과 저장소의 “화면과 구조화 데이터 100% 일치” 규칙을 충족하는 것은 별개이므로 순차 수정한다.

## 이미지 진단

- 전체 51개 PNG의 합계는 48.82MB다. 대표 이미지는 평균 798KB, 본문 이미지는 평균 1.315MB다.
- 33개 대표 이미지가 모두 `loading="lazy"`라 첫 화면의 주요 이미지 로딩이 늦어질 수 있다.
- 대표 이미지 33개와 본문 이미지 14개에는 명시적 크기가 없어 레이아웃 이동 방지 신호가 부족하다.
- `best-phone-buying-site` 대표 이미지는 “알뜰폰이란 무엇인가?”라는 다른 주제의 문구를 담아 글·OG·목록 썸네일의 의미가 일치하지 않았다.
- `fold8-series-model-guide`, `internet-installation-check`, `internet-relocation-check`, `mobile-bill-checklist`, `mobile-payment-limit-check`, `phone-identity-check`, `phone-repair-warranty-guide`, `telecom-refund-check`, `used-phone-sale-prep`는 주제 묘사 없이 로고·원형 배경을 반복한다.
- 위 로고형 이미지 중 5개는 alt가 실제 이미지에 없는 폴더블폰·공유기·방패 등을 설명해 접근성 의미도 어긋난다.
- 블로그 목록은 33개 썸네일을 CSS 배경으로 불러와 네이티브 lazy loading을 사용할 수 없다. 이 항목은 개별 글 개선이 끝난 뒤 목록 성능 작업으로 분리한다.

## 순차 개선 대기열

콘텐츠 점수는 요약, 질문형 제목, 직접 답변, 표·체크리스트, FAQ 일치, 출처, E-E-A-T, 독창성, 구체성, 내부 링크, 상업적 절제를 각 0~2점으로 평가한 22점 만점 기준이다. 우선순위는 validator 오류, 의미가 틀린 이미지, 검색 의도와 상업적 중요도, 근거 범위, 내부 링크를 함께 반영했다.

| 순서 | slug | 콘텐츠 점수 | 본문 이미지 | 핵심 개선 항목 |
|---:|---|---:|---:|---|
| 1 | `best-phone-buying-site` | 14 | 0 | validator 9건, 잘못된 대표 이미지, 관련 글 0, 자사 추천 편향, Breadcrumb·카테고리 |
| 2 | `openbox-phone-grade-guide` | 18 | 0 | FAQ 불일치, 1693×929 대표 이미지, 등급 검증 방법·근거 보강 |
| 3 | `mvno-number-transfer-guide` | 16 | 0 | FAQ 불일치, 1731×909 대표 이미지, 실패·사전동의·개통 변수 보강 |
| 4 | `unlocked-vs-carrier-cost` | 19 | 0 | FAQ 불일치, 1536×1024 대표 이미지, 수치와 확인 시점 연결 |
| 5 | `fold8-series-model-guide` | 20 | 0 | 유일한 제품 리뷰이나 로고형 대표 이미지와 허위 alt, 실제 비교 시각자료 필요 |
| 6 | `mobile-payment-limit-check` | 18 | 0 | 로고형 대표 이미지와 허위 alt, 본문 절차 이미지 필요 |
| 7 | `phone-identity-check` | 19 | 0 | 로고형 대표 이미지와 허위 alt, 확인 경로 시각자료 필요 |
| 8 | `internet-installation-check` | 18 | 0 | 로고형 대표 이미지와 허위 alt, 주소·현장 확인 시각자료 필요 |
| 9 | `internet-relocation-check` | 18 | 0 | KT 중심 근거 범위, 로고형 대표 이미지와 허위 alt |
| 10 | `mobile-bill-checklist` | 18 | 0 | 로고형 대표 이미지, 청구서 항목 시각화 필요 |
| 11 | `phone-repair-warranty-guide` | 19 | 0 | 로고형 대표 이미지, 보증·증빙 시각화 필요 |
| 12 | `used-phone-imei-check` | 18 | 0 | 요약 1자 초과, 출처 2개, 본문 점검 이미지 필요 |
| 13 | `overseas-roaming-loss-prep` | 18 | 2 | FAQ·출처·CTA가 article 밖에 있어 문서 경계 수정 필요 |
| 14 | `mobile-insurance-claim-guide` | 19 | 2 | 전체 보험 제목과 SKT 단일 사례의 범위 정합성 수정 |
| 15 | `child-mobile-bill-alerts` | 18 | 2 | 공식 출처 1개, inbound 관련 글 0 |
| 16 | `unlocked-phone-compatibility-check` | 18 | 0 | 해외판 호환 근거를 제조사·통신사 공식 자료로 확장 |
| 17 | `mobile-contract-cost-check` | 20 | 2 | inbound 관련 글 0, 이미지 크기·로딩 속성 |
| 18 | `mobile-payment-damage-report` | 20 | 2 | inbound 관련 글 0, 대표 이미지 크기·로딩 속성 |
| 19 | `overseas-iphone-repair-check` | 19 | 2 | 본문 이미지 규격 1200×630, inbound 0 |
| 20 | `galaxy-battery-self-check` | 19 | 2 | inbound 0, 대표 이미지 크기·로딩 속성 |
| 21 | `esim-device-id-check` | 19 | 0 | inbound 0, 본문 식별번호 시각자료 필요 |
| 22 | `mvno-post-discount-cost` | 20 | 0 | inbound 0, 구간 요금 시각자료 필요 |
| 23 | `minor-phone-opening` | 19 | 0 | 출처 2개, 법정대리인 준비물 시각자료 필요 |
| 24 | `internet-cancellation-check` | 19 | 2 | inbound 0, 대표 이미지 크기·로딩 속성 |
| 25 | `phone-loss-report-next-steps` | 19 | 0 | 관련 글 outbound 1, 본문 절차 이미지 필요 |
| 26 | `used-iphone-activation-lock` | 19 | 2 | inbound 0, 이미지 크기·로딩 속성 |
| 27 | `used-phone-sale-prep` | 19 | 0 | 로고형 대표 이미지, 본문 초기화 절차 이미지 필요 |
| 28 | `telecom-refund-check` | 20 | 0 | 로고형 대표 이미지, inbound 0 |
| 29 | `data-usage-plan-guide` | 18 | 0 | 본문 사용량 구간 시각자료 필요 |
| 30 | `family-mobile-cost-plan` | 20 | 0 | inbound 0, 회선 구성 의사결정 시각자료 필요 |
| 31 | `internet-tv-bundle-guide` | 18 | 0 | 출처와 주장 연결, 총비용 시각자료 필요 |
| 32 | `number-transfer-fee-check` | 20 | 0 | 이미지 속성·본문 비용 흐름 시각자료 필요 |
| 33 | `usim-change-device-registration` | 18 | 0 | 본문 등록 절차 시각자료, 관련 근거 연결 |

## 1편씩 적용할 공통 완료 기준

1. 검색 의도와 직접 답변을 유지하되 글마다 표·계산·경로·의사결정 트리 중 알맞은 형식을 선택한다.
2. 변동 가능한 가격·제도·절차는 수정일 당일의 공식 1차 자료로 재검수하고, 해당 주장과 출처의 관계를 본문에서 설명한다.
3. `dnbn:category`, Article `articleSection`, BreadcrumbList, 실제 `dateModified`, 작성·검수 방식을 넣는다.
4. FAQ 화면과 FAQPage의 질문·답변·순서를 정확히 일치시킨다.
5. 관련 글을 문맥 속에 2개 이상 연결하되 중복 키워드 링크를 만들지 않는다.
6. 주제와 의미가 맞는 1200×630 대표 이미지 1개와 서로 다른 1200×675 본문 이미지 2개를 쓴다.
7. 대표 이미지는 eager/high priority, 본문 이미지는 lazy로 두고 모든 이미지에 `width`, `height`, `decoding`, 정확한 alt를 넣는다.
8. 직접 slug validator, 자동화 테스트, build, build 검증, diff 검사, PR 검사, Pages 배포, 공개 URL과 세 이미지 HTTP 검증까지 완료한다.

## 1차 적용 대상

`best-phone-buying-site`를 선택한다. 구매 의도와 허브 역할이 큰 글인데 관련 글 링크가 없고, validator 오류가 가장 많으며, 대표 이미지가 다른 주제를 설명했다. 1차 개선에서는 비교 기준을 총비용·계약·상태·보증 중심으로 다시 쓰고, 자사 추천 섹션을 제거하며, 공식 출처·관련 글·구조화 데이터·수정일·이미지 3개를 함께 정비한다.
