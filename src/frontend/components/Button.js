import React from 'react'; 
const Button = ({ onClick, text }) => {
    return (
        <button onClick={onClick}
        style={{
            backgroundColor: '#804000',
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '13px', 
            border: 'none',
            cursor: 'pointer', 
             }}>
        {text}
        </button>
    );
}

export default Button; 
       