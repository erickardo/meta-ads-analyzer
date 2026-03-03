/**
 * Panel de Autenticación
 * Permite al usuario guardar su API Key de Apify
 * Diseño minimalista con enfoque en datos
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AuthPanelProps {
  onApiKeyChange: (key: string) => void;
  initialApiKey?: string;
}

export default function AuthPanel({
  onApiKeyChange,
  initialApiKey = '',
}: AuthPanelProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('apify_api_key', apiKey);
      onApiKeyChange(apiKey);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const isKeySet = apiKey.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">API Key de Apify</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              Obtén tu API Key en{' '}
              <a
                href="https://console.apify.com/account/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                console.apify.com
              </a>
              . Tu clave se guarda localmente en el navegador.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="relative">
        <Input
          type={showKey ? 'text' : 'password'}
          placeholder="Pega tu API Key aquí..."
          value={apiKey}
          onChange={handleChange}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <Button
        onClick={handleSave}
        disabled={!isKeySet}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        Guardar API Key
      </Button>

      {isKeySet && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          API Key guardada
        </div>
      )}
    </div>
  );
}
