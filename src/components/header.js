import { useEffect, useState } from "react";

const Header = ({ section }) => {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    switch (section) {
      case "hero":
      case "boxim":
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
      <div className="container mx-auto px-3 lg:px-6">
        <div
          className={`px-3 lg:px-6 py-2 lg:py-4 flex items-center justify-between rounded-[12px] transform duration-150 backdrop-blur-md ${
            isLight ? "bg-[rgba(255,255,255,0.5)]" : "bg-[rgba(0,0,0,0.5)]"
          }`}
        >
          <Logo isLight={isLight} />
          <div className="flex items-center gap-1">
            <Nav
              isLight={isLight}
              href="/#hero-section"
              isActive={section === "hero"}
            >
              홈
            </Nav>
            <Nav
              isLight={isLight}
              href="/#intro-section"
              isActive={
                section === "intro" ||
                section === "concept" ||
                section === "mission" ||
                section === "why" ||
                section === "type"
              }
            >
              소개
            </Nav>
            <Nav
              isLight={isLight}
              href="/#boxim-section"
              isActive={section === "boxim" || section === "history"}
            >
              회사
            </Nav>
            <Nav
              isLight={isLight}
              href="/#review-section"
              isActive={section === "review" || section === "end"}
            >
              후기
            </Nav>
            <Nav isLight={isLight} href="/blog/" isActive={false}>
              블로그
            </Nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

const Logo = ({ isLight }) => (
  <img
    src="/logo-dnbn.svg"
    alt="동네방네"
    width="98"
    height="28"
    className="h-7 w-auto transition duration-150"
    style={isLight ? undefined : { filter: "brightness(0) invert(1)" }}
  />
);

const Nav = ({ children, isActive, isLight, ...props }) => (
  <a
    className={`flex items-center justify-center px-3 py-3 text-[16px] leading-[16px] font-bold cursor-pointer rounded-[4px] ${
      isLight ? "text-gray-500" : "text-white"
    } ${isActive ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
    {...props}
  >
    {children}
  </a>
);
