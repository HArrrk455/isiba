'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AppHeader: React.FC = () => {
  // 現在のパスを取得し、アクティブなページを判断
  const pathname = usePathname();

  let links = [];

  if (pathname.includes('/diary/view')) {
    links.push({ href: '/diary/entry', label: '✍️ 入力画面へ' });
    links.push({ href: '/diary', label: '🏠 ホームへ' });
  } else if (pathname.includes('/diary')) {
    links.push({ href: '/diary/view', label: '👀 表示画面へ' });
    links.push({ href: '/diary', label: '🏠 ホームへ' });
  } else {
    links.push({ href: '/diary', label: '✍️ 日記入力へ' });
    links.push({ href: '/diary/view', label: '👀 日記表示へ' });
  }

  return (
    <header style={{
      display: 'flex',
      gap: '20px',
      padding: '10px 20px',
      borderBottom: '1px solid #333',
      backgroundColor: '#282a4d', // 背景色と合わせる
      color: 'white',
      zIndex: 100
    }}>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            color: link.href === pathname ? '#FFF0D0' : '#A0A0FF',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          {link.label}
        </Link>
      ))}
    </header>
  );
};

export default AppHeader;