import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Download, Gamepad2, Layers3, Monitor, MousePointer2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import "./launcher.css";

const features = [
  { icon: <Layers3 size={21} />, title: "Your games, together", text: "A single place to discover and manage games across your library." },
  { icon: <Zap size={21} />, title: "Made for downloads", text: "A dedicated, high-speed download experience is planned for the launcher." },
  { icon: <Gamepad2 size={21} />, title: "Play your way", text: "A controller-friendly mode is planned for a more comfortable experience." },
];

function LauncherPreview() {
  return <div className="launcher-preview" aria-label="Concept preview of the Xplode launcher">
    <div className="launcher-preview-top"><img src="/New%20Assets/LOGO.svg" alt="" /><span>CONCEPT PREVIEW</span><div className="launcher-preview-dots"><i /><i /><i /></div></div>
    <div className="launcher-preview-layout"><div className="launcher-preview-sidebar"><span className="is-active"><Layers3 size={15} /> Library</span><span><Gamepad2 size={15} /> Discover</span><span><Download size={15} /> Downloads</span></div>
      <div className="launcher-preview-body"><div className="launcher-preview-welcome"><div><small>YOUR SPACE TO PLAY</small><strong>Ready when you are.</strong></div><span><MousePointer2 size={13} /> Your library</span></div><div className="launcher-preview-covers">{["/GameList/er1.jpg", "/GameList/cyberpunk.jpg", "/GameList/gta.jpg"].map((image) => <div key={image}><img src={image} alt="" /></div>)}</div><div className="launcher-preview-footer"><span>All your games. One place.</span><span>XPLODE</span></div></div>
    </div>
  </div>;
}

export default function Launcher() {
  const platforms = useRef(null);
  const showPlatforms = () => platforms.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  return <main className="launcher-page"><div className="launcher-content">
    <section className="launcher-hero" aria-labelledby="launcher-title"><div className="launcher-hero-copy"><span className="launcher-eyebrow"><span /> THE XPLODE LAUNCHER</span><h1 id="launcher-title">Your games.<br />One home.</h1><p>Meet the future home for your games, community, and everything in between. The Xplode desktop launcher is in development.</p><div className="launcher-hero-actions"><button type="button" onClick={showPlatforms}>Explore downloads <ArrowDown size={16} /></button><Link to="/store">Explore the store <ArrowUpRight size={15} /></Link></div><div className="launcher-availability"><span /> Coming soon for desktop</div></div><LauncherPreview /></section>
    <section className="launcher-features" aria-labelledby="launcher-features-title"><div className="launcher-section-heading"><div><span className="launcher-overline">BUILT FOR HOW YOU PLAY</span><h2 id="launcher-features-title">More than a launcher.</h2></div><p>Everything you love about Xplode, with a desktop experience in mind.</p></div><div className="launcher-feature-grid">{features.map(({ icon, title, text }) => <article key={title} className="launcher-feature"><span className="launcher-feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="launcher-platforms" ref={platforms} aria-labelledby="launcher-platforms-title"><div className="launcher-section-heading"><div><span className="launcher-overline">YOUR PLATFORM</span><h2 id="launcher-platforms-title">Get ready to play.</h2></div><p>The launcher is in development. Downloads will appear here when releases are available.</p></div><div className="launcher-platform-grid">{[{ name: "Windows", description: "Desktop launcher" }, { name: "Linux", description: "Desktop launcher" }].map(({ name, description }) => <article className="launcher-platform-card" key={name}><span className="launcher-platform-icon"><Monitor size={22} /></span><div><h3>{name}</h3><p>{description}</p></div><button type="button" disabled aria-label={`${name} download coming soon`}>Coming soon</button></article>)}</div><p className="launcher-platform-note">Platform availability and requirements will be confirmed with each release.</p></section>
    <div className="launcher-bottom"><span>XPLODE LAUNCHER</span><Link to="/community/home">Find your community <ArrowUpRight size={15} /></Link></div>
  </div></main>;
}
