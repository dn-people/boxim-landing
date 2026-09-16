import { NAV_ITEMS } from "../constants";

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const icons = {
  hero: (
    <svg {...ICON_PROPS}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h3.75v-5.5h3.5V21h3.75a1 1 0 0 0 1-1V9.5" />
    </svg>
  ),
  intro: (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.75h.01" />
    </svg>
  ),
  dnbn: (
    <svg {...ICON_PROPS}>
      <path d="M3.5 21h17" />
      <path d="M6 21V4.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V21" />
      <path d="M9.5 8h1.5M13 8h1.5M9.5 12h1.5M13 12h1.5" />
      <path d="M10.5 21v-4h3v4" />
    </svg>
  ),
  review: (
    <svg {...ICON_PROPS}>
      <path d="m12 3.75 2.6 5.27 5.82.85-4.21 4.1 1 5.8L12 17.03l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85z" />
    </svg>
  ),
  blog: (
    <svg {...ICON_PROPS}>
      <path d="M6 3.5h8L19 8.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5v5h5" />
      <path d="M8.5 13.5h7M8.5 17h4.5" />
    </svg>
  ),
};

const BottomNav = ({ section }) => (
  <nav
    aria-label="빠른 이동"
    className="lg:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-[rgba(255,255,255,0.92)] backdrop-blur-md"
    style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
  >
    <ul className="flex items-stretch">
      {NAV_ITEMS.map((item) => {
        const isActive = item.matches.includes(section);

        return (
          <li key={item.key} className="flex-1">
            <a
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={`flex h-[60px] flex-col items-center justify-center gap-[3px] text-[11px] leading-[12px] font-bold ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span
                className={`flex h-7 w-10 items-center justify-center rounded-full transition-colors duration-150 ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                {icons[item.key]}
              </span>
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default BottomNav;
