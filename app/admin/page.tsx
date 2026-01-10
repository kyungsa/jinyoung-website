'use client';
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 연결 설정
const supabase = createClient('https://hpkhxnjstxghtmkpdyyq.supabase.co', 'sb_publishable_Nzr0Zrtp2Qt0pnY0g7PNfA_XgGmN7_q');

export default function FinalAdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // 제품 등록 입력창 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 1. 초기 데이터 불러오기
  const fetchData = async () => {
    const { data: pData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (pData) setProducts(pData);
    
    const { data: cData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (cData) setContacts(cData);
  };

  // 2. 로그인 처리
  const handleLogin = () => {
    if (email === 'admin@jinyoung.com' && password === '123456') {
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  // 3. 제품 등록 (사진 업로드 포함)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert('제품명을 먼저 입력하고 사진을 선택하세요!');
    
    setUploading(true);
    try {
      // 파일명 안전하게 변환 (한글 제거)
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      // 스토리지 업로드
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
      if (uploadError) throw uploadError;

      // 이미지 URL 생성
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

      // DB 저장
      const { error: dbError } = await supabase.from('products').insert([
        { title, description, image_url: publicUrl }
      ]);
      if (dbError) throw dbError;

      alert('제품이 등록되었습니다.');
      setTitle(''); setDescription('');
      fetchData(); // 목록 새로고침
    } catch (err) {
      alert('등록 실패: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // 4. 삭제 기능 (제품/문의)
  const deleteItem = async (table: string, id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchData();
  };

  // 로그인 전 화면
  if (!isLoggedIn) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#333' }}>(주)진영 이엔지 관리자</h2>
        <div style={{ maxWidth: '300px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="아이디" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} />
          <button onClick={handleLogin} style={{ padding: '12px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>로그인</button>
        </div>
      </div>
    );
  }

  // 로그인 후 관리자 화면
  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>📊 통합 관리 시스템</h1>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 15px' }}>로그아웃</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        
        {/* 왼쪽: 제품 등록 및 목록 */}
        <section>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', border: '1px solid #eee' }}>
            <h2 style={{ marginTop: 0 }}>📦 제품 등록</h2>
            <input type="text" placeholder="제품명 (예: JY-100)" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '93%', padding: '10px', marginBottom: '10px' }} />
            <input type="text" placeholder="간략 설명" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '93%', padding: '10px', marginBottom: '15px' }} />
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>사진 선택 (영문파일명 권장):</label>
            <input type="file" onChange={handleUpload} disabled={uploading} style={{ marginBottom: '10px' }} />
            {uploading && <p style={{ color: 'blue' }}>⏳ 처리 중...</p>}
          </div>

          <h3 style={{ marginTop: '30px' }}>현재 등록 제품 ({products.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
            {products.map(p => (
              <div key={p.id} style={{ border: '1px solid #eee', padding: '8px', textAlign: 'center' }}>
                <img src={p.image_url} style={{ width: '100%', height: '70px', objectFit: 'contain' }} />
                <p style={{ fontSize: '11px', margin: '5px 0', height: '30px', overflow: 'hidden' }}>{p.title}</p>
                <button onClick={() => deleteItem('products', p.id)} style={{ color: 'red', fontSize: '10px', border: 'none', background: 'none', cursor: 'pointer' }}>[삭제]</button>
              </div>
            ))}
          </div>
        </section>

        {/* 오른쪽: 고객 문의 목록 */}
        <section>
          <h2 style={{ marginTop: 0 }}>📩 고객 문의 현황 ({contacts.length})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>일시</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>고객/연락처</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>문의 내용</th>
                  <th style={{ padding: '12px' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', verticalAlign: 'top', color: '#666', fontSize: '12px' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <strong>{c.name}</strong><br/>
                      <span style={{ fontSize: '12px', color: '#0056b3' }}>{c.phone || c.email}</span>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top', lineHeight: '1.4' }}>{c.message}</td>
                    <td style={{ padding: '12px', verticalAlign: 'top', textAlign: 'center' }}>
                      <button onClick={() => deleteItem('contacts', c.id)} style={{ color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '3px', padding: '3px 7px', fontSize: '11px', cursor: 'pointer' }}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: '#999' }}>아직 접수된 문의가 없습니다.</p>}
          </div>
        </section>

      </div>
    </div>
  );
}