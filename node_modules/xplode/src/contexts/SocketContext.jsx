import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "../utils/axios";
import {
  broadcastVoteUpdate,
  broadcastNewPost,
  broadcastNewReview,
  broadcastNewComment,
  broadcastCommentVote,
  broadcastCommentDeleted,
} from "../utils/communitySync";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadConversationsCount, setUnreadConversationsCount] = useState(0);
  const [unreadByConversation, setUnreadByConversation] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const activeConversationRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUnreadConversationsCount(0);
      setUnreadByConversation({});
      return;
    }
    try {
      const { data } = await axios.get("/chat/unread-count");
      setUnreadConversationsCount(data.unreadConversationsCount || 0);
      setUnreadByConversation(data.byConversation || {});
    } catch { /* ignore */ }
  }, []);

  const markConversationAsRead = useCallback((conversationId) => {
    if (!conversationId) return;

    setUnreadByConversation((prev) => {
      if (!prev[conversationId]) return prev;
      const next = { ...prev };
      delete next[conversationId];
      setUnreadConversationsCount(Object.keys(next).length);
      return next;
    });

    if (socketRef.current?.connected) {
      socketRef.current.emit("markRead", { conversationId });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetchUnreadCount();

    const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN || "http://localhost:5000";

    const newSocket = io(serverOrigin, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      fetchUnreadCount();
    });

    newSocket.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    newSocket.on("userOffline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    newSocket.on("newMessage", (message) => {
      let myId = null;
      try {
        const t = localStorage.getItem("token");
        if (t) myId = JSON.parse(atob(t.split(".")[1])).id;
      } catch { /* ignore */ }

      const senderId = message.sender?._id || message.sender;
      const isFromMe = myId && senderId === myId;

      // If incoming message is from another user
      if (!isFromMe) {
        const convId = message.conversation;
        if (activeConversationRef.current === convId) {
          // Conversation is active in front of user, mark read instantly
          newSocket.emit("markRead", { conversationId: convId });
        } else {
          // Increment unread count for this conversation
          setUnreadByConversation((prev) => {
            const next = { ...prev, [convId]: (prev[convId] || 0) + 1 };
            setUnreadConversationsCount(Object.keys(next).length);
            return next;
          });
        }
      }
    });

    // Real-time Community Listeners
    newSocket.on("communityPostVote", (data) => {
      broadcastVoteUpdate({ ...data, isReview: false });
    });

    newSocket.on("communityReviewVote", (data) => {
      broadcastVoteUpdate({ ...data, isReview: true });
    });

    newSocket.on("newCommunityPost", (post) => {
      broadcastNewPost(post);
    });

    newSocket.on("newCommunityReview", (review) => {
      broadcastNewReview(review);
    });

    newSocket.on("newCommunityComment", (comment) => {
      broadcastNewComment(comment);
    });

    newSocket.on("communityCommentVote", (data) => {
      broadcastCommentVote(data);
    });

    newSocket.on("communityCommentDeleted", (data) => {
      broadcastCommentDeleted(data);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [fetchUnreadCount]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        unreadConversationsCount,
        unreadByConversation,
        activeConversationId,
        setActiveConversationId,
        markConversationAsRead,
        fetchUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
