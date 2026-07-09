import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { boximStats } from "../data/content";

const BoximSection = ({ sectionRef }) => (
  <section
    id="boxim-section"
    ref={sectionRef}
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
);

export default BoximSection;
