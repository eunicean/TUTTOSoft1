import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'; 

const Header = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <header className={`header ${isSidebarOpen ? 'header-open' : 'header-closed'}`}>
            <button className="menu-button" onClick={toggleSidebar}>
                ☰
            </button>
            <Link to='/sessions' className="link">
                <h1 className="title">SISTEMA TUTO</h1>
            </Link>
        </header>
    );
};

export default Header;
