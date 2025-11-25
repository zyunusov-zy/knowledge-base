import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Download, Search, ArrowLeft, Save, Edit2, Eye } from "lucide-react";
import { getDefaultTemplate } from "./documentation/defaultTemplate"
import DocumentationHeader from "./documentation/DocumentationHeader";
import DocumentationSidebar from "./documentation/DocumentationSidebar";
import BlockRenderer from "./documentation/BlockRenderer";
import BlockControls from "./documentation/BlockControls";

const DocumentationEditor = ({ 
  mode, 
  project, 
  documentationId, 
  onBack, 
  onSaved, 
  userRole 
}) => {
  const [documentation, setDocumentation] = useState(null);
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBlockMenu, setShowBlockMenu] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [editingContent, setEditingContent] = useState({});
  const [activeTabs, setActiveTabs] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
  const [contentWidth, setContentWidth] = useState("max-w-5xl");
  const [editorMode, setEditorMode] = useState("view");
  
  const tocRef = useRef(null);
  const canEdit = !["user", "User"].includes(userRole);

  // Load documentation
  useEffect(() => {
    const loadDocumentation = async () => {
      if (mode === "new") {
        // Initialize with default template
        const template = getDefaultTemplate(project);
        setStructure(template);
        setDocumentation({
          projectId: project.id,
          version: "1.0.0",
          isTest: false,
          structure: template,
        });
        setLoading(false);
        return;
      }

      // Load existing documentation by ID
      if (documentationId) {
        try {
          const token = sessionStorage.getItem("accessToken");
          const res = await fetch(
            `http://localhost:5172/api/documentation/${documentationId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (res.ok) {
            const data = await res.json();
            setDocumentation(data);
            setStructure(data.structure || []);
          } else {
            console.error("Failed to load documentation");
            onBack();
          }
        } catch (error) {
          console.error("Error loading documentation:", error);
          onBack();
        }
      }

      setLoading(false);
    };

    loadDocumentation();
  }, [mode, documentationId, project, onBack]);

  // Set editor mode based on permissions
  useEffect(() => {
    setEditorMode(canEdit ? "edit" : "view");
  }, [canEdit]);

  // Update content width when editing
  useEffect(() => {
    setContentWidth(editingBlock ? "max-w-4xl" : "max-w-5xl");
  }, [editingBlock]);

  // Close block menu on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowBlockMenu(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Save documentation
const handleSave = async () => {
    if (!canEdit) return;
    setIsSaving(true);
    
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = mode === "new"
        ? "http://localhost:5172/api/documentation"
        : `http://localhost:5172/api/documentation/${documentationId}`;
      
      const method = mode === "new" ? "POST" : "PUT";

      // Get version from cover block
      const coverBlock = structure.find((b) => b.id === "cover");
      const version = coverBlock?.content?.version || "1.0.0";

      // Extract changelog entries from changelog block
      const changelogBlock = structure.find((b) => b.id === "changelog");
      const changeLogEntries = changelogBlock?.content?.entries?.map(entry => ({
        version: entry.version,
        changeType: entry.type, // "added", "modified", "fixed"
        description: entry.description,
      })) || [
        {
          version: version,
          changeType: "added",
          description: "Initial documentation created",
        }
      ];

      // Prepare the payload with all required fields
      const payload = {
        projectId: project.id,
        version: version,
        isTest: false,
        structure: structure,
        title: structure[0].content.title,
        description: `Documentation for ${project.name} - Version ${version}`, // Required field
        changeLogEntries: changeLogEntries, // Required field
      };

      console.log("Saving documentation:", { method, url, payload });

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Log the full response for debugging
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      if (response.ok) {
        const saved = responseText ? JSON.parse(responseText) : {};
        alert("Documentation saved successfully!");
        if (onSaved) {
          onSaved(saved);
        } else {
          onBack();
        }
      } else {
        let errorMessage = "Unknown error";
        try {
          const error = JSON.parse(responseText);
          errorMessage = error.message || error.title || JSON.stringify(error);
        } catch (e) {
          errorMessage = responseText || `HTTP ${response.status}`;
        }
        console.error("Save failed:", errorMessage);
        alert(`Failed to save: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert(`An error occurred while saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };


  // Block editing functions
  const startEditing = (block) => {
    if (!canEdit) return;
    setEditingBlock(block.id);
    setEditingContent({ ...block.content });
  };

  const saveEdit = (blockId) => {
    if (!canEdit) return;
    setStructure(
      structure.map((b) =>
        b.id === blockId ? { ...b, content: editingContent } : b
      )
    );
    setEditingBlock(null);
    setEditingContent({});
  };

  const cancelEdit = () => {
    if (!canEdit) return;
    setEditingBlock(null);
    setEditingContent({});
  };

  const addBlock = (afterId, type) => {
    if (!canEdit) return;
    const newBlock = {
      id: Date.now(),
      type: type,
      level: 2,
      content: getDefaultContent(type),
    };

    const index = structure.findIndex((b) => b.id === afterId);
    const newStructure = [...structure];
    newStructure.splice(index + 1, 0, newBlock);
    setStructure(newStructure);
    setShowBlockMenu(null);
  };

  const deleteBlock = (blockId) => {
    if (!canEdit) return;
    setStructure(structure.filter((b) => b.id !== blockId));
    setSelectedBlocks(new Set());
  };

  const moveBlock = (blockId, direction) => {
    if (!canEdit) return;
    const index = structure.findIndex((b) => b.id === blockId);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < structure.length - 1)
    ) {
      const newStructure = [...structure];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newStructure[index], newStructure[targetIndex]] = [
        newStructure[targetIndex],
        newStructure[index],
      ];
      setStructure(newStructure);
    }
  };

  const scrollToBlock = (blockId) => {
    const element = document.getElementById(`block-${blockId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const generateTOC = () => {
    return structure
      .filter((b) => b.type === "section" || b.type === "method")
      .map((block) => ({
        id: block.id,
        title: block.type === "section" ? block.content.title : block.content.name,
        type: block.type,
        level: block.level,
      }));
  };

  const getDefaultContent = (type) => {
    const defaults = {
      paragraph: { text: "Новый параграф..." },
      heading: { text: "Новый заголовок" },
      section: { title: "Новая секция" },
      code: { language: "javascript", code: "// code here" },
      list: { items: [{ term: "Термин", definition: "Определение" }] },
      table: {
        headers: ["Column 1", "Column 2", "Column 3"],
        rows: [
          ["Data 1", "Data 2", "Data 3"],
          ["Data 4", "Data 5", "Data 6"],
        ],
      },
      quote: { text: "Quote text here...", author: "" },
      callout: { type: "info", title: "Note", text: "Callout text..." },
      tabs: {
        tabs: [
          { label: "Tab 1", content: "Content 1" },
          { label: "Tab 2", content: "Content 2" },
        ],
      },
      accordion: {
        items: [
          { title: "Section 1", content: "Content 1" },
          { title: "Section 2", content: "Content 2" },
        ],
      },
      method: {
        name: "methodName",
        description: "Описание метода",
        endpoint: "/api/endpoint",
        httpMethod: "POST",
        requestParams: [],
        responseParams: [],
        requestExample: "{}",
        responseExample: "{}",
      },
    };
    return defaults[type] || {};
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-700">Loading documentation...</span>
        </div>
      </div>
    );
  }

  const toc = generateTOC();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DocumentationHeader
        title={structure[0]?.content?.title || project.name}
        mode={mode}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        canEdit={canEdit}
        isSaving={isSaving}
        sidebarOpen={sidebarOpen}
        onBack={onBack}
        onSave={handleSave}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex max-w-7xl mx-auto">
        <DocumentationSidebar
          isOpen={sidebarOpen}
          toc={toc}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onScrollToBlock={scrollToBlock}
        />

        <main className={`flex-1 px-8 py-8 transition-all duration-300 ${contentWidth}`}>
          <div className="space-y-0">
            {structure.map((block, index) => (
              <div
                key={block.id}
                id={`block-${block.id}`}
                className={`relative group transition-all ${
                  selectedBlocks.has(block.id) ? "ring-2 ring-blue-400 rounded-lg" : ""
                }`}
                onClick={() =>
                  editorMode === "edit" && setSelectedBlocks(new Set([block.id]))
                }
              >
                {editorMode === "edit" && editingBlock !== block.id && (
                  <BlockControls
                    block={block}
                    showBlockMenu={showBlockMenu}
                    onShowMenu={setShowBlockMenu}
                    onEdit={startEditing}
                    onMove={moveBlock}
                    onDelete={deleteBlock}
                    onAddBlock={addBlock}
                  />
                )}

                <BlockRenderer
                  block={block}
                  isEditing={editingBlock === block.id}
                  editingContent={editingContent}
                  setEditingContent={setEditingContent}
                  activeTabs={activeTabs}
                  setActiveTabs={setActiveTabs}
                  openAccordions={openAccordions}
                  setOpenAccordions={setOpenAccordions}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationEditor;