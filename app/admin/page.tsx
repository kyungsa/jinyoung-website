'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function Home() {
  // 1. 초기값을 null로 설정하여 형식 충돌을 원천 차단합니다.
  const [products, setProducts] = useState<any>(null);
  const [contact, setContact] = useState({ name: '', phone: '', content: '' });

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      // 2. data가 있을 때만 any 타입으로 강제 주입하여 ww.png의 19번 에러를 해결합니다.
      if (data) {
        setProducts(data as any);
      } else {
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('contacts').insert([contact]);
    if (error) alert('전화(02-2631-5760)로 문의주시면 감사하겠습니다.');
    else {
      alert('문의가 접수되었습니다!');
      setContact({ name: '', phone: '', content: '' });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '3px solid #0056b3', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3' }}>(주)진영 이엔지</h1>
        <p>최고의 기술력, 대형표시기 및 자동화 시스템 전문 기업</p>
      </header>

      {/* 📍 찾아오시는 길 항목 (정상 포함) */}
      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2 style={{ borderLeft: '6px solid #0056b3', paddingLeft: '15px', display: 'inline-block' }}>찾아오시는 길</h2>
        <p style={{ margin: '20px 0' }}>서울 영등포구 양산로3길 15, 1층</p>
        <button 
          onClick={() => window.open('https://map.naver.com/v5/search/서울 영등포구 양산로3길 15', '_blank')} 
          style={{ padding: '15px 30px', backgroundColor: '#03C75A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          네이버 지도에서 위치 보기
        </button>
      </section>

      <section style={{ marginBottom: '60px' }}>
        <h2>제품 안내</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {/* 3. 데이터가 로딩된 후(Array일 때)만 화면을 그리도록 합니다. */}
          {Array.isArray(products) && products.map((product: any) => (
            <div key={product.id} style={{ border: '1px solid #eee', padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              <h3 style={{ marginTop: '15px' }}>{product.title}</h3>
              <p style={{ color: '#666' }}>{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>견적 및 제품 문의</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="성함 / 업체명" required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="연락처" required value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <textarea placeholder="내용" required value={contact.content} onChange={e => setContact({...contact, content: e.target.value})} style={{ width: '100%', padding: '12px', height: '120px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>문의 보내기</button>
        </form>
      </section>

      <footer style={{ marginTop: '60px', padding: '20px 0', textAlign: 'center', color: '#999' }}>
        © 2026 (주)진영 이엔지. All Rights Reserved.
      </footer>
    </div>
  );
}