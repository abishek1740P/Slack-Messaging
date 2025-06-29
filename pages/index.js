import { useEffect, useState } from "react";
import MessageForm from "@/components/MessageForm";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState(null);
  const [channel, setChannel] = useState("C093YCJ6865");
  const [editMode, setEditMode] = useState(false);
  const [editMessage, setEditMessage] = useState({ ts: "", text: "" });

  useEffect(() => {
    fetch(`/api/history?channel=${channel}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setMessages(data.messages);
      });
  }, []);

  const handleSubmit = async (text) => {
    const url = editMode ? "/api/edit" : "/api/send";
    const body = editMode ? { text, ts: editMessage.ts, channel } : { text };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.ok) {
      setResponse({ success: editMode ? "Message edited!" : "Message sent!" });
      setEditMode(false);
      fetch(`/api/history?channel=${channel}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) setMessages(data.messages);
        });
    } else {
      setResponse({ error: data.error || "Operation failed." });
    }
  };

  const handleDelete = async (ts) => {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ts, channel }),
    });

    const data = await res.json();
    if (data.ok) {
      setMessages(messages.filter((msg) => msg.ts !== ts));
    } else {
      alert("Failed to delete message");
    }
  };

  const handleSchedule = async () => {
    const text = prompt("Enter message to schedule:");
    const delaySeconds = prompt("Send after how many seconds?");
    const postAt = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, postAt, channel }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Message scheduled!");
    } else {
      alert("Failed to schedule message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Slack Messaging Dashboard
        </h1>

        <MessageForm onSubmit={handleSubmit} defaultText={editMessage.text} />

        {response && (
          <div className="mb-4 text-center text-sm text-green-400">
            {response.success || response.error}
          </div>
        )}

        <div className="text-right mb-2">
          <button
            onClick={handleSchedule}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            + Schedule Message
          </button>
        </div>

        <div className="bg-gray-800 shadow-md rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Previous Messages</h2>
          <ul className="space-y-3">
            {messages.map((msg) => (
              <li
                key={msg.ts}
                className="border-b border-gray-700 py-2 flex justify-between items-center"
              >
                <div className="text-sm text-gray-300">{msg.text}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditMessage({ ts: msg.ts, text: msg.text });
                    }}
                    className="text-blue-400 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(msg.ts)}
                    className="text-red-400 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
