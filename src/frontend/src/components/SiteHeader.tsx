import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, UserPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoginButton from './LoginButton';
import EditProfileDialog from './EditProfileDialog';
import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetHomepageContent } from '../hooks/useHomepageContent';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useWebsiteStatus } from '../hooks/useWebsiteStatus';
import { mergeWithDefaults } from '../lib/homepageDefaults';

export default function SiteHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: backendContent } = useGetHomepageContent();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: websiteStatus } = useWebsiteStatus();

  const content = mergeWithDefaults(backendContent ?? null);
  const { brandName, tagLine, logoFile } = content.branding;

  const isAuthenticated = !!identity;
  const showAdminLink = isAuthenticated && isAdmin;
  const isRetired = websiteStatus?.__kind__ === 'retired';
  const hideNavForNonAdmin = isRetired && !isAdmin;

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Text to Image', path: '/text-to-image' },
    { label: 'Text to Video', path: '/text-to-video' },
    { label: 'Text to Voiceover', path: '/text-to-voiceover' },
    { label: 'My History', path: '/my-history' },
  ];

  if (showAdminLink) {
    navItems.push({ label: 'Admin', path: '/admin' });
  }

  const handleNavClick = (path: string) => {
    setOpen(false);
    navigate({ to: path });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <img src={logoFile ?? '/assets/IMG_20260211_093115.png'} alt={brandName} className="h-10 w-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">{brandName}</span>
            <span className="text-xs text-muted-foreground">{tagLine}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!hideNavForNonAdmin && (
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
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated && userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <span className="text-sm font-medium">{userProfile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <EditProfileDialog>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <UserPen className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                </EditProfileDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <LoginButton />
          
          {/* Mobile Navigation */}
          {!hideNavForNonAdmin && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 pt-8">
                  {isAuthenticated && userProfile && (
                    <>
                      <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                        Signed in as {userProfile.name}
                      </div>
                      <EditProfileDialog>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <UserPen className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </EditProfileDialog>
                      <div className="my-2 h-px bg-border" />
                    </>
                  )}
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
          )}
        </div>
      </div>
    </header>
  );
}
