import { useState, useEffect, useRef } from "react";
import {
  X,
  Edit2,
  Trash2,
  Plus,
  UserPlus,
  Search,
  Users,
  FileText,
  Clock,
  Pencil,
  Upload,
} from "lucide-react";

export default function ProjectDetailModal({
  project,
  onClose,
  onUpdated,
  onDeleted,
  onDocumentation,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // PERMISSIONS
  const [permissions, setPermissions] = useState([]);
  const [emailToGrant, setEmailToGrant] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // DOCUMENTATION VERSIONS
  const [documentations, setDocumentations] = useState([]);
  const [activeDocumentation, setActiveDocumentation] = useState(null);
  const [docLoading, setDocLoading] = useState(true);
  const [showVersions, setShowVersions] = useState(false);

  // IMPORT MODAL
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [importing, setImporting] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // -----------------------------
  // LOAD PROJECT DETAILS
  // -----------------------------
  useEffect(() => {
    const fetchProject = async () => {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/projects/${project.slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setDetails(data);
      setName(data.name);
      setDescription(data.description);
      setLoading(false);
    };

    fetchProject();
  }, [project]);

  // -----------------------------
  // LOAD PERMISSIONS & USERS
  // -----------------------------
  useEffect(() => {
    if (!editMode || !details?.id || !details.canManagePermissions) return;

    const loadPermissionsAndUsers = async () => {
      const token = sessionStorage.getItem("accessToken");

      const permRes = await fetch(
        `http://localhost:5000/api/projects/${details.id}/permissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPermissions(await permRes.json());

      const usersRes = await fetch(`http://localhost:5000/api/users/emails`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await usersRes.json();
      setAllUsers(users);
      setFilteredUsers(users);
    };

    loadPermissionsAndUsers();
  }, [editMode, details]);

  // -----------------------------
  // LOAD ALL DOCUMENTATION VERSIONS
  // -----------------------------
  useEffect(() => {
    if (!project) return;

    const loadDocumentations = async () => {
      setDocLoading(true);
      const token = sessionStorage.getItem("accessToken");

      try {
        const versionsRes = await fetch(
          `http://localhost:5000/api/documentation/project/${project.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (versionsRes.ok) {
          const versions = await versionsRes.json();
          setDocumentations(versions);

          const active = versions.find((v) => v.isActive && !v.isTest);
          setActiveDocumentation(active || null);
        } else {
          setDocumentations([]);
          setActiveDocumentation(null);
        }
      } catch (error) {
        console.error("Error loading documentations:", error);
        setDocumentations([]);
        setActiveDocumentation(null);
      }

      setDocLoading(false);
    };

    loadDocumentations();
  }, [project]);

  // ESC KEY CLOSE
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // UPDATE PROJECT
  // -----------------------------
  const handleUpdate = async () => {
    const token = sessionStorage.getItem("accessToken");
    await fetch(`http://localhost:5000/api/projects/${details.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    const updated = { ...details, name, description };
    onUpdated(updated);
    setDetails(updated);
    setEditMode(false);
  };

  // -----------------------------
  // DELETE PROJECT
  // -----------------------------
  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    )
      return;

    const token = sessionStorage.getItem("accessToken");
    await fetch(`http://localhost:5000/api/projects/${details.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    onDeleted(details.id);
    onClose();
  };

  // -----------------------------
  // DOCUMENTATION HANDLERS
  // -----------------------------
  const handleOpenDocumentation = (doc) => {
    onDocumentation({
      mode: "view",
      project: details,
      documentationId: doc.id,
    });
  };

  const handleCreateNewDocumentation = () => {
    onDocumentation({
      mode: "new",
      project: details,
      documentationId: null,
    });
  };

  const handleDeleteDocumentation = async (docId) => {
    if (
      !confirm("Are you sure you want to delete this documentation version?")
    ) {
      return;
    }

    const token = sessionStorage.getItem("accessToken");
    const wasActive = activeDocumentation?.id === docId;

    try {
      const res = await fetch(
        `http://localhost:5000/api/documentation/${docId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        if (wasActive && documentations.length > 1) {
          const sortedDocs = [...documentations]
            .filter(
              (d) => d.id !== docId && d.isTest === activeDocumentation.isTest
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          if (sortedDocs.length > 0) {
            const previousDoc = sortedDocs[0];

            await fetch(
              `http://localhost:5000/api/documentation/project/${project.id}/set-active/${previousDoc.id}?isTest=${previousDoc.isTest}`,
              {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setActiveDocumentation(previousDoc);
            setDocumentations((prev) =>
              prev
                .filter((d) => d.id !== docId)
                .map((d) => ({
                  ...d,
                  isActive:
                    d.id === previousDoc.id && d.isTest === previousDoc.isTest,
                }))
            );
          } else {
            setDocumentations((prev) => prev.filter((d) => d.id !== docId));
            setActiveDocumentation(null);
          }
        } else {
          setDocumentations((prev) => prev.filter((d) => d.id !== docId));
        }
      }
    } catch (error) {
      console.error("Error deleting documentation:", error);
      alert("Failed to delete documentation. Please try again.");
    }
  };

  // -----------------------------
  // IMPORT DOCUMENTATION
  // -----------------------------
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      alert("Please select a JSON file");
      return;
    }

    setImportFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setImportData(data);
      } catch (error) {
        alert("Invalid JSON file. Please check the file format.");
        setImportFile(null);
        setImportData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImportDocumentation = async () => {
    if (!importData || !importFile) return;

    setImporting(true);

    try {
      const token = sessionStorage.getItem("accessToken");

      // Extract data from imported JSON
      const structure = importData.structure || importData;
      const coverBlock = structure.find
        ? structure.find((b) => b.id === "cover")
        : null;
      const version = coverBlock?.content?.version || importData.version || "1.0.0";

      const changelogBlock = structure.find
        ? structure.find((b) => b.id === "changelog")
        : null;
      const changeLogEntries =
        changelogBlock?.content?.entries?.map((entry) => ({
          version: entry.version,
          changeType: entry.type,
          description: entry.description,
        })) ||
        importData.changeLogEntries || [
          {
            version: version,
            changeType: "added",
            description: "Documentation imported from JSON file",
          },
        ];

      // Get title from structure or use default
      const title = 
        (structure[0]?.content?.title) || 
        importData.title || 
        `${details.name} Documentation`;

      // Prepare payload
      const payload = {
        projectId: details.id,
        version: version,
        isTest: importData.isTest || false,
        structure: structure,
        title: title,
        description: importData.description || `Documentation for ${details.name} - Version ${version}`,
        changeLogEntries: changeLogEntries,
      };

      console.log("Importing documentation:", payload);

      const response = await fetch(
        "http://localhost:5000/api/documentation",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      if (response.ok) {
        const saved = responseText ? JSON.parse(responseText) : {};
        alert("Documentation imported successfully!");
        
        // Refresh documentation list
        const versionsRes = await fetch(
          `http://localhost:5000/api/documentation/project/${details.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (versionsRes.ok) {
          const versions = await versionsRes.json();
          setDocumentations(versions);
          const active = versions.find((v) => v.isActive && !v.isTest);
          setActiveDocumentation(active || null);
        }

        // Close import modal
        setShowImportModal(false);
        setImportFile(null);
        setImportData(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        let errorMessage = "Unknown error";
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.title || JSON.stringify(error);
        } catch (e) {
          errorMessage = responseText || `HTTP ${response.status}`;
        }
        console.error("Import failed:", errorMessage);
        alert(`Failed to import: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error importing:", error);
      alert(`An error occurred while importing: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  // -----------------------------
  // USER SEARCH
  // -----------------------------
  const handleUserSearch = (query) => {
    setEmailToGrant(query);
    setShowUserDropdown(true);

    if (!query.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (u) =>
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (user) => {
    setEmailToGrant(user.email);
    setShowUserDropdown(false);
  };

  // -----------------------------
  // GRANT PERMISSION
  // -----------------------------
  const handleGrantPermission = async () => {
    if (!emailToGrant.trim()) return;

    const token = sessionStorage.getItem("accessToken");

    await fetch(
      `http://localhost:5000/api/projects/${details.id}/permissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: emailToGrant }),
      }
    );

    setEmailToGrant("");
    setShowUserDropdown(false);

    const res = await fetch(
      `http://localhost:5000/api/projects/${details.id}/permissions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPermissions(await res.json());
  };

  const handleRevokePermission = async (permissionId) => {
    const token = sessionStorage.getItem("accessToken");

    await fetch(
      `http://localhost:5000/api/projects/${details.id}/permissions/${permissionId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPermissions((prev) => prev.filter((p) => p.id !== permissionId));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-700">Loading project...</span>
          </div>
        </div>
      </div>
    );
  }

  const CAN_EDIT = details.canEdit;
  const CAN_MANAGE = details.canManagePermissions;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-3xl font-bold bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-full border-2 border-white/30 focus:border-white outline-none placeholder-white/60"
                placeholder="Project name"
              />
            ) : (
              <h2 className="text-3xl font-bold pr-12">{details.name}</h2>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* LEFT PANEL - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        rows="6"
                        placeholder="Add a description for this project..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdate}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {details.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>
                        Created by{" "}
                        <strong className="text-gray-700">
                          {details.creatorName}
                        </strong>
                      </span>
                    </div>

                    {/* Documentation Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Documentation
                        </h3>
                        {documentations.length > 0 && (
                          <button
                            onClick={() => setShowVersions(!showVersions)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Clock className="w-4 h-4" />
                            {showVersions ? "Hide" : "Show"} All Versions (
                            {documentations.length})
                          </button>
                        )}
                      </div>

                      {docLoading ? (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                          <p className="text-gray-500 text-sm">
                            Loading documentation...
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Active Documentation */}
                          {activeDocumentation ? (
                            <div
                              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-300 cursor-pointer hover:shadow-lg transition-all group"
                              onClick={() =>
                                handleOpenDocumentation(activeDocumentation)
                              }
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                      ACTIVE
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700">
                                      {activeDocumentation.title}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold text-gray-700">
                                    Version {activeDocumentation.version}
                                  </span>
                                  <p className="text-gray-600 text-sm mb-2">
                                    Created by{" "}
                                    <strong>
                                      {activeDocumentation.creatorName}
                                    </strong>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(
                                      activeDocumentation.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                {CAN_EDIT && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenDocumentation(
                                        activeDocumentation
                                      );
                                    }}
                                    className="p-2 bg-white rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <Pencil className="w-4 h-4 text-blue-600" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                              <p className="text-gray-500 text-center">
                                No active documentation yet
                              </p>
                            </div>
                          )}

                          {/* All Versions List */}
                          {showVersions && documentations.length > 0 && (
                            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                              <div className="max-h-96 overflow-y-auto">
                                {documentations.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                                      doc.isActive ? "bg-blue-50" : ""
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() =>
                                          handleOpenDocumentation(doc)
                                        }
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-gray-800">
                                            Version {doc.version}
                                          </span>
                                          {doc.isActive && (
                                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                                              ACTIVE
                                            </span>
                                          )}
                                          {doc.isTest && (
                                            <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-bold rounded">
                                              TEST
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                          by {doc.creatorName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(
                                            doc.createdAt
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>

                                      {CAN_EDIT && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenDocumentation(doc);
                                            }}
                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                                            title="Edit"
                                          >
                                            <Pencil className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteDocumentation(doc.id);
                                            }}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {CAN_EDIT && (
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={handleCreateNewDocumentation}
                                className="py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl text-blue-700 font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md group"
                              >
                                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {documentations.length > 0
                                  ? "Create New"
                                  : "Create Documentation"}
                              </button>

                              <button
                                onClick={() => setShowImportModal(true)}
                                className="py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-300 hover:border-green-500 rounded-xl text-green-700 font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-md group"
                              >
                                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Import JSON
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT PANEL - Actions & Permissions */}
              <div className="space-y-4">
                {/* Action Buttons */}
                {CAN_EDIT && !editMode && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Actions
                    </h3>

                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full py-3 bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Project
                    </button>

                    {CAN_MANAGE && (
                      <button
                        onClick={handleDelete}
                        className="w-full py-3 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Project
                      </button>
                    )}
                  </div>
                )}

                {/* Permissions Management */}
                {CAN_MANAGE && editMode && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      Manage Access
                    </h3>

                    {/* User Search Input */}
                    <div className="relative mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Search users by email or name..."
                          value={emailToGrant}
                          onChange={(e) => handleUserSearch(e.target.value)}
                          onFocus={() => setShowUserDropdown(true)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                        />
                      </div>

                      {/* User Dropdown */}
                      {showUserDropdown &&
                        filteredUsers.length > 0 &&
                        emailToGrant && (
                          <div
                            ref={dropdownRef}
                            className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                          >
                            {filteredUsers.map((u) => (
                              <div
                                key={u.id}
                                onClick={() => handleSelectUser(u)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="font-semibold text-gray-800 text-sm">
                                  {u.username}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {u.email}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    <button
                      onClick={handleGrantPermission}
                      disabled={!emailToGrant.trim()}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:shadow-none"
                    >
                      Grant Access
                    </button>

                    {/* Current Permissions List */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Current Access ({permissions.length})
                      </h4>

                      {permissions.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-6 bg-white rounded-lg border border-gray-200">
                          No users have access yet
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {permissions.map((perm) => (
                            <div
                              key={perm.id}
                              className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-800 text-sm truncate">
                                  {perm.username}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {perm.email}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRevokePermission(perm.id)}
                                className="ml-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImportModal(false);
              setImportFile(null);
              setImportData(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Documentation
              </h3>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setImportData(null);
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Upload a JSON file containing documentation structure to import
                it into this project.
              </p>

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="import-file-input"
                />
                <label
                  htmlFor="import-file-input"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">
                    Click to select a JSON file
                  </p>
                  <p className="text-sm text-gray-500">
                    or drag and drop it here
                  </p>
                </label>
              </div>

              {/* File Preview */}
              {importFile && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {importFile.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {(importFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setImportFile(null);
                        setImportData(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {importData && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-gray-700">
                        <strong>Version:</strong>{" "}
                        {importData.version ||
                          importData.structure?.find((b) => b.id === "cover")
                            ?.content?.version ||
                          "N/A"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Blocks:</strong>{" "}
                        {importData.structure?.length || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleImportDocumentation}
                  disabled={!importData || importing}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-600/30 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import Documentation
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportData(null);
                  }}
                  disabled={importing}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}