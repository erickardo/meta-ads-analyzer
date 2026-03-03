/**
 * Tarjeta de Anuncio Individual
 * Muestra información del anuncio con badge de ganador
 * Diseño minimalista con enfoque en datos
 */

import { ProcessedAd, getAdCopy } from '@/lib/adFiltering';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Flame } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

interface AdCardProps {
  ad: ProcessedAd;
}

export default function AdCard({ ad }: AdCardProps) {
  const adCopy = getAdCopy(ad);
  const isWinner = ad.is_winner;

  // Obtener la URL del anuncio en Meta Ad Library
  const metaAdLibraryUrl = ad.adLibraryUrl || ad.inputUrl || '#';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
      {/* Imagen del anuncio con Lightbox */}
      <div className="relative">
        <ImageLightbox
          src={ad.ad_snapshot_url || ''}
          alt={`Anuncio de ${ad.page_name}`}
          pageName={ad.page_name || 'Unknown'}
        />

        {/* Badge de ganador */}
        {isWinner && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-semibold">
              Ganador: {ad.duration_in_days} días
            </span>
          </div>
        )}

        {/* Badge de días activos para no ganadores */}
        {!isWinner && (
          <div className="absolute top-3 right-3 bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            {ad.duration_in_days} días
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-3">
        {/* Nombre de la página */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Página
          </p>
          <p className="text-sm font-semibold text-foreground truncate">
            {ad.page_name}
          </p>
        </div>

        {/* Texto del anuncio */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Cuerpo del Anuncio
          </p>
          <p className="text-sm text-foreground line-clamp-3">
            {adCopy}
          </p>
        </div>

        {/* Duración detallada */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Activo desde hace{' '}
            <span className="font-semibold text-foreground">
              {ad.duration_in_days} días
            </span>
          </p>
        </div>

        {/* Botón de acción */}
        <Button
          asChild
          variant="outline"
          className="w-full mt-2"
        >
          <a
            href={metaAdLibraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Analizar en Meta
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
