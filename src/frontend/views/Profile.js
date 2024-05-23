import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../css/Sidebar.css';
import '../css/Navbar.css';

function Profile() {

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
            <Navbar />
        </>

    );

}

export default Profile;