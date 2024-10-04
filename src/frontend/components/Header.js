// Este seria el componete del header.
import React from 'react';

function Header({ title}) {
    const headerStyle = {
        textAlign: 'center' // Alinea el texto en el centro
      };
    
    return <h1 style={headerStyle}>{title}</h1>;
}
export default Header;