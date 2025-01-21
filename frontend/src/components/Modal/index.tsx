import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; 
  }

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <div>{children}</div>
        <button
          className={styles.close_button}
          onClick={onClose}
        >
          confirmar
        </button>
      </div>
    </div>
  );
};

export default Modal;
