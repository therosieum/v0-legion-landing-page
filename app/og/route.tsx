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
          background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 50%, #d32f2f 100%)',
          fontFamily: '"Inter", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Warrior silhouettes background overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 630%22%3E%3Cdefs%3E%3Cpattern id=%22warriors%22 x=%220%22 y=%220%22 width=%22200%22 height=%22630%22 patternUnits=%22userSpaceOnUse%22%3E%3Ccircle cx=%22100%22 cy=%22150%22 r=%2240%22 fill=%22%23000000%22 opacity=%220.3%22/%3E%3Crect x=%2290%22 y=%22200%22 width=%2220%22 height=%22100%22 fill=%22%23000000%22 opacity=%220.3%22/%3E%3Crect x=%2280%22 y=%22310%22 width=%2240%22 height=%2220%22 fill=%22%23000000%22 opacity=%220.3%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%221200%22 height=%22630%22 fill=%22url(%23warriors)%22/%3E%3C/svg%3E")',
            backgroundSize: '200px 630px',
            opacity: 0.2,
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
          }}
        >
          {/* Main heading */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: '900',
              color: '#ffffff',
              margin: '0 40px',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            Will you survive the bear market?
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#ffffff',
              margin: '24px 0 0 0',
              fontWeight: '500',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            8 questions to find out
          </p>

          {/* Button shape */}
          <div
            style={{
              marginTop: '40px',
              paddingX: '40px',
              paddingY: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#000000',
              }}
            >
              Take the quiz
            </span>
          </div>
        </div>

        {/* Legion branding bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '40px',
            fontSize: '14px',
            color: '#ffffff',
            fontWeight: '600',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
        >
          legion.cc
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
