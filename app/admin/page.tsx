'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function Home() {
  // 상자의 형식을 임시로 완전히 풀어버려 에러를 방지합니다.
  const [products, setProducts] = useState<any>([]);
  const [contact, setContact] = useState({ name: '', phone: '', content: '' });

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      // qq.png의 19라인 에러를 원천 차단하는 가장 확실한 방법입니다.
      if (data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('contacts').insert([contact]);
    if (error) alert('전송 실패');
    else {
      alert('문의가 접수되었습니다!');
      setContact({ name: '', phone: '', content: '' });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '3px solid #0056b3', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3' }}>(주)진영 이엔지</h1>
        <p>최고의 기술력, 대형표시기 및 자동화 시스템 전문</p>
      </header>

      <section style={{ marginBottom: '60px' }}>
        <h2>제품 안내</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {products && products.map((product: any) => (
            <div key={product.id} style={{ border: '1px solid #eee', padding: '20px', textAlign: 'center' }}>
              <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2>찾아오시는 길</h2>
        <button onClick={() => window.open('https://map.naver.com/v5/search/서울 영등포구 양산로3길 15', '_blank')} style={{ padding: '15px 30px', backgroundColor: '#03C75A', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>네이버 지도에서 보기</button>
      </section>

      <section style={{ backgroundColor: '#f9f9f9', padding: '40px' }}>
        <h2 style={{ textAlign: 'center' }}>온라인 문의</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <input type="text" placeholder="성함" required value={contact.name} onChange={e => setContact({...contact, name: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <input type="text" placeholder="연락처" required value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <textarea placeholder="내용" required value={contact.content} onChange={e => setContact({...contact, content: e.target.value})} style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '10px' }} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#0056b3', color: 'white', border: 'none' }}>문의 보내기</button>
        </form>
      </section>
    </div>
  );
}