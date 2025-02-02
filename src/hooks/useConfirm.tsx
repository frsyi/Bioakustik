import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react"
import React, { createContext, useContext, useState } from "react"
  
const ctx = createContext({
    confirm: (message: string, onConfirm: () => void) => {
        if (window.confirm(message)) {
            onConfirm()
        }
    },
})

export const useConfirm = () => useContext(ctx)

export const ConfirmProvider = ({ 
    children,
}: { 
    children: React.ReactNode 
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ConfirmButton, setConfirmButton] = useState<React.ReactNode>()

    const [msg, setMessage] = useState("")
    
    const confirm = (
        message: string, 
        onConfirm: () => void,
        btn? : React.ReactNode
    ) => {
        setMessage(message)
        onOpen()
        setConfirmButton(
            btn || (
                <Button 
                    colorScheme="red" 
                    onClick={() => {
                        onConfirm()
                        onClose()
                    }}
                >
                    Delete
                </Button>
            )
        )
    }

    return (
        <ctx.Provider value={{ confirm }}>
            {children}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmation</ModalHeader>
                    <ModalBody>{msg}</ModalBody>
                    <ModalFooter gap={2}>
                        <Button onClick={onClose}>Cancel</Button>
                        {ConfirmButton}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ctx.Provider>
    )
}