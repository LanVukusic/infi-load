# Fast and smooth scrolling for the web


## References

This guy had a nice trick with page transforms. Could not have done it without him.
[Stack overflow link](https://stackoverflow.com/questions/59595066/prevent-div-scrolling-up-when-bumped-by-div-below-it)  

Please upvote his answer if you find this useful.  

## Demo

[Demo link](https://infiload.lanvukusic.com/)


## Usage

### Minimal example

``` tsx
import { InfiLoad } from "./infiload";

function App() {
  // some dynamic content
  const [items, setItems] = useState<number[]>([]);

  // initial load
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
          // loading content when user reaches the bottom
          setItems((prev) => [...prev, prev.length]);
        }}
        onTop={() => {
          // loading content when user reaches the top
          setItems((prev) => [prev.length, ...prev]);
        }}
      >
        {items.map((i, _) => (
          <div key={i}>
            <h1>{i}</h1>
          </div>
        ))}
      </InfiLoad>
    </div>
  );
}
```

## Library distribution

Due to lack of time, I did not publish this library to npm.  

If you wish to use it, you can copy the component from `src/InfiScroll` and use it in your project.  

NPM package will be published in the future.
