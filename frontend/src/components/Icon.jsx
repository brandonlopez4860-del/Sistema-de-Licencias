import React from 'react';

export default function Icon({ path, viewBox = "0 0 24 24", fill = "none", className = "panel-icon" }) {
  return (
    <svg viewBox={viewBox} fill={fill} stroke="currentColor" strokeWidth="1.5" className={className}>
      {path}
    </svg>
  );
}