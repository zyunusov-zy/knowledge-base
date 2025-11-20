import { useState } from "react";

export default function CreateUserForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // <-- new
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5172/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!res.ok) {
        let errorMsg = "Ошибка при создании пользователя";
        try {
          const errorData = await res.json();
          errorMsg = errorData?.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setMessage(`Пользователь ${data.username} успешно создан!`);
      setMessageType("success");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("User");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Ошибка при создании пользователя");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2>Создать пользователя</h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "6px",
            color: messageType === "success" ? "#155724" : "#721c24",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}>
          <option value="User">User</option>
          <option value="Engineer">Engineer</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", borderRadius: "6px", border: "none", backgroundColor: "#6366f1", color: "#fff", cursor: "pointer" }}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </form>
    </div>
  );
}
