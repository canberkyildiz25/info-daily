import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InfoDaily – Practical Knowledge for Every Day';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRAND = {
  paper: '#f8f7f4',
  ink: '#0d1117',
  muted: '#5a6270',
  rule: '#d8d4cb',
  accent: '#007883',
};

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: BRAND.paper,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          padding: '74px 86px',
          color: BRAND.ink,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                background: BRAND.accent,
                borderRadius: '50%',
              }}
            />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '40px', fontWeight: 700, letterSpacing: '-1.6px' }}>InfoDaily</span>
            <span style={{ fontSize: '20px', color: BRAND.muted }}>Independent guides &amp; timely explainers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px' }}>
            <div style={{ width: '88px', height: '8px', background: BRAND.accent, marginBottom: '28px' }} />
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '74px', lineHeight: 1.04, fontWeight: 700, letterSpacing: '-3.2px' }}>
              Practical knowledge for everyday decisions.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${BRAND.rule}`, paddingTop: '22px', fontSize: '20px', color: BRAND.muted }}>
            <span>Health · Money · Technology · Culture</span>
            <span style={{ color: BRAND.accent, fontWeight: 700 }}>infodaily.net</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
