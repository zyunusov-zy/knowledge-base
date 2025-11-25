import React from "react";
import { Save, Trash2 } from "lucide-react";

const BlockEditMode = ({
  block,
  editingContent,
  setEditingContent,
  onSave,
  onCancel,
}) => {
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

  const renderEditor = () => {
    switch (block.type) {
      case "cover":
        return (
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
        );

      case "changelog":
        return (
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
        );

      case "section":
        return (
          <input
            type="text"
            value={editingContent.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-xl font-bold"
            placeholder="Section title..."
          />
        );

      case "heading":
        return (
          <input
            type="text"
            value={editingContent.text || ""}
            onChange={(e) => updateContent("text", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold"
            placeholder="Heading text..."
          />
        );

      case "paragraph":
        return (
          <textarea
            value={editingContent.text || ""}
            onChange={(e) => updateContent("text", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            rows="4"
            placeholder="Paragraph text..."
          />
        );

      case "code":
        return (
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
        );

      case "list":
        return (
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
        );

      case "quote":
        return (
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
        );

      case "callout":
        return (
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
        );

      case "method":
        return (
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
                      updateArrayItem("requestParams", i, "name", e.target.value)
                    }
                    className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={param.type}
                    onChange={(e) =>
                      updateArrayItem("requestParams", i, "type", e.target.value)
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
                      updateArrayItem("responseParams", i, "name", e.target.value)
                    }
                    className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={param.type}
                    onChange={(e) =>
                      updateArrayItem("responseParams", i, "type", e.target.value)
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
                  onChange={(e) => updateContent("requestExample", e.target.value)}
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
        );

      default:
        return <p className="text-gray-500">Editing for {block.type} is not implemented yet.</p>;
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Editing {block.type}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(block.id)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
      {renderEditor()}
    </div>
  );
};

export default BlockEditMode;