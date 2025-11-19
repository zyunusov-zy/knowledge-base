import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateUserForm from "../components/CreateUserForm";
import SupportForm from "../components/SupportForm";


export default function MainPage() {
  const [section, setSection] = useState("documentation");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5172/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` },
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

  if (loading) return <div>Loading...</div>;

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
          marginLeft: isSidebarCollapsed ? "60px" : "280px", // динамический отступ
          padding: "40px",
          transition: "margin-left 0.3s ease", // плавный переход
        }}
      >
        {section === "create-user" && <CreateUserForm />}
        {section === "support" && <SupportForm />}

        {section !== "create-user" && section !== "support" && (
          <>
            <h2>Текущая секция: {section}</h2>
            <p>Username: {user.username}</p>
            <p>Role: {user.role}</p>
          </>
        )}

      </div>
    </div>
  );
}
