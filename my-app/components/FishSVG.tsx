// components/FishSVG.tsx
import React from 'react';

export type RGBColor = { r: number; g: number; b: number };

interface FishSVGProps {
  colors: RGBColor[];
  fishId?: string; 
}

const toRgbString = (color: RGBColor): string => {
  // 念のため、色が有効な数値か確認
  if (color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number') {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
  }
  return 'rgb(0, 0, 0)'; // 不正な場合はデフォルトで黒
};

const FishSVG: React.FC<FishSVGProps> = ({ colors, fishId = 'default' }) => {
  
  // 抽出された3色を取得。不足があればデフォルト色を使用
  // デフォルト色をより明確なものに設定し、テストしやすくする
  const gradColor1 = colors[0] ? toRgbString(colors[0]) : 'rgb(255, 0, 0)';   // デフォルト: 赤
  const gradColor2 = colors[1] ? toRgbString(colors[1]) : 'rgb(0, 255, 0)';   // デフォルト: 緑
  const gradColor3 = colors[2] ? toRgbString(colors[2]) : 'rgb(0, 0, 255)';   // デフォルト: 青

  // デバッグ用: 実際にどのような色が生成されているかコンソールで確認
  console.log(`FishID: ${fishId}, Colors: C1=${gradColor1}, C2=${gradColor2}, C3=${gradColor3}`);


  // グラデーション用のユニークなIDを生成
  const bodyGradId = `fishBodyGradient-${fishId}`;
  const tailGradId = `tailFinGradient-${fishId}`;
  
  // 1. 魚の胴体（尾びれの付け根まで）のパスデータ
  const bodyPath = `
    M 10 50 
    C 30 20, 120 20, 140 50 
    C 120 80, 30 80, 10 50 Z
  `;
  
  // 2. 尾びれ（三角形）のパスデータ
  const tailFinPath = `
    M 140 50
    L 160 40
    L 190 50
    L 160 60
    Z
  `;

  // パスデータに合わせて viewBox を設定
  const viewBox = "0 0 200 100";

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox={viewBox} 
      width="100%" 
      height="auto"
      className="max-w-xs md:max-w-md"
      // SVG自体にfillを指定すると全ての色を上書きしてしまうので注意
      // style={{ overflow: 'visible' }} 
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
        fill={`url(#${bodyGradId})`} 
        // stroke と strokeWidth はそのまま
        stroke="black"
        strokeWidth="2" 
        d={bodyPath} 
      />

      {/* 2. 尾びれ（尾びれ用グラデーション適用） */}
      <path 
        fill={`url(#${tailGradId})`} 
        // stroke と strokeWidth はそのまま
        stroke="black"
        strokeWidth="2" 
        d={tailFinPath} 
      />
    </svg>
  );
};

export default FishSVG;