/**
 * Un click "fuera del modal" es solo el del backdrop, nunca el del padding del panel.
 * Como el <dialog> es el propio panel visible (bg + p-7), `event.target === dialog`
 * también se cumple al clickear su padding. Comparamos las coordenadas contra la caja
 * del panel: dentro del rect = panel (no cerrar), fuera = backdrop (cerrar).
 */
export function isBackdropClick(event: MouseEvent, dialog: HTMLDialogElement | null | undefined): boolean {
    if (!dialog || event.target !== dialog) return false;

    const rect = dialog.getBoundingClientRect();

    return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    );
}
