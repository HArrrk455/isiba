import React from "react";
// Image コンポーネントはもう使わないため削除
// import Image from "next/image"; 

// 作成したクライアントコンポーネントをインポート
import ColorExtractor from "@/components/ColorExtractor";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* 既存のレイアウトを維持しつつ、メインコンテンツを ColorExtractor に置き換える */}
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-16 px-4 sm:px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold mb-10 text-black dark:text-zinc-50">
          写真から色を抽出して魚に反映
        </h1>
        
        {/* ★ここに ColorExtractor コンポーネントを配置★ */}
        <ColorExtractor />

        {/* 既存のフッターやリンクは必要に応じて残すか削除してください */}
        <div className="mt-auto pt-16 flex flex-col gap-4 text-base font-medium sm:flex-row">
          {/* ... 既存の Vercel/Docs リンクなど ... */}
        </div>
      </main>
    </div>
  );
}