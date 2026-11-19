import { useState } from "react";
import "./artwork-image.css";

export default function ArtworkImage({ src, onLoad, onError, decoding = "async", ...props }) {
  const [settled, setSettled] = useState({ src: null, status: "loading" });
  const status = !src ? "error" : settled.src === src ? settled.status : "loading";

  return <img {...props} src={src} decoding={decoding} data-artwork-state={status} onLoad={(event) => {
    setSettled({ src, status: "loaded" });
    onLoad?.(event);
  }} onError={(event) => {
    const before = event.currentTarget.src;
    onError?.(event);
    if (event.currentTarget.src !== before) setSettled({ src, status: "loading" });
    else setSettled({ src, status: "error" });
  }} />;
}
