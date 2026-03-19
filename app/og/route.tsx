import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
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
          background: 'linear-gradient(135deg, #C41E3A 0%, #DC143C 25%, #FF4500 50%, #DC143C 75%, #C41E3A 100%)',
          fontFamily: '"Inter", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            textAlign: 'center',
            position: 'relative',
            paddingLeft: '60px',
            paddingRight: '60px',
          }}
        >
          {/* Main heading */}
          <h1
            style={{
              fontSize: '80px',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0',
              lineHeight: '1.0',
              textShadow: '0 6px 30px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)',
              letterSpacing: '-2px',
            }}
          >
            Will you survive the bear market?
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '56px',
              color: '#ffffff',
              margin: '32px 0 0 0',
              fontWeight: '700',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
            }}
          >
            8 questions to find out
          </p>

          {/* Button shape */}
          <div
            style={{
              marginTop: '50px',
              paddingLeft: '50px',
              paddingRight: '50px',
              paddingTop: '20px',
              paddingBottom: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1a1a1a',
              }}
            >
              Take the quiz
            </span>
          </div>
        </div>

        {/* Legion branding bottom center */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '0',
            right: '0',
            textAlign: 'center',
            fontSize: '18px',
            color: '#ffffff',
            fontWeight: '700',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
            letterSpacing: '4px',
          }}
        >
          LEGION
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
