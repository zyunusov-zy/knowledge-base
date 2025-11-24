import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  Menu,
  X,
  Download,
  Search,
  Edit2,
  Plus,
  Trash2,
  Eye,
  Save,
  ArrowLeft,
  Code,
  List,
  Type,
  FileText,
  Table,
  Image as ImageIcon,
  Quote,
  CheckSquare,
  AlertCircle,
  Lightbulb,
  Info,
  Tag,
  Link,
  Grid,
  ChevronDown,
  History,
} from "lucide-react";

// Documentation Editor Component
const DocumentationEditor = ({ project, onBack, userRole, modes, documentation }) => {
  const [structure, setStructure] = useState([]);
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
  const tocRef = useRef(null);
  const canEdit = !["user", "User"].includes(userRole);
  const [mode, setMode] = useState(canEdit ? "edit" : "view");

  console.log("Printing modes: ", modes);
  console.log("Printing documentation: ", documentation);
  console.log("Project ID: ", project.project.name);

  // Default template structure
  const getDefaultTemplate = () => [
    {
      id: "cover",
      type: "cover",
      level: 0,
      content: {
        title: project.project.name,
        subtitle: "Base info of product",
        version: "1.0.0",
        logo: null,
      },
    },
    {
      id: "changelog",
      type: "changelog",
      level: 0,
      content: {
        title: "Change log",
        entries: [
          {
            date: new Date().toLocaleDateString("en-GB"),
            version: "1.0.0",
            type: "added",
            description: "Initial documentation created",
          },
        ],
      },
    },
    {
      id: 1,
      type: "section",
      level: 1,
      content: { title: "Информация о продукте" },
    },
    {
      id: 2,
      type: "paragraph",
      level: 2,
      content: { text: "Добавьте описание вашего продукта здесь..." },
    },
    { id: 3, type: "section", level: 1, content: { title: "Введение" } },
    { id: 4, type: "heading", level: 2, content: { text: "Начало работы" } },
    {
      id: 5,
      type: "paragraph",
      level: 2,
      content: {
        text: "Добро пожаловать в документацию. Этот документ содержит всю необходимую информацию для работы с API.",
      },
    },
    {
      id: 6,
      type: "section",
      level: 1,
      content: { title: "Термины и сокращения" },
    },
    {
      id: 7,
      type: "list",
      level: 2,
      content: {
        items: [
          { term: "API", definition: "Application Programming Interface" },
          { term: "REST", definition: "Representational State Transfer" },
          { term: "JSON", definition: "JavaScript Object Notation" },
        ],
      },
    },
    {
      id: 8,
      type: "section",
      level: 1,
      content: { title: "Адрес веб-сервиса" },
    },
    {
      id: 9,
      type: "heading",
      level: 2,
      content: { text: "Production Environment" },
    },
    {
      id: 10,
      type: "code",
      level: 2,
      content: { language: "text", code: "https://api.example.com" },
    },
    {
      id: 11,
      type: "heading",
      level: 2,
      content: { text: "Test Environment" },
    },
    {
      id: 12,
      type: "code",
      level: 2,
      content: { language: "text", code: "https://test-api.example.com" },
    },
    {
      id: 13,
      type: "section",
      level: 1,
      content: { title: "Формат сообщений веб-сервиса" },
    },
    {
      id: 14,
      type: "paragraph",
      level: 2,
      content: {
        text: "Все запросы и ответы используют формат JSON. Кодировка: UTF-8.",
      },
    },
    {
      id: 15,
      type: "section",
      level: 1,
      content: { title: "Модули и методы" },
    },
    {
      id: 16,
      type: "paragraph",
      level: 2,
      content: { text: "Добавьте описание ваших API методов здесь..." },
    },
  ];

  // Load structure based on mode
  useEffect(() => {
    if (modes === "current" && documentation) {
      // Load existing documentation structure
      console.log("Loading existing documentation structure");
      setStructure(documentation.structure || []);
    } else if (modes === "new") {
      // Load default template
      console.log("Loading default template");
      setStructure(getDefaultTemplate());
    } else {
      // Fallback to default template
      console.log("Fallback to default template");
      setStructure(getDefaultTemplate());
    }
  }, [modes, documentation, project]);

  // Update content width when editing
  useEffect(() => {
    if (editingBlock) {
      setContentWidth("max-w-4xl");
    } else {
      setContentWidth("max-w-5xl");
    }
  }, [editingBlock]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowBlockMenu(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Save documentation from frontend
  const handleSave = async () => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5172/api/documentation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.project.id,
          version:
            structure.find((b) => b.id === "cover")?.content?.version ||
            "1.0.0",
          isTest: false, // or true for test documentation
          structure: structure,
          description: "Documentation update",
          changeLogEntries: [
            {
              version: "1.0.0",
              changeType: "added",
              description: "Initial documentation created",
            },
          ],
        }),
      });

      if (response.ok) {
        alert("Documentation saved successfully!");
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  const getDefaultContent = (type) => {
    switch (type) {
      case "paragraph":
        return { text: "Новый параграф..." };
      case "heading":
        return { text: "Новый заголовок" };
      case "section":
        return { title: "Новая секция" };
      case "code":
        return { language: "javascript", code: "// code here" };
      case "list":
        return { items: [{ term: "Термин", definition: "Определение" }] };
      case "table":
        return {
          headers: ["Column 1", "Column 2", "Column 3"],
          rows: [
            ["Data 1", "Data 2", "Data 3"],
            ["Data 4", "Data 5", "Data 6"],
          ],
        };
      case "quote":
        return { text: "Quote text here...", author: "" };
      case "callout":
        return { type: "info", title: "Note", text: "Callout text..." };
      case "tabs":
        return {
          tabs: [
            { label: "Tab 1", content: "Content 1" },
            { label: "Tab 2", content: "Content 2" },
          ],
        };
      case "accordion":
        return {
          items: [
            { title: "Section 1", content: "Content 1" },
            { title: "Section 2", content: "Content 2" },
          ],
        };
      case "method":
        return {
          name: "methodName",
          description: "Описание метода",
          endpoint: "/api/endpoint",
          httpMethod: "POST",
          requestParams: [],
          responseParams: [],
          requestExample: "{}",
          responseExample: "{}",
        };
      default:
        return {};
    }
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
        title:
          block.type === "section" ? block.content.title : block.content.name,
        type: block.type,
        level: block.level,
      }));
  };

  const renderBlock = (block, index) => {
    const isSelected = selectedBlocks.has(block.id);
    const isEditing = editingBlock === block.id;

    return (
      <div
        key={block.id}
        id={`block-${block.id}`}
        className={`relative group transition-all ${isSelected ? "ring-2 ring-blue-400 rounded-lg" : ""}`}
        onClick={() =>
          mode === "edit" && setSelectedBlocks(new Set([block.id]))
        }
      >
        {mode === "edit" && !isEditing && (
          <div className="absolute -left-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
            <div className="flex flex-col gap-1 bg-white rounded-lg border border-gray-200 shadow-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBlockMenu(block.id);
                }}
                className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center"
                title="Add block"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(block);
                }}
                className="p-2 hover:bg-green-50 rounded-md transition-colors flex items-center justify-center"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-green-600" />
              </button>
            </div>
            <div className="flex flex-col gap-1 bg-white rounded-lg border border-gray-200 shadow-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, "up");
                }}
                className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center text-sm font-medium"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveBlock(block.id, "down");
                }}
                className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center text-sm font-medium"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBlock(block.id);
                }}
                className="p-2 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {showBlockMenu === block.id && (
          <div
            className="absolute left-0 top-12 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-3 z-50 min-w-[280px]"
            onMouseLeave={() => setShowBlockMenu(null)}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
              Add Block
            </div>
            <div className="grid grid-cols-2 gap-1">
              <BlockMenuItem
                icon={<FileText className="w-4 h-4" />}
                label="Paragraph"
                onClick={() => addBlock(block.id, "paragraph")}
              />
              <BlockMenuItem
                icon={<Type className="w-4 h-4" />}
                label="Heading"
                onClick={() => addBlock(block.id, "heading")}
              />
              <BlockMenuItem
                icon={<Tag className="w-4 h-4" />}
                label="Section"
                onClick={() => addBlock(block.id, "section")}
              />
              <BlockMenuItem
                icon={<Code className="w-4 h-4" />}
                label="Code"
                onClick={() => addBlock(block.id, "code")}
              />
              <BlockMenuItem
                icon={<List className="w-4 h-4" />}
                label="List"
                onClick={() => addBlock(block.id, "list")}
              />
              <BlockMenuItem
                icon={<Table className="w-4 h-4" />}
                label="Table"
                onClick={() => addBlock(block.id, "table")}
              />
              <BlockMenuItem
                icon={<Quote className="w-4 h-4" />}
                label="Quote"
                onClick={() => addBlock(block.id, "quote")}
              />
              <BlockMenuItem
                icon={<AlertCircle className="w-4 h-4" />}
                label="Callout"
                onClick={() => addBlock(block.id, "callout")}
              />
              <BlockMenuItem
                icon={<Grid className="w-4 h-4" />}
                label="Tabs"
                onClick={() => addBlock(block.id, "tabs")}
              />
              <BlockMenuItem
                icon={<ChevronDown className="w-4 h-4" />}
                label="Accordion"
                onClick={() => addBlock(block.id, "accordion")}
              />
              <BlockMenuItem
                icon={<Code className="w-4 h-4" />}
                label="API Method"
                onClick={() => addBlock(block.id, "method")}
              />
            </div>
          </div>
        )}

        {renderBlockContent(block, isEditing)}
      </div>
    );
  };

  const BlockMenuItem = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );

  const renderBlockContent = (block, isEditing) => {
    if (isEditing) {
      return renderEditMode(block);
    }

    switch (block.type) {
      case "cover":
        return (
          <div className="min-h-[500px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -mx-8 px-8 mb-12 rounded-2xl">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {block.content.title}
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              {block.content.subtitle}
            </p>
            <div className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-700 rounded-full text-sm font-bold shadow-lg">
              version {block.content.version}
            </div>
          </div>
        );

      case "changelog":
        return (
          <div className="mb-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <History className="w-8 h-8 text-blue-600" />
              {block.content.title}
            </h2>
            <div className="space-y-4">
              {block.content.entries.map((entry, i) => (
                <div
                  key={i}
                  className="flex gap-6 pb-4 border-b border-gray-300 last:border-0 hover:bg-white hover:shadow-md transition-all p-4 rounded-xl"
                >
                  <div className="flex-shrink-0 w-36 text-sm text-gray-600 font-medium">
                    <div className="text-base">{entry.date}</div>
                    <div className="text-xs text-gray-500">{entry.version}</div>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        entry.type === "added"
                          ? "bg-green-100 text-green-800"
                          : entry.type === "modified"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {entry.type === "added"
                        ? "✨ Added"
                        : entry.type === "modified"
                          ? "🔄 Modified"
                          : "🐛 Fixed"}
                    </div>
                    <p className="text-gray-800 font-medium">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "section":
        return (
          <div className="mb-10 mt-16">
            <h2
              className="text-4xl font-bold text-gray-900 pb-4 border-b-4 border-gradient-to-r from-blue-600 to-purple-600"
              style={{
                borderImage: "linear-gradient(to right, #2563eb, #9333ea) 1",
              }}
            >
              {block.content.title}
            </h2>
          </div>
        );

      case "heading":
        return (
          <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            {block.content.text}
          </h3>
        );

      case "paragraph":
        return (
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            {block.content.text}
          </p>
        );

      case "code":
        return (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg border-2 border-gray-800">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <span className="text-gray-400 text-xs font-mono">
                {block.content.language}
              </span>
              <button className="text-gray-400 hover:text-white text-xs">
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto">
              <code>{block.content.code}</code>
            </pre>
          </div>
        );

      case "list":
        return (
          <div className="mb-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
            {block.content.items.map((item, i) => (
              <div
                key={i}
                className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-gray-300 last:border-0"
              >
                <span className="font-bold text-gray-900 text-lg">
                  {item.term}
                </span>
                <span className="text-gray-700 ml-2">— {item.definition}</span>
              </div>
            ))}
          </div>
        );

      case "table":
        return (
          <div className="mb-8 overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  {block.content.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-r border-gray-300 last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {block.content.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "quote":
        return (
          <div className="mb-8 border-l-4 border-blue-600 bg-blue-50 p-6 rounded-r-xl shadow-md">
            <p className="text-gray-800 text-lg italic mb-2">
              "{block.content.text}"
            </p>
            {block.content.author && (
              <p className="text-gray-600 text-sm font-semibold">
                — {block.content.author}
              </p>
            )}
          </div>
        );

      case "callout":
        const calloutStyles = {
          info: {
            bg: "bg-blue-50",
            border: "border-blue-500",
            icon: <Info className="w-5 h-5 text-blue-600" />,
            title: "text-blue-900",
          },
          warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-500",
            icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
            title: "text-yellow-900",
          },
          success: {
            bg: "bg-green-50",
            border: "border-green-500",
            icon: <CheckSquare className="w-5 h-5 text-green-600" />,
            title: "text-green-900",
          },
          tip: {
            bg: "bg-purple-50",
            border: "border-purple-500",
            icon: <Lightbulb className="w-5 h-5 text-purple-600" />,
            title: "text-purple-900",
          },
        };
        const style = calloutStyles[block.content.type] || calloutStyles.info;
        return (
          <div
            className={`mb-8 ${style.bg} border-l-4 ${style.border} p-6 rounded-r-xl shadow-md`}
          >
            <div className="flex items-start gap-3">
              {style.icon}
              <div className="flex-1">
                <h4 className={`font-bold text-lg mb-2 ${style.title}`}>
                  {block.content.title}
                </h4>
                <p className="text-gray-700">{block.content.text}</p>
              </div>
            </div>
          </div>
        );

      case "tabs":
        return (
          <div className="mb-8 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <div className="flex bg-gray-100 border-b-2 border-gray-200">
              {block.content.tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setActiveTabs({ ...activeTabs, [block.id]: i })
                  }
                  className={`px-6 py-3 font-semibold transition-all ${
                    (activeTabs[block.id] ?? 0) === i
                      ? "bg-white text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-700">
                {block.content.tabs[activeTabs[block.id] ?? 0]?.content}
              </p>
            </div>
          </div>
        );

      case "accordion":
        return (
          <div className="mb-8 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
            {block.content.items.map((item, i) => {
              const accordionKey = `${block.id}-${i}`;
              const isOpen = openAccordions[accordionKey] ?? i === 0;

              return (
                <div
                  key={i}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      setOpenAccordions({
                        ...openAccordions,
                        [accordionKey]: !isOpen,
                      });
                    }}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-bold text-gray-900">
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "method":
        return (
          <div className="mb-10 p-8 bg-white border-2 border-gray-300 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-3xl font-bold text-gray-900">
                {block.content.name}
              </h3>
              <span
                className={`px-4 py-2 text-white text-sm font-bold rounded-lg ${
                  block.content.httpMethod === "GET"
                    ? "bg-green-600"
                    : block.content.httpMethod === "POST"
                      ? "bg-blue-600"
                      : block.content.httpMethod === "PUT"
                        ? "bg-yellow-600"
                        : block.content.httpMethod === "DELETE"
                          ? "bg-red-600"
                          : "bg-gray-600"
                }`}
              >
                {block.content.httpMethod}
              </span>
            </div>

            <p className="text-gray-700 mb-6 text-lg">
              {block.content.description}
            </p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-2 font-semibold">
                Endpoint:
              </div>
              <code className="px-4 py-2 bg-gray-900 text-green-400 rounded-lg text-base font-mono block">
                {block.content.endpoint}
              </code>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  Request params:
                </h4>
                {block.content.requestParams.length > 0 ? (
                  block.content.requestParams.map((param, i) => (
                    <div
                      key={i}
                      className="mb-3 text-sm bg-white p-3 rounded-lg border border-blue-200"
                    >
                      <span className="font-bold text-gray-900">
                        {param.name}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {" "}
                        ({param.type})
                      </span>
                      {param.required && (
                        <span className="text-red-600 font-bold">*</span>
                      )}
                      <p className="text-gray-600 mt-1">{param.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No parameters</p>
                )}
              </div>

              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Response params:
                </h4>
                {block.content.responseParams.length > 0 ? (
                  block.content.responseParams.map((param, i) => (
                    <div
                      key={i}
                      className="mb-3 text-sm bg-white p-3 rounded-lg border border-green-200"
                    >
                      <span className="font-bold text-gray-900">
                        {param.name}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {" "}
                        ({param.type})
                      </span>
                      <p className="text-gray-600 mt-1">{param.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No parameters</p>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  Response body:
                </h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto border-2 border-gray-700">
                  <code>{block.content.responseExample}</code>
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderEditMode = (block) => {
    const updateContent = (field, value) => {
      setEditingContent({ ...editingContent, [field]: value });
    };

    const updateArrayItem = (array, index, field, value) => {
      const newArray = [...editingContent[array]];
      newArray[index] = { ...newArray[index], [field]: value };
      setEditingContent({ ...editingContent, [array]: newArray });
    };

    const addArrayItem = (array, defaultItem) => {
      setEditingContent({
        ...editingContent,
        [array]: [...(editingContent[array] || []), defaultItem],
      });
    };

    const removeArrayItem = (array, index) => {
      setEditingContent({
        ...editingContent,
        [array]: editingContent[array].filter((_, i) => i !== index),
      });
    };

    return (
      <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Editing {block.type}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => saveEdit(block.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

        {block.type === "section" && (
          <input
            type="text"
            value={editingContent.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-xl font-bold"
            placeholder="Section title..."
          />
        )}

        {block.type === "heading" && (
          <input
            type="text"
            value={editingContent.text || ""}
            onChange={(e) => updateContent("text", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold"
            placeholder="Heading text..."
          />
        )}

        {block.type === "paragraph" && (
          <textarea
            value={editingContent.text || ""}
            onChange={(e) => updateContent("text", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            rows="4"
            placeholder="Paragraph text..."
          />
        )}

        {block.type === "code" && (
          <>
            <input
              type="text"
              value={editingContent.language || ""}
              onChange={(e) => updateContent("language", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-2"
              placeholder="Language (e.g., javascript)"
            />
            <textarea
              value={editingContent.code || ""}
              onChange={(e) => updateContent("code", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono"
              rows="6"
              placeholder="Code here..."
            />
          </>
        )}

        {block.type === "list" && (
          <div className="space-y-3">
            {(editingContent.items || []).map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) =>
                    updateArrayItem("items", i, "term", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                  placeholder="Term"
                />
                <input
                  type="text"
                  value={item.definition}
                  onChange={(e) =>
                    updateArrayItem("items", i, "definition", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                  placeholder="Definition"
                />
                <button
                  onClick={() => removeArrayItem("items", i)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem("items", { term: "", definition: "" })
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              + Add Item
            </button>
          </div>
        )}

        {block.type === "table" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Headers:</label>
              <div className="flex gap-2 mb-2">
                {(editingContent.headers || []).map((header, i) => (
                  <input
                    key={i}
                    type="text"
                    value={header}
                    onChange={(e) => {
                      const newHeaders = [...editingContent.headers];
                      newHeaders[i] = e.target.value;
                      updateContent("headers", newHeaders);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                    placeholder={`Column ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Rows:</label>
              {(editingContent.rows || []).map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 mb-2">
                  {row.map((cell, cellIndex) => (
                    <input
                      key={cellIndex}
                      type="text"
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...editingContent.rows];
                        newRows[rowIndex][cellIndex] = e.target.value;
                        updateContent("rows", newRows);
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg"
                      placeholder="Cell"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newRows = editingContent.rows.filter(
                        (_, i) => i !== rowIndex
                      );
                      updateContent("rows", newRows);
                    }}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newRow = new Array(
                    (editingContent.headers || []).length
                  ).fill("");
                  updateContent("rows", [
                    ...(editingContent.rows || []),
                    newRow,
                  ]);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                + Add Row
              </button>
            </div>
          </div>
        )}

        {block.type === "quote" && (
          <>
            <textarea
              value={editingContent.text || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-2"
              rows="3"
              placeholder="Quote text..."
            />
            <input
              type="text"
              value={editingContent.author || ""}
              onChange={(e) => updateContent("author", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              placeholder="Author (optional)"
            />
          </>
        )}

        {block.type === "callout" && (
          <>
            <select
              value={editingContent.type || "info"}
              onChange={(e) => updateContent("type", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-2"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="tip">Tip</option>
            </select>
            <input
              type="text"
              value={editingContent.title || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-2"
              placeholder="Title"
            />
            <textarea
              value={editingContent.text || ""}
              onChange={(e) => updateContent("text", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              rows="3"
              placeholder="Callout text..."
            />
          </>
        )}

        {block.type === "tabs" && (
          <div className="space-y-3">
            {(editingContent.tabs || []).map((tab, i) => (
              <div
                key={i}
                className="border-2 border-gray-300 rounded-lg p-4 bg-white"
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tab.label}
                    onChange={(e) =>
                      updateArrayItem("tabs", i, "label", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                    placeholder="Tab Label"
                  />
                  <button
                    onClick={() => removeArrayItem("tabs", i)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={tab.content}
                  onChange={(e) =>
                    updateArrayItem("tabs", i, "content", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Tab Content"
                />
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem("tabs", {
                  label: "New Tab",
                  content: "Content here...",
                })
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              + Add Tab
            </button>
          </div>
        )}

        {block.type === "accordion" && (
          <div className="space-y-3">
            {(editingContent.items || []).map((item, i) => (
              <div
                key={i}
                className="border-2 border-gray-300 rounded-lg p-4 bg-white"
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      updateArrayItem("items", i, "title", e.target.value)
                    }
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold"
                    placeholder="Section Title"
                  />
                  <button
                    onClick={() => removeArrayItem("items", i)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={item.content}
                  onChange={(e) =>
                    updateArrayItem("items", i, "content", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Section Content"
                />
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem("items", {
                  title: "New Section",
                  content: "Content here...",
                })
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              + Add Section
            </button>
          </div>
        )}

        {block.type === "method" && (
          <div className="space-y-4">
            <input
              type="text"
              value={editingContent.name || ""}
              onChange={(e) => updateContent("name", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold"
              placeholder="Method name"
            />
            <textarea
              value={editingContent.description || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
              rows="2"
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={editingContent.endpoint || ""}
                onChange={(e) => updateContent("endpoint", e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg"
                placeholder="Endpoint"
              />
              <select
                value={editingContent.httpMethod || "POST"}
                onChange={(e) => updateContent("httpMethod", e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Request Parameters:
              </label>
              {(editingContent.requestParams || []).map((param, i) => (
                <div key={i} className="flex gap-2 mb-2 flex-wrap">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) =>
                      updateArrayItem(
                        "requestParams",
                        i,
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={param.type}
                    onChange={(e) =>
                      updateArrayItem(
                        "requestParams",
                        i,
                        "type",
                        e.target.value
                      )
                    }
                    className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Type"
                  />
                  <label className="flex items-center gap-1 px-2">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) =>
                        updateArrayItem(
                          "requestParams",
                          i,
                          "required",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <input
                    type="text"
                    value={param.description}
                    onChange={(e) =>
                      updateArrayItem(
                        "requestParams",
                        i,
                        "description",
                        e.target.value
                      )
                    }
                    className="flex-1 min-w-[200px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Description"
                  />
                  <button
                    onClick={() => removeArrayItem("requestParams", i)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  addArrayItem("requestParams", {
                    name: "",
                    type: "string",
                    required: false,
                    description: "",
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                + Add Parameter
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Response Parameters:
              </label>
              {(editingContent.responseParams || []).map((param, i) => (
                <div key={i} className="flex gap-2 mb-2 flex-wrap">
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) =>
                      updateArrayItem(
                        "responseParams",
                        i,
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={param.type}
                    onChange={(e) =>
                      updateArrayItem(
                        "responseParams",
                        i,
                        "type",
                        e.target.value
                      )
                    }
                    className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Type"
                  />
                  <input
                    type="text"
                    value={param.description}
                    onChange={(e) =>
                      updateArrayItem(
                        "responseParams",
                        i,
                        "description",
                        e.target.value
                      )
                    }
                    className="flex-1 min-w-[200px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Description"
                  />
                  <button
                    onClick={() => removeArrayItem("responseParams", i)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  addArrayItem("responseParams", {
                    name: "",
                    type: "string",
                    description: "",
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                + Add Parameter
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Request Example:
                </label>
                <textarea
                  value={editingContent.requestExample || ""}
                  onChange={(e) =>
                    updateContent("requestExample", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm"
                  rows="6"
                  placeholder="{}"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Response Example:
                </label>
                <textarea
                  value={editingContent.responseExample || ""}
                  onChange={(e) =>
                    updateContent("responseExample", e.target.value)
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm"
                  rows="6"
                  placeholder="{}"
                />
              </div>
            </div>
          </div>
        )}

        {block.type === "cover" && (
          <>
            <input
              type="text"
              value={editingContent.title || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-2xl font-bold mb-3"
              placeholder="Title"
            />
            <input
              type="text"
              value={editingContent.subtitle || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg mb-3"
              placeholder="Subtitle"
            />
            <input
              type="text"
              value={editingContent.version || ""}
              onChange={(e) => updateContent("version", e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
              placeholder="Version"
            />
          </>
        )}

        {block.type === "changelog" && (
          <div className="space-y-3">
            <input
              type="text"
              value={editingContent.title || ""}
              onChange={(e) => updateContent("title", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-bold mb-4"
              placeholder="Changelog Title"
            />
            {(editingContent.entries || []).map((entry, i) => (
              <div
                key={i}
                className="border-2 border-gray-300 rounded-lg p-4 bg-white"
              >
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={entry.date}
                    onChange={(e) =>
                      updateArrayItem("entries", i, "date", e.target.value)
                    }
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Date"
                  />
                  <input
                    type="text"
                    value={entry.version}
                    onChange={(e) =>
                      updateArrayItem("entries", i, "version", e.target.value)
                    }
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Version"
                  />
                </div>
                <select
                  value={entry.type}
                  onChange={(e) =>
                    updateArrayItem("entries", i, "type", e.target.value)
                  }
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mb-2"
                >
                  <option value="added">Added</option>
                  <option value="modified">Modified</option>
                  <option value="fixed">Fixed</option>
                </select>
                <div className="flex gap-2">
                  <textarea
                    value={entry.description}
                    onChange={(e) =>
                      updateArrayItem(
                        "entries",
                        i,
                        "description",
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg"
                    rows="2"
                    placeholder="Description"
                  />
                  <button
                    onClick={() => removeArrayItem("entries", i)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                addArrayItem("entries", {
                  date: new Date().toLocaleDateString("en-GB"),
                  version: "1.0.0",
                  type: "added",
                  description: "",
                })
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              + Add Entry
            </button>
          </div>
        )}
      </div>
    );
  };

  const toc = generateTOC();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b-2 border-gray-300 bg-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-bold text-gray-700">
                  Back to Projects
                </span>
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-blue-400 to-purple-400"></div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 hover:bg-gray-100 rounded-xl transition-all"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {documentation.structure[0].content.title}
              </h1>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                {modes === "current" ? "Existing Documentation" : "New Documentation"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {mode === "edit" && userRole !== "User" && userRole !== "user" ? (
                <>
                  <button
                    onClick={() => setMode("view")}
                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md"
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg">
                    <Download className="w-5 h-5" />
                    Export PDF
                  </button>
                </>
              ) : (
                <>
                  {userRole !== "User" && userRole !== "user" && (
                    <button
                      onClick={() => setMode("edit")}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit
                    </button>
                  )}
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-lg">
                    <Download className="w-5 h-5" />
                    Export PDF
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - TOC */}
        <aside
          ref={tocRef}
          className={`w-80 bg-white border-r-2 border-gray-300 h-[calc(100vh-80px)] overflow-y-auto sticky top-20 transition-all shadow-lg ${sidebarOpen ? "block" : "hidden"}`}
        >
          <div className="p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            <nav className="space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Table of Contents
              </div>
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToBlock(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all hover:shadow-md ${
                    item.type === "section"
                      ? "font-bold text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100"
                      : "text-gray-700 hover:bg-gray-100 pl-8"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 px-8 py-8 transition-all duration-300 ${contentWidth}`}
        >
          <div className="space-y-0">
            {structure.map((block, index) => renderBlock(block, index))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentationEditor;