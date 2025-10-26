'use client'; 
import React, { useState } from 'react';
import FishSVG, { RGBColor } from './FishSVG'; 
// FishSVGをインポート

interface AquariumProps {
  // ColorExtractorから受け取る色データ
  fishColors: RGBColor[];
  isReady: boolean;
}

const Aquarium: React.FC<AquariumProps> = ({ fishColors, isReady }) => {
  // 魚が左右に反転するために必要（CSSクラスを切り替える）
  const [isFlipped, setIsFlipped] = useState(false);

  // 魚が画面端に達するたびに反転させるロジックをシミュレーションするため
  // 実際にはCSSアニメーションの終了を監視する必要がありますが、ここでは簡略化
  React.useEffect(() => {
    if (isReady) {
      const interval = setInterval(() => {
        setIsFlipped(prev => !prev);
      }, 5000); // 5秒ごとに左右反転 (アニメーションの所要時間と合わせる)
      return () => clearInterval(interval);
    }
  }, [isReady]);

  return (
    // 水槽のコンテナ
    <div className="aquarium-container">
      
      {/* 魚のコンポーネント */}
      <div 
        className={`
          fish-wrapper 
          ${isReady ? 'animate-swim' : ''} 
          ${isFlipped ? 'flipped' : ''}
        `}
        style={{ opacity: isReady ? 1 : 0 }}
      >
        <FishSVG colors={fishColors} />
      </div>

      {/* 水槽のデコレーション（水面、泡など） */}
      <div className="water-surface"></div>
      
      {/* 魚がまだ生成されていない場合のプレースホルダー */}
      {!isReady && (
        <p className="placeholder-text">画像をアップロードして魚を生成してください。</p>
      )}
    </div>
  );
};

export default Aquarium;