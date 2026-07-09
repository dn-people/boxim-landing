import { useEffect, useState } from "react";

import Header from "./components/header";
import useActiveSection from "./hooks/use-active-section";
import BoximSection from "./sections/boxim-section";
import ConceptSection from "./sections/concept-section";
import EndSection from "./sections/end-section";
import HeroSection from "./sections/hero-section";
import HistorySection from "./sections/history-section";
import IntroSection from "./sections/intro-section";
import MissionSection from "./sections/mission-section";
import ReviewSection from "./sections/review-section";
import TypeSection from "./sections/type-section";
import WhySection from "./sections/why-section";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [scroll, setScroll] = useState(0);

  const { section, refs } = useActiveSection(scroll);

  const mission1Hide = scroll > 4 * screen;

  const onUpdateScreen = () => {
    const height = window.innerHeight;
    if (height < 640) {
      setScreen(640);
    } else if (height > 800) {
      setScreen(800);
    } else {
      setScreen(height);
    }
  };

  const onUpdateScroll = () => {
    setScroll(window.scrollY);
  };

  useEffect(() => {
    onUpdateScreen();
    onUpdateScroll();
    window.addEventListener("resize", onUpdateScreen);
    window.addEventListener("scroll", onUpdateScroll);

    return () => {
      window.removeEventListener("resize", onUpdateScreen);
      window.removeEventListener("scroll", onUpdateScroll);
    };
  }, []);

  return (
    <>
      <Header section={section} />
      <HeroSection />
      <IntroSection sectionRef={refs.intro} />
      <ConceptSection sectionRef={refs.concept} />
      <MissionSection sectionRef={refs.mission} mission1Hide={mission1Hide} />
      <WhySection sectionRef={refs.why} />
      <TypeSection sectionRef={refs.type} />
      <BoximSection sectionRef={refs.boxim} />
      <HistorySection sectionRef={refs.history} />
      <ReviewSection sectionRef={refs.review} />
      <EndSection sectionRef={refs.end} />
    </>
  );
};

export default App;
