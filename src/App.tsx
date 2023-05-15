import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

function getScroll(element: HTMLElement | null) {
  if (element === null) {
    return NaN;
  }
  // returns the position of the top scroll thumb in relation to the scrollbar
  return element.scrollTop;
}

function getScrollBottom(element: HTMLElement | null) {
  if (element === null) {
    return NaN;
  }
  // returns the position of the bottom scroll thumb in relation to the scrollbar
  return element.scrollTop + element.offsetHeight;
}

function setScrollPercentage(element: HTMLElement | null, scroll: number) {
  if (element === null) {
    return;
  }
  element.scrollTop = scroll;
}

function setScrolBottom(element: HTMLElement | null, scroll: number) {
  if (element === null) {
    return;
  }
  element.scrollTop = scroll - element.offsetHeight;
}

function App() {
  const [items, setItems] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const wraper = useRef<HTMLDivElement>(null);
  const [hideScrollbar, setHideScrollbar] = useState(false);

  const [direction, setDirection] = useState<"safeBot" | "safeTop">("safeBot");

  function mirrorScrollbar(dir: "safeBot" | "safeTop") {
    if (!ref.current) return;
    if (dir === direction) return;

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

  const addCb = useCallback(() => {
    if (!ref.current) return;

    const topHandler = () => {
      console.log("top");
      if (direction === "safeBot") {
        safeguardTopAdd();
      }
      setItems([items[0] - 1, ...items.slice(0, items.length - 1)]);
    };
    const bottomHandler = () => {
      console.log("bottom");
      if (direction === "safeTop") {
        safeguardBottomAdd();
      }
      setItems([...items.slice(1), items[items.length - 1] + 1]);

      console.log(items.length, [
        ...items.slice(0, items.length),
        items.length,
      ]);
    };

    // since we rotated the whole thing around, we have to account for two different "bottoms" and "tops"
    // TOP HANDLER
    if (
      (getScroll(ref.current) < 30 && direction === "safeBot") ||
      (getScrollBottom(ref.current) > ref.current.scrollHeight - 10 &&
        direction === "safeTop")
    ) {
      topHandler();
    }

    // BOTTOM HANDLER
    if (
      (getScroll(ref.current) < 30 && direction === "safeTop") ||
      (getScrollBottom(ref.current) > ref.current.scrollHeight - 10 &&
        direction === "safeBot")
    ) {
      bottomHandler();
    }
  }, [items, direction, ref.current]);

  useEffect(() => {
    const items = Array.from({ length: 30 }).map((_, i) => i);
    setItems(items);
  }, []);

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
        console.log("wheel", direction);
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

      // touch scroll
      // works as is
    }
  }, [ref.current, wheelCb]);

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <div>
        <button
          onClick={() => {
            setHideScrollbar(!hideScrollbar);
          }}
        >
          toggle scrollbar visible
        </button>

        {/* <button
          onClick={() => {
            if (direction === "safeBot") {
              safeguardTopAdd();
            } else {
              safeguardBottomAdd();
            }
            mirrorScrollbar(direction);
          }}
        >
          mirror scrollbar
        </button> */}
        <span>{direction}</span>
      </div>
      <div
        ref={ref}
        className={hideScrollbar ? "no-scrollbar" : ""}
        style={{
          width: "100vw",
          height: "100%",
          overflowY: "scroll",
          // flip the scrollbar
          // transform: "rotate(180deg)",
        }}
      >
        <div
          ref={wraper}
          style={
            {
              // correct the flipped content while preserving scroll behaviour
              // transform: "scale(-1, -1)",
            }
          }
        >
          {items.map((i, _) => (
            <div
              key={i}
              style={{
                height: 50 + ((Math.abs(i) * 71) % 100),
                width: "100%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                paddingLeft: 20,
                // bg color based on index
                backgroundColor: `hsl(${(i * 173) % 360}, 50%, 60%)`,
              }}
            >
              <h1>{i}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
