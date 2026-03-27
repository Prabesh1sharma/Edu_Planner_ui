'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            padding: '24px',
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: 480,
                width: '100%',
            }}>
                {/* Animated emoji */}
                <div style={{
                    fontSize: 90,
                    marginBottom: 12,
                    display: 'inline-block',
                    animation: 'wobble 2s ease-in-out infinite',
                }}>
                    😕
                </div>

                {/* 404 number */}
                <div style={{
                    fontSize: 120,
                    fontWeight: 800,
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 8,
                }}>
                    Oops!
                </div>

                {/* Heading */}
                <h1 style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 12px',
                }}>
                    Why did you click that?
                </h1>

                {/* Subtext */}
                <p style={{
                    fontSize: 15,
                    color: '#6b7280',
                    margin: '0 0 36px',
                    lineHeight: 1.6,
                }}>

                </p>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            padding: '12px 28px',
                            borderRadius: 12,
                            border: '2px solid #6366f1',
                            background: 'transparent',
                            color: '#4f46e5',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = '#eef2ff';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                    >
                        ← Go Back
                    </button>

                    <Link
                        href="/home"
                        style={{
                            padding: '12px 28px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            color: '#fff',
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                        }}
                    >
                        Go to Home
                    </Link>
                </div>

                {/* Decorative blobs */}
                <div style={{
                    position: 'fixed', top: 60, left: 60,
                    width: 220, height: 220,
                    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'fixed', bottom: 80, right: 80,
                    width: 280, height: 280,
                    background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />
            </div>

            <style>{`
                @keyframes wobble {
                    0%, 100% { transform: rotate(-4deg) scale(1); }
                    50%       { transform: rotate(4deg) scale(1.08); }
                }
            `}</style>
        </div>
    );
}
