// components/KeyGeneration.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, KeyRound, Copy, CheckCircle } from 'lucide-react';
import { makeExtensionRequest } from '@/lib/api';

export function KeyGeneration({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      const response = await makeExtensionRequest(
        `/api/extension/tool/stratum/public-key`,
        { method: 'GET' }
      );
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch public key');
      }

      setPublicKey(data.publicKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!publicKey) return;
    
    const text = `NEXT_PUBLIC_ENCRYPTION_KEY="${publicKey}"`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Encryption Key
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : publicKey ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Public Key</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <code className="block p-2 bg-secondary rounded text-xs overflow-x-auto">
              NEXT_PUBLIC_ENCRYPTION_KEY="{publicKey}"
            </code>
            <p className="text-xs text-muted-foreground">
              Add this to your project's .env.local file
            </p>
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              No public key is configured. Please contact support.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}