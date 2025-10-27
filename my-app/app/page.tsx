import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ 
      padding: 40, 
      fontFamily: 'sans-serif', 
      textAlign: 'center', 
      minHeight: '100vh',
      backgroundColor: '#191945',
      color: 'white'
    }}>
      <h1 style={{ marginTop: '50px' }}>Welcome to isiba Diary App</h1>
      <p style={{ marginBottom: '30px' }}>機能を選んでください。</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/diary/entry" style={{ color: '#A0A0FF', textDecoration: 'underline' }}>
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