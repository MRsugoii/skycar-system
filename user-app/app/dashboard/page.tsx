'use client';

import React from 'react';

export default function NuclearDashboard() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EF4444',
            color: 'white',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                ⚠️ 緊急維護模式 (Nuclear Mode)
            </h1>
            <p style={{ marginBottom: '2rem' }}>
                如果您能看到這個畫面，代表系統核心是正常的，只是之前的 Dashboard 程式碼有問題。
            </p>
            <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1.5rem',
                borderRadius: '1rem',
                maxWidth: '400px',
                textAlign: 'left'
            }}>
                <p><strong>Debug Info:</strong></p>
                <p>Build Time: {new Date().toISOString()}</p>
                <p>Status: Loaded Successfully</p>
            </div>

            <button
                onClick={() => {
                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = '/login';
                }}
                style={{
                    marginTop: '2rem',
                    padding: '1rem 2rem',
                    background: 'white',
                    color: '#EF4444',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                清除快取並登出
            </button>
        </div>
    );
}
