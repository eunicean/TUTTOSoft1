import React, { useState } from 'react';
import './Horario.css';

const Horario = () => {
    const [selected, setSelected] = useState('');

    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <div className="horario-container">
            <div className={`horario-option ${selected === 'manana' ? 'selected' : ''}`} onClick={() => handleSelect('manana')}>
                Mañana
            </div>
            <div className={`horario-option ${selected === 'tarde' ? 'selected' : ''}`} onClick={() => handleSelect('tarde')}>
                Tarde
            </div>
            <div className={`horario-option ${selected === 'noche' ? 'selected' : ''}`} onClick={() => handleSelect('noche')}>
                Noche
            </div>
        </div>
    );
};

export default Horario;

