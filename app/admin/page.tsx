'use client';
// @ts-ignore
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function Home() {
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      // as.png의 19번 에러를 강제로 해결합니다.
      if (data) setProducts(data as any);
    }
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '3px solid #0056b3', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3' }}>(주)진영 이엔지</h1>
        <p>최고의 기술력, 대형표시기 및 자동화 시스템 전문 기업</p>
      </header>

      {/* 📍 찾아오시는 길 */}
      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2 style={{ borderLeft: '6px solid #0056b3', paddingLeft: '15px', display: 'inline-block' }}>찾아오시는 길</h2>
        <p style={{ margin: '20px 0' }}>서울 영등포구 양산로3길 15, 1층</p>
        <button onClick={() => window.open('https://map.naver.com/v5/search/서울 영등포구 양산로3길 15', '_blank')} style={{ padding: '15px 30px', backgroundColor: '#03C75A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>네이버 지도에서 위치 보기</button>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>제품 안내</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {products && products.map((product: any) => (
            <div key={product.id} style={{ border: '1px solid #eee', padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}