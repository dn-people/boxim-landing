import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { dnbnStats } from "../data/content";

const dnbnSection = ({ sectionRef }) => (
  <section
    id="dnbn-section"
    ref={sectionRef}
    style={{
      backgroundImage: "url(./dnbn-wallpaper.jpeg)",
      ...SECTION_SCROLL_MARGIN,
    }}
    className="w-full min-h-160 h-screen max-h-200 bg-cover bg-no-repeat bg-center text-white"
  >
    <div
      id="dnbn-container"
      className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        동네방네를 만드는 사람들은 이미 시장에서 유명합니다
      </Text.SectionTitle>
      <div className="flex flex-col lg:flex-row gap-6">
        {dnbnStats.map((stat, index) => (
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
            <Text.Header3>{stat.value}</Text.Header3>
            <Text.Header5 className="font-normal">
              {stat.label}
            </Text.Header5>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default dnbnSection;
