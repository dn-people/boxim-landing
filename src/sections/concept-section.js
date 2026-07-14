import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { conceptPrinciples } from "../data/content";

const ConceptSection = ({ sectionRef }) => (
  <section
    id="concept-section"
    ref={sectionRef}
    className="w-full min-h-160 h-screen max-h-200 bg-gray-100"
    style={SECTION_SCROLL_MARGIN}
  >
    <div
      id="concept-container"
      className="container mx-auto h-full flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <span className="font-normal">동네방네팀이 강조하는</span>
        <br />
        현명한 통신생활 3대 원칙
      </Text.SectionTitle>
      <div className="flex flex-col gap-6">
        {conceptPrinciples.map((principle, index) => (
          <motion.div
            key={principle.title}
            className="flex items-center gap-6 p-6 rounded-[12px] bg-white"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="flex-none flex items-center justify-center w-8 h-8 rounded-[4px] bg-blue-100 font-bold text-blue-500">
              <Text.Body1>{index + 1}</Text.Body1>
            </div>
            <div className="flex-1 flex flex-col">
              <Text.Header5>{principle.title}</Text.Header5>
              {principle.note && (
                <Text.Body3 className="text-gray-500">
                  {principle.note}
                </Text.Body3>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ConceptSection;
