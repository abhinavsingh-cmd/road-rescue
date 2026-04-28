import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBookingChat, sendBookingMessage } from "@/services/chats";
import { getSocket } from "@/services/socket";

export default function ChatWindow({ bookingId, currentUser }) {
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!bookingId) return;
    let active = true;
    const socket = getSocket();
    async function loadChat() {
      const response = await getBookingChat(bookingId);
      if (active) setChat(response);
    }
    loadChat();
    socket?.emit("join:booking", bookingId);
    const onMessage = (m) => setChat(p => p ? { ...p, messages: [...(p.messages || []), m] } : p);
    socket?.on("chat:message", onMessage);
    return () => { active = false; socket?.off("chat:message", onMessage); };
  }, [bookingId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const sortedMessages = useMemo(() => [...(chat?.messages || [])].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)), [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await sendBookingMessage(bookingId, text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="flex h-full flex-col overflow-hidden bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="border-b border-white/5 p-8">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#faff5d]" />
          <h3 className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-white">Mission Comms</h3>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
        {sortedMessages.length ? (
          sortedMessages.map((m, i) => {
            const isMe = String(m.senderId) === String(currentUser?._id);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[85%] rounded-[28px] px-6 py-5 text-sm leading-relaxed ${
                  isMe ? "bg-primary text-black font-bold shadow-[0_15px_40px_rgba(250,255,93,0.15)]" : "bg-white/[0.03] text-white/80 border border-white/5"
                }`}>
                  {m.text}
                </div>
                <div className="mt-3 flex items-center gap-3 px-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                    {isMe ? "You" : (m.senderName || m.senderRole)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/10" />
                  <span className="text-[9px] font-bold text-white/10">
                    {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center text-center p-12">
            <div className="space-y-4">
              <div className="h-px w-8 bg-white/10 mx-auto" />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">Waiting for Data Link...</p>
            </div>
          </div>
        )}
      </div>

      <form className="p-6 bg-white/[0.01] border-t border-white/5 flex gap-4" onSubmit={handleSubmit}>
        <input
          className="flex-1 h-16 bg-white/[0.02] border border-white/5 rounded-3xl px-8 text-sm font-medium text-white outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all duration-500 placeholder:text-white/10"
          placeholder="Transmit message..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" disabled={submitting} className="h-16 w-16 rounded-3xl bg-white text-black flex items-center justify-center hover:bg-primary transition-all duration-500 active:scale-90 shadow-xl">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </form>
    </motion.div>
  );
}