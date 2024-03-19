import USDC from "@/assets/icons/USDC.svg";
import ETH from "@/assets/icons/ETH.svg";
import styles from "./Token.module.scss";
import { motion, useAnimate } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tokenVariants = {
  idle: {
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export interface IToken {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Token: React.FC<IToken> = (props) => {
  const { size = "medium", className } = props;
  const [hovered, setHovered] = useState(false);

  const sz = size === "small" ? 0 : size === "medium" ? 1 : 2;

  const [scope, animate] = useAnimate();
  const [clickable, setClickable] = useState(true);

  const handleClick = async () => {
    if (!scope.current) return;
    if (!clickable) return;

    setClickable(false);
    setTimeout(
      () => {
        setClickable(true);
      },
      200 + sz * 100,
    );

    animate(
      scope.current,
      {
        y: [null, -(4 * sz + 6), 0],
      },
      {
        duration: 0.3 + sz * 0.1,
        ease: "easeOut",
      },
    );
  };

  return (
    <motion.div
      custom={sz}
      className={cn(styles.TokenContainer, styles[size], className)}
      variants={tokenVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <motion.div
        className={styles.Token}
        custom={sz}
        variants={tokenVariants}
        initial={"idle"}
        animate={hovered ? "hover" : "idle"}
        ref={scope}
      >
        <div className={styles.tails}>
          {/* Placeholder */}
          <USDC height={50} width={50} />
        </div>
        <div className={styles.heads}>
          {/* Placeholder */}
          <ETH height={50} width={50} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export { Token };
