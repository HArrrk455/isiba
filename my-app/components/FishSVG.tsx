// components/FishSVG.tsx
import React from 'react';

export type RGBColor = { r: number; g: number; b: number };

interface FishSVGProps {
  colors: RGBColor[];
  fishId?: string; // ★修正: fishId を受け取る
}

const toRgbString = (color: RGBColor): string => {
  if (color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number') {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
  }
  return 'rgb(0, 0, 0)'; 
};

const FishSVG: React.FC<FishSVGProps> = ({ colors, fishId = 'default' }) => {
  // 抽出された3色を取得。
  const gradColor1 = colors[0] ? toRgbString(colors[0]) : 'rgb(255, 0, 0)';
  const gradColor2 = colors[1] ? toRgbString(colors[1]) : 'rgb(0, 255, 0)';
  const gradColor3 = colors[2] ? toRgbString(colors[2]) : 'rgb(0, 0, 255)'; 

  // ★修正: ユニークなIDを生成
  const bodyGradId = `fishBodyGradient-${fishId}`;
  const tailGradId = `tailFinGradient-${fishId}`;

  // 1. 魚の胴体（パスデータ）
  const bodyPath = `
    M 10 50 
    C 30 20, 120 20, 140 50 
    C 120 80, 30 80, 10 50 Z
  `;
  
  // 2. 尾びれ（パスデータ）
  const tailFinPath = `
    M 140 50
    L 160 40
    L 190 50
    L 160 60
    Z
  `;

  const viewBox = "0 0 200 100";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox={viewBox} 
      width="100%" 
      height="auto"
      className="max-w-xs md:max-w-md"
    >
      <defs>
        {/* 線形グラデーションの定義: 胴体用 */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: gradColor1, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: gradColor2, stopOpacity: 1 }} />
        </linearGradient>
        
        {/* 尾びれ用のグラデーション */}
        <linearGradient id={tailGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: gradColor2, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: gradColor3, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* 1. 胴体（グラデーション適用） */}
      <path 
        fill={`url(#${bodyGradId})`} // ユニークなIDを適用
        stroke="black"
        strokeWidth="2" 
        d={bodyPath} 
      />

      {/* 2. 尾びれ（尾びれ用グラデーション適用） */}
      <path 
        fill={`url(#${tailGradId})`} // ユニークなIDを適用
        stroke="black"
        strokeWidth="2" 
        d={tailFinPath} 
      />
    
    </svg>
  );
};

export default FishSVG;