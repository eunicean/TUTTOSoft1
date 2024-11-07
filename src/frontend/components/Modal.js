import React from 'react';
import '../css/Modal.css';  // Asegúrate de agregar estilos CSS para el modal

function Modal({ isOpen, onClose, sessionId, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Botón para cerrar el modal */}
                <button className="modal-close" onClick={onClose}>X</button>
                
                {/* Si sessionId está presente, lo mostramos */}
                {sessionId && <p>Session ID: {sessionId}</p>}

                {/* Contenido dinámico del modal */}
                {children}
            </div>
        </div>
    );
}

export default Modal;