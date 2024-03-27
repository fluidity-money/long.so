import { useEffect, useRef, useState } from "react";
import "./segmented-control.css";
import { cn } from "@/lib/utils";

const SegmentedControl = ({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
  className,
}: any) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const componentReady = useRef<boolean>();

  // Determine when the component is "ready"
  useEffect(() => {
    componentReady.current = true;
  }, []);

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref;
    const { offsetWidth, offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;

    style.setProperty("--highlight-width", `${offsetWidth}px`);
    style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
  }, [activeIndex, controlRef, segments]);

  const onInputChange = (value: any, index: any) => {
    setActiveIndex(index);
    if (callback) callback(value, index);
  };

  return (
    <div className={cn("controls-container", className)} ref={controlRef}>
      <div className={`controls ${componentReady.current ? "ready" : "idle"}`}>
        {segments?.map((item: any, i: number) => (
          <div
            key={item.value}
            className={`segment ${i === activeIndex ? "active" : "inactive"}`}
            ref={item.ref}
          >
            <input
              type="radio"
              value={item.value}
              id={item.value}
              name={name}
              onChange={() => onInputChange(item.value, i)}
              checked={i === activeIndex}
            />
            <label htmlFor={item.value}>{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
