// este es el componente del input...
import React from 'react';

/* 
* type: es el tipo de entrada que va a recibir el input. 
* placeholder: texto que va a llevar cada input.
*/
function Input({ type, placeholder }) {
    return <input type={type} placeholder={placeholder} />;
}

export default Input; 