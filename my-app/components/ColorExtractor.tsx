// components/ColorExtractor.tsx
'use client'; // 状態とuseEffectを使用するためクライアントコンポーネントにする

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import FishSVG, { RGBColor } from './FishSVG';

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
  return (v / 255) + s; // 明度(V)と彩度(S)の合計をスコアとする
};

// RGBオブジェクトをCSSのrgb()文字列に変換するヘルパー関数 (再利用)
const toRgbString = (color: RGBColor): string => 
  `rgb(${color.r}, ${color.g}, ${color.b})`;

export type ImageColorData = {
  image: Blob | null;
  colors: RGBColor[] | null;
}

const ColorExtractor: React.FC = () => {
  const [data, setData] = useState<ImageColorData>({ image: null, colors: null });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 画像から色を抽出するメインロジック
  const extractColors = useCallback(async (src: ImageData) => {
    setLoading(true);
    const pixels = [];
    // 4ピクセルごとのサンプリングでピクセルデータを収集
    for (let x = 0; x < src.width; x += 4) {
      for (let y = 0; y < src.height; y += 4) {
        const i = (y * src.width + x) * 4;
        const r = src.data[i + 0];
        const g = src.data[i + 1];
        const b = src.data[i + 2];
        pixels.push([r, g, b]);
      }
    }

    // K-means初期化: ランダムに12個の代表色を選択
    let chosenPixels: number[][] = [];
    const candidates = [...pixels];
    for (let i = 0; i < 12 && candidates.length > 0; i++) {
      const arrayIndex = Math.floor(Math.random() * candidates.length);
      chosenPixels.push(candidates[arrayIndex]);
      candidates.splice(arrayIndex, 1);
    }

    // K-means法の反復処理 (100回)
    for (let loop = 0; loop < 100; loop++) {
      const groupIndexes: number[] = [];
      for (const pixel of pixels) {
        const distances = [];
        for (const chosenPixel of chosenPixels) {
          distances.push(abs(pixel, chosenPixel));
        }
        groupIndexes.push(distances.indexOf(Math.min(...distances)));
      }

      const groupIndexCount = [...Array(chosenPixels.length)].map(
        (_, i) => groupIndexes.filter((x) => x === i).length
      );

      let newChosenPixels = [...Array(chosenPixels.length)].map((_) => [0, 0, 0]);

      for (let i = 0; i < pixels.length; i++) {
        const groupIndex = groupIndexes[i];
        if (groupIndexCount[groupIndex] > 0) {
          newChosenPixels[groupIndex][0] += pixels[i][0] / groupIndexCount[groupIndex];
          newChosenPixels[groupIndex][1] += pixels[i][1] / groupIndexCount[groupIndex];
          newChosenPixels[groupIndex][2] += pixels[i][2] / groupIndexCount[groupIndex];
        }
      }
      chosenPixels = newChosenPixels;
    }

    // 明るさ+彩度のスコアでソートし、上位3色を選択
    const finalColors: RGBColor[] = chosenPixels
      .filter(color => color.every(c => !isNaN(c))) 
      .sort((a, b) => {
        const scoreA = getHsvScore(a[0], a[1], a[2]);
        const scoreB = getHsvScore(b[0], b[1], b[2]);
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map((color) => ({
        r: Math.round(color[0]),
        g: Math.round(color[1]),
        b: Math.round(color[2]),
      }));
      
    setData(prev => ({ ...prev, colors: finalColors }));
    setLoading(false);
  }, []);

  // data.image が更新されたときに色抽出プロセスを実行
  useEffect(() => {
    if (data.image) {
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
    // クリーンアップ関数
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
    };
  }, [data.image, extractColors]);

  // ファイル入力のハンドラー
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setData({ image: file, colors: null });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full">
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
      
      {loading && (
        <div className="text-lg text-indigo-600 animate-pulse">
          画像を解析中...少々お待ちください 🐟
        </div>
      )}

      {(imageUrl && !loading) && (
        <div className="flex flex-col items-center gap-6 w-full">
          {/* 魚のSVGを描画 */}
          {data.colors && data.colors.length >= 3 ? (
            <div className="w-full max-w-md bg-zinc-100 p-4 rounded-xl shadow-xl border border-gray-200">
              <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-800">
                🎨 カラーリング結果
              </h2>
              <FishSVG colors={data.colors} />
              
              {/* 抽出された色を表示 */}
              <div className="flex justify-center gap-4 mt-6">
                {data.colors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full border-4 border-white shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: toRgbString(color) }}
                      title={`R:${color.r}, G:${color.g}, B:${color.b}`}
                    ></div>
                    <small className="text-sm mt-2 font-medium text-gray-600">色 {index + 1}</small>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">色抽出に問題が発生しました。別の画像を試してください。</p>
            </div>
          )}

          {/* 元画像プレビュー */}
          <h2 className="text-xl font-bold mt-8 text-gray-700">📸 元画像プレビュー</h2>
          <img src={imageUrl} alt="Uploaded for color extraction" className="max-w-xs h-auto rounded-lg shadow-xl border border-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ColorExtractor;