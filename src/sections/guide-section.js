import Text from "../components/text";
import {
  faqs,
  LAST_UPDATED,
  serviceRows,
  serviceSteps,
} from "../data/aeo-content";

const GuideSection = ({ sectionRef }) => (
  <section
    id="service-guide"
    ref={sectionRef}
    aria-labelledby="service-guide-title"
    className="w-full bg-white"
  >
    <div className="container mx-auto flex flex-col gap-10 px-6 py-20 lg:gap-16 lg:px-12 lg:py-24">
      <div className="flex max-w-4xl flex-col gap-4 lg:gap-5">
        <Text.SectionTitle id="service-guide-title">
          동네방네는 어떤 서비스인가요?
        </Text.SectionTitle>
        <Text.Body1 className="text-[16px]! leading-[26px]! text-gray-700 sm:text-[17px]! sm:leading-7! lg:text-[19px]! lg:leading-8!">
          동네방네는 단말기 유통과 통신상품 가입 시장에서 쌓은 경험을 바탕으로,
          스마트폰 구매부터 요금제와 인터넷·TV 선택까지 복잡한 통신생활을
          이해하기 쉽게 안내합니다. 아래에서 제공 범위와 이용 순서를 한눈에
          확인할 수 있습니다.
        </Text.Body1>
      </div>

      <div className="flex flex-col gap-2">
        <div className="overflow-x-auto rounded-[16px] border border-gray-200">
          <table className="w-full min-w-180 border-collapse text-left">
            <caption className="sr-only">
              동네방네에서 살펴볼 수 있는 상품과 선택 도움
            </caption>
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-[15px] font-bold lg:px-5 lg:py-4 lg:text-[16px]">
                  구분
                </th>
                <th scope="col" className="px-4 py-3 text-[15px] font-bold lg:px-5 lg:py-4 lg:text-[16px]">
                  상품
                </th>
                <th scope="col" className="px-4 py-3 text-[15px] font-bold lg:px-5 lg:py-4 lg:text-[16px]">
                  선택 도움
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceRows.map((row) => (
                <tr key={row.category} className="border-t border-gray-200">
                  <th scope="row" className="px-4 py-3 font-bold lg:px-5 lg:py-4">
                    {row.category}
                  </th>
                  <td className="px-4 py-3 leading-[26px] text-gray-700 lg:px-5 lg:py-4 lg:leading-7">
                    {row.products}
                  </td>
                  <td className="px-4 py-3 leading-[26px] text-gray-700 lg:px-5 lg:py-4 lg:leading-7">
                    {row.help}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Text.Body3 className="text-gray-500 lg:hidden" aria-hidden="true">
          표를 좌우로 밀면 나머지 항목을 볼 수 있습니다
        </Text.Body3>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <Text.Header2>동네방네 서비스는 어떻게 이용하나요?</Text.Header2>
          <ol className="flex list-decimal flex-col gap-3 pl-5 text-[16px] leading-[26px] text-gray-700 lg:gap-4 lg:pl-6 lg:text-[17px] lg:leading-7">
            {serviceSteps.map((step) => (
              <li key={step} className="pl-2">
                {step}
              </li>
            ))}
          </ol>
          <a
            href="https://dnbn.co.kr/"
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-[8px] bg-blue-500 px-5 py-4 text-center font-bold text-white hover:bg-blue-600 sm:w-fit lg:py-3"
          >
            동네방네 공식 서비스 보기
          </a>
        </div>

        <div
          id="faq-section"
          className="flex flex-col gap-6"
          aria-labelledby="faq-title"
        >
          <Text.Header2 id="faq-title">자주 묻는 질문</Text.Header2>
          <div className="flex flex-col divide-y divide-gray-200 rounded-[16px] border border-gray-200 px-5 lg:px-5">
            {faqs.map((faq) => (
              <article key={faq.question} className="py-4 lg:py-5">
                <Text.Header3 className="text-[17px]! leading-[26px]! lg:text-[21px]! lg:leading-8!">
                  {faq.question}
                </Text.Header3>
                <Text.Body1 className="aeo-answer mt-2 text-gray-700">
                  {faq.answer}
                </Text.Body1>
              </article>
            ))}
          </div>
        </div>
      </div>

      <aside className="rounded-[16px] bg-gray-100 p-5 text-[14px] leading-[24px] text-gray-600 lg:p-6 lg:text-[15px] lg:leading-7">
        <p>
          이 페이지는 일반적인 서비스 안내를 제공하며, 가격·재고·요금제·약정과
          지원 조건은 시점 및 신청 조건에 따라 달라질 수 있습니다. 최종 신청 전
          공식 서비스의 상품 상세와 신청 화면을 확인하세요.
        </p>
        <p className="mt-2">
          작성·검수:{" "}
          <a
            href="https://dnbn.co.kr/"
            rel="author"
            className="font-bold text-gray-800 underline"
          >
            동네방네 콘텐츠팀
          </a>
          {" · "}최종 업데이트:{" "}
          <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
        </p>
      </aside>
    </div>
  </section>
);

export default GuideSection;
