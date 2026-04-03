import { useState } from 'react';
import DupeCard from './DupeCard';

export default function ResultsGrid({ results }) {
  const { originalProduct, dupes } = results;
  const [imgError, setImgError] = useState(false);
  const imgSrc = `/api/image?q=${encodeURIComponent(originalProduct.name)}`;

  return (
    <div className="results">
      <div className="original-product">
        <div className="original-product-left">
          <div className="original-image">
            {!imgError ? (
              <img
                src={imgSrc}
                alt={originalProduct.name}
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className="original-image-fallback">
                {originalProduct.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="label">Original Product</div>
            <div className="name">{originalProduct.name}</div>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>{originalProduct.category}</span>
          </div>
        </div>
        <div className="price">{originalProduct.estimatedPrice}</div>
      </div>

      <div className="dupes-grid">
        {dupes.map((dupe, i) => (
          <DupeCard key={i} dupe={dupe} />
        ))}
      </div>
    </div>
  );
}
