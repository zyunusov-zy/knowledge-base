import React from "react";
import { ArrowLeft, X, Menu, Eye, Edit2, Save, Download } from "lucide-react";

const DocumentationHeader = ({
  title,
  mode,
  editorMode,
  setEditorMode,
  canEdit,
  isSaving,
  sidebarOpen,
  onBack,
  onSave,
  onToggleSidebar,
}) => {
  return (
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
              onClick={onToggleSidebar}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
              {mode === "new" ? "New Documentation" : "Existing Documentation"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {editorMode === "edit" && canEdit ? (
              <>
                <button
                  onClick={() => setEditorMode("view")}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md"
                >
                  <Eye className="w-5 h-5" />
                  Preview
                </button>
                <button
                  onClick={onSave}
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
                {canEdit && (
                  <button
                    onClick={() => setEditorMode("edit")}
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
  );
};

export default DocumentationHeader;