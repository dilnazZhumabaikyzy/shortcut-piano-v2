import { Link } from "react-router-dom";
import { AUTHOR } from "../../modules/about";
import PixelIcon from "../pixelIcon";
import "./index.css";

const Footer = () => (
  <footer className="footer">
    <a href={`mailto:${AUTHOR.email}`} className="footer__mail">
      <PixelIcon name="mail" size={28} />
      {AUTHOR.email}
    </a>
    <span className="footer__credits">
      Made by <Link to="/about">{AUTHOR.name}</Link> · Insert coin to continue
    </span>
  </footer>
);

export default Footer;
