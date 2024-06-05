import React from 'react'
import styles from './styles/Modal.module.css'

const Modal = ( { isOpen, onClose, children } ) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    )
}

export default Modal;