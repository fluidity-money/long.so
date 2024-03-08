import { motion } from "framer-motion";
import styles from "./Button.module.scss";

interface IButton {
  children: React.ReactNode;
  color?: "light" | "dark";
  size?: "small" | "medium" | "large";
  inline?: boolean;
  onClick?: () => void;
}

const Button: React.FC<IButton> = (props) => {
  const {
    children,
    color = "dark",
    size = "medium",
    inline = false,
    onClick = () => {
      return;
    },
  } = props;

  const classes = `
    ${styles.Button}
    ${styles[color]}
    ${styles[size]}
    ${inline ? styles.inline : ""}
  `;

  return (
    <motion.button
      className={classes}
      style={{
        rotate: 0,
        scale: 1,
      }}
      whileHover={{
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export { Button };
