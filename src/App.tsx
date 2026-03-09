import { useEditorStore } from './store/editorStore';
import { Sidebar } from './components/editor/Sidebar';
import { Editor } from './components/editor/Editor';
import { RightPanel } from './components/panels/RightPanel';
import { CommandPalette } from './components/panels/CommandPalette';
import { CreateThemeModal } from './components/panels/CreateThemeModal';
import { DashboardView } from './components/views/DashboardView';
import { FlashcardsView } from './components/views/FlashcardsView';
import { SettingsView } from './components/views/SettingsView';

function App() {
  const { sidebarOpen, activeView } = useEditorStore();

  const renderMainContent = () => {
    switch (activeView) {
      case 'notes':
        return <Editor />;
      case 'dashboard':
        return <DashboardView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Editor />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main
        className="flex-1 min-w-0 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {renderMainContent()}
      </main>

      {/* Right Panel */}
      <RightPanel />

      {/* Command Palette */}
      <CommandPalette />

      {/* Create Theme Modal */}
      <CreateThemeModal />
    </div>
  );
}

export default App;
