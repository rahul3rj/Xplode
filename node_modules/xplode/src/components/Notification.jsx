import { forwardRef, useId } from "react";
import { X } from "lucide-react";
import ArtworkImage from "./ArtworkImage";
import "./notification.css";

const sections = [
  { title: "Important", items: [{ title: "DLC released", game: "Cyberpunk 2077", time: "1 hour ago", image: "https://cdn2.steamgriddb.com/grid/8c048326e93a94589190693897ce3456.jpg" }] },
  { title: "More", items: [{ title: "Live stream", game: "Sekiro: Shadows Die Twice", time: "3 hours ago", image: "https://cdn2.steamgriddb.com/grid/095cbfc2bef4012059a1641551b1f46f.png" }] },
];

const Notification = forwardRef(function Notification({ onClose }, ref) {
  const headingId = useId();
  return <div ref={ref} className="notification-panel" role="region" aria-labelledby={headingId}>
    <div className="notification-panel-header"><h2 id={headingId}>Notifications</h2>{onClose && <button type="button" className="notification-close" onClick={onClose} aria-label="Close notifications"><X size={17} aria-hidden="true" /></button>}</div>
    <div className="notification-panel-body">{sections.map((section) => <section className="notification-group" key={section.title} aria-label={section.title}><h3>{section.title}</h3>{section.items.map((item) => <div className="notification-item" key={item.title}><ArtworkImage className="notification-art" src={item.image} alt="" /><div className="notification-copy"><strong>{item.title}</strong><span>{item.game}</span><small>{item.time}</small></div></div>)}</section>)}</div>
  </div>;
});

export default Notification;
