import { useEffect, useState } from "react";
import styles from "./Hoverable.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { ITooltip } from "@/components/Tooltip/Tooltip";

interface IHoverable extends React.HTMLAttributes<HTMLElement> {
  tooltip: React.ReactElement<ITooltip>;
}

const Hoverable: React.FC<IHoverable> = (props) => {
  const { children, className = "", tooltip } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // TODO: Set Tooltip x position to cursor position

  const classProps = `
    ${styles.Hoverable}
    ${className}
  `;

  useEffect(() => {
    if (isHovered || isFocused) {
      setShowTooltip(true);
      return;
    }

    if (!isHovered) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!isFocused) {
      setShowTooltip(false);
      return;
    }
  }, [isHovered, isFocused]);

  return (
    <div
      className={classProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.pseudoBridge}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Hoverable };
