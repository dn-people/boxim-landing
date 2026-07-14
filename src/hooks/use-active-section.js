import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { SECTION_IN_VIEW_MARGIN } from "../constants";

const useActiveSection = (scroll) => {
  const [section, setSection] = useState(null);

  const introSectionRef = useRef(null);
  const isIntroSection = useInView(introSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const conceptSectionRef = useRef(null);
  const isConceptSection = useInView(conceptSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const missionSectionRef = useRef(null);
  const isMissionSection = useInView(missionSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const whySectionRef = useRef(null);
  const isWhySection = useInView(whySectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const typeSectionRef = useRef(null);
  const isTypeSection = useInView(typeSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const dnbnSectionRef = useRef(null);
  const isdnbnSection = useInView(dnbnSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const historySectionRef = useRef(null);
  const isHistorySection = useInView(historySectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const reviewSectionRef = useRef(null);
  const isReviewSection = useInView(reviewSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const endSectionRef = useRef(null);
  const isEndSection = useInView(endSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });

  useEffect(() => {
    if (isEndSection) {
      setSection("end");
    } else if (isReviewSection) {
      setSection("review");
    } else if (isHistorySection) {
      setSection("history");
    } else if (isdnbnSection) {
      setSection("dnbn");
    } else if (isTypeSection) {
      setSection("type");
    } else if (isWhySection) {
      setSection("why");
    } else if (isMissionSection) {
      setSection("mission");
    } else if (isConceptSection) {
      setSection("concept");
    } else if (isIntroSection) {
      setSection("intro");
    } else {
      setSection("hero");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll]);

  return {
    section,
    refs: {
      intro: introSectionRef,
      concept: conceptSectionRef,
      mission: missionSectionRef,
      why: whySectionRef,
      type: typeSectionRef,
      dnbn: dnbnSectionRef,
      history: historySectionRef,
      review: reviewSectionRef,
      end: endSectionRef,
    },
  };
};

export default useActiveSection;
