import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import Button from "../components/button";
import Text from "../components/text";
import { DNBN_URL } from "../constants";
import { heroTitles } from "../data/content";

const HeroSection = () => {
  const [heroTitle, setHeroTitle] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTitle((prev) => (prev % 3) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
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
        <div className="flex max-w-3xl flex-col gap-6">
          <Text.Header1
            className="flex flex-col"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
          >
            <span className="relative block h-14 w-full overflow-hidden">
              <AnimatePresence>
                <motion.span
                  key={heroTitles[heroTitle - 1].key}
                  className="absolute inset-0"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                >
                  {heroTitles[heroTitle - 1].text}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>통신생활 원스톱 솔루션</span>
            <span>동네방네에서 쉽고 간편하게</span>
          </Text.Header1>
          <Text.Body1
            id="aeo-answer"
            className="max-w-2xl text-[17px] leading-7 font-normal text-white/90 lg:text-[19px] lg:leading-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            동네방네는 스마트폰 단말기 구매와 유심·이동통신사 요금제,
            인터넷·TV 가입을 한곳에서 살펴볼 수 있도록 돕는 통신생활 원스톱
            서비스입니다. 단말기와 통신상품을 각각 비교해 사용 목적과 예산에
            맞는 선택을 할 수 있도록 안내합니다.
          </Text.Body1>
        </div>
        <div>
          <Button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onClick={() => window.open(DNBN_URL, "_blank")}
          >
            바로가기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
