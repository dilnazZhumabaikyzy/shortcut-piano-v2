import PixelIcon from "../pixelIcon";

// Three pixel stars, `count` of them filled.
const Stars = ({ count, size = 22 }) => (
  <div className="stars" role="img" aria-label={`${count} of 3 stars`}>
    {[1, 2, 3].map((n) => (
      <PixelIcon key={n} name={n <= count ? "star" : "starEmpty"} size={size} />
    ))}
  </div>
);

export default Stars;
