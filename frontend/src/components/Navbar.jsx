import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 3rem',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gaps: '1rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Zap color="#00F0FF" size={32} />
           <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
             PROJECT <span className="text-gradient">ONEX</span>
           </h1>
        </Link>
      </div>
      <div>
        {/* Add more links if needed */}
      </div>
    </nav>
  );
};

export default Navbar;
