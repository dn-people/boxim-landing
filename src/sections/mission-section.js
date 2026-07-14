import Text from "../components/text";
import { SECTION_SCROLL_MARGIN } from "../constants";

const MissionSection = ({ sectionRef, mission1Hide }) => (
  <section
    id="mission-section"
    ref={sectionRef}
    className="w-full min-h-480 h-[300vh] bg-white"
    style={SECTION_SCROLL_MARGIN}
  >
    <div
      id="mission-container"
      className="container mx-auto min-h-160 h-screen flex flex-col p-6 lg:p-12 justify-center gap-12 lg:gap-24 sticky top-0"
    >
      <Text.SectionTitle
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        하지만
        <br />
        <span className="font-normal">
          통신 시장의 현실을 바꿀 수 있을까요?
        </span>
      </Text.SectionTitle>
      <div className="w-full h-120 relative">
        <div
          id="mission-1"
          className={`absolute top-0 left-0 right-0 bottom-0 bg-gray-100 z-2 flex flex-col lg:items-center justify-center lg:flex-row rounded-[16px] transition-all duration-500 ${
            mission1Hide ? "hide" : ""
          }`}
        >
          <div className="lg:flex-1 flex flex-col justify-center items-center gap-2 lg:gap-3 p-12 ">
            <Text.Header3 className="text-center">
              어차피 알려줘도 아무도 안해요.
            </Text.Header3>
            <Text.Header5 className="font-normal text-center">
              “막상 구매하려고 하면, 현실적인 장벽에 부딫혀요. 진짜
              답답하죠.”
            </Text.Header5>
          </div>
          <div
            style={{ backgroundImage: "url(./mission-1.png)" }}
            className="flex-1 h-full bg-no-repeat bg-contain bg-bottom"
          />
        </div>
        <div
          id="mission-2"
          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-100 z-1 flex flex-col lg:items-center justify-center lg:flex-row rounded-[16px]"
        >
          <div className="flex-1 flex flex-col justify-center items-center gap-2 lg:gap-3 p-6 lg:p-12 ">
            <Text.Header3 className="text-center">
              왜 그럴까요?
            </Text.Header3>
            <Text.Header5 className="font-normal text-center">
              현재 통신 시장은 너무나도 복잡합니다. 수많은 유통 구조와
              복잡한 요금제, 그리고 신뢰하기 어려운 판매처들. 소비자
              입장에선 선뜻 구매 결정을 내리기가 쉽지 않죠. 이런 고민을 하다
              보면 결국 ‘모르겠다. 그냥 대리점 가야겠다.’는 결론에 도달하곤
              합니다.
            </Text.Header5>
          </div>
          <div
            style={{ backgroundImage: "url(./mission-2.png)" }}
            className="flex-1 h-full bg-no-repeat bg-contain bg-bottom"
          />
        </div>
      </div>
    </div>
  </section>
);

export default MissionSection;
