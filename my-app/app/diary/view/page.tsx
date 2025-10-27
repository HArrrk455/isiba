import DiaryView from '@/components/DiaryView';

export default function DiaryViewPage() {
  return (
    // 画面全体に表示するため、html/bodyのスタイルをリセット
    <html style={{ margin: 0 }}>
      <body style={{ margin: 0 }}>
        <DiaryView />
      </body>
    </html>
  );
}