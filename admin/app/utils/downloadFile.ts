/**
 * Utility function to trigger a browser download of a file
 * @param file - The File object to download
 * @param filename - Optional custom filename (defaults to original filename)
 */
export function downloadFile(file: File, filename?: string): void {
    // Create a temporary URL for the file
    const url = URL.createObjectURL(file);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || file.name;

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the temporary URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
