import Marquee from "react-fast-marquee";

import ReviewCard from "../components/review-card";
import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";
import { reviewDataRow1, reviewDataRow2 } from "../data/reviews";

const ReviewSection = ({ sectionRef }) => (
  <section
    id="review-section"
    ref={sectionRef}
    style={SECTION_SCROLL_MARGIN}
    className="w-full min-h-screen flex bg-gray-100"
  >
    <div className="w-full flex flex-col justify-center overflow-hidden">
      <div
        id="review-container"
        className="container mx-auto flex flex-col px-6 lg:px-12 py-16 lg:py-24 justify-center gap-12 lg:gap-24 overflow-visible"
      >
        <Text.SectionTitle
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          동네방네 이용자의
          <br />
          실제 후기
        </Text.SectionTitle>
        <Marquee style={{ height: "360px", overflow: "visible" }}>
          {reviewDataRow1.map((data) => (
            <ReviewCard key={data.name} {...data} />
          ))}
        </Marquee>
        <Marquee
          style={{ height: "360px", overflow: "visible" }}
          direction="right"
        >
          {reviewDataRow2.map((data) => (
            <ReviewCard key={data.name} {...data} />
          ))}
        </Marquee>
      </div>
    </div>
  </section>
);

export default ReviewSection;
