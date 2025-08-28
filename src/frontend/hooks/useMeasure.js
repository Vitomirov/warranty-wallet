import { useState, useRef, useEffect } from "react";

const useMeasure = (dependency) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const measure = () => {
    if (ref.current) {
      const firstLiItem = ref.current.querySelector("li");
      if (firstLiItem) {
        setHeight(Math.ceil(firstLiItem.getBoundingClientRect().height));
      }
    }
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dependency]);

  return { ref, height };
};

export default useMeasure;
