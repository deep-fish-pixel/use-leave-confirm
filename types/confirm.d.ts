export default function (options: {
    confirm?: () => void;
    cancel?: () => void;
    contentText: string;
    confirmText: string;
    cancelText: string;
}): {
    show(): void;
    close(): void;
    cancel(): void;
    confirm(): void;
};
