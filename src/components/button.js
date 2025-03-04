import { motion } from "motion/react";

const Button = ({ children, ...props }) => (
  <motion.button
    className="flex items-center justify-center px-6 py-5 bg-blue-500 hover:bg-blue-600 text-[20px] leading-[20px] cursor-pointer rounded-[4px]"
    {...props}
  >
    {children}
  </motion.button>
);

export default Button;
