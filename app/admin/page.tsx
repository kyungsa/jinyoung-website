'use client';
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);

  const handleLogin = () => {
    // 사장님 전용 아이디와 비번입니다.
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchProducts();
    } else {
      alert('로그인 정보가 틀립니다.');
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '20px' }}>(주)진영 이엔지 관리자</h2>
          <input type="text" placeholder="아이디" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🛠️ 제품 및 관리자 센터</h1>
      <p>로그인에 성공하셨습니다. 여기서 제품을 추가하거나 삭제하세요.</p>
      {/* 제품 등록 양식 등이 들어갈 자리 */}
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={p.image_url} style={{ width: '100%' }} />
            <p>{p.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}