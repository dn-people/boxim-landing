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
      className="w-full min-h-160 h-screen max-h-200 bg-white"
      style={SECTION_SCROLL_MARGIN}
    >
      <div
        id="intro-container"
        className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
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
          <motion.div
            className="w-full h-96 lg:h-48 relative overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              key={introSlides[introSection - 1].key}
              className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 px-6 py-6 rounded-[12px] bg-gray-100"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <div
                style={{
                  backgroundImage: `url(${introSlides[introSection - 1].image})`,
                }}
                className="flex-none w-20 h-20 lg:w-16 lg:h-16 rounded-full bg-gray-500 bg-no-repeat bg-cover bg-center"
              />
              <div className="flex flex-col">
                <Text.Header6>
                  {introSlides[introSection - 1].persona}
                </Text.Header6>
                <Text.Header4 className="font-normal">
                  {introSlides[introSection - 1].quote}
                </Text.Header4>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default IntroSection;
