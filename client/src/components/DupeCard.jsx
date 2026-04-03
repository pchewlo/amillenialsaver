import { useState } from 'react';

export default function DupeCard({ dupe }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = `/api/image?q=${encodeURIComponent(dupe.imageSearchQuery)}`;

  return (
    <div className="dupe-card">
      <div className="card-image">
        {!imgError ? (
          <img
            src={imgSrc}
            alt={dupe.name}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="card-image-fallback">
            {dupe.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-header">
          <span className="card-name">{dupe.name}</span>
          <span className="score-badge">{dupe.similarityScore}% match</span>
        </div>
        <div className="card-price">{dupe.priceRange}</div>
        <p className="card-reason">{dupe.reasonItsDupe}</p>
        <div className="card-stores">
          {dupe.whereToBuy.map((store) => (
            <a
              key={store}
              className="store-link"
              href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(dupe.name + ' ' + store)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {store}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
