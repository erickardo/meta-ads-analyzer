/**
 * Componente Lightbox para mostrar imágenes en grande
 * Permite ver la imagen completa sin cortes
 */

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  src: string;
  alt: string;
  pageName: string;
}

export default function ImageLightbox({ src, alt, pageName }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Contenedor de imagen con ícono de zoom */}
      <div className="relative h-48 bg-muted overflow-hidden group cursor-pointer">
        {src ? (
          <>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
            />
            {/* Overlay con ícono de zoom */}
            <div
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="bg-white/90 p-3 rounded-full">
                <ZoomIn className="w-5 h-5 text-black" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen disponible
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && src && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Imagen en grande */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain rounded-lg"
            />

            {/* Información */}
            <div className="text-white text-center mt-4">
              <p className="text-sm font-medium">Anuncio de {pageName}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
