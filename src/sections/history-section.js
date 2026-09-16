import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { historyEntries } from "../data/content";

const PHOTO_OVERLAY = {
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.55))",
};

const HistorySection = ({ sectionRef }) => (
  <section
    id="history-section"
    ref={sectionRef}
    style={{
      backgroundImage: "url(./history.jpeg)",
      ...SECTION_SCROLL_MARGIN,
    }}
    className="relative w-full min-h-[100svh] flex flex-col justify-center bg-cover bg-no-repeat bg-center text-white"
  >
    <div className="absolute inset-0" style={PHOTO_OVERLAY} aria-hidden="true" />
    <div
      id="history-container"
      className="relative container mx-auto flex flex-col px-6 lg:px-12 py-20 lg:py-24 justify-center gap-10 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        가계 통신비 절감에 진심인 사람들이 모여
        <br />
        약정폰 위주의 기존 통신시장에 새로운 변화를 만듭니다
      </Text.SectionTitle>
      <div className="flex flex-col gap-4 lg:gap-6">
        {historyEntries.map((entry, index) => (
          <motion.div
            key={entry.year}
            className="flex flex-col gap-2 lg:gap-3 p-5 lg:p-6 rounded-[12px] bg-[rgba(31,41,55,0.75)] backdrop-blur-md"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          >
            <Text.Header6 className="text-blue-300">{entry.year}</Text.Header6>
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
);

export default HistorySection;
