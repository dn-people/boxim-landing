import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

import Button from "./components/button";
import {
  BOXIM_URL,
  SECTION_IN_VIEW_MARGIN,
  SECTION_SCROLL_MARGIN,
} from "./constants";
import { boximStats, historyEntries } from "./data/content";
import { reviewDataRow1, reviewDataRow2 } from "./data/reviews";
import Header from "./components/header";
import ReviewCard from "./components/review-card";
import Text from "./components/text";
import ConceptSection from "./sections/concept-section";
import HeroSection from "./sections/hero-section";
import IntroSection from "./sections/intro-section";
import MissionSection from "./sections/mission-section";
import TypeSection from "./sections/type-section";
import WhySection from "./sections/why-section";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [section, setSection] = useState(null);

  const introSectionRef = useRef(null);
  const isIntroSection = useInView(introSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const conceptSectionRef = useRef(null);
  const isConceptSection = useInView(conceptSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const missionSectionRef = useRef(null);
  const isMissionSection = useInView(missionSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const whySectionRef = useRef(null);
  const isWhySection = useInView(whySectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const typeSectionRef = useRef(null);
  const isTypeSection = useInView(typeSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const boximSectionRef = useRef(null);
  const isBoximSection = useInView(boximSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const historySectionRef = useRef(null);
  const isHistorySection = useInView(historySectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const reviewSectionRef = useRef(null);
  const isReviewSection = useInView(reviewSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const endSectionRef = useRef(null);
  const isEndSection = useInView(endSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });

  useEffect(() => {
    if (isEndSection) {
      setSection("end");
    } else if (isReviewSection) {
      setSection("review");
    } else if (isHistorySection) {
      setSection("history");
    } else if (isBoximSection) {
      setSection("boxim");
    } else if (isTypeSection) {
      setSection("type");
    } else if (isWhySection) {
      setSection("why");
    } else if (isMissionSection) {
      setSection("mission");
    } else if (isConceptSection) {
      setSection("concept");
    } else if (isIntroSection) {
      setSection("intro");
    } else {
      setSection("hero");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll]);

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
      <IntroSection sectionRef={introSectionRef} />
      <ConceptSection sectionRef={conceptSectionRef} />
      <MissionSection sectionRef={missionSectionRef} mission1Hide={mission1Hide} />
      <WhySection sectionRef={whySectionRef} />
      <TypeSection sectionRef={typeSectionRef} />
      <section
        id="boxim-section"
        ref={boximSectionRef}
        style={{
          backgroundImage: "url(./boxim-wallpaper.jpeg)",
          ...SECTION_SCROLL_MARGIN,
        }}
        className="w-full min-h-160 h-screen max-h-200 bg-cover bg-no-repeat bg-center text-white"
      >
        <div
          id="boxim-container"
          className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            빡심을 만드는 사람들은 이미 시장에서 유명합니다
          </Text.Header1>
          <div className="flex flex-col lg:flex-row gap-6">
            {boximStats.map((stat, index) => (
              <motion.div
                key={stat.value}
                className="lg:flex-1 flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
              >
                <Text.Header2>{stat.value}</Text.Header2>
                <Text.Header5 className="font-normal">
                  {stat.label}
                </Text.Header5>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="history-section"
        ref={historySectionRef}
        style={{
          backgroundImage: "url(./history.jpeg)",
          ...SECTION_SCROLL_MARGIN,
        }}
        className="w-full min-h-screen flex flex-col justify-center bg-cover bg-no-repeat bg-center text-white"
      >
        <div
          id="history-container"
          className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            가계 통신비 절감에 진심인 사람들이 모여
            <br />
            약정폰 위주의 기존 통신시장에 새로운 변화를 만듭니다
          </Text.Header1>
          <div className="flex flex-col gap-6">
            {historyEntries.map((entry, index) => (
              <motion.div
                key={entry.year}
                className="flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
              >
                <Text.Header6>{entry.year}</Text.Header6>
                {entry.items.map((item) => (
                  <Text.Header5 key={item} className="font-normal">
                    {item}
                  </Text.Header5>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="review-section"
        ref={reviewSectionRef}
        style={SECTION_SCROLL_MARGIN}
        className="w-full min-h-screen flex bg-gray-100"
      >
        <div className="w-full flex flex-col justify-center overflow-hidden">
          <div
            id="review-container"
            className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24 overflow-visible"
          >
            <Text.Header1
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              빡심 이용자의
              <br />
              실제 후기
            </Text.Header1>
            <Marquee style={{ height: "360px", overflow: "visible" }}>
              {reviewDataRow1.map((data) => (
                <ReviewCard key={data.name} {...data} />
              ))}
            </Marquee>
            <Marquee
              style={{ height: "360px", overflow: "visible" }}
              direction="right"
            >
              {reviewDataRow2.map((data) => (
                <ReviewCard key={data.name} {...data} />
              ))}
            </Marquee>
          </div>
        </div>
      </section>
      <section
        id="end-section"
        ref={endSectionRef}
        className="w-full min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        <motion.div
          style={{ backgroundImage: "url(./end.jpeg)" }}
          className="absolute top-0 left-0 right-0 bottom-0 -z-1 bg-cover bg-no-repeat bg-center"
          initial={{ scale: 1.5 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <div
          id="end-container"
          className="container mx-auto flex flex-col items-center p-6 lg:p-12 gap-3 lg:gap-6 justify-center text-white font-bold"
        >
          <Text.Header1
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="text-center"
          >
            빡심으로 쉽고 편리하게
            <br />
            통신비 SAVE 하자
          </Text.Header1>
          <Button
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => window.open(BOXIM_URL, "_blank")}
          >
            바로가기
          </Button>
        </div>
      </section>
    </>
  );
};

export default App;
