import React, { useState } from 'react';
import { ChevronLeft, FileText, TestTube, HelpCircle, LogOut, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userRole, onNavigate, isCollapsed, onCollapseChange }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('documentation');

  const canViewTestDocs = ['Admin', 'Engineer'].includes(userRole);
  const canCreateUsers = userRole === 'Admin';

  const menuItems = [
    { id: 'documentation', label: 'Документация', icon: FileText, visible: true },
    { id: 'documentation-test', label: 'Документация (тест)', icon: TestTube, visible: canViewTestDocs },
    { id: 'support', label: 'Поддержка', icon: HelpCircle, visible: true },
    { id: 'create-user', label: 'Создать пользователя', icon: Plus, visible: canCreateUsers },
  ];

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    onNavigate(sectionId);
  };

  const handleCollapse = () => {
    onCollapseChange(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5172/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: sessionStorage.getItem("refreshToken")
        })
      });

      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("accessToken");

      navigate("/login", { replace: true }); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  return (
    <div 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '60px' : '280px',
        height: '100vh',
        backgroundColor: '#1a1d29',
        color: '#fff',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {!isCollapsed && <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>DocPortal</h2>}
        <button onClick={handleCollapse} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
        {menuItems.filter(item => item.visible).map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              style={{
                width: '100%',
                padding: isCollapsed ? '15px' : '15px 20px',
                background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                color: isActive ? '#6366f1' : '#a0a0a0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                marginBottom: '5px'
              }}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/10 p-5">
        <button
          onClick={handleLogout}
          className={`
            w-full py-3 ${isCollapsed ? "px-0" : "px-4"}
            rounded-lg border border-red-500/30 
            bg-red-500/10 text-red-500 font-medium cursor-pointer
            flex items-center gap-3
            transition-all duration-300
            ${isCollapsed ? "justify-center" : "justify-start"}
          `}
        >
          <LogOut 
            size={20} 
            className={`${isCollapsed ? "mx-auto" : "min-w-[30px]"}`} 
          />

          {!isCollapsed && <span>Выход</span>}
        </button>
      </div>



    </div>
  );
};

export default Sidebar;
