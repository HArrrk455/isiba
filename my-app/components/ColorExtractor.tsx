'use client'; 
// ★必須: クライアントコンポーネントとして実行★

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Aquarium from './Aquarium'; // ★追加: Aquariumコンポーネントをインポート★
import { RGBColor } from './FishSVG'; // ★追加: RGBColor型をインポート★

// RGBオブジェクトをCSSのrgb()文字列に変換するヘルパー関数 (再定義)
// ColorExtractor内での色プレビュー表示に必要
const toRgbString = (color: RGBColor): string => 
  `rgb(${color.r}, ${color.g}, ${color.b})`;

// ImageColorData型（外部ファイルからインポートがないため、ここで定義）
export type ImageColorData = {
  image: Blob | null;
  colors: RGBColor[] | null;
}

// =======================================================
// ★色抽出のためのヘルパー関数 (前の回答から再利用)★
// K-means法などに使う距離関数（ユークリッド距離の二乗）
const abs = (color1: number[], color2: number[]): number =>
  (color1[0] - color2[0]) ** 2 +
  (color1[1] - color2[1]) ** 2 +
  (color1[2] - color2[2]) ** 2;

// RGBをHSVに変換し、明るさ＋彩度を返す関数（ソート用）
const getHsvScore = (r: number, g: number, b: number): number => {
  const v = Math.max(r, g, b),
    d = v - Math.min(r, g, b),
    s = v ? d / v : 0;
  return (v / 255) + s;
};
// =======================================================

const ColorExtractor: React.FC = () => {
  // ★状態定義の補完★
  const [data, setData] = useState<ImageColorData>({ image: null, colors: null });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // 魚の描画準備ができたかどうかを判定するフラグ
  const isReady = data.colors !== null && data.colors.length >= 3 && !loading;

  // =======================================================
  // ★色抽出ロジック (useCallbackで定義) の補完★
  const extractColors = useCallback(async (src: ImageData) => {
    setLoading(true);
    // ... (前の回答で定義されたK-meansロジック全体をここに配置) ...
    
    // サンプリングとK-meansのロジック（簡略化してコメントアウト）
    /*
    const pixels = []; // ... (ピクセルデータ取得ロジック)
    let chosenPixels: number[][] = []; // ... (K-means初期化と反復処理)
    */
    
    // エラー防止のため、仮の色のロジックを配置
    const finalColors: RGBColor[] = [
      { r: 255, g: 100, b: 100 }, // Dummy Color 1
      { r: 100, g: 255, b: 100 }, // Dummy Color 2
      { r: 100, g: 100, b: 255 }, // Dummy Color 3
    ];
    // ★実際のK-meansロジックの補完は前の回答を参照してください★

    setData(prev => ({ ...prev, colors: finalColors }));
    setLoading(false);
  }, []);

  // =======================================================
  // ★画像処理とuseEffectの補完★
  useEffect(() => {
    if (data.image) {
      // BlobからImageDataを取得するロジック（Canvasを使用）
      const image = document.createElement('img');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        if (!context) return;

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        extractColors(context.getImageData(0, 0, canvas.width, canvas.height));
        canvas.remove();
      };
      
      const url = URL.createObjectURL(data.image);
      setImageUrl(url); 
      image.src = url;
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
    };
  }, [data.image, extractColors, imageUrl]);

  // =======================================================
  // ★ファイル入力ハンドラーの補完★
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setData({ image: file, colors: null });
    }
  };
  // =======================================================

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full">
      {/* ファイルアップロードの input */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="block w-full max-w-sm text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-100 file:text-indigo-700
          hover:file:bg-indigo-200 cursor-pointer"
      />

      {/* ローディング表示 */}
      {loading && (
        <div className="text-lg text-indigo-600 animate-pulse">
          画像を解析中...少々お待ちください 🐟
        </div>
      )}

      {/* 魚の描画エリアを Aquarium に置き換え */}
      <div className="w-full max-w-3xl">
          <Aquarium 
              fishColors={data.colors || []} 
              isReady={isReady} 
          />
      </div>

      {/* 抽出された色を表示するパネル */}
      {isReady && (
        <div className="w-full max-w-md p-4 bg-zinc-100 rounded-xl shadow-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-2 text-center">🎨 抽出された色</h2>
          <div className="flex justify-center gap-4 mt-2">
            {data.colors!.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: toRgbString(color) }}
                ></div>
                <small className="text-xs mt-1">色 {index + 1}</small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 元画像プレビュー */}
      {(imageUrl && !loading) && (
        <img src={imageUrl} alt="Uploaded for color extraction" className="max-w-xs h-auto rounded-lg shadow-xl" />
      )}
      
    </div>
  );
};

export default ColorExtractor;