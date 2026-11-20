import { useEffect, useRef, useState, useCallback } from "react";
import { Check, CheckCheck, ImagePlus, MessageCircle, Search, Send, Users, X, XCircle } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import axios from "../utils/axios";
import "./community.css";
import "./chat.css";

function ChatAvatar({ participant, isGroup }) {
  const pic = participant?.profilePic
    ? `data:${participant.profilePic.contentType};base64,${participant.profilePic.data}`
    : null;

  if (isGroup) {
    return <span className="chat-demo-avatar chat-demo-avatar--group" aria-hidden="true"><Users size={19} /></span>;
  }

  return (
    <span className="chat-demo-avatar" aria-hidden="true">
      {pic ? <img src={pic} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : (participant?.name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function FriendRequestPanel({ onAccepted }) {
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const { data } = await axios.get("/friends/requests");
      setRequests(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const accept = async (userId) => {
    try {
      await axios.post(`/friends/accept/${userId}`);
      fetchRequests();
      onAccepted?.();
    } catch { /* ignore */ }
  };

  const reject = async (userId) => {
    try {
      await axios.post(`/friends/reject/${userId}`);
      fetchRequests();
    } catch { /* ignore */ }
  };

  if (loading) return null;
  if (!requests.received.length) return null;

  return (
    <div className="chat-requests">
      <span className="chat-requests-label">Friend requests</span>
      {requests.received.map((user) => (
        <div key={user._id} className="chat-request-row">
          <ChatAvatar participant={user} />
          <span className="chat-request-info">
            <strong>{user.name}</strong>
            {user.username && <small>@{user.username}</small>}
          </span>
          <button type="button" className="chat-request-accept" onClick={() => accept(user._id)} aria-label="Accept"><Check size={16} /></button>
          <button type="button" className="chat-request-reject" onClick={() => reject(user._id)} aria-label="Reject"><XCircle size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export default function Chat() {
  const {
    socket,
    onlineUsers,
    unreadByConversation,
    setActiveConversationId,
    markConversationAsRead,
  } = useSocket() || {};

  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesRef = useRef(null);
  const mediaInput = useRef(null);
  const objectUrls = useRef([]);
  const typingTimeout = useRef(null);

  // Sync active conversation with socket context
  useEffect(() => {
    setActiveConversationId?.(activeConversation?._id || null);
    return () => {
      setActiveConversationId?.(null);
    };
  }, [activeConversation, setActiveConversationId]);

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    try {
      const { data } = await axios.get("/friends");
      setFriends(data);
    } catch { /* ignore */ }
    setLoadingFriends(false);
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await axios.get("/chat/conversations");
      setConversations(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchFriends();
    fetchConversations();
  }, [fetchFriends, fetchConversations]);

  // Get the "other" participant in a DM
  const getOtherParticipant = useCallback((conversation) => {
    let myId = null;
    try {
      const t = localStorage.getItem("token");
      if (t) myId = JSON.parse(atob(t.split(".")[1])).id;
    } catch { /* ignore */ }
    return conversation.participants?.find((p) => (p._id || p) !== myId) || conversation.participants?.[0];
  }, []);

  // Open or create a conversation with a friend
  const openChat = useCallback(async (friendId) => {
    try {
      setLoadingMessages(true);
      const { data: conversation } = await axios.post(`/chat/conversation/${friendId}`);
      setActiveConversation(conversation);
      setActiveConversationId?.(conversation._id);
      markConversationAsRead?.(conversation._id);

      // Clear unread count for this conversation in local list
      setConversations((prev) =>
        prev.map((c) => (c._id === conversation._id ? { ...c, unreadCount: 0 } : c))
      );

      // Join socket room
      socket?.emit("joinConversation", { conversationId: conversation._id });

      // Fetch messages
      const { data: msgs } = await axios.get(`/chat/messages/${conversation._id}`);
      setMessages(msgs);

      // Mark as read via socket
      socket?.emit("markRead", { conversationId: conversation._id });
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
    setLoadingMessages(false);
    setDraft("");
    setAttachment(null);
  }, [socket, setActiveConversationId, markConversationAsRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  // Cleanup object URLs
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  // ——— Socket event listeners ———
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const isActive = message.conversation === activeConversation?._id;

      setMessages((prev) => {
        if (isActive) {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        }
        return prev;
      });

      // Update conversation list (move to top, update preview and unread count)
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv._id === message.conversation) {
            return {
              ...conv,
              unreadCount: isActive ? 0 : (conv.unreadCount || 0) + 1,
              lastMessage: {
                text: message.text,
                sender: message.sender?._id || message.sender,
                timestamp: message.createdAt,
              },
              updatedAt: message.createdAt,
            };
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      // Mark as read if currently open
      if (isActive) {
        socket.emit("markRead", { conversationId: message.conversation });
        markConversationAsRead?.(message.conversation);
      }
    };

    const handleMessagesRead = ({ conversationId, userId }) => {
      // If the other user read messages in our active conversation
      if (activeConversation?._id === conversationId) {
        setMessages((prev) =>
          prev.map((m) => {
            const readBy = m.readBy || [];
            if (!readBy.some((id) => (id._id || id) === userId)) {
              return { ...m, readBy: [...readBy, userId] };
            }
            return m;
          })
        );
      }
    };

    const handleTyping = ({ conversationId, userName }) => {
      if (conversationId === activeConversation?._id) {
        setTypingUser(userName);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2500);
      }
    };

    const handleStopTyping = ({ conversationId }) => {
      if (conversationId === activeConversation?._id) {
        setTypingUser(null);
      }
    };

    const handleFriendAccepted = () => {
      fetchFriends();
      fetchConversations();
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);
    socket.on("friendAccepted", handleFriendAccepted);
    socket.on("friendRequest", handleFriendAccepted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
      socket.off("friendAccepted", handleFriendAccepted);
      socket.off("friendRequest", handleFriendAccepted);
    };
  }, [socket, activeConversation, fetchFriends, fetchConversations, markConversationAsRead]);

  // Send message
  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!activeConversation || (!text && !attachment)) return;

    const media = attachment
      ? { url: URL.createObjectURL(attachment), type: attachment.type, name: attachment.name }
      : null;
    if (media) objectUrls.current.push(media.url);

    // Send via socket (primary) with REST fallback
    if (socket?.connected) {
      socket.emit("sendMessage", {
        conversationId: activeConversation._id,
        text,
        media,
      }, (response) => {
        if (response?.error) {
          console.error("Socket send failed:", response.error);
        }
      });
    } else {
      // REST fallback
      try {
        await axios.post("/chat/messages", {
          conversationId: activeConversation._id,
          text,
          media,
        });
      } catch (err) {
        console.error("Failed to send message:", err);
      }
    }

    socket?.emit("stopTyping", { conversationId: activeConversation._id });

    setDraft("");
    setAttachment(null);
  };

  // Handle typing indicator
  const handleDraftChange = (event) => {
    setDraft(event.target.value);
    if (activeConversation && socket) {
      socket.emit("typing", { conversationId: activeConversation._id });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { conversationId: activeConversation._id });
      }, 1500);
    }
  };

  // Filter friends by search
  const filteredFriends = friends.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (f.name || "").toLowerCase().includes(q) || (f.username || "").toLowerCase().includes(q);
  });

  // Find conversation for a friend
  const getConversationForFriend = (friendId) => {
    return conversations.find((conv) =>
      conv.kind === "dm" && conv.participants?.some((p) => (p._id || p) === friendId)
    );
  };

  const isOnline = (friendId) => onlineUsers?.has(friendId) || false;
  const activeFriend = activeConversation ? getOtherParticipant(activeConversation) : null;

  return (
    <main className="chat-page">
      <div className="chat-layout">
        {/* ——— Sidebar ——— */}
        <aside className="chat-list" aria-label="Conversations">
          <h1>Chats</h1>
          <p>Friends and squads</p>

          {/* Search friends */}
          <div className="chat-search-box">
            <Search size={14} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends..."
              aria-label="Search friends"
            />
          </div>

          {/* Friend requests */}
          <FriendRequestPanel onAccepted={fetchFriends} />

          {/* Friends list */}
          {loadingFriends ? (
            <div className="chat-loading">Loading friends...</div>
          ) : filteredFriends.length ? (
            <div className="chat-demo-list">
              {filteredFriends.map((friend) => {
                const conv = getConversationForFriend(friend._id);
                const online = isOnline(friend._id);
                const isActive = activeConversation?.participants?.some(
                  (p) => (p._id || p) === friend._id
                );

                const unread = conv ? (unreadByConversation?.[conv._id] ?? conv.unreadCount ?? 0) : 0;
                const isUnread = unread > 0 && !isActive;

                return (
                  <button
                    key={friend._id}
                    type="button"
                    className={`chat-demo-row${isActive ? " is-active" : ""}`}
                    onClick={() => openChat(friend._id)}
                    aria-pressed={isActive}
                  >
                    <span style={{ position: "relative" }}>
                      <ChatAvatar participant={friend} />
                      <span className={`chat-online-dot${online ? " is-online" : ""}`} />
                    </span>
                    <span className="chat-demo-row-copy">
                      <strong className={isUnread ? "chat-row-unread" : ""}>{friend.name}</strong>
                      <small className={isUnread ? "chat-row-unread-preview" : ""}>
                        {conv?.lastMessage?.text
                          ? conv.lastMessage.text.slice(0, 40)
                          : friend.username
                            ? `@${friend.username}`
                            : online ? "Online" : "Offline"}
                      </small>
                    </span>
                    {isUnread && (
                      <span className="chat-unread-badge">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="chat-empty-friends">
              <Users size={20} />
              <p>{searchQuery ? "No friends match your search" : "No friends yet. Search for people in the Community tab to add friends!"}</p>
            </div>
          )}
        </aside>

        {/* ——— Chat area ——— */}
        <section className="community-chat-preview" aria-label="Conversation">
          {activeConversation && activeFriend ? (
            <>
              <div className="community-chat-header">
                <ChatAvatar participant={activeFriend} />
                <div>
                  <h2>{activeFriend.name}</h2>
                  <p>
                    {typingUser
                      ? `${typingUser} is typing...`
                      : isOnline(activeFriend._id || activeFriend)
                        ? "Online"
                        : "Offline"}
                  </p>
                </div>
              </div>

              <div className="chat-demo-wallpaper">
                <div className="chat-demo-messages" ref={messagesRef} aria-label={`Messages with ${activeFriend.name}`}>
                  {loadingMessages ? (
                    <div className="chat-demo-notice">Loading messages...</div>
                  ) : (
                    <>
                      <div className="chat-demo-notice">
                        Start of your conversation with {activeFriend.name}
                      </div>
                      {messages.map((message, index) => {
                        let myId = null;
                        try {
                          const t = localStorage.getItem("token");
                          if (t) myId = JSON.parse(atob(t.split(".")[1])).id;
                        } catch { /* ignore */ }

                        const isOwn = (message.sender?._id || message.sender) === myId;
                        const time = new Intl.DateTimeFormat(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(message.createdAt));

                        // Read receipt check
                        const otherId = activeFriend?._id || activeFriend;
                        const isRead = isOwn && (message.readBy || []).some((id) => (id._id || id) === otherId);

                        return (
                          <div
                            key={message._id || index}
                            className={`chat-demo-message${isOwn ? " chat-demo-message--own" : ""}`}
                          >
                            {message.media?.url && (
                              message.media.type?.startsWith("video/") ? (
                                <video className="chat-demo-media" src={message.media.url} controls aria-label={message.media.name} />
                              ) : message.media.type?.startsWith("image/") ? (
                                <img className="chat-demo-media" src={message.media.url} alt={message.media.name} />
                              ) : null
                            )}
                            {message.text && <p>{message.text}</p>}
                            <div className="chat-message-meta">
                              <time>{time}</time>
                              {isOwn && (
                                <span
                                  className={`chat-read-receipt${isRead ? " chat-read-receipt--read" : " chat-read-receipt--sent"}`}
                                  title={isRead ? "Read" : "Sent"}
                                >
                                  {isRead ? <CheckCheck size={14} /> : <Check size={14} />}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {attachment && (
                <div className="chat-demo-attachment">
                  <ImagePlus size={15} />
                  <span>{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment">
                    <X size={15} />
                  </button>
                </div>
              )}

              <form className="chat-demo-input" onSubmit={sendMessage}>
                <input
                  value={draft}
                  onChange={handleDraftChange}
                  placeholder="Write a message..."
                  aria-label="Message"
                />
                <input
                  ref={mediaInput}
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  onChange={(event) => {
                    setAttachment(event.target.files?.[0] || null);
                    event.target.value = "";
                  }}
                />
                <button
                  className="chat-demo-media-button"
                  type="button"
                  onClick={() => mediaInput.current?.click()}
                  aria-label="Attach image or video"
                  title="Attach image or video"
                >
                  <ImagePlus size={18} />
                </button>
                <button type="submit" disabled={!draft.trim() && !attachment} aria-label="Send message">
                  <Send size={17} />
                </button>
              </form>
            </>
          ) : (
            <div className="community-chat-empty">
              <MessageCircle size={24} />
              <h3>Choose a conversation</h3>
              <p>Select a friend to start chatting in real-time.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
