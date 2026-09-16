import { useEffect, useState } from "react";

import { NAV_ITEMS } from "../constants";

const Header = ({ section }) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    switch (section) {
      case "hero":
      case "dnbn":
      case "history":
      case "end":
        setIsLight(false);
        return;
      default:
        setIsLight(true);
        return;
    }
  }, [section]);

  return (
    <header className="fixed top-3 lg:top-6 left-0 right-0 z-10">
      <div className="container mx-auto px-4 lg:px-6">
        <div
          className={`px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between rounded-[12px] transform duration-150 backdrop-blur-md ${
            isLight ? "bg-[rgba(255,255,255,0.5)]" : "bg-[rgba(0,0,0,0.5)]"
          }`}
        >
          <Logo isLight={isLight} />
          {/* 모바일은 하단 탭바가 섹션 이동을 담당하고, 상단은 브랜드만 노출한다 */}
          <nav
            aria-label="주요 메뉴"
            className="hidden lg:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <Nav
                key={item.key}
                isLight={isLight}
                href={item.href}
                isActive={item.matches.includes(section)}
              >
                {item.label}
              </Nav>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

// 로고 자체는 28px지만 히트 영역은 44px을 확보한다 (헤더 높이는 -my-2로 유지)
const Logo = ({ isLight }) => (
  <a href="/" aria-label="동네방네팀 홈" className="-my-2 flex items-center py-2">
    <img
      src="/logo-dnbn.svg"
      alt="동네방네"
      width="98"
      height="28"
      className="h-7 w-auto transition duration-150"
      style={isLight ? undefined : { filter: "brightness(0) invert(1)" }}
    />
  </a>
);

const Nav = ({ children, isActive, isLight, ...props }) => (
  <a
    className={`flex items-center justify-center whitespace-nowrap px-3 py-3 text-[16px] leading-[16px] font-bold cursor-pointer rounded-[4px] ${
      isLight ? "text-gray-600" : "text-white"
    } ${isActive ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
    {...props}
  >
    {children}
  </a>
);
