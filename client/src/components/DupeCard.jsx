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

        <div className="card-price-row">
          <span className="card-price">{dupe.priceRange}</span>
          {dupe.savingsPercent > 0 && (
            <span className="savings-pill">Save ~{dupe.savingsPercent}%</span>
          )}
        </div>

        {dupe.similarities && dupe.similarities.length > 0 && (
          <div className="card-similarities">
            <span className="card-section-label">Why it's a dupe</span>
            <ul>
              {dupe.similarities.map((s, i) => (
                <li key={i}><span className="check-icon">&#10003;</span> {s}</li>
              ))}
            </ul>
          </div>
        )}

        {dupe.differences && dupe.differences.length > 0 && (
          <div className="card-differences">
            <span className="card-section-label">Worth knowing</span>
            <ul>
              {dupe.differences.map((d, i) => (
                <li key={i}><span className="diff-icon">&#8226;</span> {d}</li>
              ))}
            </ul>
          </div>
        )}

        {dupe.verdict && (
          <div className="card-verdict">{dupe.verdict}</div>
        )}

        {/* Fallback for old-format responses */}
        {!dupe.similarities && dupe.reasonItsDupe && (
          <p className="card-reason">{dupe.reasonItsDupe}</p>
        )}

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
