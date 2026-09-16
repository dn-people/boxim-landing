import { useEffect, useState } from "react";

import BottomNav from "./components/bottom-nav";
import Header from "./components/header";
import Footer from "./components/footer";
import useActiveSection from "./hooks/use-active-section";
import DnbnSection from "./sections/dnbn-section";
import ConceptSection from "./sections/concept-section";
import EndSection from "./sections/end-section";
import HeroSection from "./sections/hero-section";
import HistorySection from "./sections/history-section";
import GuideSection from "./sections/guide-section";
import IntroSection from "./sections/intro-section";
import MissionSection from "./sections/mission-section";
import ReviewSection from "./sections/review-section";
import TypeSection from "./sections/type-section";
import WhySection from "./sections/why-section";

// 미션 섹션은 300vh 안에서 sticky로 고정되므로, 고정 구간의 약 40% 지점에서 첫 카드를 걷어낸다.
const MISSION_REVEAL_RATIO = 0.8;

const App = () => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scroll, setScroll] = useState(0);

  const { section, refs } = useActiveSection();

  const missionTop = refs.mission.current?.offsetTop;
  const mission1Hide =
    missionTop !== undefined &&
    scroll > missionTop + viewportHeight * MISSION_REVEAL_RATIO;

  const onUpdateViewport = () => {
    setViewportHeight(window.innerHeight);
  };

  const onUpdateScroll = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    onUpdateViewport();
    onUpdateScroll();
    window.addEventListener("resize", onUpdateViewport);
    window.addEventListener("scroll", onUpdateScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onUpdateViewport);
      window.removeEventListener("scroll", onUpdateScroll);
    };
  }, []);

  return (
    <>
      <Header section={section} />
      <main>
        <HeroSection />
        <IntroSection sectionRef={refs.intro} />
        <ConceptSection sectionRef={refs.concept} />
        <MissionSection sectionRef={refs.mission} mission1Hide={mission1Hide} />
        <WhySection sectionRef={refs.why} />
        <TypeSection sectionRef={refs.type} />
        <DnbnSection sectionRef={refs.dnbn} />
        <HistorySection sectionRef={refs.history} />
        <ReviewSection sectionRef={refs.review} />
        <GuideSection sectionRef={refs.guide} />
        <EndSection sectionRef={refs.end} />
      </main>
      <Footer />
      <BottomNav section={section} />
    </>
  );
};

export default App;
