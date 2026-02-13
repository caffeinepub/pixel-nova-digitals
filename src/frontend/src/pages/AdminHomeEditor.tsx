import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useGetHomepageContent, useUpdateHomepageContent } from '../hooks/useHomepageContent';
import { useRetireWebsite, useReactivateWebsite, usePurgeData } from '../hooks/useWebsiteAdminActions';
import { useWebsiteStatus } from '../hooks/useWebsiteStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Save, AlertCircle, Copy, ExternalLink, CheckCircle, AlertTriangle, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';
import RequireAuth from '../components/RequireAuth';
import type { HomePageContent } from '../backend';
import { DEFAULT_HOMEPAGE_CONTENT } from '../lib/homepageDefaults';

function AdminEditorContent() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: content, isLoading: contentLoading } = useGetHomepageContent();
  const { data: websiteStatus, isLoading: statusLoading } = useWebsiteStatus();
  const updateMutation = useUpdateHomepageContent();
  const retireMutation = useRetireWebsite();
  const reactivateMutation = useReactivateWebsite();
  const purgeMutation = usePurgeData();

  const [formData, setFormData] = useState<HomePageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [showLiveSite, setShowLiveSite] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [retireMessage, setRetireMessage] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const isRetired = websiteStatus?.__kind__ === 'retired';

  useEffect(() => {
    if (content) {
      setFormData({
        heroTitle: content.heroTitle ?? DEFAULT_HOMEPAGE_CONTENT.heroTitle,
        heroSubtitle: content.heroSubtitle ?? DEFAULT_HOMEPAGE_CONTENT.heroSubtitle,
        freeSection: content.freeSection ?? DEFAULT_HOMEPAGE_CONTENT.freeSection,
        premiumSection: content.premiumSection ?? DEFAULT_HOMEPAGE_CONTENT.premiumSection,
        branding: {
          heroBadge: content.branding?.heroBadge ?? DEFAULT_HOMEPAGE_CONTENT.branding.heroBadge,
          brandName: content.branding?.brandName ?? DEFAULT_HOMEPAGE_CONTENT.branding.brandName,
          tagLine: content.branding?.tagLine ?? DEFAULT_HOMEPAGE_CONTENT.branding.tagLine,
          logoFile: content.branding?.logoFile ?? DEFAULT_HOMEPAGE_CONTENT.branding.logoFile,
        },
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Homepage content updated successfully!');
      
      const origin = window.location.origin;
      setLiveUrl(origin);
      setShowLiveSite(true);
    } catch (error: any) {
      console.error('Failed to update homepage content:', error);
      toast.error(error.message || 'Failed to update homepage content');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleOpenLiveSite = () => {
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRetireWebsite = async () => {
    if (confirmText !== 'RETIRE') {
      toast.error('Please type RETIRE to confirm');
      return;
    }

    try {
      const message = retireMessage.trim() || null;
      await retireMutation.mutateAsync(message);
      toast.success('Website has been retired');
      setConfirmText('');
      setRetireMessage('');
    } catch (error: any) {
      console.error('Failed to retire website:', error);
      toast.error(error.message || 'Failed to retire website');
    }
  };

  const handleReactivateWebsite = async () => {
    try {
      await reactivateMutation.mutateAsync();
      toast.success('Website has been reactivated');
    } catch (error: any) {
      console.error('Failed to reactivate website:', error);
      toast.error(error.message || 'Failed to reactivate website');
    }
  };

  const handlePurgeData = async () => {
    if (confirmText !== 'PURGE') {
      toast.error('Please type PURGE to confirm');
      return;
    }

    try {
      await purgeMutation.mutateAsync();
      toast.success('All user data has been purged');
      setConfirmText('');
    } catch (error: any) {
      console.error('Failed to purge data:', error);
      toast.error(error.message || 'Failed to purge data');
    }
  };

  if (isAdminLoading || contentLoading || statusLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-md border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access this page. Only administrators can edit homepage content.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage homepage content and website lifecycle.
          </p>
        </div>

        {showLiveSite && (
          <Card className="mb-6 border-success bg-success/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle className="text-success">Live Site</CardTitle>
              </div>
              <CardDescription>
                Your changes are now live. Share your site or preview it below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-md bg-background p-3">
                <code className="flex-1 text-sm">{liveUrl}</code>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleOpenLiveSite}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Live Site
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Website Shutdown Controls */}
        <Card className="mb-6 border-retired-border bg-retired-surface">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-retired-emphasis" />
              <CardTitle className="text-retired-emphasis">Website Shutdown Controls</CardTitle>
            </div>
            <CardDescription className="text-retired-foreground">
              {isRetired
                ? 'The website is currently retired. You can reactivate it or purge all user data.'
                : 'Permanently retire this website and optionally purge all user data.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isRetired ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retireMessage" className="text-retired-foreground">
                    Public Message (Optional)
                  </Label>
                  <Textarea
                    id="retireMessage"
                    value={retireMessage}
                    onChange={(e) => setRetireMessage(e.target.value)}
                    placeholder="Enter a message to display to visitors (optional)"
                    rows={3}
                    className="bg-background"
                  />
                  <p className="text-xs text-retired-foreground">
                    This message will be shown to visitors on the retired site page.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      disabled={retireMutation.isPending}
                    >
                      {retireMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                      Retire Website
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Retire Website</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-4">
                        <p>
                          This will retire the website and show a shutdown notice to all non-admin visitors.
                          You can reactivate it later if needed.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="confirmRetire">Type RETIRE to confirm</Label>
                          <Input
                            id="confirmRetire"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="RETIRE"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRetireWebsite}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Retire Website
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-retired-emphasis/10 p-4">
                  <p className="text-sm font-medium text-retired-emphasis">
                    Website Status: Retired
                  </p>
                  {websiteStatus.__kind__ === 'retired' && websiteStatus.retired.message && (
                    <p className="mt-2 text-sm text-retired-foreground">
                      Public message: "{websiteStatus.retired.message}"
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleReactivateWebsite}
                  disabled={reactivateMutation.isPending}
                >
                  {reactivateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                  Reactivate Website
                </Button>

                <div className="my-4 h-px bg-retired-border" />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      disabled={purgeMutation.isPending}
                    >
                      {purgeMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Purge All User Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Purge All User Data</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-4">
                        <p className="font-semibold text-destructive">
                          This action is irreversible and will permanently delete:
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                          <li>All user profiles</li>
                          <li>All generation history records</li>
                        </ul>
                        <p>This operation can only be performed while the website is retired.</p>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPurge">Type PURGE to confirm</Label>
                          <Input
                            id="confirmPurge"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="PURGE"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePurgeData}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Purge Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Homepage Content Editor */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Configure site branding, logo, and header information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={formData.branding.brandName}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    branding: { ...formData.branding, brandName: e.target.value }
                  })}
                  placeholder="Enter brand name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagLine">Header Tagline</Label>
                <Input
                  id="tagLine"
                  value={formData.branding.tagLine}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    branding: { ...formData.branding, tagLine: e.target.value }
                  })}
                  placeholder="Enter header tagline"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoFile">Logo Source</Label>
                <Input
                  id="logoFile"
                  value={formData.branding.logoFile ?? ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    branding: { ...formData.branding, logoFile: e.target.value }
                  })}
                  placeholder="Enter logo path (e.g., /assets/logo.png)"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter an asset path (e.g., /assets/logo.png) or a full URL
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroBadge">Hero Badge Text</Label>
                <Input
                  id="heroBadge"
                  value={formData.branding.heroBadge}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    branding: { ...formData.branding, heroBadge: e.target.value }
                  })}
                  placeholder="Enter hero badge text"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main headline and subtitle displayed at the top of the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Enter hero title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  placeholder="Enter hero subtitle"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Sections</CardTitle>
              <CardDescription>Text displayed in the features section at the bottom of the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="freeSection">Free Section Text</Label>
                <Textarea
                  id="freeSection"
                  value={formData.freeSection}
                  onChange={(e) => setFormData({ ...formData, freeSection: e.target.value })}
                  placeholder="Enter free section description"
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premiumSection">Premium Section Text</Label>
                <Textarea
                  id="premiumSection"
                  value={formData.premiumSection}
                  onChange={(e) => setFormData({ ...formData, premiumSection: e.target.value })}
                  placeholder="Enter premium section description"
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminHomeEditor() {
  return (
    <RequireAuth>
      <AdminEditorContent />
    </RequireAuth>
  );
}
