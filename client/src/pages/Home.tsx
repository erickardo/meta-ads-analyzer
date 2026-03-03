/**
 * Página Principal - Meta Ads Analyzer
 * Layout asimétrico: panel de búsqueda a la izquierda, galería de resultados a la derecha
 * Diseño minimalista con enfoque en datos
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import AuthPanel from '@/components/AuthPanel';
import AdCard from '@/components/AdCard';
import { executeFullScrape, processApifyResponse } from '@/lib/apifyClient';
import { filterAndSortAds, ProcessedAd, Ad } from '@/lib/adFiltering';
import { getMockAds } from '@/lib/mockData';
import { Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [resultsLimit, setResultsLimit] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProcessedAd[]>([]);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  // Cargar API Key guardada al montar
  useEffect(() => {
    const savedKey = localStorage.getItem('apify_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
  };

  const handleSearch = async () => {
    // Validaciones
    if (!apiKey.trim()) {
      toast.error('Por favor, ingresa tu API Key de Apify');
      return;
    }

    if (!targetUrl.trim()) {
      toast.error('Por favor, ingresa la URL de Instagram o Facebook');
      return;
    }

    setIsLoading(true);
    setError('');
    setProgress('');
    setResults([]);

    try {
      // Usar datos de ejemplo si la URL contiene 'mock'
      let rawData;

      if (targetUrl.toLowerCase().includes('mock')) {
        setProgress('Usando datos de ejemplo...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResponse = getMockAds();
        rawData = processApifyResponse(mockResponse as any);
      } else {
        // Ejecutar scrape real
        rawData = await executeFullScrape(
          apiKey,
          targetUrl,
          (message) => {
            setProgress(message);
          },
          resultsLimit
        );
      }

      if (!rawData || rawData.length === 0) {
        setError('No se encontraron anuncios para esta página.');
        toast.error('No se encontraron anuncios');
        return;
      }

      // Filtrar y ordenar
      const processedResults = filterAndSortAds(rawData as any, resultsLimit);
      setResults(processedResults);

      const winnerCount = processedResults.filter((ad) => ad.is_winner).length;
      toast.success(
        `Se encontraron ${processedResults.length} anuncios (${winnerCount} ganadores)`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Meta Ads Analyzer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Descubre los anuncios ganadores (30+ días activos)
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Izquierdo - Búsqueda y Autenticación */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Tarjeta de Autenticación */}
              <Card className="p-6 bg-card border border-border">
                <AuthPanel
                  onApiKeyChange={handleApiKeyChange}
                  initialApiKey={apiKey}
                />
              </Card>

              {/* Tarjeta de Búsqueda */}
              <Card className="p-6 bg-card border border-border">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      URL de Búsqueda
                    </label>
                    <Input
                      placeholder="https://www.facebook.com/ads/library/?..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Pega la URL de Meta Ad Library, perfil de Facebook o Instagram que deseas analizar
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Límite de Resultados
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={resultsLimit}
                      onChange={(e) => setResultsLimit(Math.max(1, parseInt(e.target.value) || 4))}
                      disabled={isLoading}
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Número máximo de anuncios a buscar (1-100)
                    </p>
                  </div>

                  <Button
                    onClick={handleSearch}
                    disabled={isLoading || !apiKey.trim()}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analizar Ads Ganadores
                      </>
                    )}
                  </Button>

                  {/* Progress */}
                  {progress && (
                    <div className="text-xs text-muted-foreground text-center py-2">
                      {progress}
                    </div>
                  )}
                </div>
              </Card>

              {/* Información de Ayuda */}
              <Card className="p-4 bg-muted/30 border border-border">
                <h4 className="text-xs font-semibold text-foreground mb-2">
                  ¿Cómo funciona?
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>1. Ingresa tu API Key de Apify</li>
                  <li>2. Pega la URL del perfil a analizar</li>
                  <li>3. Espera 1-2 minutos mientras se escanean los anuncios</li>
                  <li>4. Visualiza los 4 mejores anuncios ganadores</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Panel Derecho - Resultados */}
          <div className="lg:col-span-2">
            {error && (
              <Card className="p-4 bg-destructive/10 border border-destructive/20 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive text-sm">
                      Error en la búsqueda
                    </h3>
                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            )}

            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Anuncios Ganadores Encontrados
                  </h2>
                </div>

                {/* Separador visual */}
                <div className="h-px bg-border mb-6" />

                {/* Grid de anuncios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((ad, index) => (
                    <div key={index} className="animate-fade-in">
                      <AdCard ad={ad} />
                    </div>
                  ))}
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Nota:</span> Los anuncios se ordenan por antigüedad (los más antiguos primero son los más "probados").
                    Los anuncios con más de 30 días activos se marcan como "Ganadores".
                  </p>
                </div>
              </div>
            )}

            {!results.length && !isLoading && !error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Comienza tu análisis
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ingresa una URL de Instagram o Facebook para descubrir anuncios ganadores
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Analizando anuncios...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esto puede tomar 1-2 minutos. Por favor, espera.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
