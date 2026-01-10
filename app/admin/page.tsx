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
  const [uploading, setUploading] = useState(false);

  // 제품 등록용 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleLogin = () => {
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchProducts();
    } else { alert('로그인 실패'); }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  // 🚀 사진 업로드 및 제품 등록 함수
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명을 입력하고 사진을 선택하세요!');
    
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      // 1. 이미지 창고(Storage)에 저장
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      // 2. 이미지 주소 가져오기
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      // 3. 데이터베이스(DB)에 제품 정보 저장
      const { error: dbError } = await supabase.from('products').insert([
        { title, description, image_url: publicUrl }
      ]);
      if (dbError) throw dbError;

      alert('제품이 성공적으로 등록되었습니다!');
      setTitle(''); setDescription(''); fetchProducts();
    } catch (error) {
      alert('등록 중 오류 발생: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>(주)진영 이엔지 관리자</h2>
        <input type="text" placeholder="아이디" onChange={e => setEmail(e.target.value)} style={{ padding: '10px', marginBottom: '5px' }} /><br/>
        <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} style={{ padding: '10px', marginBottom: '10px' }} /><br/>
        <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none' }}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📦 제품 등록 센터</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h3>새 제품 추가</h3>
        <input type="text" placeholder="제품명 (예: JY-330-8A)" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="text" placeholder="설명 (예: 대형표시기)" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <p>사진 선택:</p>
        <input type="file" onChange={handleUpload} disabled={uploading} />
        {uploading && <p style={{ color: 'blue' }}>업로드 중입니다... 잠시만 기다려주세요.</p>}
      </div>

      <hr style={{ margin: '40px 0' }} />

      <h3>현재 등록된 제품 목록</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
        {products.map((p: any) => (
          <div key={p.id} style={{ textAlign: 'center', border: '1px solid #eee', padding: '10px' }}>
            <img src={p.image_url} style={{ width: '100%', height: '100px', objectFit: 'contain' }} />
            <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{p.title}</p>
            <button onClick={async () => { if(confirm('삭제하시겠습니까?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} style={{ color: 'red', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}