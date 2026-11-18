import { useModalStore } from '@/stores/modalStore';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tabs,
  Tab,
} from '@nextui-org/react';

type JsonModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  data: any;
};

export const JsonModal = ({
  isOpen,
  setIsOpen,
  title,
  data,
}: JsonModalProps) => {
  return (
    <Modal
      className="p-8 overflow-auto max-w-2xl"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalContent className="overflow-auto">
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {data && Array.isArray(data) ? (
            <Tabs>
              {data.map((item, index) => (
                <Tab key={index} title={`Credential ${index + 1}`}>
                  <textarea
                    className="dark:text-navy-blue-800 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none"
                    disabled
                    value={JSON.stringify(item, null, 4)}
                  />
                </Tab>
              ))}
            </Tabs>
          ) : (
            <textarea
              className="dark:text-navy-blue-800 dark:bg-navy-blue-300 scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono min-h-[60vh] w-full resize-none rounded-2xl bg-gray-100 p-2 text-gray-700 focus:outline-none"
              disabled
              value={JSON.stringify(data, null, 4)}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
