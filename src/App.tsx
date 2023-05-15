import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import { InfiLoad } from "./infiload";
function App() {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    // populate items
    setItems(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <InfiLoad
        onBottom={() => {
          setItems((prev) => [...prev, prev.length]);
        }}
        onTop={() => {
          setItems((prev) => [prev.length, ...prev]);
        }}
      >
        {items.map((i, _) => (
          // <div
          //   key={i}
          //   style={{
          //     height: 50 + ((Math.abs(i) * 71) % 100),
          //     width: "100%",
          //     overflow: "hidden",
          //     display: "flex",
          //     alignItems: "center",
          //     paddingLeft: 20,
          //     // bg color based on index
          //     backgroundColor: `hsl(${(i * 173) % 360}, 50%, 60%)`,
          //   }}
          // >
          //   <h1>{i}</h1>
          // </div>
          <div key={i}>
            <h1>{i}</h1>
          </div>
        ))}
      </InfiLoad>
    </div>
  );
}

export default App;
