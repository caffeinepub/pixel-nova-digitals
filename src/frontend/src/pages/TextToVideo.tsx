import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GeneratedAssetCard from '../components/GeneratedAssetCard';
import { Sparkles } from 'lucide-react';
import { generateVideo } from '../lib/clientVideoGen';
import { useAddGenRecord } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { saveAssetToStore } from '../lib/historyAssetStore';
import { toast } from 'sonner';
import { GenType } from '../backend';

export default function TextToVideo() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutate: addRecord } = useAddGenRecord();
  const { identity } = useInternetIdentity();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { blobUrl, blob } = await generateVideo(prompt);
      setVideoUrl(blobUrl);

      // Save to history if authenticated
      if (identity) {
        const assetId = await saveAssetToStore(blob, 'video');
        addRecord({
          type: GenType.video,
          prompt,
          metadata: JSON.stringify({
            assetId,
            mimeType: 'video/webm',
            size: blob.size,
            duration: 3,
          }),
        });
        toast.success('Video generated and saved to history!');
      } else {
        toast.success('Video generated! Sign in to save to history.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `pnd-video-${Date.now()}.webm`;
    link.click();
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Text to Video</h1>
          <p className="text-lg text-muted-foreground">
            Describe your vision, and we'll create an animated video for you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Video Prompt</CardTitle>
              <CardDescription>
                Describe the video animation you want to create.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Your Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="A colorful abstract animation with flowing shapes and particles..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  'Generating...'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <GeneratedAssetCard
            title="Generated Video"
            description={videoUrl ? 'Your AI-generated video is ready!' : 'Your video will appear here'}
            onDownload={videoUrl ? handleDownload : undefined}
            downloadLabel="Download Video"
            isGenerating={isGenerating}
          >
            {videoUrl ? (
              <video src={videoUrl} controls className="h-full w-full" />
            ) : (
              <div className="flex h-96 items-center justify-center text-muted-foreground">
                <p>No video generated yet</p>
              </div>
            )}
          </GeneratedAssetCard>
        </div>
      </div>
    </div>
  );
}
