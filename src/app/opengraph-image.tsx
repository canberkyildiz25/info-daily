import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InfoDaily — Guides for the hardware and software you already own.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Paylaşım görseli. Eskiden "Practical knowledge for everyday decisions" ve
   altında "Health · Money · Technology · Culture" yazıyordu — site iki
   bölüme indiğinden beri yanlış. Artık sitenin kendi sahnesi: petrol koyu
   zemin, sıkışık grotesk manşet, tek vurgu rengi (design.md). */
const STAGE = {
  bg: '#060f11',
  ink: '#f1f0eb',
  muted: '#a9b3b5',
  rule: '#253032',
  accent: '#4ab5c0',
  mark: '#007883',
};

const HEADLINE = 'Guides for the hardware and software you already own.';

/* Satori değişken fontun genişlik eksenini okuyamıyor; Archivo'nun sabit
   dar kesimi Archivo Narrow aynı iskelet. Google Fonts'tan yalnızca bu
   görseldeki harfler isteniyor. Ulaşılamazsa görsel varsayılan fontla yine
   de üretiliyor — paylaşım görseli hiç gelmemesinden iyidir. */
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(
      `https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@700&text=${encodeURIComponent(text)}`,
    )).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OGImage() {
  const font = await loadFont(`InfoDaily${HEADLINE}TECHNOLOGY · GAMINGinfodaily.net`);
  const display = font ? 'Archivo Narrow' : 'sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          background: STAGE.bg,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          color: STAGE.ink,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: STAGE.mark,
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <div style={{ width: '7px', height: '7px', background: 'white', borderRadius: '50%' }} />
            <div style={{ width: '8px', height: '14px', background: 'white', borderRadius: '1px' }} />
          </div>
          <span style={{ fontFamily: display, fontSize: '40px', fontWeight: 700, letterSpacing: '-0.5px' }}>InfoDaily</span>
        </div>

        <div style={{ display: 'flex', fontFamily: display, fontSize: '104px', lineHeight: 0.95, fontWeight: 700, letterSpacing: '-2px', maxWidth: '1000px' }}>
          {HEADLINE}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${STAGE.rule}`,
            paddingTop: '22px',
            fontFamily: display,
            fontSize: '26px',
            color: STAGE.muted,
            letterSpacing: '3px',
          }}
        >
          <span>TECHNOLOGY · GAMING</span>
          <span style={{ color: STAGE.accent }}>infodaily.net</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'Archivo Narrow', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  );
}
