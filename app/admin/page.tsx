'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function Home() {
  // 1. 상자의 형식을 임시로 완전히 풀어버립니다 (any 사용)
  const [products, setProducts] = useState<any>([]);
  const [contact, setContact] = useState({ name: '', phone: '', content: '' });

  useEffect(() => {
    async function fetchProducts() {
      // 2. 데이터를 가져올 때 'any'로 취급하여 컴퓨터의 간섭을 차단합니다.
      const { data }: { data: any } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      
      // 3. jj.png의 19라인 에러를 해결하는 핵심 코드입니다.
      if (data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 4. EE.png에서 보신 'policy' 에러는 Supabase 설정 문제이므로, 우선 전송 실패 메시지만 띄웁니다.
    const { error } = await supabase.from('contacts').insert([contact]);
    if (error) {
      alert('현재 문의 기능 점검 중입니다. 전화(02-2631-5760)로 연락 주시면 감사하겠습니다.');
    } else {
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

      <section style={{ marginBottom: '60px' }}>
        <h2>제품 안내</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {/* 5. 데이터가 있을 때만 화면에 그리도록 안전장치를 추가했습니다. */}
          {products && Array.isArray(products) && products.map((product: any) => (
            <div key={product.id} style={{ border: '1px solid #eee', padding: '20px', textAlign: 'center', borderRadius: '10px' }}>
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              <h3 style={{ marginTop: '15px' }}>{product.title}</h3>
              <p style={{ color: '#666' }}>{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2>찾아오시는 길</h2>
        <p style={{ marginBottom: '20px' }}>서울 영등포구 양산로3길 15, 1층</p>
        <button onClick={() => window.open('https://map.naver.com/v5/search/서울 영등포구 양산로3길 15', '_blank')} style={{ padding: '15px 30px', backgroundColor: '#03C75A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>네이버 지도에서 위치 보기</button>
      </section>

      <section style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>견적 및 제품 문의</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="성함 / 업체명" required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          <input type="text" placeholder="연락처" required value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          <textarea placeholder="문의하실 내용을 적어주세요" required value={contact.content} onChange={e => setContact({...contact, content: e.target.value})} style={{ width: '100%', padding: '12px', height: '120px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>문의 보내기</button>
        </form>
      </section>

      <footer style={{ marginTop: '60px', padding: '20px 0', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '13px' }}>
        © 2026 (주)진영 이엔지. All Rights Reserved.
      </footer>
    </div>
  );
}