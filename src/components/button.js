import { motion } from "motion/react";

const Button = ({ children, className = "", ...props }) => (
  <motion.button
    className={`flex items-center justify-center px-6 py-4 lg:py-5 bg-blue-500 hover:bg-blue-600 text-[18px] lg:text-[20px] leading-[24px] font-bold text-white cursor-pointer rounded-[8px] ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;
