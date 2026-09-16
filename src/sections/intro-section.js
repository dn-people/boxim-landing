import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { introSlides } from "../data/content";

const IntroSection = ({ sectionRef }) => {
  const [introSection, setIntroSection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntroSection((prev) => (prev % 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="intro-section"
      ref={sectionRef}
      className="w-full min-h-[100svh] flex flex-col justify-center bg-white"
      style={SECTION_SCROLL_MARGIN}
    >
      <div
        id="intro-container"
        className="container mx-auto flex flex-col px-6 py-20 lg:p-12 justify-center gap-10 lg:gap-24"
      >
        <Text.SectionTitle
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          어렵고 복잡한 통신상품 구매는
          <br />
          동네방네에게 맡기세요
        </Text.SectionTitle>
        <AnimatePresence>
          {/* 슬라이드가 겹쳐 전환되므로 높이는 가장 긴 후기 기준으로 고정한다 */}
          <motion.div
            className="w-full h-[360px] sm:h-[300px] lg:h-48 relative overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              key={introSlides[introSection - 1].key}
              className="absolute inset-0 flex flex-col lg:flex-row lg:items-center justify-center gap-4 lg:gap-6 p-5 lg:p-6 rounded-[12px] bg-gray-100"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div
                style={{
                  backgroundImage: `url(${introSlides[introSection - 1].image})`,
                }}
                className="flex-none w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center"
              />
              <div className="flex flex-col gap-1 lg:gap-0">
                <Text.Header6 className="text-gray-500">
                  {introSlides[introSection - 1].persona}
                </Text.Header6>
                <Text.Body1 className="text-[15px]! leading-[24px]! sm:text-[16px]! sm:leading-[26px]! lg:text-[24px]! lg:leading-[36px]!">
                  {introSlides[introSection - 1].quote}
                </Text.Body1>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default IntroSection;
