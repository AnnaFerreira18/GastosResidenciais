import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* Barra de Navegação Superior (Navbar) */}
      <header style={{ 
        backgroundColor: '#1a252f', 
        color: 'white', 
        padding: '15px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '15px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>💰 Controle de Gastos</h2>
          
          <nav>
            <ul style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              gap: '8px',
              justifyContent: 'center'
            }}>
              <li><Link to="/pessoas" style={navLinkStyle}>Pessoas</Link></li>
              <li><Link to="/categorias" style={navLinkStyle}>Categorias</Link></li>
              <li><Link to="/transacoes" style={navLinkStyle}>Transações</Link></li>
              <li><Link to="/relatorios" style={navLinkStyle}>Relatórios</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ 
        flex: 1, 
        backgroundColor: '#f4f6f8', 
        padding: '20px 10px' // Menos padding nas laterais para telas pequenas
      }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
          overflowX: 'auto' //scroll horizontal na tabela se a tela for pequena
        }}>
          <Outlet /> 
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '15px', fontSize: '0.8rem', color: '#7f8c8d' }}>
        © 2026 Controle de Gastos Residenciais
      </footer>
    </div>
  );
}
// Estilo isolado para os links 
const navLinkStyle = {
  color: '#ecf0f1',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 12px',
  borderRadius: '6px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  whiteSpace: 'nowrap', 
  transition: 'background 0.2s'
};