// page.tsx
import React from "react";
// Aquariumコンポーネントは、水槽のロジックと描画のハブとなる
import Aquarium from "@/components/Aquarium"; 

export default function Home() {
  return (
    // Outer div: 画面全体をカバーし、ダークモードに対応した背景色
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* main: コンテンツ幅を制限し、垂直にアイテムを配置 */}
      <main className="flex w-full max-w-3xl flex-col items-center justify-start py-16 px-4 sm:px-16 bg-white dark:bg-black shadow-2xl rounded-lg">
        <h1 className="text-4xl font-bold mb-10 text-black dark:text-zinc-50">
          写真から色を抽出して魚を生成
        </h1>
        
        {/* Aquariumコンポーネント内に、ImageUploaderとFishRendererが組み込まれる */}
        <Aquarium /> 

        <div className="pt-16 flex flex-col gap-4 text-base font-medium sm:flex-row">
          {/* フッターや説明文のコンテンツを配置 */}
        </div>
      </main>
    </div>
  );
}