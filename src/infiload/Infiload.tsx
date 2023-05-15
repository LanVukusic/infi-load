import "./infi.css";
import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import {
  getScroll,
  setScrolBottom,
  getScrollBottom,
  setScrollPercentage,
} from "./util";

interface InfiscrollProps {
  children: ReactNode;
  onBottom: () => void;
  onTop: () => void;
  hideScrollbar?: boolean;
}

export function InfiLoad({
  children,
  onBottom,
  onTop,
  hideScrollbar = true,
}: InfiscrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const wraper = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<"safeBot" | "safeTop">("safeBot");

  function mirrorScrollbar(dir: "safeBot" | "safeTop") {
    if (!ref.current || dir === direction) return;

    if (dir === "safeBot") {
      // if safe bottom
      const scTopDelta = ref.current.scrollHeight - getScroll(ref.current);
      setScrolBottom(ref.current, scTopDelta);
    } else {
      // if safe top
      const scBotDelta =
        ref.current.scrollHeight - getScrollBottom(ref.current);
      setScrollPercentage(ref.current, scBotDelta);
    }
  }

  function safeguardBottomAdd() {
    if (wraper.current && ref.current) {
      wraper.current.style.transform = "";
      ref.current.style.transform = "";
      mirrorScrollbar("safeBot");
      setDirection("safeBot");
    }
  }

  function safeguardTopAdd() {
    if (wraper.current && ref.current) {
      wraper.current!.style.transform = "scale(-1, -1)";
      ref.current!.style.transform = "rotate(180deg)";
      mirrorScrollbar("safeTop");
      setDirection("safeTop");
    }
  }

  useEffect(() => {
    console.log(direction);
  }, [direction]);

  const topHandler = () => {
    if (direction === "safeBot") {
      safeguardTopAdd();
    }
  };
  const bottomHandler = () => {
    if (direction === "safeTop") {
      safeguardBottomAdd();
    }
  };

  const addCb = useCallback(() => {
    if (!ref.current) return;
    // since we rotated the whole thing around, we have to account for two different "bottoms" and "tops"
    // TOP HANDLER
    if (
      (getScroll(ref.current) < 30 && direction === "safeBot") ||
      (getScrollBottom(ref.current) > ref.current.scrollHeight - 10 &&
        direction === "safeTop")
    ) {
      topHandler();
      onTop();
    }

    // BOTTOM HANDLER
    if (
      (getScroll(ref.current) < 30 && direction === "safeTop") ||
      (getScrollBottom(ref.current) > ref.current.scrollHeight - 10 &&
        direction === "safeBot")
    ) {
      bottomHandler();
      onBottom();
    }
  }, [direction, ref.current, onBottom, onTop, topHandler, bottomHandler]);

  useEffect(() => {
    if (ref.current) {
      ref.current.onscroll = addCb;
    }

    return () => {
      if (ref.current) {
        ref.current.onscroll = null;
      }
    };
  }, [ref.current, addCb]);

  const wheelCb = useCallback(
    (e: WheelEvent) => {
      if (ref.current) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        // move the scrollbar by the delta
        if (direction === "safeBot") {
          ref.current.scrollTop += delta / 5;
        }
        if (direction === "safeTop") {
          // reverse scrolling
          ref.current.scrollTop -= delta / 5;
        }
      }
    },
    [ref.current, direction]
  );

  // fix half scroll
  useEffect(() => {
    if (ref.current) {
      // mouse scroll
      ref.current.onwheel = wheelCb;
      // keayboard scroll
      // TODO
    }
  }, [ref.current, wheelCb]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        ref={ref}
        className={hideScrollbar ? "no-scrollbar" : ""}
        style={{
          width: "100%",
          height: "100%",
          overflowY: "scroll",
        }}
      >
        <div ref={wraper}>{children}</div>
      </div>
    </div>
  );
}
