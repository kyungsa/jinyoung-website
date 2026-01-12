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
  const [description, setDescription] = useState('');

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
    } else { alert('아이디/비밀번호가 틀립니다.'); }
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명과 사진을 모두 넣어주세요.');
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      await supabase.storage.from('images').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      await supabase.from('products').insert([{ title, description, image_url: publicUrl }]);
      alert('성공적으로 등록되었습니다!');
      setTitle(''); setDescription(''); fetchData();
    } catch (err) { alert('업로드 실패'); }
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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
        <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '350px' }}>
          <h2 style={{ textAlign: 'center', color: '#0056b3' }}>관리자 로그인</h2>
          <input type="text" placeholder="아이디" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '3px solid #0056b3', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>📊 진영이엔지 관리 시스템</h1>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>로그아웃</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        <section style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0 }}>📦 제품 등록 현황</h2>
          <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f1f3f5', borderRadius: '15px' }}>
            <input placeholder="제품 제목" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <textarea placeholder="제품 상세 설명" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', height: '80px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="file" onChange={handleUpload} disabled={uploading} style={{ marginBottom: '10px' }} />
            {uploading && <p style={{ color: 'blue' }}>전송 중...</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
            {products.map(p => (
              <div key={p.id} style={{ textAlign: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '15px' }}>
                <img src={p.image_url} style={{ width: '100%', height: '100px', objectFit: 'contain' }} />
                <p style={{ fontWeight: 'bold', fontSize: '13px' }}>{p.title}</p>
                <button onClick={() => deleteItem('products', p.id)} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>[제품삭제]</button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0 }}>📩 실시간 고객 문의</h2>
          {contacts.map(c => (
            <div key={c.id} style={{ padding: '20px', borderBottom: '1px solid #eee', position: 'relative' }}>
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{new Date(c.created_at).toLocaleString()}</p>
              <p style={{ margin: '10px 0' }}><strong>{c.name}</strong> | <span style={{ color: '#0056b3' }}>{c.phone}</span></p>
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', fontSize: '14px', color: '#444' }}>{c.message}</div>
              <button onClick={() => deleteItem('contacts', c.id)} style={{ marginTop: '10px', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>문의 삭제</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}