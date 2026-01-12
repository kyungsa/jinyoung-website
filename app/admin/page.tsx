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
  const [contacts, setContacts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // 설명 상태 추가

  const fetchData = async () => {
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (pData) setProducts(pData);
    const { data: cData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (cData) setContacts(cData);
  };

  const handleLogin = () => {
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchData();
    } else { alert('로그인 정보 오류'); }
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명과 사진은 필수입니다!');
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      
      // DB에 제목과 설명을 함께 저장
      await supabase.from('products').insert([{ title, description, image_url: publicUrl }]);
      
      alert('제품 등록 완료!');
      setTitle(''); setDescription(''); fetchData();
    } catch (err) { alert('에러: ' + err.message); }
    finally { setUploading(false); }
  };

  const deleteItem = async (table, id) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>관리자 로그인</h2>
        <input type="text" placeholder="아이디" onChange={e => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} /><br/>
        <button onClick={handleLogin}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>⚙️ 진영이엔지 관리 시스템</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
          <h2>📦 제품 등록</h2>
          <input placeholder="제품명" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <textarea placeholder="제품 설명 (예: 규격, 특징 등)" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', height: '80px' }} />
          <input type="file" onChange={handleUpload} disabled={uploading} />
          <hr/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
            {products.map(p => (
              <div key={p.id} style={{ border: '1px solid #eee', padding: '5px', textAlign: 'center' }}>
                <img src={p.image_url} style={{ width: '100%', height: '80px', objectFit: 'contain' }} />
                <p style={{ fontSize: '11px', fontWeight: 'bold' }}>{p.title}</p>
                <button onClick={() => deleteItem('products', p.id)} style={{ color: 'red', fontSize: '10px' }}>삭제</button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd' }}>
          <h2>📩 고객 문의</h2>
          {contacts.map(c => (
            <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <strong>{c.name}</strong> ({c.phone})<br/>
              <p style={{ fontSize: '14px', color: '#555' }}>{c.message}</p>
              <button onClick={() => deleteItem('contacts', c.id)} style={{ color: 'red', fontSize: '11px' }}>문의 삭제</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}