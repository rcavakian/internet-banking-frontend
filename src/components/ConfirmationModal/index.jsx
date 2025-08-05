import './ConfirmationModal.css';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title || 'Confirmar Ação'}</h2>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-button cancel">Cancelar</button>
                    <button onClick={onConfirm} className="modal-button confirm">Confirmar</button>
                </div>
            </div>
        </div>
    );
}