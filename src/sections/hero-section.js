import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import Button from "../components/button";
import Text from "../components/text";
import { BOXIM_URL } from "../constants";
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
        <div className="flex flex-col">
          <AnimatePresence>
            <motion.div
              className="w-full h-14 relative overflow-hidden"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            >
              <Text.Header1
                key={heroTitles[heroTitle - 1].key}
                className="absolute inset-0"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
              >
                {heroTitles[heroTitle - 1].text}
              </Text.Header1>
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
            onClick={() => window.open(BOXIM_URL, "_blank")}
          >
            바로가기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
