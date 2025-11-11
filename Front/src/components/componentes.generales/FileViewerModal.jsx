import { useEffect, useState } from 'react';

export default function FileViewerModal({ url, onClose }) {
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    // Si la URL no es absoluta, construir la URL completa
    let fullUrl = url;
    if (!url.startsWith('http') && !url.startsWith('blob:')) {
      // Eliminar barras iniciales para evitar dobles barras
      const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
      fullUrl = `${window.location.origin}/${cleanUrl}`;
    }
    
    setFileUrl(fullUrl);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    if (!fileUrl) return;
    
    // Abrir el archivo en una nueva pestaña
    const newTab = window.open('', '_blank');
    if (newTab) {
      // Si es un PDF, abrirlo directamente
      if (fileUrl.toLowerCase().endsWith('.pdf')) {
        newTab.location.href = fileUrl;
      } 
      // Si es un documento de Word, usar Google Docs Viewer
      else if (fileUrl.toLowerCase().match(/\.(docx|doc)$/)) {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}`;
        newTab.location.href = viewerUrl;
      } 
      // Para otros tipos de archivo, intentar abrirlos directamente
      else {
        newTab.location.href = fileUrl;
      }
    }
    
    // Cerrar la ventana modal después de abrir el archivo
    onClose();
  }, [fileUrl, onClose]);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Abriendo documento...</p>
      </div>
    </div>
  );
}
