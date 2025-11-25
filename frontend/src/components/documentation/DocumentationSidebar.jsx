import React from "react";
import { Search } from "lucide-react";

const DocumentationSidebar = ({
  isOpen,
  toc,
  searchQuery,
  onSearchChange,
  onScrollToBlock,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-80 bg-white border-r-2 border-gray-300 h-[calc(100vh-80px)] overflow-y-auto sticky top-20 transition-all shadow-lg">
      <div className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onScrollToBlock(item.id)}
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
  );
};

export default DocumentationSidebar;