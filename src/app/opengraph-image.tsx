import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InfoDaily – Knowledge for Every Day';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0ea5e9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '72px',
              height: '72px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}
          >
            📰
          </div>
          <span style={{ color: 'white', fontSize: '56px', fontWeight: 800, letterSpacing: '-1px' }}>
            InfoDaily
          </span>
        </div>
        <p style={{ color: '#bfdbfe', fontSize: '28px', margin: '0 0 40px', textAlign: 'center' }}>
          Knowledge for Every Day
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Health', 'Finance', 'Technology', 'Travel', 'Life Hacks'].map(cat => (
            <div
              key={cat}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '999px',
                padding: '8px 20px',
                color: 'white',
                fontSize: '18px',
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
