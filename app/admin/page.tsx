'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<any[]>([]); // 형식을 미리 지정
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('products');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleLogin = () => {
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchData();
    } else { alert('로그인 실패'); }
  };

  const fetchData = async () => {
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (pData) setProducts(pData as any); // as any 추가로 에러 해결
    const { data: cData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (cData) setContacts(cData as any);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명을 먼저 입력하세요');
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      await supabase.storage.from('images').upload(fileName, file);
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      await supabase.from('products').insert([{ title, description, image_url: publicUrl }]);
      alert('등록 성공!');
      setTitle(''); setDescription(''); fetchData();
    } finally { setUploading(false); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>(주)진영 이엔지 관리자</h2>
        <input type="text" placeholder="아이디" onChange={e => setEmail(e.target.value)} style={{ padding: '10px', marginBottom: '5px' }} /><br/>
        <input type="password" placeholder="비밀번호" onChange={e => setPassword(e.target.value)} style={{ padding: '10px', marginBottom: '10px' }} /><br/>
        <button onClick={handleLogin} style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '5px' }}>로그인</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('products')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'products' ? '#0056b3' : '#eee', color: activeTab === 'products' ? 'white' : 'black' }}>제품 관리</button>
        <button onClick={() => setActiveTab('contacts')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'contacts' ? '#0056b3' : '#eee', color: activeTab === 'contacts' ? 'white' : 'black' }}>문의 확인</button>
      </div>

      {activeTab === 'products' ? (
        <div>
          <h3>📦 제품 등록</h3>
          <input type="text" placeholder="제품명" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
          <textarea placeholder="설명" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
          <input type="file" onChange={handleUpload} disabled={uploading} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '20px' }}>
            {products.map((p: any) => (
              <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                <img src={p.image_url} style={{ width: '100%' }} />
                <p>{p.title}</p>
                <button onClick={async () => { if(confirm('삭제?')) { await supabase.from('products').delete().eq('id', p.id); fetchData(); } }}>삭제</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>📩 문의 목록</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#f4f4f4' }}><th>날짜</th><th>업체명</th><th>연락처</th><th>내용</th></tr></thead>
            <tbody>
              {contacts.map((c: any) => (
                <tr key={c.id}>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>{c.name}</td><td>{c.phone}</td><td>{c.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}