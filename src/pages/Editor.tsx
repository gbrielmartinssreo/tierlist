import { useState, useRef, useEffect } from "react";
import { TierList } from "../types";
import { storage } from "../utils/storage";
import { exportToPNG, exportToPDF, exportToJSON } from "../utils/export";
import { useTierList } from "../hooks/useTierList";
import { TierListCanvas } from "../components/TierListCanvas";
import { ActivityPanel } from "../components/ActivityPanel";
import { SavedListsPanel } from "../components/SavedListsPanel";
import "../styles/Editor.css";

type View = "home" | "editor";
interface NavigationData {
  tierListId?: string;
}

interface EditorProps {
  tierListId: string;
  onNavigate: (view: View, data?: NavigationData) => void;
}

export const Editor: React.FC<EditorProps> = ({ tierListId, onNavigate }) => {
  const tierListData = storage.getTierList(tierListId);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showSavedLists, setShowSavedLists] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!tierListData) {
    return (
      <div className="editor-error">
        <h2>Tier list não encontrada</h2>
        <button onClick={() => onNavigate("home")} className="btn btn-primary">
          Voltar
        </button>
      </div>
    );
  }

  const {
    tierList,
    setTierList,
    addActivity,
    addCategory,
    removeCategory,
    updateCategory,
    addItem,
    removeItem,
    moveItem,
    updateItem,
    reorderCategories,
    reorderItems,
  } = useTierList(tierListData);

  const user = storage.getUser();

  const handleSave = () => {
    storage.saveTierList(tierList);
  };

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    setExportLoading(true);
    try {
      await exportToPNG(canvasRef.current, tierList.name);
    } catch (error) {
      alert("Erro ao exportar para PNG");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setExportLoading(true);
    try {
      await exportToPDF(canvasRef.current, tierList.name);
    } catch (error) {
      alert("Erro ao exportar para PDF");
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(tierList, tierList.name);
    } catch (error) {
      alert("Erro ao exportar para JSON");
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportJSON = async (file?: File) => {
    if (!file) return;
    try {
      const data = await import("../utils/export").then((m) =>
        m.importFromJSON(file),
      );
      // basic validation
      const obj = data as any;
      if (obj && obj.id && obj.name && obj.categories && obj.items) {
        // ensure id uniqueness
        const newId = obj.id || Math.random().toString(36).slice(2, 11);
        obj.id = newId;
        storage.saveTierList(obj);
        onNavigate("editor", { tierListId: obj.id });
      } else {
        alert("Arquivo JSON inválido");
      }
    } catch (e) {
      alert("Erro ao importar JSON");
    }
  };

  useEffect(() => {
    // auto-save with debounce
    const t = setTimeout(() => {
      handleSave();
    }, 1000);
    return () => clearTimeout(t);
  }, [tierList]);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-left">
          <h1>{tierList.name}</h1>
          <p className="user-info">Por {tierList.userName}</p>
        </div>

        <div className="header-right">
          <button
            onClick={() => {
              handleSave();
              setShowSavedLists(!showSavedLists);
            }}
            className="btn btn-secondary"
            title="Minhas tier lists"
          >
            📋 Salvas
          </button>

          <button
            onClick={() => setShowActivityPanel(!showActivityPanel)}
            className="btn btn-secondary"
            title="Atividades"
          >
            📝 Atividades ({tierList.activities.length})
          </button>

          <div className="export-dropdown">
            <button className="btn btn-success">⬇️ Exportar</button>
            <div className="dropdown-menu">
              <button onClick={handleExportPNG} disabled={exportLoading}>
                📷 PNG
              </button>
              <button onClick={handleExportPDF} disabled={exportLoading}>
                📄 PDF
              </button>
              <button onClick={handleExportJSON}>📋 JSON</button>
            </div>
          </div>

          <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
            📥 Importar
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => handleImportJSON(e.target.files?.[0])}
            />
          </label>

          <button
            onClick={() => {
              handleSave();
              onNavigate("home");
            }}
            className="btn btn-secondary"
          >
            🏠 Home
          </button>
        </div>
      </div>

      <div className="editor-main">
        <div className="editor-canvas-wrapper">
          <div ref={canvasRef} className="tier-list-wrapper">
            <TierListCanvas
              tierList={tierList}
              onAddCategory={addCategory}
              onRemoveCategory={removeCategory}
              onUpdateCategory={updateCategory}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onMoveItem={moveItem}
              onUpdateItem={updateItem}
              onReorderItems={reorderItems}
              onReorderCategories={reorderCategories}
              user={user}
            />
          </div>
        </div>

        {showActivityPanel && (
          <ActivityPanel activities={tierList.activities} />
        )}

        {showSavedLists && (
          <SavedListsPanel
            onSelect={(id) => {
              handleSave();
              onNavigate("editor", { tierListId: id });
              setShowSavedLists(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
