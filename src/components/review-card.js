import { motion } from "motion/react";

import Star from "./star";
import Text from "./text";

// 모바일에서 카드가 뷰포트(≈375px)보다 넓으면 어느 후기도 끝까지 읽히지 않는다.
const ReviewCard = ({ name, content }) => (
  <motion.div className="w-[280px] h-[280px] lg:w-90 lg:h-90 flex flex-col gap-3 lg:gap-6 p-5 lg:p-6 rounded-[12px] bg-white mx-2 lg:mx-4">
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} />
      ))}
    </div>
    <Text.Header6>{name}</Text.Header6>
    <Text.Header5 className="flex-1 font-normal overflow-hidden line-clamp-6 lg:line-clamp-none">
      {content}
    </Text.Header5>
  </motion.div>
);

export default ReviewCard;
