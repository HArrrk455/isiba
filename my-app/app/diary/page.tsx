'use client'; // 💡 アニメーションやuseStateを使うため、クライアントコンポーネントにする

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import FishSVG from '@/components/FishSVG'; 

// 魚の特性を定義する型
interface FishProps {
  id: number;
  startX: number; // 初期X位置 (vw, 画面外を含む)
  y: number; // Y位置 (vh)
  delay: number; // アニメーション開始の遅延 (s)
  scale: number; // サイズ
  rotate: 0 | 180; // 回転角度 (0度または180度で左右反転)
  fill: string; // 魚の色
  duration: number; // 泳ぐ速さ (s)
}

// 魚の数を定義
const FISH_COUNT = 15;
// 魚が完全に画面外に出るために必要な移動量
const TRAVEL_DISTANCE = 120; // 画面幅(100) + 魚の幅(20)

export default function HomePage() {
  const [fishPositions, setFishPositions] = useState<FishProps[]>([]);

  // 魚の初期位置と動きを生成
  useEffect(() => {
    const newFish: FishProps[] = Array.from({ length: FISH_COUNT }).map((_, i) => {
      const isMovingRight = Math.random() > 0.5;

      return {
        id: i,
        // 💡 初期X位置: ランダムな開始点 (-30vw ~ 130vw の範囲)
        startX: Math.random() * 160 - 30, 
        y: 10 + Math.random() * 80, // 画面端を避ける (10% ~ 90%)
        delay: Math.random() * 8, // 0-8秒の遅延
        scale: 0.5 + Math.random() * 0.8, // 0.5倍から1.3倍
        rotate: isMovingRight ? 0 : 180, // 魚の向き
        fill: `hsl(${Math.random() * 360}, 70%, 70%)`,
        duration: 10 + Math.random() * 15,
      }
    });
    setFishPositions(newFish);
  }, []);

  return (
    <main style={{ 
      padding: 40, 
      fontFamily: 'sans-serif', 
      textAlign: 'center', 
      minHeight: '100vh',
      backgroundColor: '#191945', 
      color: 'white',
      overflow: 'hidden', 
      position: 'relative'
    }}>
      
      {/* 💡 泳ぐ魚たち */}
      {fishPositions.map(fish => (
        <div 
          key={fish.id}
          style={{
            position: 'absolute',
            // 初期配置をランダムな画面外/画面内に設定
            left: `${fish.startX}vw`, 
            top: `${fish.y}vh`, 
            
            // CSS変数を設定
            '--fish-scale': fish.scale,
            '--fish-rotate': fish.rotate,
            '--fish-duration': `${fish.duration}s`,
            '--fish-delay': `${fish.delay}s`,
            '--travel-distance': `${TRAVEL_DISTANCE}vw`,
            
            // 💡 向きが180度 (左向き) ならアニメーションを逆再生する
            '--animation-direction': fish.rotate === 180 ? 'reverse' : 'normal',
            
            opacity: 0.8,
            // アニメーションを適用
            animation: `swim var(--fish-duration) linear infinite var(--fish-delay) var(--animation-direction)`,
            // 初期状態のサイズと向きを設定
            transform: `scale(var(--fish-scale)) rotateY(var(--fish-rotate)deg)`,
            zIndex: 0 
          } as React.CSSProperties} // CSS変数を使うため型アサーション
        >
          <FishSVG size={80} fill={fish.fill} />
        </div>
      ))}

      {/* 💡 キーフレームアニメーションの定義 */}
      <style jsx>{`
        @keyframes swim {
          0% { 
            /* 初期位置を基準に移動なし */
            transform: translateX(0) 
                        scale(var(--fish-scale)) 
                        rotateY(var(--fish-rotate)deg);
          }
          100% { 
            /* 画面幅全体を超える距離を移動させる */
            transform: translateX(var(--travel-distance)) 
                        scale(var(--fish-scale)) 
                        rotateY(var(--fish-rotate)deg);
          }
        }
      `}</style>


      <h1 style={{ marginTop: '50px', position: 'relative', zIndex: 1, maxWidth: '430px', margin: '50px auto 20px auto' }}>Welcome to isiba Diary App</h1>
      <p style={{ marginBottom: '30px', position: 'relative', zIndex: 1, maxWidth: '430px', margin: '0 auto 30px auto' }}>機能を選んでください。</p>
      <ul style={{ listStyle: 'none', padding: 0, position: 'relative', zIndex: 1, maxWidth: '430px', margin: '0 auto' }}>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/diary" style={{ color: '#A0A0FF', textDecoration: 'underline' }}>
            ➡️ ✍️ 日記入力ページへ
          </Link>
        </li>
        <li>
          <Link href="/diary/view" style={{ color: '#A0A0FF', textDecoration: 'underline' }}>
            ➡️ 👀 日記表示ページへ
          </Link>
        </li>
      </ul>
    </main>
  );
}
