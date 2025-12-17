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
        const res = await fetch("http://localhost:5000/api/users/me", {
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

  /**
   * Handle documentation actions from ProjectDetailModal
   * Payload structure:
   * {
   *   mode: "new" | "view" | "edit",
   *   project: projectObject,
   *   documentationId: number | null
   * }
   */
  const handleDocumentationAction = (payload) => {
    console.log("Documentation action:", payload);
    setEditingDocumentation(payload);
    setSelectedProject(null); // Close the project modal
  };

  const handleBackToProjects = () => {
    setEditingDocumentation(null);
  };

  /**
   * Optional: Refresh project list after documentation changes
   */
  const handleDocumentationSaved = () => {
    // You can add logic here to refresh the project list if needed
    // or update specific project data
    handleBackToProjects();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show DocumentationEditor when user wants to create/edit documentation
  if (editingDocumentation) {
    return (
      <DocumentationEditor
        mode={editingDocumentation.mode}
        project={editingDocumentation.project}
        documentationId={editingDocumentation.documentationId}
        onBack={handleBackToProjects}
        onSaved={handleDocumentationSaved}
        userRole={user.role}
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
          onDocumentation={handleDocumentationAction}
        />
      )}
    </div>
  );
}