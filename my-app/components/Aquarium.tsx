// components/Aquarium.tsx
'use client';

import React, { useState } from 'react';
import ColorExtractor from './ColorExtractor';
import FishSVG, { RGBColor } from './FishSVG';

const toRgbString = (color: RGBColor): string => 
  `rgb(${color.r}, ${color.g}, ${color.b})`;

// 各魚の情報を保持する型
interface FishData {
  id: string;
  colors: RGBColor[];
  position: { x: number; y: number };
  scale: number;
}

const Aquarium: React.FC = () => {
  const [fishes, setFishes] = useState<FishData[]>([]);
  // 確認待ちの魚の色データと元の画像のURLを保持
  const [pendingFishColors, setPendingFishColors] = useState<RGBColor[] | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

  // ColorExtractorから新しい魚のデータを受け取るハンドラー
  const handleNewFish = (colors: RGBColor[], originalImageUrl: string | null) => {
    if (colors.length < 3) {
      console.warn("3色抽出できませんでした。魚を追加しません。");
      // 抽出に失敗した場合は、一時URLも解放する
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      return;
    }
    
    // リストにすぐ追加せず、確認待ちの状態にセットする
    setPendingFishColors(colors);
    setPendingImageUrl(originalImageUrl);
  };

  // 確認済みの魚を水槽に追加する関数（ボタンクリックで実行）
const addPendingFishToAquarium = () => {
    // ★追加: デバッグログ
    console.log("水槽に入れるボタンがクリックされました。"); 
    
    if (!pendingFishColors || pendingFishColors.length < 3) {
      console.log("エラー: 魚の色データが不正です。"); // 不正な場合のログ
      return;
    }

    const newFish: FishData = {
      id: `fish-${Date.now()}-${fishes.length}`,
      colors: pendingFishColors,
      // ランダムな位置とスケールを生成
      position: { 
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      },
      scale: Math.random() * 0.5 + 0.7,
    };
    
    setFishes((prevFishes) => [...prevFishes, newFish]);
    
    // 追加後、確認待ちの状態をクリアし、URLを解放
    if (pendingImageUrl) {
        URL.revokeObjectURL(pendingImageUrl);
    }
    setPendingFishColors(null);
    setPendingImageUrl(null);
  };

  // キャンセル時のURL解放処理
  const cancelAddFish = () => {
    setPendingFishColors(null);
    if (pendingImageUrl) {
      URL.revokeObjectURL(pendingImageUrl);
    }
    setPendingImageUrl(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full p-4">
      
      <ColorExtractor onExtractColors={handleNewFish} />

      {/* 確認画面（pendingFishColorsが存在する場合に表示） */}
      {(pendingFishColors && pendingFishColors.length >= 3) && (
        <div className="w-full max-w-xl p-6 bg-yellow-50 border-4 border-yellow-300 rounded-xl shadow-2xl z-20 sticky top-4 flex flex-col items-center dark:bg-yellow-950 dark:border-yellow-700">
          <h3 className="text-2xl font-bold text-center mb-4 text-yellow-800 dark:text-yellow-100">
            この魚を水槽に入れますか？ 🐠
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6 w-full">
            {/* 元画像プレビュー */}
            {pendingImageUrl && (
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">元の写真</h4>
                <img 
                  src={pendingImageUrl} 
                  alt="Original" 
                  className="max-w-[150px] max-h-[150px] w-full h-auto object-cover rounded-lg shadow-md border-2 border-gray-400" 
                />
              </div>
            )}

            {/* 抽出された魚のプレビュー */}
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">抽出された魚</h4>
              <div className="w-48 h-auto scale-125">
                <FishSVG colors={pendingFishColors} />
              </div>
            </div>
          </div>
          
          {/* 抽出された色情報の表示（カラーパレット） */}
          <div className="flex justify-center gap-2 mb-6">
              {pendingFishColors.map((color, index) => (
                  <div 
                      key={index} 
                      className="w-8 h-8 rounded-full border border-gray-400 shadow-sm" 
                      style={{ backgroundColor: toRgbString(color) }}
                      title={`R:${color.r}, G:${color.g}, B:${color.b}`}
                  ></div>
              ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addPendingFishToAquarium}
              className="px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors shadow-md"
            >
              水槽に入れる 🚀
            </button>
            <button
              onClick={cancelAddFish}
              className="px-6 py-3 text-lg font-bold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors shadow-md"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 水槽の表示エリア */}
      <div 
        className="relative w-full max-w-2xl h-96 bg-blue-100 border-8 border-blue-300 rounded-2xl shadow-inner overflow-hidden dark:bg-blue-950 dark:border-blue-700"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 100%, #aee1ff, #62a8d1 60%, #3a7caf 100%)' }}
      >
        <h2 className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl font-extrabold text-blue-800 dark:text-blue-200 z-10">
          My Aquarium 🏞️
        </h2>
        {fishes.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-xl text-blue-700 dark:text-blue-300 animate-pulse">
            写真をアップロードして魚を追加しよう！
          </p>
        )}
        {fishes.map((fish) => (
          <div
            key={fish.id}
            className={`absolute fish-${fish.id}`}
            style={{
              left: `${fish.position.x}%`,
              top: `${fish.position.y}%`,
              transform: `translate(-50%, -50%) scale(${fish.scale})`,
              width: '150px',
              height: 'auto',
            }}
          >
            <FishSVG colors={fish.colors} />
          </div>
        ))}
        {/* 魚の泳ぐアニメーションの定義 */}
        <style jsx>{`
          @keyframes swim {
            0% { transform: translateX(0) translateY(0) scale(var(--fish-scale, 1)); }
            25% { transform: translateX(20px) translateY(10px) scale(var(--fish-scale, 1)); }
            50% { transform: translateX(0) translateY(-10px) scale(var(--fish-scale, 1)); }
            75% { transform: translateX(-20px) translateY(5px) scale(var(--fish-scale, 1)); }
            100% { transform: translateX(0) translateY(0) scale(var(--fish-scale, 1)); }
          }
          /* 各魚のscale変数を設定し、アニメーションに反映 */
          ${fishes.map(fish => `
            .fish-${fish.id} {
              --fish-scale: ${fish.scale};
              animation-name: swim;
              animation-duration: ${Math.random() * 10 + 10}s;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              animation-delay: -${Math.random() * 10}s;
            }
          `).join('')}
        `}</style>
      </div>
    </div>
  );
};

export default Aquarium;