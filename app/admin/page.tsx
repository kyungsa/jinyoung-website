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
  const [contacts, setContacts] = useState([]); // 문의 목록 상태
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleLogin = () => {
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchData();
    } else { alert('로그인 실패'); }
  };

  const fetchData = async () => {
    // 제품 목록 가져오기
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (pData) setProducts(pData);
    
    // 문의 목록 가져오기
    const { data: cData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (cData) setContacts(cData);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명을 입력하고 사진을 선택하세요!');
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`; // 한글 파일명 방지
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      await supabase.from('products').insert([{ title, description, image_url: publicUrl }]);
      alert('제품 등록 완료!');
      setTitle(''); fetchData();
    } catch (error) { alert('오류: ' + error.message); }
    finally { setUploading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>(주)진영 이엔지 관리자 로그인</h2>
        <input type="text" placeholder="아이디" onChange={e => setEmail(e.target.value)} style={{ padding: '10px', marginBottom: '5px', width: '200px' }} /><br/>
        <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} style={{ padding: '10px', marginBottom: '10px', width: '200px' }} /><br/>
        <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🛠️ 통합 관리 시스템</h1>
      
      {/* 1. 제품 등록 섹션 */}
      <section style={{ marginBottom: '50px', backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h2>📦 제품 등록</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input type="text" placeholder="제품명" value={title} onChange={e => setTitle(e.target.value)} style={{ flex: 1, padding: '10px' }} />
          <input type="text" placeholder="설명" value={description} onChange={e => setDescription(e.target.value)} style={{ flex: 1, padding: '10px' }} />
        </div>
        <input type="file" onChange={handleUpload} disabled={uploading} style={{ marginBottom: '10px' }} />
        {uploading && <p style={{ color: 'blue' }}>업로드 중...</p>}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '20px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'center', backgroundColor: 'white' }}>
              <img src={p.image_url} style={{ width: '100%', height: '80px', objectFit: 'contain' }} />
              <p style={{ fontSize: '12px', margin: '5px 0' }}>{p.title}</p>
              <button onClick={async () => { if(confirm('삭제할까요?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }} style={{ fontSize: '10px', color: 'red' }}>삭제</button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. 고객 문의 목록 섹션 */}
      <section>
        <h2>📩 고객 문의 현황</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#333', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>날짜</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>고객명</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>연락처</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>문의내용</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} style={{ textAlign: 'center' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '13px' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{c.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{c.phone || c.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>{c.message}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={async () => { if(confirm('문의를 삭제하시겠습니까?')) { await supabase.from('contacts').delete().eq('id', c.id); fetchData(); } }} style={{ color: 'red', cursor: 'pointer' }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>접수된 문의가 없습니다.</p>}
      </section>
    </div>
  );
}