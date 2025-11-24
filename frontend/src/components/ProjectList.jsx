import { useState, useEffect } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectList({ user, projects, setProjects, onSelectProject }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch("http://localhost:5172/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load projects");

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        Loading projects...
      </div>
    );

  const canCreate = user.role === "Admin" || user.role === "Engineer";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: "600", color: "#333" }}>
          Projects
        </h2>

        {canCreate && (
          <button
            style={{
              padding: "10px 20px",
              fontSize: "15px",
              background: "#1E90FF",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => setShowModal(true)}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0f73d1")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1E90FF")}
          >
            + Add Project
          </button>
        )}

        {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleProjectCreated}
        />
      )}
      </div>

      {projects.length === 0 ? (
        <p style={{ color: "#555", textAlign: "center" }}>
          No projects available
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onClick={() => onSelectProject(p)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
            >
              <h3 style={{ margin: "0 0 8px", color: "#1E90FF" }}>{p.name}</h3>
              <p style={{ margin: "0", color: "#555", fontSize: "14px" }}>
                {p.description || "No description"}
              </p>
              <small style={{ color: "#999", display: "block", marginTop: "12px" }}>
                Created by: {p.creatorName}
              </small>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
