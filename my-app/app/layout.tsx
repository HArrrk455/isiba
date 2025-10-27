import AppHeader from '@/components/AppHeader'; // エイリアスを使用

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      {/* 全体に適用される基本的なスタイル */}
      <head>
        <title>isiba Diary App</title>
      </head>
      <body>
        <AppHeader /> 
        {children}
      </body>
    </html>
  );
}