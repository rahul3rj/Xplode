import { useEffect, useRef, useState } from "react";
import { ImagePlus, MessageCircle, Send, Users, X } from "lucide-react";
import demoChats from "../data/chatDemo.json";
import "./community.css";
import "./chat.css";

function ChatAvatar({ chat }) {
  return <span className={`chat-demo-avatar${chat.kind === "group" ? " chat-demo-avatar--group" : ""}`} aria-hidden="true">{chat.kind === "group" ? <Users size={19} /> : chat.name.charAt(0)}</span>;
}

export default function Chat() {
  const [chats, setChats] = useState(demoChats);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const messagesRef = useRef(null);
  const mediaInput = useRef(null);
  const objectUrls = useRef([]);
  const chat = chats.find((item) => item.id === selectedId);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [chat]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!chat || (!text && !attachment)) return;
    const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
    const media = attachment ? { url: URL.createObjectURL(attachment), type: attachment.type, name: attachment.name } : null;
    if (media) objectUrls.current.push(media.url);
    setChats((current) => current.map((item) => item.id === chat.id ? { ...item, messages: [...item.messages, { sender: "You", text, time, media }] } : item));
    setDraft("");
    setAttachment(null);
  };

  return <main className="chat-page"><div className="chat-layout">
    <aside className="chat-list" aria-label="Conversations"><h1>Chats</h1><p>Friends and squads</p><span className="chat-demo-label">Demo conversations</span>
      <div className="chat-demo-list">{chats.map((item) => {
        const latest = item.messages[item.messages.length - 1];
        return <button key={item.id} type="button" className={`chat-demo-row${selectedId === item.id ? " is-active" : ""}`} onClick={() => { setSelectedId(item.id); setDraft(""); setAttachment(null); }} aria-pressed={selectedId === item.id}>
          <ChatAvatar chat={item} /><span className="chat-demo-row-copy"><strong>{item.name}</strong><small>{latest?.sender === "You" ? "You: " : item.kind === "group" ? `${latest?.sender}: ` : ""}{latest?.text || (latest?.media?.type.startsWith("video/") ? "Video" : "Photo")}</small></span>
        </button>;
      })}</div>
    </aside>
    <section className="community-chat-preview" aria-label="Conversation">{chat ? <>
      <div className="community-chat-header"><ChatAvatar chat={chat} /><div><h2>{chat.name}</h2><p>{chat.status} · Demo</p></div></div>
      <div className="chat-demo-wallpaper"><div className="chat-demo-messages" ref={messagesRef} aria-label={`Messages with ${chat.name}`}><div className="chat-demo-notice">Demo conversation · Messages stay in this session</div>{chat.messages.map((message, index) => <div key={`${chat.id}-${index}`} className={`chat-demo-message${message.sender === "You" ? " chat-demo-message--own" : ""}`}>
        {chat.kind === "group" && message.sender !== "You" && <span className="chat-demo-sender">{message.sender}</span>}{message.media && (message.media.type.startsWith("video/") ? <video className="chat-demo-media" src={message.media.url} controls aria-label={message.media.name} /> : <img className="chat-demo-media" src={message.media.url} alt={message.media.name} />)}{message.text && <p>{message.text}</p>}<time>{message.time}</time>
      </div>)}</div></div>
      {attachment && <div className="chat-demo-attachment"><ImagePlus size={15} /><span>{attachment.name}</span><button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X size={15} /></button></div>}
      <form className="chat-demo-input" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." aria-label="Message" /><input ref={mediaInput} type="file" accept="image/*,video/*" hidden onChange={(event) => { setAttachment(event.target.files?.[0] || null); event.target.value = ""; }} /><button className="chat-demo-media-button" type="button" onClick={() => mediaInput.current?.click()} aria-label="Attach image or video" title="Attach image or video"><ImagePlus size={18} /></button><button type="submit" disabled={!draft.trim() && !attachment} aria-label="Send demo message"><Send size={17} /></button></form>
    </> : <div className="community-chat-empty"><MessageCircle size={24} /><h3>Choose a conversation</h3><p>Select a demo chat to see your messages.</p></div>}</section>
  </div></main>;
}
