import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Layout/Header';
import { LoginScreen } from './components/Auth/LoginScreen';
import { WriteTab } from './components/Write/WriteTab';
import { HistoryTab } from './components/History/HistoryTab';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/write" replace />} />
          <Route path="/write" element={<WriteTab />} />
          <Route path="/history" element={<HistoryTab />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
