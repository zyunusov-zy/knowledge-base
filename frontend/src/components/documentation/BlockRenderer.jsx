import React from "react";
import BlockEditMode from "./BlockEditMode";
import BlockViewMode from "./BlockViewMode";

const BlockRenderer = ({
  block,
  isEditing,
  editingContent,
  setEditingContent,
  activeTabs,
  setActiveTabs,
  openAccordions,
  setOpenAccordions,
  onSave,
  onCancel,
}) => {
  if (isEditing) {
    return (
      <BlockEditMode
        block={block}
        editingContent={editingContent}
        setEditingContent={setEditingContent}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <BlockViewMode
      block={block}
      activeTabs={activeTabs}
      setActiveTabs={setActiveTabs}
      openAccordions={openAccordions}
      setOpenAccordions={setOpenAccordions}
    />
  );
};

export default BlockRenderer;