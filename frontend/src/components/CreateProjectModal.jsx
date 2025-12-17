import { useState } from "react";

export default function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to create project");
      }
      const project = await res.json();
      onCreated(project);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "400px",
          padding: "25px",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "15px", color: "#1E90FF" }}>Create Project</h2>

        <label style={{ display: "block", marginBottom: "10px" }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            placeholder="Project Name"
          />
        </label>

        <label style={{ display: "block", marginBottom: "15px" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
            placeholder="Project Description"
          />
        </label>

        {error && (
          <div style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#ccc",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#1E90FF",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
