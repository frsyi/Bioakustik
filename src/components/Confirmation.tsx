import {
    Button,
    ButtonProps,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
  } from "@chakra-ui/react"
  
  type ConfirmationModalProps = {
    onClose: () => void
    isOpen: boolean
    onConfirm?: () => void
    confirmLabel?: string
    title?: string
    children?: React.ReactNode
    _confirmButton?: ButtonProps
  }
  
  const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    confirmLabel,
    title,
    children,
    _confirmButton,
  }: ConfirmationModalProps) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button mr={3} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (onConfirm) onConfirm()
                onClose()
              }}
              colorScheme="purple"
              bgColor="purple"
              {..._confirmButton}
            >
              {confirmLabel || "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  
  export default ConfirmationModal
  