import React, { useState } from 'react';

function CancelSessionView({ sessionId }) {
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    const handleCancelSession = async () => {
        const token = localStorage.getItem('token');
        if (!reason) {
            setMessage('El motivo de la cancelación es obligatorio');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/cancel-session', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, reason }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Sesión cancelada y motivo guardado exitosamente');
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al cancelar la sesión:', error);
            setMessage('Error al cancelar la sesión');
        }
    };

    return (
        <div>
            <h1>Cancelar Sesión</h1>
            <div>
                <label>
                    Motivo de la Cancelación:
                    <input 
                        type="text" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                    />
                </label>
            </div>
            <button onClick={handleCancelSession}>Cancelar Sesión</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CancelSessionView;
