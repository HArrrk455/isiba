// components/ColorExtractor.tsx
'use client';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { RGBColor } from './FishSVG'; 

// K-means法などに使う距離関数（ユークリッド距離の二乗）
const abs = (color1: number[], color2: number[]): number =>
  (color1[0] - color2[0]) ** 2 + (color1[1] - color2[1]) ** 2 + (color1[2] - color2[2]) ** 2;

// RGBをHSVに変換し、明るさ＋彩度を返す関数（ソート用）
const getHsvScore = (r: number, g: number, b: number): number => {
  const v = Math.max(r, g, b),
    d = v - Math.min(r, g, b),
    s = v ? d / v : 0;
  return (v / 255) + s;
};

export type ImageColorData = { image: Blob | null; colors: RGBColor[] | null; }

interface ColorExtractorProps { 
  // ★修正: 抽出した色と元の画像URLを親に渡す
  onExtractColors: (colors: RGBColor[], originalImageUrl: string | null) => void; 
}

const ColorExtractor: React.FC<ColorExtractorProps> = ({ onExtractColors }) => {
  const [data, setData] = useState<ImageColorData>({ image: null, colors: null });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const extractColors = useCallback(async (src: ImageData, currentImageUrl: string | null) => { 
    setLoading(true);
    const pixels: number[][] = [];
    // 4ピクセルごとのサンプリングでピクセルデータを収集
    for (let x = 0; x < src.width; x += 4) {
      for (let y = 0; y < src.height; y += 4) {
        const i = (y * src.width + x) * 4;
        pixels.push([src.data[i + 0], src.data[i + 1], src.data[i + 2]]);
      }
    }

    // K-means初期化
    let chosenPixels: number[][] = [];
    const candidates = [...pixels];
    for (let i = 0; i < 12 && candidates.length > 0; i++) {
      const arrayIndex = Math.floor(Math.random() * candidates.length);
      chosenPixels.push(candidates[arrayIndex]);
      candidates.splice(arrayIndex, 1);
    }

    // K-means法の反復処理 (100回)
    for (let loop = 0; loop < 100; loop++) {
      // 1. 各ピクセルを最も近いセントロイドに割り当て
      const groupIndexes: number[] = []; 
      for (const pixel of pixels) {
        const distances = [];
        for (const chosenPixel of chosenPixels) {
          distances.push(abs(pixel, chosenPixel));
        }
        groupIndexes.push(distances.indexOf(Math.min(...distances)));
      }

      // 2. 新しいセントロイドの計算 (0除算回避ロジック)
      let newChosenPixels: number[][] = [...Array(chosenPixels.length)].map((_) => [0, 0, 0]);
      let assignedCount: number[] = [...Array(chosenPixels.length)].fill(0);

      for (let i = 0; i < pixels.length; i++) {
        const groupIndex = groupIndexes[i]; 
        
        newChosenPixels[groupIndex][0] += pixels[i][0];
        newChosenPixels[groupIndex][1] += pixels[i][1];
        newChosenPixels[groupIndex][2] += pixels[i][2];
        assignedCount[groupIndex]++;
      }
      
      let nextChosenPixels: number[][] = [];

      for (let i = 0; i < chosenPixels.length; i++) {
        if (assignedCount[i] > 0) {
          // 割り当てがあった場合: 平均を計算
          const newR = newChosenPixels[i][0] / assignedCount[i];
          const newG = newChosenPixels[i][1] / assignedCount[i];
          const newB = newChosenPixels[i][2] / assignedCount[i];
          nextChosenPixels.push([newR, newG, newB]);
        } else {
          // 割り当てがなかった場合: 前回のセントロイドを維持
          nextChosenPixels.push(chosenPixels[i]);
        }
      }
      chosenPixels = nextChosenPixels;
    }

    const finalColors: RGBColor[] = chosenPixels 
      .filter(color => color.every(c => !isNaN(c))) 
      .sort((a, b) => getHsvScore(b[0], b[1], b[2]) - getHsvScore(a[0], a[1], a[2]))
      .slice(0, 3)
      .map((color) => ({ r: Math.round(color[0]), g: Math.round(color[1]), b: Math.round(color[2]), }));
      
    if (finalColors.length >= 3) {
      onExtractColors(finalColors, currentImageUrl); 
    }

    setLoading(false);
    setData({ image: null, colors: null }); 
  }, [onExtractColors]);

  useEffect(() => {
    let urlToRevoke: string | null = null;
    if (data.image) {
      const image = document.createElement('img');
      urlToRevoke = URL.createObjectURL(data.image);
      setImageUrl(urlToRevoke); 
      image.src = urlToRevoke;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        if (!context) { console.error('Canvas context not available.'); return; }
        extractColors(context.getImageData(0, 0, canvas.width, canvas.height), urlToRevoke); 
        canvas.remove();
      };
    }
    return () => { 
      if (urlToRevoke) { 
        URL.revokeObjectURL(urlToRevoke); 
        setImageUrl(null); 
      } 
    };
  }, [data.image, extractColors]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setData({ image: file, colors: null });
      event.target.value = ''; 
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
      
      {/* 元画像プレビューは Aquarium の確認画面に統合されているため、ここでは表示しない */}
    </div>
  );
};

export default ColorExtractor;