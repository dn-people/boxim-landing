import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

import Button from "./components/button";
import {
  BOXIM_URL,
  SECTION_IN_VIEW_MARGIN,
  SECTION_SCROLL_MARGIN,
} from "./constants";
import {
  boximStats,
  historyEntries,
  productTypes,
  whyCards,
} from "./data/content";
import { reviewDataRow1, reviewDataRow2 } from "./data/reviews";
import Header from "./components/header";
import ReviewCard from "./components/review-card";
import Text from "./components/text";
import ConceptSection from "./sections/concept-section";
import HeroSection from "./sections/hero-section";
import IntroSection from "./sections/intro-section";

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
      <section
        id="mission-section"
        ref={missionSectionRef}
        className="w-full min-h-480 h-[300vh] bg-white"
        style={SECTION_SCROLL_MARGIN}
      >
        <div
          id="mission-container"
          className="container mx-auto min-h-160 h-screen flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24 sticky top-0"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            하지만
            <br />
            <span className="font-normal">
              통신 시장의 현실을 바꿀 수 있을까요?
            </span>
          </Text.Header1>
          <div className="w-full h-120 relative">
            <div
              id="mission-1"
              className={`absolute top-0 left-0 right-0 bottom-0 bg-gray-100 z-2 flex flex-col lg:items-center justify-center lg:flex-row rounded-[16px] transition-all duration-500 ${
                mission1Hide ? "hide" : ""
              }`}
            >
              <div className="lg:flex-1 flex flex-col justify-center items-center gap-2 lg:gap-3 p-12 ">
                <Text.Header3 className="text-center">
                  어차피 알려줘도 아무도 안해요.
                </Text.Header3>
                <Text.Header5 className="font-normal text-center">
                  “막상 구매하려고 하면, 현실적인 장벽에 부딫혀요. 진짜
                  답답하죠.”
                </Text.Header5>
              </div>
              <div
                style={{ backgroundImage: "url(./mission-1.png)" }}
                className="flex-1 h-full bg-no-repeat bg-contain bg-bottom"
              />
            </div>
            <div
              id="mission-2"
              className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 z-1 flex flex-col lg:items-center justify-center lg:flex-row rounded-[16px]"
            >
              <div className="flex-1 flex flex-col justify-center items-center gap-2 lg:gap-3 p-6 lg:p-12 ">
                <Text.Header3 className="text-center">
                  왜 그럴까요?
                </Text.Header3>
                <Text.Header5 className="font-normal text-center">
                  현재 통신 시장은 너무나도 복잡합니다. 수많은 유통 구조와
                  복잡한 요금제, 그리고 신뢰하기 어려운 판매처들. 소비자
                  입장에선 선뜻 구매 결정을 내리기가 쉽지 않죠. 이런 고민을 하다
                  보면 결국 ‘모르겠다. 그냥 대리점 가야겠다.’는 결론에 도달하곤
                  합니다.
                </Text.Header5>
              </div>
              <div
                style={{ backgroundImage: "url(./mission-2.png)" }}
                className="flex-1 h-full bg-no-repeat bg-contain bg-bottom"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="why-section"
        ref={whySectionRef}
        className="w-full min-h-screen flex flex-col justify-center bg-gray-100"
        style={SECTION_SCROLL_MARGIN}
      >
        <div
          id="why-container"
          className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            빡심은 왜 
            <br />
            저렴하고, 간편하고, 쉬울까요?
          </Text.Header1>
          <div className="flex flex-col lg:flex-row gap-6">
            {whyCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="lg:flex-1 flex flex-col gap-6 p-6 rounded-[12px] bg-white"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
              >
                <div
                  style={{ backgroundImage: `url(${card.image})` }}
                  className={`h-48 rounded-[12px] bg-gray-100 bg-no-repeat ${card.imagePosition} bg-contain`}
                />
                <Text.Header3>{card.title}</Text.Header3>
                <Text.Header5 className="font-normal">{card.body}</Text.Header5>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="type-section"
        ref={typeSectionRef}
        className="w-full min-h-screen flex flex-col justify-center bg-white"
        style={SECTION_SCROLL_MARGIN}
      >
        <div
          id="type-container"
          className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            다양한 통신상품을
            <br />
            준비했습니다
          </Text.Header1>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {productTypes.map((product, index) => (
                <motion.div
                  key={product.label}
                  className="lg:flex-1 flex flex-col gap-3"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    delay: index * 0.05,
                  }}
                >
                  <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                    <div
                      style={{ backgroundImage: `url(${product.icon})` }}
                      className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                    />
                  </div>
                  <Text.Header4 className="text-center">
                    {product.label}
                  </Text.Header4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
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
