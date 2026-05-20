import { useState } from "react";
import { TierItem } from "../types";
import "../styles/ItemCard.css";

interface ItemCardProps {
  item: TierItem;
  onRemove: () => void;
  onUpdate: (updates: Partial<TierItem>) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onRemove,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);

  const handleSaveEdit = () => {
    if (editName.trim()) {
      onUpdate({ name: editName });
      setIsEditing(false);
    }
  };

  const handleImageSelect = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdate({ image: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="item-card">
      {item.image && (
        <img src={item.image} alt={item.name} className="item-image" />
      )}

      <div className="item-content">
        {isEditing ? (
          <div className="item-edit">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="item-input"
              autoFocus
            />
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <label
                className="btn btn-secondary btn-small"
                style={{ cursor: "pointer" }}
              >
                Selecionar imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e.target.files?.[0])}
                  style={{ display: "none" }}
                />
              </label>

              <button
                onClick={() => onUpdate({ image: undefined })}
                className="btn-small"
              >
                Remover imagem
              </button>

              <button onClick={handleSaveEdit} className="btn-small">
                ✓
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-small">
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="item-display">
            <span className="item-name">{item.name}</span>
            <div className="item-actions">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
