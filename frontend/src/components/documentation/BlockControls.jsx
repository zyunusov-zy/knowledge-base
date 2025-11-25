
import React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Code,
  List,
  Type,
  FileText,
  Table,
  Quote,
  AlertCircle,
  Tag,
  Grid,
  ChevronDown,
} from "lucide-react";

const BlockControls = ({
  block,
  showBlockMenu,
  onShowMenu,
  onEdit,
  onMove,
  onDelete,
  onAddBlock,
}) => {
  return (
    <>
      <div className="absolute -left-16 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-10">
        <div className="flex flex-col gap-1 bg-white rounded-lg border border-gray-200 shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowMenu(block.id);
            }}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center"
            title="Add block"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(block);
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
              onMove(block.id, "up");
            }}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center text-sm font-medium"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, "down");
            }}
            className="p-2 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center text-sm font-medium"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="p-2 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {showBlockMenu === block.id && (
        <div
          className="absolute left-0 top-12 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-3 z-50 min-w-[280px]"
          onMouseLeave={() => onShowMenu(null)}
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
            Add Block
          </div>
          <div className="grid grid-cols-2 gap-1">
            <BlockMenuItem
              icon={<FileText className="w-4 h-4" />}
              label="Paragraph"
              onClick={() => onAddBlock(block.id, "paragraph")}
            />
            <BlockMenuItem
              icon={<Type className="w-4 h-4" />}
              label="Heading"
              onClick={() => onAddBlock(block.id, "heading")}
            />
            <BlockMenuItem
              icon={<Tag className="w-4 h-4" />}
              label="Section"
              onClick={() => onAddBlock(block.id, "section")}
            />
            <BlockMenuItem
              icon={<Code className="w-4 h-4" />}
              label="Code"
              onClick={() => onAddBlock(block.id, "code")}
            />
            <BlockMenuItem
              icon={<List className="w-4 h-4" />}
              label="List"
              onClick={() => onAddBlock(block.id, "list")}
            />
            <BlockMenuItem
              icon={<Table className="w-4 h-4" />}
              label="Table"
              onClick={() => onAddBlock(block.id, "table")}
            />
            <BlockMenuItem
              icon={<Quote className="w-4 h-4" />}
              label="Quote"
              onClick={() => onAddBlock(block.id, "quote")}
            />
            <BlockMenuItem
              icon={<AlertCircle className="w-4 h-4" />}
              label="Callout"
              onClick={() => onAddBlock(block.id, "callout")}
            />
            <BlockMenuItem
              icon={<Grid className="w-4 h-4" />}
              label="Tabs"
              onClick={() => onAddBlock(block.id, "tabs")}
            />
            <BlockMenuItem
              icon={<ChevronDown className="w-4 h-4" />}
              label="Accordion"
              onClick={() => onAddBlock(block.id, "accordion")}
            />
            <BlockMenuItem
              icon={<Code className="w-4 h-4" />}
              label="API Method"
              onClick={() => onAddBlock(block.id, "method")}
            />
          </div>
        </div>
      )}
    </>
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

export default BlockControls;