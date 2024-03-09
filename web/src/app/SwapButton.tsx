import { Box } from "@/components";
import Swap from "@/assets/icons/Swap.svg";

export const SwapButton = ({ onClick }: { onClick?: () => void }) => (
  <Box
    whileHover={{
      borderRadius: 32,
      transition: {
        duration: 0.6,
      },
    }}
    initial={{
      borderRadius: 4,
      x: "-50%",
      y: "-50%",
    }}
    animate={{
      borderRadius: 4,
      transition: {
        duration: 0.6,
      },
    }}
    whileTap={{ scale: 0.9 }}
    background="dark"
    className="width-[40px] height-[40px] absolute left-1/2 top-1/2 flex cursor-pointer items-center justify-center"
    onClick={onClick}
  >
    <Swap className="absolute w-[10px]" />
  </Box>
);
