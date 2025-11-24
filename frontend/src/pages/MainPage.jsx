import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateUserForm from "../components/CreateUserForm";
import SupportForm from "../components/SupportForm";
import ProjectList from "../components/ProjectList";
import ProjectDetailModal from "../components/ProjectDetailModal";
import DocumentationEditor from "../components/DocumentationEditor";

export default function MainPage() {
  const [section, setSection] = useState("documentation");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [editingDocumentation, setEditingDocumentation] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5172/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProjectUpdate = (updated) => {
    setProjectList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleProjectDelete = (id) => {
    setProjectList((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

 const handleCreateDocumentation = (payload) => {
  // payload = { mode, project, documentation }
  setEditingDocumentation(payload); 
  setSelectedProject(null);
};

  const handleBackToProjects = () => {
    setEditingDocumentation(null);
  };

  if (loading) return <div>Loading...</div>;

  if (editingDocumentation) {
    // console.log(editingDocumentation.mode);
    console.log(editingDocumentation.documentation);
    return (
      <DocumentationEditor
        project={editingDocumentation}
        onBack={handleBackToProjects}
        userRole={user.role}
        modes={editingDocumentation.mode}
        documentation={editingDocumentation.documentation}
      />
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        userRole={user.role}
        onNavigate={setSection}
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
      />

      <div
        style={{
          flex: 1,
          marginLeft: isSidebarCollapsed ? "60px" : "280px",
          padding: "40px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {(section === "documentation" || section === "documentation-test") && (
          <ProjectList
            user={user}
            projects={projectList}
            setProjects={setProjectList}
            onSelectProject={setSelectedProject}
          />
        )}
        {section === "create-user" && <CreateUserForm />}
        {section === "support" && <SupportForm />}
        {section !== "documentation" &&
          section !== "documentation-test" &&
          section !== "create-user" &&
          section !== "support" && (
            <>
              <h2>Текущая секция: {section}</h2>
              <p>Username: {user.username}</p>
              <p>Role: {user.role}</p>
            </>
          )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdated={handleProjectUpdate}
          onDeleted={handleProjectDelete}
          isSidebarCollapsed={isSidebarCollapsed}
          onDocumentation={handleCreateDocumentation}
        />
      )}
    </div>
  );
}
