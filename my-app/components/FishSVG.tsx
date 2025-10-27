// components/FishSVG.tsx
import React from 'react';

export type RGBColor = { r: number; g: number; b: number };

interface FishSVGProps {
  colors: RGBColor[];
}

const toRgbString = (color: RGBColor): string =>
  `rgb(${color.r}, ${color.g}, ${color.b})`;

const FishSVG: React.FC<FishSVGProps> = ({ colors }) => {
  // 抽出された3色を取得。
  const gradColor1 = colors[0] ? toRgbString(colors[0]) : 'rgb(0, 150, 250)'; // 頭部の色
  const gradColor2 = colors[1] ? toRgbString(colors[1]) : 'rgb(50, 200, 100)'; // 胴体の色 (ヒレの単色も兼ねる)
  const gradColor3 = colors[2] ? toRgbString(colors[2]) : 'rgb(255, 150, 0)';  // 尾びれの色

  // ★新しいシンプルな魚のシルエットパスデータ★
  // M 始点, C 制御点1, 制御点2, 終点
  const fish1 = `
    M 10 50 
    C 80 -10, 150 40, 150 50     
    C 95 100, 50 80, 10 50       
    M 130 50 
    C 145 60, 215 -40, 170 50 
    C 170 60, 205 120, 140 50 Z
  `;

  // 2. 尾びれ（三角形）
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
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* 線形グラデーションの定義: 左から右へ色を変化させる (胴体用) */}
        <linearGradient id="fishBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          {/* 胴体のグラデーションは Color 1 (頭) と Color 2 (胴体) を使用 */}
          <stop offset="0%" style={{ stopColor: gradColor1, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: gradColor2, stopOpacity: 1 }} />
        </linearGradient>

        {/* 尾びれ用のグラデーション (Color 2 と Color 3 の間で変化させる) */}
        <linearGradient id="tailFinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: gradColor2, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: gradColor3, stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* 1. 胴体（グラデーション適用） */}
      <path
        fill="url(#fishBodyGradient)" // 胴体グラデーションを適用
        stroke="black"
        strokeWidth="2"
        d={fish1}
      />

      {/* 2. 尾びれ（尾びれ用グラデーション適用） */}
      <path
        fill="url(#fishGradient)" // グラデーションを適用
        stroke="none"
        strokeWidth="2" // シンプルな viewBox に合わせて線の太さも細くします
        d={fish1}
        id="fish-silhouette"
      />

    </svg>
  );
};

export default FishSVG;