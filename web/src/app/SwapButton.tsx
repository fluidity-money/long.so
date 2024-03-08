import { Box } from "@/components";
import styles from "@/app/page.module.scss";
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
    className={styles.swapBtn}
    onClick={onClick}
  >
    <Swap className={styles.swapIcon} />
  </Box>
);
