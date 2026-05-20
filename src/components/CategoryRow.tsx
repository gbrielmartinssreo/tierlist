import { useState } from "react";
import { Category } from "../types";
import "../styles/CategoryRow.css";

interface CategoryRowProps {
  category: Category;
  onUpdate: (updates: Partial<Category>) => void;
  onRemove: () => void;
  onAddItem: (name: string, image?: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  onUpdate,
  onRemove,
  onAddItem,
  onMoveUp,
  onMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editColor, setEditColor] = useState(category.color);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemImage, setNewItemImage] = useState<string | null>(null);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdate({ name: editName, color: editColor });
      setIsEditing(false);
    }
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName, newItemImage || undefined);
      setNewItemName("");
      setNewItemImage(null);
      setShowAddItem(false);
    }
  };

  const handleImageSelect = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewItemImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="category-row">
      <div
        className="category-label"
        style={{ backgroundColor: category.color }}
      >
        {isEditing ? (
          <div className="category-edit">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="category-input"
              maxLength={3}
              autoFocus
            />
            <input
              type="color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              className="color-picker"
            />
            <button onClick={handleSaveEdit} className="btn-small">
              ✓
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-small">
              ✕
            </button>
          </div>
        ) : (
          <div className="category-display">
            <span className="category-name">{category.name}</span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-icon"
                title="Editar"
              >
                ✎
              </button>
              <button
                onClick={onRemove}
                className="btn-icon btn-danger"
                title="Remover"
              >
                🗑
              </button>
              <button
                onClick={() => setShowAddItem((s) => !s)}
                className="btn-icon"
                title="Adicionar item"
              >
                ➕
              </button>
              <button
                onClick={onMoveUp}
                className="btn-icon"
                title="Mover para cima"
              >
                ⬆️
              </button>
              <button
                onClick={onMoveDown}
                className="btn-icon"
                title="Mover para baixo"
              >
                ⬇️
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddItem && (
        <div className="add-item-inline">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nome do item..."
            className="form-input"
            autoFocus
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e.target.files?.[0])}
            className="file-input"
          />

          {newItemImage && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src={newItemImage}
                alt="preview"
                style={{ width: 48, height: 48, borderRadius: 6 }}
              />
              <button
                onClick={() => setNewItemImage(null)}
                className="btn btn-secondary btn-small"
              >
                Remover imagem
              </button>
            </div>
          )}

          <button onClick={handleAddItem} className="btn btn-primary btn-small">
            Adicionar
          </button>
          <button
            onClick={() => setShowAddItem(false)}
            className="btn btn-secondary btn-small"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
