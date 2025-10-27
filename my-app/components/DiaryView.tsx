'use client'; 

import React, { useState, useEffect } from 'react';

interface DiaryData {
  title: string;
  content: string;
  date: string; 
}

const getTodayKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    return days[date.getDay()];
};

// --- 魚のシルエットコンポーネント (SVG) ---
const FishSilhouette: React.FC = () => {
  return (
    <svg 
      width="300" 
      height="150" 
      viewBox="0 0 300 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.9, transform: 'scale(1.3)' }}
    >
      <path 
        d="M20 75 C 100 20, 200 20, 260 75 L 290 65 L 260 75 L 290 85 Z" 
        style={{ fill: 'url(#fishGradient)' }}
      />
      <path 
        d="M260 75 L 290 65 L 290 85 Z" 
        style={{ fill: '#FFF0D0' }}
      />
      <defs>
        <linearGradient id="fishGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{stopColor: "#C6A0D5"}} />
          <stop offset="50%" style={{stopColor: "#F0C0D0"}} />
          <stop offset="100%" style={{stopColor: "#FFF0D0"}} />
        </linearGradient>
      </defs>
    </svg>
  );
};


// --- メイン表示コンポーネント ---
const DiaryView: React.FC = () => {
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const todayKey = getTodayKey(); 
  const displayDate = new Date().getMonth() + 1 + "/" + new Date().getDate(); 
  const displayDayOfWeek = getDayOfWeek(todayKey);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`diary-${todayKey}`);
      if (savedData) {
        setDiaryData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("日記データの読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, [todayKey]);

  const displayEvent = diaryData 
    ? diaryData.content 
    : "今日のできごとはまだ記録されていません。";
  
  if (isLoading) {
      return <div style={{ color: 'white', padding: 50 }}>読み込み中...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '50px 30px',
      height: '100vh',
      backgroundColor: '#191945',
      color: 'white',
      fontFamily: 'sans-serif',
      width: '100%',
      maxWidth: '430px', // 💡 iPhoneサイズに固定
      margin: '0 auto' 
    }}>
      
      {/* --- 日付と天気のエリア --- */}
      <div style={{ marginBottom: '80px' }}>
        <p style={{ fontSize: '72px', fontWeight: '300', lineHeight: '1.0' }}>
          {displayDate}
        </p>
        <p style={{ fontSize: '32px', fontWeight: '500' }}>
          {displayDayOfWeek} ☀️
        </p>
      </div>

      {/* --- 魚のエリア --- */}
      <div style={{ margin: '0 auto 100px auto', width: '100%', textAlign: 'center' }}>
        <FishSilhouette />
      </div>

      {/* --- 日記の本文エリア --- */}
      <div style={{ 
        width: '100%', 
        padding: '20px', 
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
      }}>
        <p style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '10px', 
            color: '#D0D0FF' 
        }}>
            🐏 今日のできごと
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          {displayEvent}
        </p>
      </div>

    </div>
  );
};

export default DiaryView;