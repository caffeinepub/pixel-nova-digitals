import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useWebsiteStatus } from '../hooks/useWebsiteStatus';

export default function SiteRetired() {
  const { data: websiteStatus } = useWebsiteStatus();

  const publicMessage =
    websiteStatus?.__kind__ === 'retired' && websiteStatus.retired.message
      ? websiteStatus.retired.message
      : null;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="mx-auto max-w-2xl border-retired-border bg-retired-surface">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-retired-emphasis/10">
            <AlertCircle className="h-8 w-8 text-retired-emphasis" />
          </div>
          <CardTitle className="text-3xl font-bold text-retired-emphasis">
            This Website Has Been Retired
          </CardTitle>
          <CardDescription className="mt-4 text-base text-retired-foreground">
            This site is no longer active and has been permanently shut down.
          </CardDescription>
        </CardHeader>
        {publicMessage && (
          <CardContent className="text-center">
            <div className="rounded-lg bg-background/50 p-4">
              <p className="text-sm text-retired-foreground">{publicMessage}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
