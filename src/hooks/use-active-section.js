import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";

import { SECTION_IN_VIEW_MARGIN } from "../constants";

// 관찰 결과(IntersectionObserver)는 스크롤 이벤트와 별개로 갱신되므로,
// 스크롤량이 아니라 in-view 플래그 자체를 의존성으로 삼아야 앵커 점프에도 활성 섹션이 따라온다.
const useActiveSection = () => {
  const [section, setSection] = useState("hero");

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
  const isDnbnSection = useInView(dnbnSectionRef, {
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
  const guideSectionRef = useRef(null);
  const isGuideSection = useInView(guideSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });
  const endSectionRef = useRef(null);
  const isEndSection = useInView(endSectionRef, {
    margin: SECTION_IN_VIEW_MARGIN,
  });

  useEffect(() => {
    if (isEndSection) {
      setSection("end");
    } else if (isGuideSection) {
      setSection("guide");
    } else if (isReviewSection) {
      setSection("review");
    } else if (isHistorySection) {
      setSection("history");
    } else if (isDnbnSection) {
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
  }, [
    isEndSection,
    isGuideSection,
    isReviewSection,
    isHistorySection,
    isDnbnSection,
    isTypeSection,
    isWhySection,
    isMissionSection,
    isConceptSection,
    isIntroSection,
  ]);

  const refs = useMemo(
    () => ({
      intro: introSectionRef,
      concept: conceptSectionRef,
      mission: missionSectionRef,
      why: whySectionRef,
      type: typeSectionRef,
      dnbn: dnbnSectionRef,
      history: historySectionRef,
      review: reviewSectionRef,
      guide: guideSectionRef,
      end: endSectionRef,
    }),
    [],
  );

  return { section, refs };
};

export default useActiveSection;
