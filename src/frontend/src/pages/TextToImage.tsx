import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GeneratedAssetCard from '../components/GeneratedAssetCard';
import { Sparkles, Download } from 'lucide-react';
import { generateImage } from '../lib/clientImageGen';
import { useAddGenRecord, useUpdateGenRecord } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { saveAssetToStore } from '../lib/historyAssetStore';
import { toast } from 'sonner';
import { GenType } from '../backend';
import { parseReEditParams } from '../utils/urlParams';

export default function TextToImage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reEditRecordId, setReEditRecordId] = useState<bigint | null>(null);
  const { mutate: addRecord } = useAddGenRecord();
  const { mutate: updateRecord } = useUpdateGenRecord();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    // Parse URL parameters on mount
    const searchParams = new URLSearchParams(window.location.search);
    const { recordId, prompt: urlPrompt } = parseReEditParams(searchParams);
    
    if (recordId && urlPrompt) {
      setReEditRecordId(recordId);
      setPrompt(urlPrompt);
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { dataUrl, blob } = await generateImage(prompt);
      setImageUrl(dataUrl);

      // Save to history if authenticated
      if (identity) {
        const assetId = await saveAssetToStore(blob, 'image');
        const metadata = JSON.stringify({
          assetId,
          mimeType: 'image/png',
          size: blob.size,
        });

        if (reEditRecordId) {
          // Update existing record
          updateRecord({
            recordId: reEditRecordId,
            type: GenType.image,
            prompt,
            metadata,
          });
          toast.success('Image updated in history!');
        } else {
          // Create new record
          addRecord({
            type: GenType.image,
            prompt,
            metadata,
          });
          toast.success('Image generated and saved to history!');
        }
      } else {
        toast.success('Image generated! Sign in to save to history.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pnd-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {reEditRecordId ? 'Re-edit Image' : 'Text to Image'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {reEditRecordId 
              ? 'Modify your prompt and regenerate the image.'
              : 'Describe what you want to see, and our AI will create a unique image for you.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Image Prompt</CardTitle>
              <CardDescription>
                Describe the image you want to generate in detail.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Your Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="A serene mountain landscape at sunset with vibrant colors..."
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
                    {reEditRecordId ? 'Regenerate Image' : 'Generate Image'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <GeneratedAssetCard
            title="Generated Image"
            description={imageUrl ? 'Your AI-generated image is ready!' : 'Your image will appear here'}
            onDownload={imageUrl ? handleDownload : undefined}
            downloadLabel="Download Image"
            isGenerating={isGenerating}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Generated" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-96 items-center justify-center text-muted-foreground">
                <p>No image generated yet</p>
              </div>
            )}
          </GeneratedAssetCard>
        </div>
      </div>
    </div>
  );
}
