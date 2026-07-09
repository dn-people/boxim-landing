import { motion } from "motion/react";

import Button from "../components/button";
import Text from "../components/text";
import { BOXIM_URL } from "../constants";

const EndSection = ({ sectionRef }) => (
  <section
    id="end-section"
    ref={sectionRef}
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
        동네방네로 쉽고 편리하게
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
);

export default EndSection;
