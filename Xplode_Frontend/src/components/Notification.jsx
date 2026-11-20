import { forwardRef, useId } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MessageCircle, X } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import ArtworkImage from "./ArtworkImage";

const sections = [
  {
    title: "Important",
    items: [
      {
        title: "DLC released",
        game: "Cyberpunk 2077",
        time: "1 hour ago",
        image: "https://cdn2.steamgriddb.com/grid/8c048326e93a94589190693897ce3456.jpg",
      },
    ],
  },
  {
    title: "More",
    items: [
      {
        title: "Live stream",
        game: "Sekiro: Shadows Die Twice",
        time: "3 hours ago",
        image: "https://cdn2.steamgriddb.com/grid/095cbfc2bef4012059a1641551b1f46f.png",
      },
    ],
  },
];

const Notification = forwardRef(function Notification({ onClose }, ref) {
  const headingId = useId();
  const { unreadConversationsCount } = useSocket() || {};

  return (
    <div
      ref={ref}
      role="region"
      aria-labelledby={headingId}
      className="absolute z-50 top-[calc(100%+14px)] right-0 box-border w-[min(360px,calc(100vw-32px))] max-h-[min(480px,calc(100dvh-80px))] overflow-hidden rounded-xl bg-[#111111]/95 backdrop-blur-xl text-white shadow-2xl border border-white/10 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 border-b border-white/10">
        <h2 id={headingId} className="text-sm font-bold tracking-wide text-white uppercase">
          Notifications
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto px-4 py-3 flex-1 flex flex-col gap-3.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Unread Messages Highlight */}
        {!!unreadConversationsCount && (
          <section aria-label="Unread Messages">
            <h3 className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Messages
            </h3>
            <Link
              to="/chat"
              onClick={onClose}
              className="group flex items-center gap-3 p-2.5 rounded-lg bg-neutral-900/90 border border-white/10 hover:border-white/25 hover:bg-neutral-800/80 transition-all text-inherit no-underline shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-800 text-white flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                <MessageCircle size={18} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <strong className="text-xs font-bold text-white truncate">
                  {unreadConversationsCount} unread {unreadConversationsCount === 1 ? "chat" : "chats"}
                </strong>
                <span className="text-[11px] text-neutral-400 truncate">
                  View your unread messages in Chat
                </span>
                <small className="text-[10px] text-neutral-300 font-medium flex items-center gap-0.5 mt-0.5 group-hover:text-white transition-colors">
                  Open Chat <ChevronRight size={12} />
                </small>
              </div>
            </Link>
          </section>
        )}

        {/* Section Groups */}
        {sections.map((section) => (
          <section
            key={section.title}
            aria-label={section.title}
            className="border-t border-white/10 pt-2.5 first:border-0 first:pt-0"
          >
            <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-2">
              {section.title}
            </h3>
            <div className="flex flex-col gap-1.5">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ArtworkImage
                    src={item.image}
                    alt=""
                    className="w-16 h-12 rounded-md object-cover bg-neutral-800 flex-shrink-0 border border-white/5"
                  />
                  <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                    <strong className="text-xs font-semibold text-gray-200 truncate">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-gray-400 truncate">
                      {item.game}
                    </span>
                    <small className="text-[10px] text-gray-500">
                      {item.time}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
});

export default Notification;
