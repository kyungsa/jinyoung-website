'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 연결 설정
const supabase = createClient(
  'https://hpkhxnjstxghtmkpdyyq.supabase.co', 
  'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q'
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [contact, setContact] = useState({ name: '', phone: '', content: '' });

  // 1. 제품 목록 불러오기
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  // 2. 문의하기 전송 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('contacts').insert([contact]);
    if (error) {
      alert('전송 실패: ' + error.message);
    } else {
      alert('문의가 접수되었습니다. 곧 연락드리겠습니다!');
      setContact({ name: '', phone: '', content: '' });
    }
  };

  return (
    <div style={{ padding: '0', margin: '0', fontFamily: '"Pretendard", "Malgun Gothic", sans-serif', color: '#333', backgroundColor: '#fff' }}>
      
      {/* 헤더 섹션 */}
      <header style={{ backgroundColor: '#fff', borderBottom: '2px solid #0056b3', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#0056b3', fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: '800' }}>(주)진영 이엔지</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', margin: '0' }}>최고의 기술력으로 응답하는 대형표시기 및 자동화 시스템 전문 기업</p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 제품 안내 섹션 */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ borderLeft: '6px solid #0056b3', paddingLeft: '15px', marginBottom: '40px', fontSize: '1.8rem' }}>제품 안내</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {products.length > 0 ? (
              products.map((product: any) => (
                <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '15px', padding: '20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}>
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                    <img src={product.image_url} alt={product.title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', color: '#222' }}>{product.title}</h3>
                  <p style={{ color: '#777', fontSize: '1rem', lineHeight: '1.6', height: '50px', overflow: 'hidden' }}>{product.description}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', color: '#999' }}>등록된 제품이 없습니다. 관리자 페이지에서 제품을 등록해주세요.</p>
            )}
          </div>
        </section>

        {/* 찾아오시는 길 섹션 (지도 연결) */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ borderLeft: '6px solid #0056b3', paddingLeft: '15px', marginBottom: '40px', fontSize: '1.8rem' }}>찾아오시는 길</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'stretch' }}>
            <div 
              onClick={() => window.open('https://map.naver.com/v5/search/서울 영등포구 양산로3길 15', '_blank')}
              style={{ flex: '1 1 500px', height: '350px', backgroundColor: '#e9ecef', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #ddd', backgroundImage: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div style={{ backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px 40px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', fontWeight: 'bold', color: '#0056b3' }}>
                📍 네이버 지도로 위치 보기 (클릭)
              </div>
            </div>
            <div style={{ flex: '1 1 350px', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ marginTop: 0, color: '#0056b3', fontSize: '1.6rem', marginBottom: '20px' }}>(주)진영 이엔지 본사</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.9', margin: 0 }}>
                <strong>주소:</strong> 서울특별시 영등포구 양산로3길 15, 1층<br/>
                <strong>지번:</strong> 양평동3가 30-30<br/><br/>
                <strong>대표전화:</strong> 02-2631-5760<br/>
                <strong>팩스:</strong> 02-2631-5762<br/>
                <strong>이메일:</strong> jinyoung@jinyoung.com
              </p>
            </div>
          </div>
        </section>

        /* 온라인 문의 섹션 */
<section id="contact" style={{ backgroundColor: '#0056b3', padding: '60px 20px', borderRadius: '20px', color: '#fff' }}>
  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '10px' }}>온라인 견적 문의</h2>
    <p style={{ textAlign: 'center', marginBottom: '40px', opacity: '0.9' }}>궁금하신 점을 남겨주시면 담당자가 빠르게 연락드리겠습니다.</p>
    
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const message = formData.get('message');

      const { error } = await supabase.from('contacts').insert([{ name, phone, message }]);
      
      if (error) {
        alert('전송 실패: ' + error.message);
      } else {
        alert('문의가 성공적으로 접수되었습니다!');
        e.currentTarget.reset();
      }
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <input 
          name="name"
          type="text" 
          placeholder="성함 / 업체명" 
          required 
          style={{ padding: '18px', borderRadius: '8px', border: 'none', color: '#333' }} 
        />
        <input 
          name="phone"
          type="text" 
          placeholder="연락처 (예: 010-0000-0000)" 
          required 
          style={{ padding: '18px', borderRadius: '8px', border: 'none', color: '#333' }} 
        />
      </div>
      <textarea 
        name="message"
        placeholder="문의하실 제품과 상세 내용을 입력해주세요." 
        required 
        style={{ width: '100%', padding: '18px', borderRadius: '8px', border: 'none', height: '150px', marginBottom: '20px', color: '#333', boxSizing: 'border-box' }} 
      />
      <button 
        type="submit" 
        style={{ width: '100%', padding: '18px', backgroundColor: '#ffcc00', color: '#333', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        문의하기 전송
      </button>
    </form>
  </div>
</section>      