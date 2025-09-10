import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Layouts/Navbar";
import axiosInstance from "../../utils/axiosInsantce";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { IconHttpDelete } from "@tabler/icons-react";
import axios from "axios";

const API_BASE = "http://localhost:8000"; // đổi thành API backend của bạn

export default function Orientation({userInfo}) {
  const userId = userInfo?.id;
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("tôi phù hợp với ngành nghề nào?");
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
      const newSession = res.data;   // lấy data từ axios
      setSessions((prev) => [newSession, ...prev]);
      navigate(`/orientation/${newSession.id}`);
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

  const handleDeleteSession = async (id) => {
    try{
      const res = await axiosInstance.delete(`/session/${id}`);
      console.log("xóa session thành công");
      try {
        const res = await axiosInstance.get(`/sessions/last/${userInfo.id}`)

        if (res.data?.id) {
    
          navigate(`/orientation/${res.data.id}`);
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
        } else {
          
          const newRes = await axiosInstance.post(`/sessions/${userInfo.id}`);
          navigate(`/orientation/${newRes.data.id}`);
        }
      } catch (err) {
        console.error("Không lấy được session:", err);
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div className="flex h-screen">
      <Navbar />

      {/* Sidebar sessions */}
      <div className="w-72 overflow-hidden bg-gray-900 text-white flex flex-col main-content">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <span className="text-xl font-bold">Sessions</span>
          <button
            onClick={createSession}
            className="p-2 rounded-lg bg-[#0367B0] hover:bg-[#C6E7FF] hover:text-[#112D4E] transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex-grow overflow-y-auto -mr-2 pr-2">
          {Array.isArray(sessions) &&
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/orientation/${s.id}`)}
                className={`block cursor-pointer w-full text-left px-4 py-3 m1-1 mb-1 rounded-lg text-sm transition-colors ${
                  s.id === sessionId ? "bg-[#C6E7FF] text-[#112D4E] font-semibold" : "hover:bg-[#C6E7FF] hover:text-[#112D4E]"
                }`}
              >
                {s.title || "New Chat"}
                <IconHttpDelete onClick={() => handleDeleteSession(s.id)} />
              </div>
            ))}
        </div>

      </div>

      {/* Chat box */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1 p-7 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-xl overflow-x-auto px-4 py-3 rounded-xl shadow-md  ${
                  m.sender === "user"
                    ? "bg-[#0367B0] text-white rounded-br-none"
                    : "bg-white text-[#112D4E] text-sm leading-relaxed rounded-bl-none"
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
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="w-full pl-5 pr-28 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#C6E7FF] focus:border-[#0367B0] transition"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="absolute top-1/2 right-2 cursor-pointer transform -translate-y-1/2 bg-[#0367B0] text-white font-semibold py-2 px-5 rounded-full hover:bg-[#C6E7FF] hover:text-[#112D4E] transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
