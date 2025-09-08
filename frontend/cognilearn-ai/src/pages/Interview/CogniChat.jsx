import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      const res = await fetch("https://cloudvn.tino.page/webhook/3361c577-2f5c-440f-9191-6020fce3f636/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json(); // giả sử API trả JSON
      setMessages([
        ...messages,
        { sender: "me", text: input },
        { sender: "bot", text: data.reply || JSON.stringify(data) }
      ]);
      setInput("");
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", width: "300px" }}>
      <div style={{ minHeight: "200px", marginBottom: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === "me" ? "right" : "left" }}>
            <b>{m.sender}:</b> {m.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
        style={{ width: "70%" }}
      />
      <button onClick={sendMessage} style={{ width: "25%" }}>
        Gửi
      </button>
    </div>
  );
}
