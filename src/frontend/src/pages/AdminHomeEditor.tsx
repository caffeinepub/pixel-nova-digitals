import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAdmin';
import { useGetHomepageContent, useUpdateHomepageContent } from '../hooks/useHomepageContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import RequireAuth from '../components/RequireAuth';
import type { HomePageContent } from '../backend';
import { DEFAULT_HOMEPAGE_CONTENT } from '../lib/homepageDefaults';

function AdminEditorContent() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: content, isLoading: contentLoading } = useGetHomepageContent();
  const updateMutation = useUpdateHomepageContent();

  const [formData, setFormData] = useState<HomePageContent>(DEFAULT_HOMEPAGE_CONTENT);

  useEffect(() => {
    if (content) {
      // Ensure branding object exists with all fields
      setFormData({
        ...content,
        branding: {
          heroBadge: content.branding?.heroBadge || DEFAULT_HOMEPAGE_CONTENT.branding.heroBadge,
          brandName: content.branding?.brandName || DEFAULT_HOMEPAGE_CONTENT.branding.brandName,
          tagLine: content.branding?.tagLine || DEFAULT_HOMEPAGE_CONTENT.branding.tagLine,
          logoFile: content.branding?.logoFile || DEFAULT_HOMEPAGE_CONTENT.branding.logoFile,
        },
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Homepage content updated successfully!');
    } catch (error: any) {
      console.error('Failed to update homepage content:', error);
      toast.error(error.message || 'Failed to update homepage content');
    }
  };

  if (isAdminLoading || contentLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Homepage Content</h1>
          <p className="mt-2 text-muted-foreground">
            Update the text content displayed on the homepage. Changes will be visible immediately after saving.
          </p>
        </div>

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
                  value={formData.branding.logoFile || ''}
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

          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
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
