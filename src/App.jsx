import useAppStore from './store';
import Home from './pages/Home';
import MatchRoom from './pages/MatchRoom';
import PlayerEditor from './pages/PlayerEditor';

function App() {
  const currentView = useAppStore((state) => state.currentView);

  return (
    <>
      {currentView === 'home' && <Home />}
      {currentView === 'editor' && <PlayerEditor />}
      {currentView === 'matchRoom' && <MatchRoom />}
    </>
  );
}

export default App;
