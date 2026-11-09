/** Hace que el navegador guarde un Blob como archivo (p. ej. un Excel recibido de la API) */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
	// Se revoca después: algunos navegadores todavía leen la URL tras el click
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
