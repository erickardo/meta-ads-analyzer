/**
 * Cliente para interactuar con la API de Apify
 * Maneja la ejecución del Facebook Ads Scraper
 */

const ACTOR_ID = 'apify~facebook-ads-scraper';
const APIFY_API_URL = 'https://api.apify.com/v2';

export interface ApifyAd {
  ad_delivery_start_time?: string;
  ad_delivery_end_time?: string;
  ad_creative_bodies?: string[];
  ad_snapshot_url?: string;
  page_name?: string;
  adLibraryUrl?: string;
  adCreativeBody?: string;
  adSnapshotUrl?: string;
  pageName?: string;
  startDate?: string;
  pageProfilePictureUrl?: string;
  [key: string]: any;
}

/**
 * Procesa la respuesta de Apify
 * Cada item en el array es UN anuncio individual con su propia información
 */
export function processApifyResponse(data: any[]): ApifyAd[] {
  const ads: ApifyAd[] = [];

  if (!Array.isArray(data)) {
    return ads;
  }

  // Iterar sobre cada item en la respuesta
  // CADA ITEM ES UN ANUNCIO INDIVIDUAL, NO UNA COLECCIÓN
  for (const item of data) {
    const startDate = item.startDateFormatted || item.startDate;
    const endDate = item.endDateFormatted || item.endDate;
    const pageName = item.snapshot?.pageName || item.pageName || 'Unknown';
    const pageProfilePictureUrl = item.snapshot?.pageProfilePictureUrl;
    
    // Obtener la imagen del anuncio
    const imageUrl =
      item.snapshot?.cards?.[0]?.resizedImageUrl ||
      item.snapshot?.cards?.[0]?.originalImageUrl ||
      item.snapshot?.images?.[0]?.resizedImageUrl ||
      item.snapshot?.images?.[0]?.originalImageUrl ||
      '';

    // Obtener el cuerpo del anuncio
    const adBody = item.snapshot?.cards?.[0]?.body || item.snapshot?.body?.text || '';

    const ad: ApifyAd = {
      ad_delivery_start_time: startDate,
      ad_delivery_end_time: endDate,
      page_name: pageName,
      ad_creative_bodies: adBody ? [adBody] : [],
      ad_snapshot_url: imageUrl,
      pageProfilePictureUrl: pageProfilePictureUrl,
      // Campos adicionales para referencia
      adLibraryUrl: item.inputUrl,
      title: item.snapshot?.title,
      linkUrl: item.snapshot?.linkUrl,
      ctaText: item.snapshot?.ctaText,
      startDate: startDate,
      pageName: pageName,
      ...item,
    };

    ads.push(ad);
  }

  return ads;
}

/**
 * Ejecuta el scraper de forma síncrona y obtiene los resultados directamente
 * Este es el método más eficiente para obtener datos
 */
export async function executeFullScrape(
  apiKey: string,
  targetUrl: string,
  onProgress?: (message: string) => void,
  resultsLimit: number = 100
): Promise<ApifyAd[]> {
  try {
    onProgress?.('Iniciando búsqueda de anuncios...');

    const payload = {
      includeAboutPage: false,
      isDetailsPerAd: true,
      onlyTotal: false,
      resultsLimit: resultsLimit,
      startUrls: [
        {
          url: targetUrl,
        },
      ],
    };

    onProgress?.('Enviando request a Apify...');

    const response = await fetch(
      `${APIFY_API_URL}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Error de Apify: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    onProgress?.('Procesando resultados...');

    const rawData = await response.json();
    
    if (!Array.isArray(rawData)) {
      throw new Error('Respuesta inesperada de Apify: se esperaba un array de anuncios');
    }
    
    const processedAds = processApifyResponse(rawData);

    if (processedAds.length === 0) {
      onProgress?.('No se encontraron anuncios en los resultados');
    } else {
      const pageCount = new Set(processedAds.map((a) => a.page_name)).size;
      onProgress?.(
        `Encontrados ${processedAds.length} anuncios de ${pageCount} página(s)`
      );
    }

    return processedAds;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido en Apify';
    onProgress?.(`Error: ${message}`);
    throw error;
  }
}
