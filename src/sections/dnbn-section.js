import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { dnbnStats } from "../data/content";

// 배경 사진은 모바일에서 다르게 크롭돼 밝은 부분 위에 흰 글씨가 얹히므로 오버레이로 대비를 확보한다
const PHOTO_OVERLAY = {
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.55))",
};

const DnbnSection = ({ sectionRef }) => (
  <section
    id="dnbn-section"
    ref={sectionRef}
    style={{
      backgroundImage: "url(./dnbn-wallpaper.jpeg)",
      ...SECTION_SCROLL_MARGIN,
    }}
    className="relative w-full min-h-[100svh] flex flex-col justify-center bg-cover bg-no-repeat bg-center text-white"
  >
    <div className="absolute inset-0" style={PHOTO_OVERLAY} aria-hidden="true" />
    <div
      id="dnbn-container"
      className="relative container mx-auto flex flex-col px-6 py-20 lg:p-12 justify-center gap-10 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        동네사람들은 이미 시장에서 유명합니다
      </Text.SectionTitle>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {dnbnStats.map((stat, index) => (
          <motion.div
            key={stat.value}
            className="lg:flex-1 flex flex-col gap-1 lg:gap-3 p-5 lg:p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          >
            <Text.Header3>{stat.value}</Text.Header3>
            <Text.Header5 className="font-normal text-white/80">
              {stat.label}
            </Text.Header5>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DnbnSection;
