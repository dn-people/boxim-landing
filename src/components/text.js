import { motion } from "motion/react";

// 모바일(≈375px)에서 36px 제목은 한 줄에 8~9자밖에 못 담아 어절이 계속 흘러넘친다.
// 모바일 → sm → lg 3단계로 낮춰 잡고, 제목은 text-pretty로 외톨이 줄을 줄인다.
const Text = {
  Header1: ({ children, className, ...props }) => (
    <motion.h1
      className={`text-[30px] leading-[40px] sm:text-[36px] sm:leading-[44px] lg:text-[48px] lg:leading-[56px] font-bold text-pretty ${className}`}
      {...props}
    >
      {children}
    </motion.h1>
  ),
  Header2: ({ children, className, ...props }) => (
    <motion.h2
      className={`text-[24px] leading-[34px] sm:text-[30px] sm:leading-[40px] lg:text-[36px] lg:leading-[44px] font-bold text-pretty ${className}`}
      {...props}
    >
      {children}
    </motion.h2>
  ),
  SectionTitle: ({ children, className, ...props }) => (
    <motion.h2
      className={`text-[28px] leading-[38px] sm:text-[34px] sm:leading-[44px] lg:text-[48px] lg:leading-[56px] font-bold text-pretty ${className}`}
      {...props}
    >
      {children}
    </motion.h2>
  ),
  Header3: ({ children, className, ...props }) => (
    <motion.h3
      className={`text-[20px] leading-[30px] sm:text-[24px] sm:leading-[36px] lg:text-[30px] lg:leading-[40px] font-bold text-pretty ${className}`}
      {...props}
    >
      {children}
    </motion.h3>
  ),
  Header4: ({ children, className, ...props }) => (
    <motion.h4
      className={`text-[18px] leading-[28px] sm:text-[20px] sm:leading-[32px] lg:text-[24px] lg:leading-[36px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h4>
  ),
  Header5: ({ children, className, ...props }) => (
    <motion.h5
      className={`text-[16px] leading-[26px] sm:text-[18px] sm:leading-[30px] lg:text-[20px] lg:leading-[32px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h5>
  ),
  Header6: ({ children, className, ...props }) => (
    <motion.h6
      className={`text-[15px] leading-[22px] sm:text-[16px] sm:leading-[24px] lg:text-[18px] lg:leading-[30px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h6>
  ),
  Body1: ({ children, className, ...props }) => (
    <motion.p className={`text-[16px] leading-[26px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
  Body2: ({ children, className, ...props }) => (
    <motion.p className={`text-[14px] leading-[22px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
  Body3: ({ children, className, ...props }) => (
    <motion.p className={`text-[12px] leading-[18px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
};

export default Text;
