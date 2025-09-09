import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const API_BASE = "http://localhost:8000"; // đổi thành API backend của bạn

export default function ChatPage({userInfo}) {
  const userId = userInfo?.id;
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sessions khi load trang
  useEffect(() => {
  if (!userId) return; // chỉ gọi khi userId có giá trị

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${userId}`);
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []); // đảm bảo luôn là array
    } catch (err) {
      console.error("Fetch sessions error:", err);
    }
  };
  fetchSessions();
}, [userId]);


  // Lấy tin nhắn khi đổi sessionId
  useEffect(() => {
    if (sessionId) {
      const fetchMessages = async () => {
        try {
          const res = await axiosInstance.get(`/sessions/${sessionId}/messages`);
          setMessages(res.data);
        } catch (err) {
          console.error("Fetch messages error:", err);
        }
      };
      fetchMessages();
    }
  }, [sessionId]);

  // Tạo session mới
  const createSession = async () => {
    try {
      const res = await axiosInstance.post(`/sessions/${userId}`);
      const newSession = await res.json();
      setSessions((prev) => [newSession, ...prev]);
      navigate(`/cogni-chat/${newSession.id}`);
    } catch (err) {
      console.error("Create session error:", err);
    }
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Lưu tin nhắn user vào DB
      await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      });

      // Gọi chatbot API
      const res = await fetch(
        "https://cloudvn.tino.page/webhook/3361c577-2f5c-440f-9191-6020fce3f636/chat",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "userID" : userId
           },
          body: JSON.stringify({
            action: "sendMessage",
            chatInput: input,
            sessionId,
            variables: {userId}
          }),
        }
      );

      const data = await res.json();
      const botMessage = {
        sender: "bot",
        content: data?.output || JSON.stringify(data, null, 2),
      };

      // Lưu tin nhắn bot vào DB
      await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botMessage),
      });

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "⚠️ Lỗi kết nối API" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Navbar />

      {/* Sidebar sessions */}
      <div className="w-64 bg-gray-900 text-white flex flex-col main-content">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <span className="font-bold">Sessions</span>
          <button
            onClick={createSession}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
          >
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array.isArray(sessions) &&
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/cogni-chat/${s.id}`)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                  s.id === sessionId ? "bg-gray-700 font-semibold text-white" : ""
                }`}
              >
                {s.title || "New Chat"}
              </div>
            ))}
        </div>

      </div>

      {/* Chat box */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {m.content}
                </Markdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-sm italic">
                Bot is typing<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-3 flex items-center gap-2 bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
