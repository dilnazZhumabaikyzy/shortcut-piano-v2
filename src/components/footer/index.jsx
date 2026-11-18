import PixelIcon from "../pixelIcon";
import "./index.css";

const CONTACT_EMAIL = "shortcutlearnpiano@gmail.com";

const Footer = () => (
  <footer className="footer">
    <a href={`mailto:${CONTACT_EMAIL}`} className="footer__mail">
      <PixelIcon name="mail" size={28} />
      {CONTACT_EMAIL}
    </a>
    <span className="footer__credits">© Shortcut Piano · Insert coin to continue</span>
  </footer>
);

export default Footer;
