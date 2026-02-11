import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from './LoginButton';
import { useState } from 'react';

export default function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Text to Image', path: '/text-to-image' },
    { label: 'Text to Video', path: '/text-to-video' },
    { label: 'Text to Voiceover', path: '/text-to-voiceover' },
    { label: 'My History', path: '/my-history' },
  ];

  const handleNavClick = (path: string) => {
    setOpen(false);
    navigate({ to: path });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src="/assets/generated/pnd-logo.dim_512x512.png" alt="PIXEL NOVA DIGITALS" className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">PIXEL NOVA DIGITALS</span>
            <span className="text-xs text-muted-foreground">100% Free AI Tools</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LoginButton />
          
          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-8">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="text-left text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
