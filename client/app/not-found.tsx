export default function NotFound() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>404 - Page Not Found</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Go Home
            </a>
        </div>
    );
}