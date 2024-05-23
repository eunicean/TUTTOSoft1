// componente del boton.
import React from 'react';

/* 
onClick: es el metodo que va a mandar el boton.
chlidren: texto que va a decir cada boton.
*/
function Button ({onClick, children}) {
    return <button onClick={onClick}>{children}</button>;
}

export default Button; 
