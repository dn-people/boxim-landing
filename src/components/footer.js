const Footer = () => (
  <footer className="bg-gray-950 text-gray-300">
    <div className="container mx-auto flex flex-col gap-5 px-6 py-10 lg:px-12">
      <nav aria-label="하단 메뉴" className="flex flex-wrap gap-x-5 gap-y-3">
        <a href="/" className="font-bold text-white">
          동네방네팀
        </a>
        <a href="/#service-guide">서비스 안내</a>
        <a href="/#faq-section">자주 묻는 질문</a>
        <a href="/blog/">통신생활 가이드</a>
        <a href="https://dnbn.co.kr/" target="_blank" rel="noreferrer">
          공식 서비스
        </a>
        <a href="https://dnbn.co.kr/company" target="_blank" rel="noreferrer">
          회사소개
        </a>
        <a href="https://dnbn.co.kr/guide/privacy" target="_blank" rel="noreferrer">
          개인정보처리방침
        </a>
      </nav>
      <p className="text-[14px] leading-6 text-gray-400">
        스마트폰과 통신상품을 더 쉽고 합리적으로 선택하도록 돕는 동네방네팀의
        공식 소개 사이트입니다.
      </p>
      <address className="border-t border-gray-800 pt-5 text-[13px] not-italic leading-6 text-gray-500">
        <p>
          주식회사 동네사람들 · 대표 박사경 · 사업자등록번호 432-81-02257 ·
          통신판매신고번호 2021-서울광진-1122
        </p>
        <p>
          서울특별시 광진구 광나루로56길 85(구의동), 테크노마트 사무동 6층
          2-1호
        </p>
        <p>
          고객지원:{" "}
          <a href="tel:16002891" className="underline">
            1600-2891
          </a>
          {" · "}
          <a href="mailto:help@dn-people.com" className="underline">
            help@dn-people.com
          </a>
        </p>
      </address>
      <p className="text-[13px] text-gray-500">© 2026 동네방네</p>
    </div>
  </footer>
);

export default Footer;
