"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ISlider {
  onSlideComplete: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Index: React.FC<ISlider> = (props) => {
  const { children, onSlideComplete, disabled = false } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [dragComplete, setDragComplete] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;
    setWidth(containerRef.current.offsetWidth);
  }, [containerRef]);

  const arrowOpacity = useTransform(x, [0, (width || 0) - 32], [1, 0]);

  useEffect(() => {
    if (dragComplete && !disabled) setDragComplete(false);
  }, [dragComplete, disabled]);

  return (
    <div className="w-full">
      <motion.div
        className={cn(
          "relative flex h-12 w-full items-center overflow-hidden rounded-full bg-gray-200",
          disabled && "cursor-not-allowed opacity-50",
          dragComplete && "bg-green-500",
          props.className,
        )}
        ref={containerRef}
      >
        {!dragComplete && (
          <motion.div
            className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-full bg-white shadow-md"
            drag="x"
            style={{ x, cursor: "grab" }}
            dragElastic={0.1}
            dragSnapToOrigin
            dragMomentum={false}
            dragConstraints={containerRef}
            onDragEnd={(event, info) => {
              if (!width) return;
              if (info.offset.x >= width - 32) {
                setDragComplete(true);
                onSlideComplete();
              }
            }}
          >
            <div className="absolute left-0 top-0 h-full w-full rounded-full bg-gray-200" />
            {!dragComplete && (
              <div className="flex h-12 w-12 items-center justify-center">
                <motion.div
                  style={{ opacity: arrowOpacity }}
                  className="text-2xl text-gray-500"
                >
                  -&gt;
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
        <motion.div className="absolute left-12 top-0 flex h-full w-full items-center justify-center">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
