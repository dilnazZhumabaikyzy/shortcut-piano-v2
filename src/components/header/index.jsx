import { Link, useLocation } from "react-router-dom";
import PixelIcon from "../pixelIcon";
import "./index.css";

const Header = () => {
  const { pathname } = useLocation();
  // Game pages of a category live under other URLs, so match them by prefix too.
  const links = [
    { to: "/shortcuts", label: "Shortcuts", also: ["/compositions", "/instruction", "/play"] },
    { to: "/typing", label: "Fast typing" },
    { to: "/chess", label: "Chess" },
  ];
  const isActive = (link) =>
    pathname.startsWith(link.to) || (link.also ?? []).some((prefix) => pathname.startsWith(prefix));

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <PixelIcon name="logo" size={52} />
        <span className="header__title">
          Shortcut
          <br />
          Piano
        </span>
      </Link>
      <nav className="header__nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`header__link ${isActive(link) ? "active" : ""}`}
            aria-current={isActive(link) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
