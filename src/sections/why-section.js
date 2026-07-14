import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { whyCards } from "../data/content";

const WhySection = ({ sectionRef }) => (
  <section
    id="why-section"
    ref={sectionRef}
    className="w-full min-h-screen flex flex-col justify-center bg-gray-100"
    style={SECTION_SCROLL_MARGIN}
  >
    <div
      id="why-container"
      className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        동네방네는 왜
        <br />
        저렴하고, 간편하고, 쉬울까요?
      </Text.SectionTitle>
      <div className="flex flex-col lg:flex-row gap-6">
        {whyCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="lg:flex-1 flex flex-col gap-6 p-6 rounded-[12px] bg-white"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          >
            <div
              style={{ backgroundImage: `url(${card.image})` }}
              className={`h-48 rounded-[12px] bg-gray-100 bg-no-repeat ${card.imagePosition} bg-contain`}
            />
            <Text.Header3>{card.title}</Text.Header3>
            <Text.Header5 className="font-normal">{card.body}</Text.Header5>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;
