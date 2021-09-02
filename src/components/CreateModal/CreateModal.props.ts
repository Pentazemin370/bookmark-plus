export interface CreateModalProps {
    show: boolean;
    setModalOpen: (...args: any) => void;
    forceUpdateCallback: (...args: any) => void;
}