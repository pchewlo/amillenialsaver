import { useState, useRef } from 'react';

const TABS = [
  { key: 'text', label: 'Search by Name' },
  { key: 'url', label: 'Paste URL' },
  { key: 'image', label: 'Upload Photo' },
];

export default function SearchInput({ onSearch, loading, onClear }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textQuery, setTextQuery] = useState('');
  const [urlQuery, setUrlQuery] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (loading) return;

    if (activeTab === 'text' && textQuery.trim()) {
      onSearch('text', textQuery.trim());
    } else if (activeTab === 'url' && urlQuery.trim()) {
      onSearch('url', urlQuery.trim());
    } else if (activeTab === 'image' && imageFile) {
      onSearch('image', null, imageFile);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="search-section">
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => { setActiveTab(tab.key); onClear(); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'text' && (
        <div className="input-area">
          <input
            type="text"
            placeholder="e.g. Dyson Airwrap, Lululemon Align leggings..."
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSubmit} disabled={loading || !textQuery.trim()}>
            Find Dupes
          </button>
        </div>
      )}

      {activeTab === 'url' && (
        <div className="input-area">
          <input
            type="url"
            placeholder="Paste a product URL..."
            value={urlQuery}
            onChange={(e) => setUrlQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSubmit} disabled={loading || !urlQuery.trim()}>
            Find Dupes
          </button>
        </div>
      )}

      {activeTab === 'image' && (
        <div>
          {imagePreview ? (
            <div className="upload-preview">
              <img src={imagePreview} alt="Preview" />
              <div className="file-info">
                <strong>{imageFile.name}</strong>
                <br />
                <span style={{ color: '#888', fontSize: '0.85rem' }}>
                  {(imageFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <button className="remove-btn" onClick={removeImage}>✕</button>
            </div>
          ) : (
            <div
              className={`upload-zone ${dragover ? 'dragover' : ''}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragover(false);
                handleImageSelect(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(e.target.files[0])}
              />
              <p><strong>Drop an image here</strong> or click to browse</p>
              <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Supports JPG, PNG, WebP (max 10MB)</p>
            </div>
          )}
          {imageFile && (
            <button
              className="search-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: 16, width: '100%' }}
            >
              Find Dupes
            </button>
          )}
        </div>
      )}
    </div>
  );
}
