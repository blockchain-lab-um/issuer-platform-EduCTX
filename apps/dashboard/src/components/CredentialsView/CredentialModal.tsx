import { useModalStore } from '@/stores/modalStore';
import { Modal, ModalContent } from '@nextui-org/react';

export const CredentialModal = () => {
  const isOpen = useModalStore.use.isCredentialModalOpen();
  const credential = useModalStore.use.selectedCredential();
  const setIsOpen = useModalStore.use.setIsCredentialModalOpen();

  return (
    <Modal
      className="p-8 overflow-auto max-w-2xl"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className="overflow-auto">
        <textarea
          className="dark:text-navy-blue-800 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none"
          disabled
          value={JSON.stringify(credential, null, 4)}
        />
      </ModalContent>
    </Modal>
  );
};
