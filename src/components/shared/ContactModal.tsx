import Modal from './Modal';
import ContactForm from './ContactForm';

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ContactForm onSuccess={onClose} />
    </Modal>
  );
};

export default ContactModal;
