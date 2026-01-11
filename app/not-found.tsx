export default function NotFound() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '50px 20px',
      background: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#333' }}>404 - Not Found</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>The requested page could not be found.</p>
    </div>
  );
}

