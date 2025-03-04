import { motion } from "motion/react";

const Text = {
  Header1: ({ children, className, ...props }) => (
    <motion.h1
      className={`text-[36px] leading-[44px] lg:text-[48px] lg:leading-[56px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h1>
  ),
  Header2: ({ children, className, ...props }) => (
    <motion.h2
      className={`text-[30px] leading-[40px] lg:text-[36px] lg:leading-[44px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h2>
  ),
  Header3: ({ children, className, ...props }) => (
    <motion.h3
      className={`text-[24px] leading-[36px] lg:text-[30px] lg:leading-[40px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h3>
  ),
  Header4: ({ children, className, ...props }) => (
    <motion.h4
      className={`text-[20px] leading-[32px] lg:text-[24px] lg:leading-[36px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h4>
  ),
  Header5: ({ children, className, ...props }) => (
    <motion.h5
      className={`text-[18px] leading-[30px] lg:text-[20px] lg:leading-[32px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h5>
  ),
  Header6: ({ children, className, ...props }) => (
    <motion.h6
      className={`text-[16px] leading-[24px] lg:text-[18px] lg:leading-[30px] font-bold ${className}`}
      {...props}
    >
      {children}
    </motion.h6>
  ),
  Body1: ({ children, className, ...props }) => (
    <motion.p className={`text-[16px] leading-[24px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
  Body2: ({ children, className, ...props }) => (
    <motion.p className={`text-[14px] leading-[20px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
  Body3: ({ children, className, ...props }) => (
    <motion.p className={`text-[12px] leading-[16px] ${className}`} {...props}>
      {children}
    </motion.p>
  ),
};

export default Text;
