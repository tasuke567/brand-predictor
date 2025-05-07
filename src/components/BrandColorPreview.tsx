// src/components/BrandColorPreview.tsx
import { brandThemes } from "../utils/brandThemes";
import "../styles/BrandColorPreview.css"; // Adjust the path as necessary

const BrandColorPreview = () => {
  return (
    <div className="brand-color-preview">
      {Object.entries(brandThemes).map(([brand, theme]) => (
        brand !== "default" && (
          <div key={brand} className="brand-bubble">
            <div
              className="bubble-circle"
              style={{ backgroundColor: theme.primary }}
            ></div>
            <span className="bubble-label">{brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
          </div>
        )
      ))}
    </div>
  );
};

export default BrandColorPreview;
