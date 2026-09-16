import { motion } from "motion/react";

import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { productTypes } from "../data/content";

const TypeSection = ({ sectionRef }) => (
  <section
    id="type-section"
    ref={sectionRef}
    className="w-full min-h-[100svh] flex flex-col justify-center bg-white"
    style={SECTION_SCROLL_MARGIN}
  >
    <div
      id="type-container"
      className="container mx-auto flex flex-col px-6 lg:px-12 py-20 lg:py-24 justify-center gap-10 lg:gap-24"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        다양한 통신상품을
        <br />
        준비했습니다
      </Text.SectionTitle>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {productTypes.map((product, index) => (
            <motion.div
              key={product.label}
              className="lg:flex-1 flex flex-col gap-2 lg:gap-3"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: index * 0.05,
              }}
            >
              {/* 모바일 2열에서는 정사각 타일이라야 아이콘 주변 여백이 과하지 않다 */}
              <div className="flex items-center justify-center aspect-square lg:aspect-auto lg:h-48 rounded-[12px] bg-gray-100">
                <div
                  style={{ backgroundImage: `url(${product.icon})` }}
                  className="w-20 h-20 lg:w-24 lg:h-24 bg-no-repeat bg-center bg-contain"
                />
              </div>
              <Text.Header5 className="text-center lg:text-[24px]! lg:leading-[36px]!">
                {product.label}
              </Text.Header5>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TypeSection;
