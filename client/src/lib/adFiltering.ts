/**
 * Utilidades para filtrado y ordenamiento de anuncios
 * Implementa la "Regla de Rentabilidad" del documento de especificaciones
 */

export interface Ad {
  ad_delivery_start_time: string | number | undefined;
  ad_creative_bodies: string[] | undefined;
  ad_snapshot_url: string | undefined;
  page_name: string | undefined;
  [key: string]: any;
}

export interface ProcessedAd extends Ad {
  duration_in_days: number;
  is_winner: boolean;
}

/**
 * Calcula la duración en días desde la fecha de inicio del anuncio
 */
export function calculateDuration(startTime: string | number | undefined): number {
  if (!startTime) {
    return 0;
  }
  
  const startDate = typeof startTime === 'string' 
    ? new Date(startTime).getTime() 
    : startTime;
  
  const currentDate = new Date().getTime();
  const durationMs = currentDate - startDate;
  const durationDays = durationMs / (1000 * 60 * 60 * 24);
  
  return Math.floor(durationDays);
}

/**
 * Procesa un anuncio agregando información de duración y estado de ganador
 */
export function processAd(ad: Ad): ProcessedAd {
  const duration_in_days = calculateDuration(ad.ad_delivery_start_time);
  const is_winner = duration_in_days > 30;
  
  return {
    ...ad,
    duration_in_days,
    is_winner,
  };
}

/**
 * Filtra y ordena anuncios según la "Regla de Rentabilidad"
 * 
 * Prioridad 1: Anuncios ganadores (>30 días) - ordenados por más antiguos primero
 * Prioridad 2: Anuncios nuevos (<30 días) - ordenados por más nuevos primero
 * 
 * @param ads Array de anuncios a procesar
 * @param limit Número máximo de anuncios a retornar (default: 4)
 * @returns Array de anuncios procesados y ordenados
 */
export function filterAndSortAds(ads: Ad[], limit: number = 4): ProcessedAd[] {
  // Procesar todos los anuncios
  const processedAds = ads.map(processAd);
  
  // Separar ganadores y no ganadores
  const winners = processedAds.filter(ad => ad.is_winner);
  const nonWinners = processedAds.filter(ad => !ad.is_winner);
  
  // Ordenar ganadores por más antiguos primero (menor duración primero en el array, pero mostrar los más antiguos)
  winners.sort((a, b) => a.duration_in_days - b.duration_in_days);
  
  // Ordenar no ganadores por más nuevos primero
  nonWinners.sort((a, b) => b.duration_in_days - a.duration_in_days);
  
  // Combinar: ganadores primero, luego no ganadores
  const combined = [...winners, ...nonWinners];
  
  // Retornar solo el límite especificado
  return combined.slice(0, limit);
}

/**
 * Obtiene el texto principal del anuncio
 */
export function getAdCopy(ad: ProcessedAd): string {
  if (ad.ad_creative_bodies && ad.ad_creative_bodies.length > 0) {
    return ad.ad_creative_bodies[0];
  }
  return 'Sin texto disponible';
}
