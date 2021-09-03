export interface DropzoneProps {
    disabled?: boolean;
    alwaysActive?: boolean;
    onDropCallback: (e: React.DragEvent) => any;
}