'use client';
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  // 전송 실패 시 바구니 이름을 바꿔서 한 번 더 시도하는 강력한 전송 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');

    // 1차 시도: message 컬럼으로 전송
    const { error: error1 } = await supabase.from('contacts').insert([{ name, phone, message }]);
    
    if (error1) {
      // 1차 실패 시 2차 시도: content 컬럼으로 전송 (q4 에러 방지)
      const { error: error2 } = await supabase.from('contacts').insert([{ name, phone, content: message }]);
      
      if (error2) {
        alert('전송에 실패했습니다: ' + error2.message);
      } else {
        alert('문의가 성공적으로 접수되었습니다! (2)');
        target.reset();
      }
    } else {
      alert('문의가 성공적으로 접수되었습니다! (1)');
      target.reset();
    }
  };

  return (
    <div style={{ padding: '0', margin: '0', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      
      <header style={{ padding: '40px 20px', textAlign: 'center', borderBottom: '2px solid #0056b3' }}>
        <h1 style={{ color: '#0056b3', fontSize: '2.5rem', margin: 0 }}>(주)진영 이엔지</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>대형표시기 및 자동화 시스템 전문 기업</p>
        <button 
          onClick={() => setIsMapOpen(true)}
          style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,86,179,0.3)' }}
        >
          📍 찾아오시는 길 (지도보기)
        </button>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 제품 리스트 영역 */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '1.8rem', borderLeft: '6px solid #0056b3', paddingLeft: '15px', marginBottom: '30px' }}>주요 제품 소개</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {products.map((p) => (
              <div key={p.id} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                <div style={{ height: '250px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                  <img src={p.image_url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', margin: 0 }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 온라인 문의 섹션 (입력창 막힘 완벽 해결) */}
        <section id="contact" style={{ backgroundColor: '#0056b3', padding: '60px 30px', borderRadius: '25px', color: '#fff' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '10px' }}>온라인 견적 문의</h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', opacity: '0.9' }}>내용을 남겨주시면 담당자가 빠르게 연락드리겠습니다.</p>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input name="name" type="text" placeholder="성함 / 업체명" required style={{ padding: '18px', borderRadius: '10px', border: 'none', fontSize: '16px', color: '#333' }} />
              <input name="phone" type="text" placeholder="연락처" required style={{ padding: '18px', borderRadius: '10px', border: 'none', fontSize: '16px', color: '#333' }} />
            </div>
            <textarea name="message" placeholder="문의하실 내용을 상세히 입력해 주세요." required style={{ width: '100%', padding: '18px', borderRadius: '10px', border: 'none', height: '150px', marginBottom: '20px', fontSize: '16px', boxSizing: 'border-box', color: '#333' }} />
            <button type="submit" style={{ width: '100%', padding: '20px', backgroundColor: '#ffcc00', color: '#333', border: 'none', borderRadius: '10px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>문의하기 전송</button>
          </form>
        </section>
      </main>

      {/* 지도 팝업 (모달) */}
      {isMapOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '800px', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>📍 찾아오시는 길</h3>
              <button onClick={() => setIsMapOpen(false)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '20px' }}>
              <p>서울 영등포구 양산로3길 15, 1층 | 📞 02-2631-5760</p>
              <div style={{ width: '100%', height: '400px', backgroundColor: '#eee', marginTop: '15px' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.048701833502!2d126.8860183!3d37.530349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c9ec92562f79f%3A0x6b26284617a9446c!2z7ISc7Jq47Yq567OE7IucIO 영등포구 양산로3길 15!5e0!3m2!1sko!2skr!4v1710000000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
              </div>
            </div>
            <button onClick={() => setIsMapOpen(false)} style={{ width: '100%', padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}