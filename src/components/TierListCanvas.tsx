import { useState } from "react";
import { TierList, Category, TierItem, User } from "../types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CategoryRow } from "./CategoryRow";
import { ItemCard } from "./ItemCard";
import "../styles/TierListCanvas.css";

interface TierListCanvasProps {
  tierList: TierList;
  onAddCategory: (
    name: string,
    color: string,
    userName: string,
    userId: string,
  ) => void;
  onRemoveCategory: (
    categoryId: string,
    userName: string,
    userId: string,
  ) => void;
  onUpdateCategory: (
    categoryId: string,
    updates: Partial<Category>,
    userName: string,
    userId: string,
  ) => void;
  onAddItem: (
    name: string,
    categoryId: string,
    image?: string,
    userName?: string,
    userId?: string,
  ) => void;
  onRemoveItem: (itemId: string, userName: string, userId: string) => void;
  onMoveItem: (
    itemId: string,
    newCategoryId: string,
    destinationIndex: number,
    userName: string,
    userId: string,
  ) => void;
  onUpdateItem: (
    itemId: string,
    updates: Partial<TierItem>,
    userName: string,
    userId: string,
  ) => void;
  onReorderItems: (
    categoryId: string,
    sourceIndex: number,
    destinationIndex: number,
    userName: string,
    userId: string,
  ) => void;
  onReorderCategories: (
    orderedCategoryIds: string[],
    userName: string,
    userId: string,
  ) => void;
  user: User | null;
}

export const TierListCanvas: React.FC<TierListCanvasProps> = ({
  tierList,
  onAddCategory,
  onRemoveCategory,
  onUpdateCategory,
  onAddItem,
  onRemoveItem,
  onMoveItem,
  onUpdateItem,
  onReorderItems,
  onReorderCategories,
  user,
}) => {
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#FF6B6B");

  // item pool state only for UI
  const [poolItemName, setPoolItemName] = useState("");
  const [poolItemImage, setPoolItemImage] = useState<string | null>(null);

  const POOL_ID = "__POOL__";

  const handleAddCategory = () => {
    if (user && newCategoryName.trim()) {
      onAddCategory(newCategoryName, newCategoryColor, user.name, user.id);
      setNewCategoryName("");
      setNewCategoryColor("#FF6B6B");
      setShowNewCategoryForm(false);
    }
  };

  const handleAddToPool = () => {
    if (!user) return;
    if (!poolItemName.trim()) return;
    onAddItem(
      poolItemName,
      POOL_ID,
      poolItemImage || undefined,
      user.name,
      user.id,
    );
    setPoolItemName("");
    setPoolItemImage(null);
  };

  const handlePoolImageSelect = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPoolItemImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const item = tierList.items.find((i) => i.id === draggableId);
    if (!item || !user) return;

    if (source.droppableId === destination.droppableId) {
      // reorder within same category (including pool)
      onReorderItems(
        source.droppableId,
        source.index,
        destination.index,
        user.name,
        user.id,
      );
    } else {
      // move to another category (or to/from pool) with destination index
      onMoveItem(
        draggableId,
        destination.droppableId,
        destination.index,
        user.name,
        user.id,
      );
    }
  };

  const sortedCategories = [...tierList.categories].sort(
    (a, b) => a.order - b.order,
  );

  // pool items
  const poolItems = tierList.items.filter((it) => it.categoryId === POOL_ID);

  return (
    <div className="tier-list-canvas">
      {tierList.themeImage && (
        <div className="theme-background">
          <img src={tierList.themeImage} alt="Theme" />
        </div>
      )}

      <div className="tier-list-content">
        <div className="tier-list-title">
          <h2>{tierList.name}</h2>
          <p className="tier-list-creator">Criado por {tierList.userName}</p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="pool-area">
            <h3>Banco de Itens</h3>
            <div className="pool-controls">
              <input
                type="text"
                value={poolItemName}
                onChange={(e) => setPoolItemName(e.target.value)}
                placeholder="Nome do personagem..."
                className="form-input"
              />
              <label
                className="btn btn-secondary"
                style={{ cursor: "pointer" }}
              >
                📷 Imagem
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handlePoolImageSelect(e.target.files?.[0])}
                />
              </label>
              <button onClick={handleAddToPool} className="btn btn-primary">
                Adicionar ao Banco
              </button>
            </div>

            <Droppable droppableId={POOL_ID} direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`items-container pool-container ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                >
                  {poolItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`item-wrapper ${snapshot.isDragging ? "dragging" : ""}`}
                        >
                          <ItemCard
                            item={item}
                            onRemove={() =>
                              user && onRemoveItem(item.id, user.name, user.id)
                            }
                            onUpdate={(updates) =>
                              user &&
                              onUpdateItem(item.id, updates, user.name, user.id)
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="tier-list-rows">
            {sortedCategories.map((category) => (
              <Droppable
                key={category.id}
                droppableId={category.id}
                direction="vertical"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`tier-row ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                  >
                    <CategoryRow
                      category={category}
                      onUpdate={(updates) =>
                        user &&
                        onUpdateCategory(
                          category.id,
                          updates,
                          user.name,
                          user.id,
                        )
                      }
                      onRemove={() =>
                        user &&
                        onRemoveCategory(category.id, user.name, user.id)
                      }
                      onAddItem={(name, image) =>
                        user &&
                        onAddItem(name, category.id, image, user.name, user.id)
                      }
                      onMoveUp={() => {
                        if (!user) return;
                        const ordered = sortedCategories.map((c) => c.id);
                        const idx = ordered.indexOf(category.id);
                        if (idx > 0) {
                          const tmp = ordered[idx - 1];
                          ordered[idx - 1] = ordered[idx];
                          ordered[idx] = tmp;
                          onReorderCategories(ordered, user.name, user.id);
                        }
                      }}
                      onMoveDown={() => {
                        if (!user) return;
                        const ordered = sortedCategories.map((c) => c.id);
                        const idx = ordered.indexOf(category.id);
                        if (idx < ordered.length - 1) {
                          const tmp = ordered[idx + 1];
                          ordered[idx + 1] = ordered[idx];
                          ordered[idx] = tmp;
                          onReorderCategories(ordered, user.name, user.id);
                        }
                      }}
                    />

                    <div className="items-container">
                      {tierList.items
                        .filter((item) => item.categoryId === category.id)
                        .map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`item-wrapper ${snapshot.isDragging ? "dragging" : ""}`}
                              >
                                <ItemCard
                                  item={item}
                                  onRemove={() =>
                                    user &&
                                    onRemoveItem(item.id, user.name, user.id)
                                  }
                                  onUpdate={(updates) =>
                                    user &&
                                    onUpdateItem(
                                      item.id,
                                      updates,
                                      user.name,
                                      user.id,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <div className="category-controls">
          {!showNewCategoryForm ? (
            <button
              onClick={() => setShowNewCategoryForm(true)}
              className="btn btn-secondary"
            >
              ➕ Adicionar Categoria
            </button>
          ) : (
            <div className="new-category-form">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nome da categoria..."
                className="form-input"
                autoFocus
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="color-input"
              />
              <button onClick={handleAddCategory} className="btn btn-primary">
                Adicionar
              </button>
              <button
                onClick={() => setShowNewCategoryForm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
