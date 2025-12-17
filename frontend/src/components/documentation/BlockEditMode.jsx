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

case "table":
        return (
          <div className="space-y-4 overflow-x-auto">
            <div>
              <label className="block text-sm font-bold mb-2">Headers:</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {(editingContent.headers || []).map((header, i) => (
                  <div key={i} className="flex gap-2 min-w-[150px]">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...editingContent.headers];
                        newHeaders[i] = e.target.value;
                        setEditingContent({ ...editingContent, headers: newHeaders });
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                      placeholder={`Header ${i + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newHeaders = editingContent.headers.filter((_, idx) => idx !== i);
                        const newRows = editingContent.rows.map(row => row.filter((_, idx) => idx !== i));
                        setEditingContent({ ...editingContent, headers: newHeaders, rows: newRows });
                      }}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const newHeaders = [...(editingContent.headers || []), ""];
                  const newRows = (editingContent.rows || []).map(row => [...row, ""]);
                  setEditingContent({ ...editingContent, headers: newHeaders, rows: newRows });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                + Add Column
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Rows:</label>
              <div className="space-y-2">
                {(editingContent.rows || []).map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2 flex-wrap">
                    {row.map((cell, cellIdx) => (
                      <input
                        key={cellIdx}
                        type="text"
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...editingContent.rows];
                          newRows[rowIdx][cellIdx] = e.target.value;
                          setEditingContent({ ...editingContent, rows: newRows });
                        }}
                        className="min-w-[150px] flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                        placeholder={`Cell ${rowIdx + 1},${cellIdx + 1}`}
                      />
                    ))}
                    <button
                      onClick={() => {
                        const newRows = editingContent.rows.filter((_, idx) => idx !== rowIdx);
                        setEditingContent({ ...editingContent, rows: newRows });
                      }}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const colCount = (editingContent.headers || []).length;
                  const newRow = Array(colCount).fill("");
                  setEditingContent({ 
                    ...editingContent, 
                    rows: [...(editingContent.rows || []), newRow] 
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm mt-2"
              >
                + Add Row
              </button>
            </div>
          </div>
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

            {/* Request Examples Section */}
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <label className="block text-sm font-bold mb-2">
                Request Examples:
              </label>
              {(editingContent.requests || []).map((req, i) => (
                <div key={i} className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-300">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={req.title || ""}
                      onChange={(e) =>
                        updateArrayItem("requests", i, "title", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold mr-2"
                      placeholder="Request Title (e.g., Example 1)"
                    />
                    <button
                      onClick={() => removeArrayItem("requests", i)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1">Parameters:</label>
                    {(req.params || []).map((param, j) => (
                      <div key={j} className="flex gap-2 mb-2 flex-wrap">
                        <input
                          type="text"
                          value={param.name || ""}
                          onChange={(e) => {
                            const newRequests = [...(editingContent.requests || [])];
                            const newParams = [...(newRequests[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), name: e.target.value };
                            newRequests[i] = { ...(newRequests[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, requests: newRequests });
                          }}
                          className="flex-1 min-w-[100px] px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={param.type || ""}
                          onChange={(e) => {
                            const newRequests = [...(editingContent.requests || [])];
                            const newParams = [...(newRequests[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), type: e.target.value };
                            newRequests[i] = { ...(newRequests[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, requests: newRequests });
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Type"
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={param.required || false}
                            onChange={(e) => {
                              const newRequests = [...(editingContent.requests || [])];
                              const newParams = [...(newRequests[i].params || [])];
                              newParams[j] = { ...(newParams[j] || {}), required: e.target.checked };
                              newRequests[i] = { ...(newRequests[i] || {}), params: newParams };
                              setEditingContent({ ...editingContent, requests: newRequests });
                            }}
                            className="w-3 h-3"
                          />
                          <span className="text-xs">Req</span>
                        </label>
                        <input
                          type="text"
                          value={param.description || ""}
                          onChange={(e) => {
                            const newRequests = [...(editingContent.requests || [])];
                            const newParams = [...(newRequests[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), description: e.target.value };
                            newRequests[i] = { ...(newRequests[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, requests: newRequests });
                          }}
                          className="flex-1 min-w-[150px] px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Description"
                        />
                        <button
                          onClick={() => {
                            const newRequests = [...(editingContent.requests || [])];
                            newRequests[i] = { 
                              ...(newRequests[i] || {}), 
                              params: (newRequests[i].params || []).filter((_, idx) => idx !== j) 
                            };
                            setEditingContent({ ...editingContent, requests: newRequests });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newRequests = [...(editingContent.requests || [])];
                        newRequests[i] = { 
                          ...(newRequests[i] || {}), 
                          params: [...(newRequests[i].params || []), { name: "", type: "string", required: false, description: "" }] 
                        };
                        setEditingContent({ ...editingContent, requests: newRequests });
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      + Add Param
                    </button>
                  </div>

                  <textarea
                    value={req.example || ""}
                    onChange={(e) =>
                      updateArrayItem("requests", i, "example", e.target.value)
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-xs"
                    rows="4"
                    placeholder="Request body example (JSON)"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  addArrayItem("requests", {
                    title: "",
                    params: [],
                    example: "{}",
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                + Add Request Example
              </button>
            </div>

            {/* Response Examples Section */}
            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <label className="block text-sm font-bold mb-2">
                Response Examples:
              </label>
              {(editingContent.responses || []).map((res, i) => (
                <div key={i} className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-300">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={res.title || ""}
                      onChange={(e) =>
                        updateArrayItem("responses", i, "title", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold mr-2"
                      placeholder="Response Title (e.g., Success Response)"
                    />
                    <button
                      onClick={() => removeArrayItem("responses", i)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs font-semibold mb-1">Parameters:</label>
                    {(res.params || []).map((param, j) => (
                      <div key={j} className="flex gap-2 mb-2 flex-wrap">
                        <input
                          type="text"
                          value={param.name || ""}
                          onChange={(e) => {
                            const newResponses = [...(editingContent.responses || [])];
                            const newParams = [...(newResponses[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), name: e.target.value };
                            newResponses[i] = { ...(newResponses[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, responses: newResponses });
                          }}
                          className="flex-1 min-w-[100px] px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          value={param.type || ""}
                          onChange={(e) => {
                            const newResponses = [...(editingContent.responses || [])];
                            const newParams = [...(newResponses[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), type: e.target.value };
                            newResponses[i] = { ...(newResponses[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, responses: newResponses });
                          }}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Type"
                        />
                        <input
                          type="text"
                          value={param.description || ""}
                          onChange={(e) => {
                            const newResponses = [...(editingContent.responses || [])];
                            const newParams = [...(newResponses[i].params || [])];
                            newParams[j] = { ...(newParams[j] || {}), description: e.target.value };
                            newResponses[i] = { ...(newResponses[i] || {}), params: newParams };
                            setEditingContent({ ...editingContent, responses: newResponses });
                          }}
                          className="flex-1 min-w-[150px] px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Description"
                        />
                        <button
                          onClick={() => {
                            const newResponses = [...(editingContent.responses || [])];
                            newResponses[i] = { 
                              ...(newResponses[i] || {}), 
                              params: (newResponses[i].params || []).filter((_, idx) => idx !== j) 
                            };
                            setEditingContent({ ...editingContent, responses: newResponses });
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newResponses = [...(editingContent.responses || [])];
                        newResponses[i] = { 
                          ...(newResponses[i] || {}), 
                          params: [...(newResponses[i].params || []), { name: "", type: "string", description: "" }] 
                        };
                        setEditingContent({ ...editingContent, responses: newResponses });
                      }}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                    >
                      + Add Param
                    </button>
                  </div>

                  <textarea
                    value={res.example || ""}
                    onChange={(e) =>
                      updateArrayItem("responses", i, "example", e.target.value)
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg font-mono text-xs"
                    rows="4"
                    placeholder="Response body example (JSON)"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  addArrayItem("responses", {
                    title: "",
                    params: [],
                    example: "{}",
                  })
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                + Add Response Example
              </button>
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