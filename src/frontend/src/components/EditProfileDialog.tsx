import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, UserPen } from 'lucide-react';
import { toast } from 'sonner';

interface EditProfileDialogProps {
  children?: React.ReactNode;
}

export default function EditProfileDialog({ children }: EditProfileDialogProps) {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: isSaving } = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  // Pre-fill the current name when dialog opens
  useEffect(() => {
    if (open && userProfile) {
      setName(userProfile.name);
    }
  }, [open, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile(
        { name: name.trim() },
        {
          onSuccess: () => {
            toast.success('Profile updated successfully!');
            setOpen(false);
          },
          onError: (error) => {
            toast.error('Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <UserPen className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your display name. This is how others will see you.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Your Name</Label>
            <Input
              id="edit-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving || profileLoading}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
