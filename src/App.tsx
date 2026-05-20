import { useState } from "react";
import { Home } from "./pages/Home";
import { Editor } from "./pages/Editor";
import "./App.css";

type View = "home" | "editor";

interface NavigationData {
  tierListId?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [navigationData, setNavigationData] = useState<NavigationData>({});

  const handleNavigate = (view: View, data?: NavigationData) => {
    setCurrentView(view);
    if (data) {
      setNavigationData(data);
    }
  };

  return (
    <div className="app">
      {currentView === "home" && <Home onNavigate={handleNavigate} />}
      {currentView === "editor" && navigationData.tierListId && (
        <Editor
          tierListId={navigationData.tierListId}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
