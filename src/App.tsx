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
          setItems([...items.slice(1), items[items.length - 1] + 1]);
        }}
        onTop={() => {
          setItems([items[0] - 1, ...items.slice(0, items.length - 1)]);
        }}
      >
        {items.map((i, _) => (
          <h1
            key={i}
            style={{
              // fancy colors
              color: `hsl(${(i * 20) % 360}, 50%, 60%)`,
              fontSize: 30 + (Math.abs(i ** 3) % 110),
              // font settings
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {i}
          </h1>
        ))}
      </InfiLoad>
    </div>
  );
}

export default App;
