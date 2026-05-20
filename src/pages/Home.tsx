import { useState, useEffect } from "react";
import { storage, generateId } from "../utils/storage";
import { TierList, User } from "../types";
import "../styles/Home.css";

type View = "home" | "editor";
interface NavigationData {
  tierListId?: string;
}

interface HomeProps {
  onNavigate: (view: View, data?: NavigationData) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [userName, setUserName] = useState("");
  const [tierListName, setTierListName] = useState("");
  const [themeImage, setThemeImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savedLists, setSavedLists] = useState<TierList[]>([]);

  useEffect(() => {
    setSavedLists(storage.getAllTierLists());
    const u = storage.getUser();
    if (u) setUserName(u.name);
  }, []);

  const handleUserSave = () => {
    if (!userName.trim()) return;
    const user: User = { id: generateId(), name: userName };
    storage.setUser(user);
    setUserName(user.name);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      convertImageToBase64(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file && file.type.startsWith("image/")) {
      convertImageToBase64(file);
    }
  };

  const convertImageToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setThemeImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTierListCreate = (e?: React.FormEvent) => {
    e?.preventDefault();
    const user = storage.getUser();
    if (user && tierListName.trim()) {
      const newTierList: TierList = {
        id: generateId(),
        name: tierListName,
        userName: user.name,
        userId: user.id,
        themeImage: themeImage || undefined,
        categories: [
          { id: generateId(), name: "S", color: "#FF6B6B", order: 0 },
          { id: generateId(), name: "A", color: "#FFA500", order: 1 },
          { id: generateId(), name: "B", color: "#FFD700", order: 2 },
          { id: generateId(), name: "C", color: "#90EE90", order: 3 },
          { id: generateId(), name: "D", color: "#87CEEB", order: 4 },
        ],
        items: [],
        activities: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      storage.saveTierList(newTierList);
      onNavigate("editor", { tierListId: newTierList.id });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Deletar esta tier list?")) return;
    storage.deleteTierList(id);
    setSavedLists(storage.getAllTierLists());
  };

  return (
    <div className="home-container">
      <div className="home-background"></div>

      <div className="home-content">
        <h1 className="home-title">Tier List Creator</h1>

        <div className="home-form">
          <div className="form-group">
            <label>Nome do Usuário</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
            />
            <button onClick={handleUserSave} className="btn btn-primary">
              Salvar
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3>Minhas Tier Lists</h3>
            {savedLists.length === 0 ? (
              <p className="small-text">Nenhuma tier list salva ainda</p>
            ) : (
              <ul>
                {savedLists.map((l) => (
                  <li
                    key={l.id}
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      onClick={() => onNavigate("editor", { tierListId: l.id })}
                    >
                      {l.name}
                    </button>
                    <span className="small-text">
                      Por {l.userName} • {l.items.length} itens
                    </span>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDelete(l.id)}
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            {!showCreate ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
              >
                ➕ Criar Nova Tier List
              </button>
            ) : (
              <form onSubmit={handleTierListCreate}>
                <div className="form-group">
                  <label>Nome da Nova Tier List</label>
                  <input
                    value={tierListName}
                    onChange={(e) => setTierListName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Imagem Temática (Opcional)</label>
                  <div
                    className={`drop-zone ${isDragging ? "dragging" : ""} ${themeImage ? "has-image" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {themeImage ? (
                      <div className="theme-preview">
                        <img src={themeImage} alt="Theme preview" />
                        <button
                          type="button"
                          onClick={() => setThemeImage(null)}
                          className="btn-remove"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="drop-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>Arraste e solte a imagem aqui</p>
                        <p className="small-text">ou clique para selecionar</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="file-input"
                          style={{ display: "none" }}
                          onClick={(e) => e.currentTarget.click()}
                        />
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input-hidden"
                    style={{ display: "none" }}
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="file-label">
                    Selecionar arquivo
                  </label>
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
