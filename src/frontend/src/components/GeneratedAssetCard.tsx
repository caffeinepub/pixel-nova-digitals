import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface GeneratedAssetCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onDownload?: () => void;
  downloadLabel?: string;
  isGenerating?: boolean;
}

export default function GeneratedAssetCard({
  title,
  description,
  children,
  onDownload,
  downloadLabel = 'Download',
  isGenerating = false,
}: GeneratedAssetCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border bg-muted/30">
          {isGenerating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating...</p>
              </div>
            </div>
          )}
          {children}
        </div>
        {onDownload && (
          <Button onClick={onDownload} className="w-full gap-2" disabled={isGenerating}>
            <Download className="h-4 w-4" />
            {downloadLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
