'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: '100%',
        padding: '14px 16px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#888',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}
    >
      <span>© {currentYear} EduPlanner</span>
      <span style={{ color: '#555' }}>·</span>
      <a
        href="https://buymemomo.com/Prabesh1sharma"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '5px 14px',
          borderRadius: '999px',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 18px rgba(245, 158, 11, 0.55)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.35)';
        }}
      >
        🥟 Buy Me a Momo
      </a>
    </footer>
  );
}
