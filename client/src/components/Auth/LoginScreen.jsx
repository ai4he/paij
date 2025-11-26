import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function LoginScreen() {
  const { login, register } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(pin);
    } catch (err) {
      setError(err.message || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePin = async () => {
    setLoading(true);
    setError('');

    try {
      const userData = await register();
      alert(`Your new PIN is: ${userData.pin}\nPlease save this PIN to log in again.`);
    } catch (err) {
      setError(err.message || 'Failed to generate PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            AI Journal
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Enter your 4-digit PIN to continue
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="Enter PIN"
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl tracking-widest focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={loading}
              autoFocus
            />

            {error && (
              <p className="mb-4 text-center text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || pin.length !== 4}
              className="mb-3 w-full rounded-md bg-primary-600 py-3 font-medium text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleGeneratePin}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Generate New PIN
          </button>
        </div>
      </div>
    </div>
  );
}
