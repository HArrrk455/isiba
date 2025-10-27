// my-app/components/FishSVG.tsx
// このファイル名はすでに存在している場合があるので、既存のものがあればそれを更新するか、
// なければ新規作成してください。

import React from 'react';

// 魚のシルエットとグラデーションのSVG
const FishSVG: React.FC<{ size?: number; fill?: string }> = ({ size = 50, fill }) => {
  // fill propが指定された場合はその色を使い、指定がなければグラデーションを使用
  const fishFill = fill ? fill : 'url(#fishGradientBasic)';

  return (
    <svg 
      width={size} 
      height={size * 0.5} // 縦横比を調整
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }} // レイアウト調整
    >
      <path 
        d="M10 25 C 40 10, 80 10, 90 25 L 100 20 L 90 25 L 100 30 Z" 
        style={{ fill: fishFill }}
      />
      <path 
        d="M90 25 L 100 20 L 100 30 Z" 
        style={{ fill: fill ? fill : '#FFF0D0' }} // 尾びれもfillを適用
      />
      
      {/* デフォルトのグラデーション定義 */}
      {!fill && (
        <defs>
          <linearGradient id="fishGradientBasic" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{stopColor: "#C6A0D5"}} />
            <stop offset="50%" style={{stopColor: "#F0C0D0"}} />
            <stop offset="100%" style={{stopColor: "#FFF0D0"}} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};

export default FishSVG;