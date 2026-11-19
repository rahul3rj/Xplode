import { Link } from "react-router-dom";
import { Github, Instagram } from "lucide-react";

export default function StoreFooter() {
  return <footer className="store-footer">
    <div className="store-footer-brand">
      <img className="store-footer-logo" src="/New%20Assets/LOGO.svg" alt="Xplode" />
      <p>© 2025 Xplode. All rights reserved. All trademarks are property of their respective owners in India and other countries.</p>
      <div className="store-footer-bottom">
        <div className="store-footer-social" aria-label="Social media">
          <a href="https://github.com/rahul3rj/Xplode" target="_blank" rel="noreferrer" aria-label="Xplode on GitHub"><Github size={19} /></a>
          <span role="img" aria-label="X">𝕏</span>
          <span role="img" aria-label="Instagram"><Instagram size={19} /></span>
        </div>
        <Link className="store-footer-download" to="/library"><img src="/New%20Assets/LOGO%20Download.svg" alt="" />Download</Link>
      </div>
    </div>
    <div className="store-footer-column"><span>About Valve</span><span>Jobs</span><span>Steamworks</span><span>Steam Distribution</span><span>Support</span></div>
    <div className="store-footer-column"><span>About Valve</span><span>Jobs</span><span>Steamworks</span><span>Steam Distribution</span><span>Support</span></div>
    <div className="store-footer-column"><span>Privacy Policy</span><span>Legal</span><span>Steam Subscriber Agreement</span><span>Refunds</span><span>Cookies</span></div>
  </footer>;
}
