import { motion } from "motion/react";

import Star from "./star";
import Text from "./text";

const ReviewCard = ({ name, content }) => (
  <motion.div
    className="w-90 h-90 flex flex-col gap-6 p-6 rounded-[12px] bg-white mx-4"
  >
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} />
      ))}
    </div>
    <Text.Header6>{name}</Text.Header6>
    <Text.Header5 className="flex-1 font-normal overflow-hidden text-ellipsis">
      {content}
    </Text.Header5>
  </motion.div>
);

export default ReviewCard;
