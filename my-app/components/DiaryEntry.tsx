'use client'; 

import React, { useState } from 'react';

interface DiaryData {
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
}

const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DiaryEntry: React.FC = () => {
  const [date, setDate] = useState<string>(getTodayDate()); 
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DiaryData = { title, content, date };

    try {
      localStorage.setItem(`diary-${newEntry.date}`, JSON.stringify(newEntry));
      
      alert(`${newEntry.date} の日記を保存しました！`);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setTitle('');
        setContent('');
      }, 2000);
    } catch (error) {
      console.error("localStorageへの保存に失敗しました:", error);
      alert("データの保存に失敗しました。");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', 
    padding: '10px', 
    marginTop: '5px', 
    border: '1px solid #333',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px 30px',
      minHeight: 'calc(100vh - 40px)', // ヘッダー分を引く
      backgroundColor: '#191945',
      color: 'white',
      fontFamily: 'sans-serif',
      width: '100%',
      maxWidth: '430px', // 💡 iPhoneサイズに固定
      margin: '0 auto' 
    }}>
      
      <h2 style={{ fontSize: '30px', fontWeight: '500', marginBottom: '40px' }}>
        🗓️ 日記を記録
      </h2>
      
      <div style={{ 
        width: '100%', 
        padding: '30px', 
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
      }}>
        
        {isSaved && (
          <p style={{ color: '#00FF00', fontWeight: 'bold', textAlign: 'center' }}>
            ✅ 保存完了！
          </p>
        )}

        <form onSubmit={handleSave}>
          
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="date" style={{ display: 'block', fontWeight: 'bold', color: '#D0D0FF' }}>日付:</label>
            <input
              id="date"
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="title" style={{ display: 'block', fontWeight: 'bold', color: '#D0D0FF' }}>タイトル:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
              placeholder="今日の出来事のテーマ"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label htmlFor="content" style={{ display: 'block', fontWeight: 'bold', color: '#D0D0FF' }}>詳細:</label>
            <textarea
              id="content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ ...inputStyle, height: '150px', resize: 'vertical' }}
              placeholder="今日の気持ちや出来事を自由に書きましょう..."
            />
          </div>

          <button 
            type="submit"
            style={{ 
              width: '100%',
              padding: '12px', 
              backgroundColor: '#A0A0FF',
              color: '#191945', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            日記を保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiaryEntry;