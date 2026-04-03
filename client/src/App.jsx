import { useState } from 'react';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import ResultsGrid from './components/ResultsGrid';
import LoadingState from './components/LoadingState';

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (type, query, imageFile) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let res;

      if (type === 'image') {
        const formData = new FormData();
        formData.append('type', 'image');
        formData.append('image', imageFile);
        res = await fetch('/api/dupes', { method: 'POST', body: formData });
      } else {
        res = await fetch('/api/dupes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, query }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <SearchInput onSearch={handleSearch} loading={loading} onClear={() => { setResults(null); setError(null); }} />

      {error && <div className="error">{error}</div>}
      {loading && <LoadingState />}
      {results && <ResultsGrid results={results} />}

      <p className="disclaimer">
        Prices and availability are approximate. Always verify before purchasing.
      </p>
    </div>
  );
}
