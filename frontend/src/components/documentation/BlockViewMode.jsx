import React from "react";
import {
  History,
  Info,
  AlertCircle,
  CheckSquare,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

const BlockViewMode = ({
  block,
  activeTabs,
  setActiveTabs,
  openAccordions,
  setOpenAccordions,
}) => {
  switch (block.type) {
    case "cover":
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -mx-8 px-8 mb-12 rounded-2xl">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {block.content.title}
          </h1>
          <p className="text-2xl text-gray-600 mb-8">{block.content.subtitle}</p>
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
                  <p className="text-gray-800 font-medium">{entry.description}</p>
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
            <button className="text-gray-400 hover:text-white text-xs">Copy</button>
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
              <span className="font-bold text-gray-900 text-lg">{item.term}</span>
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
                onClick={() => setActiveTabs({ ...activeTabs, [block.id]: i })}
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
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => {
                    setOpenAccordions({
                      ...openAccordions,
                      [accordionKey]: !isOpen,
                    });
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-bold text-gray-900">{item.title}</span>
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

          <p className="text-gray-700 mb-6 text-lg">{block.content.description}</p>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2 font-semibold">
              Endpoint:
            </div>
            <code className="px-4 py-2 bg-gray-900 text-green-400 rounded-lg text-base font-mono block">
              {block.content.endpoint}
            </code>
          </div>

          {/* Request Examples */}
          {block.content.requests && block.content.requests.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Request Examples
              </h4>
              {block.content.requests.map((req, i) => (
                <div key={i} className="mb-6 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  {req.title && (
                    <h5 className="font-bold text-gray-900 mb-3 text-lg">{req.title}</h5>
                  )}
                  {req.params && req.params.length > 0 && (
                    <div className="mb-4">
                      <h6 className="font-semibold text-gray-800 mb-2 text-sm">Parameters:</h6>
                      {req.params.map((param, j) => (
                        <div
                          key={j}
                          className="mb-2 text-sm bg-white p-3 rounded-lg border border-blue-200"
                        >
                          <span className="font-bold text-gray-900">{param.name}</span>
                          <span className="text-blue-600 font-semibold">
                            {" "}
                            ({param.type})
                          </span>
                          {param.required && (
                            <span className="text-red-600 font-bold">*</span>
                          )}
                          <p className="text-gray-600 mt-1">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {req.example && (
                    <div>
                      <h6 className="font-semibold text-gray-800 mb-2 text-sm">Example:</h6>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs overflow-x-auto border-2 border-gray-700">
                        <code>{req.example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Response Examples */}
          {block.content.responses && block.content.responses.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Response Examples
              </h4>
              {block.content.responses.map((res, i) => (
                <div key={i} className="mb-6 bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  {res.title && (
                    <h5 className="font-bold text-gray-900 mb-3 text-lg">{res.title}</h5>
                  )}
                  {res.params && res.params.length > 0 && (
                    <div className="mb-4">
                      <h6 className="font-semibold text-gray-800 mb-2 text-sm">Parameters:</h6>
                      {res.params.map((param, j) => (
                        <div
                          key={j}
                          className="mb-2 text-sm bg-white p-3 rounded-lg border border-green-200"
                        >
                          <span className="font-bold text-gray-900">{param.name}</span>
                          <span className="text-green-600 font-semibold">
                            {" "}
                            ({param.type})
                          </span>
                          <p className="text-gray-600 mt-1">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {res.example && (
                    <div>
                      <h6 className="font-semibold text-gray-800 mb-2 text-sm">Example:</h6>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs overflow-x-auto border-2 border-gray-700">
                        <code>{res.example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default BlockViewMode;