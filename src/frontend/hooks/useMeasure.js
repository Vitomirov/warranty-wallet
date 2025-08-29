import { useState, useRef, useEffect } from "react";

/**
 * Custom hook for dynamically measuring the height of a DOM element.
 * It's primarily used to calculate the height of a single list item
 * and provides a ref to attach to the list container for accurate measurements.
 * The hook recalculates the height on component updates and window resize events.
 * @param {any} dependency The hook will re-measure when this dependency changes.
 * @returns {{ref: React.RefObject<any>, height: number}} An object containing a ref for the element and its calculated height.
 */

const useMeasure = (dependency) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  /**
   * Measures the height of the first list item within the referenced element.
   * We use `getBoundingClientRect` to get the item's precise height, including padding and borders.
   */

  const measure = () => {
    if (ref.current) {
      const firstLiItem = ref.current.querySelector("li");
      if (firstLiItem) {
        setHeight(Math.ceil(firstLiItem.getBoundingClientRect().height));
      }
    }
  };

  /**
   * The effect hook that sets up height measurement.
   * It runs the measurement on initial render and whenever the provided dependency changes.
   * It also adds and cleans up a resize event listener to handle responsive changes.
   */

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [dependency]);

  return { ref, height };
};

export default useMeasure;
