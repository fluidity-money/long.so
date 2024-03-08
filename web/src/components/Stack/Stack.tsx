import { IToken, Token } from "@/components/Token/Token";
import styles from "./Stack.module.scss";
import { motion } from "framer-motion";

interface IStack {
  children: React.ReactElement<IToken>[];
  size?: "small" | "medium" | "large";
}

const Stack: React.FC<IStack> = (props) => {
  const { children, size = "medium" } = props;

  const stackClasses = `
    ${styles.Stack}
    ${styles[size]}
  `;

  const tokenDiameter = size === "small" ? 16 : size === "medium" ? 32 : 64;
  const offset = tokenDiameter - tokenDiameter / 3;
  // To find the total width of the container, n-1 tokens are overlapped, + 1 full width token
  const containerLength = (children.length - 1) * offset + tokenDiameter;

  return (
    <motion.div
      className={stackClasses}
      style={{ width: containerLength, height: tokenDiameter }}
    >
      {children.map((child, i) => {
        return (
          <motion.div
            key={i}
            className={styles.item}
            initial={{ x: offset * i }}
            style={{ zIndex: i }}
          >
            <Token {...child} size={size} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export { Stack };
