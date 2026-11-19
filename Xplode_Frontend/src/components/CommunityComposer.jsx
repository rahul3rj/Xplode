import { createElement, useRef, useState } from "react";
import { Image, Link as LinkIcon, X } from "lucide-react";

export default function CommunityComposer({ user, games, fixedGame, Picker, onCreated }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postGame, setPostGame] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLink, setShowLink] = useState(false);
  const mediaInput = useRef(null);
  const gameId = fixedGame || postGame;

  const chooseMedia = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) { setError("Choose an image or video file."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Choose a file under 2 MB for browser storage."); return; }
    setMediaLoading(true); setError("");
    const reader = new FileReader();
    reader.onload = () => { setMedia({ data: reader.result, type: file.type, name: file.name }); setMediaLoading(false); };
    reader.onerror = () => { setError("Could not read that file. Please try again."); setMediaLoading(false); };
    reader.readAsDataURL(file);
  };
  const createPost = (event) => {
    event.preventDefault();
    if (!gameId || !title.trim() || mediaLoading) return;
    try {
      if (linkUrl && !/^https?:$/.test(new URL(linkUrl).protocol)) throw new Error("Invalid URL");
      const key = `xplode-community-posts-${gameId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (!Array.isArray(existing)) throw new Error("Invalid posts");
      const post = { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), ...(media ? { media: media.data, mediaType: media.type } : {}), link: linkUrl.trim(), createdAt: new Date().toISOString(), comments: [] };
      localStorage.setItem(key, JSON.stringify([post, ...existing]));
      setTitle(""); setBody(""); setMedia(null); setLinkUrl(""); setShowLink(false); setOpen(false); setError("");
      onCreated?.();
    } catch (err) { setError(err instanceof TypeError || err.message === "Invalid URL" ? "Please enter a valid http or https URL." : "Could not save your post. Browser storage may be full."); }
  };
  return <><form className="community-feed-compose" onSubmit={createPost}>
    <div className="community-compose-bar"><img className="community-compose-avatar" src={user?.profilePic || "/defaultprofile.jpg"} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/defaultprofile.jpg"; }} /><div className="community-compose-field"><input value={title} onFocus={() => setOpen(true)} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a title..." aria-label="Post title" maxLength={200} required /><input ref={mediaInput} className="community-media-input" type="file" accept="image/*,video/*" onChange={chooseMedia} aria-label="Choose an image or video" /><button type="button" aria-label="Add image or video" title="Add image or video" onClick={() => { setOpen(true); mediaInput.current?.click(); }}><Image size={18} strokeWidth={1.7} /></button><button type="button" aria-label="Add link" title="Add link" aria-pressed={showLink} onClick={() => { setOpen(true); setShowLink(!showLink); }}><LinkIcon size={18} strokeWidth={1.7} /></button></div><button className="community-compose-submit" type="submit" disabled={mediaLoading || !title.trim() || !gameId}>Post</button></div>
    {open && <div className="community-compose-details"><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add details to your post..." aria-label="Post details (optional)" maxLength={5000} />{mediaLoading && <small>Preparing media...</small>}{media && <div className="community-media-preview">{media.type.startsWith("video/") ? <video src={media.data} controls aria-label="Selected video" /> : <img src={media.data} alt="Selected media" />}<button type="button" onClick={() => setMedia(null)} aria-label="Remove media"><X size={16} /></button><span>{media.name}</span></div>}{showLink && <input type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="Paste a link" aria-label="Link URL" />}<div className="community-compose-bottom">{createElement(Picker, { games, value: gameId, onChange: setPostGame, locked: !!fixedGame })}<button className="community-compose-close" type="button" onClick={() => setOpen(false)} aria-label="Close post editor" title="Close post editor"><X size={17} aria-hidden="true" /></button></div><small className="community-compose-hint">Saved on this device · Media up to 2 MB</small></div>}
  </form>{error && <p className="community-error" role="alert">{error}</p>}</>;
}
