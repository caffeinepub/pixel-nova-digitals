import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'pixel-nova-digitals';

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold">PIXEL NOVA DIGITALS</p>
            <p className="text-xs text-muted-foreground">100% Free AI-Powered Creative Tools</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
            <p>© {currentYear} PIXEL NOVA DIGITALS. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 fill-primary text-primary" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
