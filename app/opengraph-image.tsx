import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Omarchy Quest — learn Omarchy commands by playing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          background: '#0d1117',
          color: '#e6edf3',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#7ee787' }}>$ ./welcome --to omarchy</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700 }}>
          Omarchy<span style={{ color: '#7ee787' }}>Quest</span>
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#8b949e' }}>
          Learn Omarchy&apos;s shortcuts and commands by playing
        </div>
      </div>
    ),
    { ...size },
  );
}
