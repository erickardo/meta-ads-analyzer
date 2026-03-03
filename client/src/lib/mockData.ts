/**
 * Datos de ejemplo para testing
 * Estructura que coincide con la respuesta real de Apify
 */

export function getMockAds() {
  const now = new Date();
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      inputUrl: 'https://www.instagram.com/estudiose.aimkt/',
      pageID: '123456789',
      adArchiveID: 'ad_001',
      startDateFormatted: daysAgo(45),
      endDateFormatted: now.toISOString(),
      snapshot: {
        pageName: 'Estudios E',
        pageProfilePictureUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        cards: [
          {
            body: 'Descubre nuestros cursos de marketing digital. ¡Aprende de los mejores!',
            title: 'Cursos de Marketing Digital',
            ctaText: 'Saber más',
            originalImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
            resizedImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
          },
        ],
      },
    },
    {
      inputUrl: 'https://www.instagram.com/estudiose.aimkt/',
      pageID: '123456789',
      adArchiveID: 'ad_002',
      startDateFormatted: daysAgo(60),
      endDateFormatted: now.toISOString(),
      snapshot: {
        pageName: 'Estudios E',
        pageProfilePictureUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        cards: [
          {
            body: 'Sé un experto en redes sociales. Certificación internacional incluida.',
            title: 'Experto en Redes Sociales',
            ctaText: 'Inscribirse',
            originalImageUrl:
              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop',
            resizedImageUrl:
              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop',
          },
        ],
      },
    },
    {
      inputUrl: 'https://www.instagram.com/estudiose.aimkt/',
      pageID: '123456789',
      adArchiveID: 'ad_003',
      startDateFormatted: daysAgo(35),
      endDateFormatted: now.toISOString(),
      snapshot: {
        pageName: 'Estudios E',
        pageProfilePictureUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        cards: [
          {
            body: 'Masterclass exclusiva: Estrategias de marketing que generan resultados reales.',
            title: 'Masterclass de Marketing',
            ctaText: 'Reservar lugar',
            originalImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
            resizedImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
          },
        ],
      },
    },
    {
      inputUrl: 'https://www.instagram.com/estudiose.aimkt/',
      pageID: '123456789',
      adArchiveID: 'ad_004',
      startDateFormatted: daysAgo(90),
      endDateFormatted: now.toISOString(),
      snapshot: {
        pageName: 'Estudios E',
        pageProfilePictureUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        cards: [
          {
            body: 'Únete a miles de emprendedores que han transformado su negocio con nuestros cursos.',
            title: 'Transformación Empresarial',
            ctaText: 'Comenzar ahora',
            originalImageUrl:
              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop',
            resizedImageUrl:
              'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=500&fit=crop',
          },
        ],
      },
    },
    {
      inputUrl: 'https://www.instagram.com/estudiose.aimkt/',
      pageID: '123456789',
      adArchiveID: 'ad_005',
      startDateFormatted: daysAgo(5),
      endDateFormatted: now.toISOString(),
      snapshot: {
        pageName: 'Estudios E',
        pageProfilePictureUrl:
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        cards: [
          {
            body: 'Promoción especial: 50% de descuento en todos nuestros cursos este mes.',
            title: 'Oferta Especial 50% OFF',
            ctaText: 'Aprovechar',
            originalImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
            resizedImageUrl:
              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
          },
        ],
      },
    },
  ];
}
