export const DNBN_URL = "https://dnbn.co.kr";
export const SECTION_SCROLL_MARGIN = {
  scrollMarginTop: "var(--section-scroll-margin)",
};
export const SECTION_IN_VIEW_MARGIN = "0px 0px -90% 0px";

// 상단 헤더(데스크톱 내비 / 모바일 로고 바)와 모바일 하단 탭바가 공유하는 메뉴 정의
export const NAV_ITEMS = [
  { key: "hero", label: "홈", href: "/#hero-section", matches: ["hero"] },
  {
    key: "intro",
    label: "소개",
    href: "/#intro-section",
    // 서비스 안내·FAQ(guide)도 '소개'로 묶어 하단 탭 하이라이트가 비지 않게 한다
    matches: ["intro", "concept", "mission", "why", "type", "guide"],
  },
  {
    key: "dnbn",
    label: "회사",
    href: "/#dnbn-section",
    matches: ["dnbn", "history"],
  },
  {
    key: "review",
    label: "후기",
    href: "/#review-section",
    matches: ["review", "end"],
  },
  { key: "blog", label: "블로그", href: "/blog/", matches: [] },
];
