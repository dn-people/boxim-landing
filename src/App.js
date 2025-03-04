import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

import Button from "./components/button";
import { reviewDataRow1, reviewDataRow2 } from "./components/datas";
import Header from "./components/header";
import Star from "./components/star";
import Text from "./components/text";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [section, setSection] = useState(null);
  const [heroTitle, setHeroTitle] = useState(1);
  const [introSecton, setIntroSection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTitle((prev) => (prev % 3) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntroSection((prev) => (prev % 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const introSectionRef = useRef(null);
  const isIntroSection = useInView(introSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const conceptSectionRef = useRef(null);
  const isConceptSection = useInView(conceptSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const missionSectionRef = useRef(null);
  const isMissionSection = useInView(missionSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const whySectionRef = useRef(null);
  const isWhySection = useInView(whySectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const typeSectionRef = useRef(null);
  const isTypeSection = useInView(typeSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const boximSectionRef = useRef(null);
  const isBoximSection = useInView(boximSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const historySectionRef = useRef(null);
  const isHistorySection = useInView(historySectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const reviewSectionRef = useRef(null);
  const isReviewSection = useInView(reviewSectionRef, {
    margin: "0px 0px -90% 0px",
  });
  const endSectionRef = useRef(null);
  const isEndSection = useInView(endSectionRef, {
    margin: "0px 0px -90% 0px",
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

  console.log(section);

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
      <Header scroll={scroll} section={section} />
      <section
        id="hero-section"
        className="w-full min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        <motion.div
          style={{ backgroundImage: "url(./hero.jpeg)" }}
          className="absolute top-0 left-0 right-0 bottom-0 -z-1 bg-cover bg-no-repeat bg-center"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <div
          id="hero-container"
          className="container mx-auto flex flex-col p-6 lg:p-12 gap-6 lg:gap-12 justify-center text-white font-bold"
        >
          <div className="flex flex-col">
            <AnimatePresence>
              <motion.div
                className="w-full h-14 relative overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
              >
                {
                  {
                    1: (
                      <Text.Header1
                        key="smartphone"
                        className="absolute inset-0"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                      >
                        스마트폰 구매
                      </Text.Header1>
                    ),
                    2: (
                      <Text.Header1
                        key="cell"
                        className="absolute inset-0"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                      >
                        통신사 가입
                      </Text.Header1>
                    ),
                    3: (
                      <Text.Header1
                        key="usim"
                        className="absolute inset-0"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                      >
                        유심 구매
                      </Text.Header1>
                    ),
                  }[heroTitle]
                }
              </motion.div>
            </AnimatePresence>
            <Text.Header1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              통신생활 원스톱 솔루션
            </Text.Header1>
            <Text.Header1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              빡심에서 쉽고 간편하게
            </Text.Header1>
          </div>
          <div>
            <Button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              바로가기
            </Button>
          </div>
        </div>
      </section>
      <section
        id="intro-section"
        ref={introSectionRef}
        className="w-full min-h-160 h-screen max-h-200 bg-white"
        style={{ scrollMarginTop: "96px" }}
      >
        <div
          id="intro-container"
          className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            어렵고 복잡한 통신상품 구매는
            <br />
            빡심에게 맡기세요
          </Text.Header1>
          <AnimatePresence>
            <motion.div
              className="w-full h-96 lg:h-48 relative overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {
                {
                  1: (
                    <motion.div
                      key="intro-1"
                      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 px-6 py-6 rounded-[12px] bg-gray-100"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <div
                        style={{ backgroundImage: "url(./intro-1.jpeg)" }}
                        className="flex-none w-20 h-20 lg:w-16 lg:h-16 rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center"
                      />
                      <div className="flex flex-col">
                        <Text.Header6>
                          최신 스마트폰 & 가성비 모두 챙겨야 하는 20대 대학생
                          A님
                        </Text.Header6>
                        <Text.Header4 className="font-normal">
                          “민트급 자급제폰을 할인된 가격으로 구매하고, 추천해준
                          저렴한 유심 요금제 가입으로 기존의 2년 약정으로
                          구매했을 때 보다 훨씬 더 저렴하게 스마트폰을
                          구매했어요.”
                        </Text.Header4>
                      </div>
                    </motion.div>
                  ),
                  2: (
                    <motion.div
                      key="intro-2"
                      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 px-6 py-6 rounded-[12px] bg-gray-100"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <div
                        style={{ backgroundImage: "url(./intro-2.jpeg)" }}
                        className="flex-none w-20 h-20 lg:w-16 lg:h-16 rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center"
                      />
                      <div className="flex flex-col">
                        <Text.Header6>
                          부모님 스마트폰 바꿔드리고 싶은 사회 초년생 30대
                          직장인 B님
                        </Text.Header6>
                        <Text.Header4 className="font-normal">
                          "부모님께서는 이동통신사를 직접 방문하거나 복잡한
                          절차를 따라야 하는 불편함 없이, 제가 대신 모든 과정을
                          처리해드리니 정말 편리하셨어요. 온라인에서 간단하게
                          구매하고, 개통까지 문제없이 진행되니까 시간도 절약되고
                          부모님도 최신 기능을 바로 경험하실 수 있었습니다."
                        </Text.Header4>
                      </div>
                    </motion.div>
                  ),
                  3: (
                    <motion.div
                      key="intro-3"
                      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 px-6 py-6 rounded-[12px] bg-gray-100"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <div
                        style={{ backgroundImage: "url(./intro-3.jpeg)" }}
                        className="flex-none w-20 h-20 lg:w-16 lg:h-16 rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center"
                      />
                      <div className="flex flex-col">
                        <Text.Header6>
                          자녀들 스마트폰 구매부터 가족 통신비에 민감한 40대
                          가장 C님
                        </Text.Header6>
                        <Text.Header4 className="font-normal">
                          “제 아이의 첫 스마트폰을 구매하면서, 평소에 바쁜 일정
                          때문에 직접 여러 통신사를 방문하거나 복잡한 절차를
                          거치기 어려웠는데, 스마트폰 구매부터 저렴한 요금제 및
                          결합을 통한 추가 할인 등 모든 과정을 온라인에서
                          간편하게 한 번에 처리하여 시간과 저희 가족 통신비용을
                          크게 절약 할 수 있었습니다.”
                        </Text.Header4>
                      </div>
                    </motion.div>
                  ),
                }[introSecton]
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      <section
        id="concept-section"
        ref={conceptSectionRef}
        className="w-full min-h-160 h-screen max-h-200 bg-gray-100"
        style={{ scrollMarginTop: "96px" }}
      >
        <div
          id="concept-container"
          className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
        >
          <Text.Header1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <span className="font-normal">빡심팀이 강조하는</span>
            <br />
            현명한 통신생활 3대 원칙
          </Text.Header1>
          <div className="flex flex-col gap-6">
            <motion.div
              className="flex items-center gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-100 font-bold text-blue-500">
                <Text.Body1>1</Text.Body1>
              </div>
              <div className="flex-1 flex flex-col">
                <Text.Header5>
                  스마트폰 단말기 구매와 통신상품 가입을 분리해서 각각 저렴하게
                  구매하고 가입하는게 더 유리하다
                </Text.Header5>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-100 font-bold text-blue-500">
                <Text.Body1>2</Text.Body1>
              </div>
              <div className="flex-1 flex flex-col">
                <Text.Header5>
                  스마트폰 단말기는 믿을 수 있는 판매처에서 “박스폰”을 최대한
                  저렴하게 구매한다
                </Text.Header5>
                <Text.Body3 className="text-gray-500">
                  * 박스폰: 새롭게 출시된 최신 자급제폰 부터 할인폭이 큰 민트급
                  미개통 자급제폰
                </Text.Body3>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-100 font-bold text-blue-500">
                <Text.Body1>3</Text.Body1>
              </div>
              <div className="flex-1 flex flex-col">
                <Text.Header5>
                  통신상품은 유심과 인터넷/TV를 통합상품으로 동시에 약정하여
                  추가 할인 및 지원금을 최대한 확보하는것이 더욱 유리하다
                </Text.Header5>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section
        id="mission-section"
        ref={missionSectionRef}
        className="w-full min-h-480 h-[300vh] bg-white"
        style={{ scrollMarginTop: "96px" }}
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
        style={{ scrollMarginTop: "96px" }}
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
            <motion.div
              className="lg:flex-1 flex flex-col gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div
                style={{ backgroundImage: "url(./why-1.png)" }}
                className="h-48 rounded-[12px] bg-gray-100 bg-no-repeat bg-center bg-contain"
              />
              <Text.Header3>중간 유통구조 생략</Text.Header3>
              <Text.Header5 className="font-normal">
                제조사/이동통신사들의 공식 협력업체로서 직접 대량으로 단말기
                매입하여 바로 소비자들께 판매합니다
              </Text.Header5>
            </motion.div>
            <motion.div
              className="lg:flex-1 flex flex-col gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            >
              <div
                style={{ backgroundImage: "url(./why-2.png)" }}
                className="h-48 rounded-[12px] bg-gray-100 bg-no-repeat bg-bottom bg-contain"
              />
              <Text.Header3>서로 다른 시장에서 직접 쌓은 전문성</Text.Header3>
              <Text.Header5 className="font-normal">
                서로 완전히 다른 단말기 유통시장과 통신사 요금제 약정 시장에서
                직접 발로 뛰며 구축한 인프라로 자급제 구매부터 요금제 개통까지
                한번에 해결해드립니다
              </Text.Header5>
            </motion.div>
            <motion.div
              className="lg:flex-1 flex flex-col gap-6 p-6 rounded-[12px] bg-white"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            >
              <div
                style={{ backgroundImage: "url(./why-3.png)" }}
                className="h-48 rounded-[12px] bg-gray-100 bg-no-repeat bg-bottom bg-contain"
              />
              <Text.Header3>지원금 가장 많은 요금제 추천</Text.Header3>
              <Text.Header5 className="font-normal">
                사실상 큰 차이 없는 수천개의 요금제 중 현 시점 최대의 지원금을
                드릴 수 있는 답을 빡심이 찾아 드립니다
              </Text.Header5>
            </motion.div>
          </div>
        </div>
      </section>
      <section
        id="type-section"
        ref={typeSectionRef}
        className="w-full min-h-screen flex flex-col justify-center bg-white"
        style={{ scrollMarginTop: "96px" }}
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
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-phone.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">
                  최신 자급제폰
                </Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-box.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">박스폰</Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-tablet.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">태블릿</Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.15 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-watch.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">스마트 워치</Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-usim.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">유심 요금제</Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.25 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-setupbox.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">
                  인터넷 / TV 요금제
                </Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-plan.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">
                  이통사 약정 요금제
                </Text.Header4>
              </motion.div>
              <motion.div
                className="lg:flex-1 flex flex-col gap-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.35 }}
              >
                <div className="flex items-center justify-center h-48 rounded-[12px] bg-gray-100">
                  <div
                    style={{ backgroundImage: "url(./icon-accs.png)" }}
                    className="w-24 h-24 bg-no-repeat bg-center bg-contain"
                  />
                </div>
                <Text.Header4 className="text-center">악세사리</Text.Header4>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="boxim-section"
        ref={boximSectionRef}
        style={{
          backgroundImage: "url(./boxim-wallpaper.jpeg)",
          scrollMarginTop: "96px",
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
            <motion.div
              className="lg:flex-1 flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Text.Header2>200억 +</Text.Header2>
              <Text.Header5 className="font-normal">누적 매출액</Text.Header5>
            </motion.div>
            <motion.div
              className="lg:flex-1 flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            >
              <Text.Header2>1위</Text.Header2>
              <Text.Header5 className="font-normal">박스폰 판매</Text.Header5>
            </motion.div>
            <motion.div
              className="lg:flex-1 flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            >
              <Text.Header2>10명중 9명+</Text.Header2>
              <Text.Header5 className="font-normal">고객 만족</Text.Header5>
            </motion.div>
          </div>
        </div>
      </section>
      <section
        id="history-section"
        ref={historySectionRef}
        style={{
          backgroundImage: "url(./history.jpeg)",
          scrollMarginTop: "96px",
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
            <motion.div
              className="flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Text.Header6>2022년</Text.Header6>
              <Text.Header5 className="font-normal">
                • 삼성전자판매 공식 입찰협력사 선정
              </Text.Header5>
            </motion.div>
            <motion.div
              className="flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
            >
              <Text.Header6>2023년</Text.Header6>
              <Text.Header5 className="font-normal">
                • LG U+ 공식 입찰협력사 선정
              </Text.Header5>
              <Text.Header5 className="font-normal">
                • KT m&s 공식 입찰협력사 선정
              </Text.Header5>
            </motion.div>
            <motion.div
              className="flex flex-col gap-3 p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            >
              <Text.Header6>2024년</Text.Header6>
              <Text.Header5 className="font-normal">
                • 미디어로그 공식 입찰협력사 선정
              </Text.Header5>
              <Text.Header5 className="font-normal">
                • 민팃 공식 입찰협력사 선정
              </Text.Header5>
            </motion.div>
          </div>
        </div>
      </section>
      <section
        id="review-section"
        ref={reviewSectionRef}
        style={{ scrollMarginTop: "96px" }}
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
            <Marquee
              style={{ height: "360px", overflow: "visible" }}
              // autoFill
            >
              {reviewDataRow1.map((data) => (
                <motion.div
                  className="w-90 h-90 flex flex-col gap-6 p-6 rounded-[12px] bg-white mx-4"
                  key={data.name}
                  // initial={{ y: 50, opacity: 0 }}
                  // whileInView={{ y: 0, opacity: 1 }}
                  // transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="flex">
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </div>
                  <Text.Header6>{data.name}</Text.Header6>
                  <Text.Header5 className="flex-1 font-normal overflow-hidden text-ellipsis">
                    {data.content}
                  </Text.Header5>
                </motion.div>
              ))}
            </Marquee>
            <Marquee
              style={{ height: "360px", overflow: "visible" }}
              direction="right"
              // autoFill
            >
              {reviewDataRow2.map((data) => (
                <motion.div
                  className="w-90 h-90 flex flex-col gap-6 p-6 rounded-[12px] bg-white mx-4"
                  key={data.name}
                  // initial={{ y: 50, opacity: 0 }}
                  // whileInView={{ y: 0, opacity: 1 }}
                  // transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="flex">
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </div>
                  <Text.Header6>{data.name}</Text.Header6>
                  <Text.Header5 className="flex-1 font-normal overflow-hidden text-ellipsis">
                    {data.content}
                  </Text.Header5>
                </motion.div>
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
          id="hero-container"
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
          >
            바로가기
          </Button>
        </div>
      </section>
    </>
  );
};

export default App;
