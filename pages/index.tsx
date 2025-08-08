// White Noise Island Website Template (Next.js + TailwindCSS + Markdown)

// --- Project Structure ---
// pages/
//   index.tsx              => Home page with animated logo and news carousel
//   news.tsx               => News section (pulling from Markdown)
//   members/[slug].tsx     => Dynamic member page
//   about.tsx              => About us page
//   recruit.tsx            => Recruitment info
// posts/
//   news/                  => Markdown files for news
//   members/               => Markdown files for each Vtuber
// public/
//   logo.gif               => Animated logo
//   images/                => Static assets

// Here's a basic sample of index.tsx

"use client"; // 標記這個檔案為前端 client component（Next.js 13+）

import Image from "next/image"; // Next.js 的圖片元件，優化圖片載入
import Link from "next/link";   // Next.js 的連結元件，處理頁面跳轉
import { useEffect, useState } from "react"; // React 的 hooks，用於管理狀態與副作用
import fs from "fs";            // Node.js 的檔案系統模組，讀取本地檔案（僅在 server-side 使用）
import path from "path";        // Node.js 的路徑模組，處理檔案路徑
import matter from "gray-matter"; // 解析 Markdown 檔案中的 YAML 前言（frontmatter）
import { GetStaticProps } from "next"; // Next.js 的型別，定義靜態生成 props 的函式

// 定義新聞項目的型別，方便型別檢查與自動補全
interface NewsItem {
  title: string;   // 新聞標題
  date: string;    // 新聞日期
  excerpt: string; // 新聞摘要
  slug: string;    // 新聞網址用的 slug（檔名去掉 .md）
}

// 頁面主元件，接收 news 陣列作為 props
export default function Home({ news }: { news: NewsItem[] }) {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* 頁面主區塊，設置最小高度、背景色、文字顏色 */}
      <div className="flex flex-col items-center justify-center py-10">
        {/* Logo 圖片，使用 Next.js Image 元件 */}
        <Image src="/logo.gif" alt="Logo" width={200} height={200} />
        {/* 網站標題 */}
        <h1 className="text-3xl font-bold mt-4">白噪島 White Noise Island</h1>
        {/* 網站副標題 */}
        <p className="text-sm text-gray-600">虛擬藝人世界觀計畫官方網站</p>
      </div>

      {/* 最新消息區塊 */}
      <section className="max-w-3xl mx-auto px-4">
        {/* 最新消息標題 */}
        <h2 className="text-xl font-semibold mb-4">最新消息</h2>
        {/* 新聞列表 */}
        <ul className="space-y-4">
          {/* 遍歷 news 陣列，渲染每一則新聞 */}
          {news.map((item) => (
            <li key={item.slug} className="border-b pb-2">
              {/* 新聞標題，點擊可跳轉到詳細頁 */}
              <Link href={`/news/${item.slug}`}> 
                <p className="font-bold text-blue-600 hover:underline">{item.title}</p>
              </Link>
              {/* 新聞日期 */}
              <p className="text-xs text-gray-500">{item.date}</p>
              {/* 新聞摘要 */}
              <p className="text-sm">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// Next.js 的靜態生成函式，於 build 時執行，取得新聞資料
export const getStaticProps: GetStaticProps = async () => {
  const newsDir = path.join(process.cwd(), "posts/news"); // 取得新聞資料夾的絕對路徑
  const filenames = fs.readdirSync(newsDir);              // 讀取資料夾內所有檔案名稱

  // 遍歷每個檔案，解析內容
  const news = filenames.map((filename) => {
    const filePath = path.join(newsDir, filename);        // 組合出檔案完整路徑
    const fileContent = fs.readFileSync(filePath, "utf8"); // 讀取檔案內容（字串）
    const { data } = matter(fileContent);                 // 解析 frontmatter，取得 meta 資料

    return {
      title: data.title,                                  // 新聞標題
      date: String(data.date),                            // 新聞日期（轉成字串）
      excerpt: data.excerpt,                              // 新聞摘要
      slug: filename.replace(".md", ""),                  // 檔名去掉 .md，作為網址 slug
    };
  });

  // 回傳 props，供頁面元件使用
  return {
    props: { news },
  };
};