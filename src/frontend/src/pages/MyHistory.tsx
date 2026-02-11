import RequireAuth from '../components/RequireAuth';
import { useGetGenHistory, useDeleteGenRecord } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Video, Mic, Trash2, Loader2, FileText } from 'lucide-react';
import { getAssetFromStore } from '../lib/historyAssetStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { GenType } from '../backend';

export default function MyHistory() {
  const { data: history, isLoading } = useGetGenHistory();
  const { mutate: deleteRecord } = useDeleteGenRecord();
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const getIcon = (type: GenType) => {
    switch (type) {
      case GenType.image:
        return <Image className="h-5 w-5" />;
      case GenType.video:
        return <Video className="h-5 w-5" />;
      case GenType.sound:
        return <Mic className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: GenType) => {
    switch (type) {
      case GenType.image:
        return 'Image';
      case GenType.video:
        return 'Video';
      case GenType.sound:
        return 'Voiceover';
      default:
        return 'Text';
    }
  };

  const handlePreview = async (recordId: bigint, type: GenType, metadata: string) => {
    try {
      const meta = JSON.parse(metadata);
      if (meta.assetId) {
        const blob = await getAssetFromStore(meta.assetId);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setPreviewUrls((prev) => ({ ...prev, [recordId.toString()]: url }));
        } else {
          toast.error('Asset not found in local storage');
        }
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to load preview');
    }
  };

  const handleDelete = (recordId: bigint) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteRecord(recordId);
      toast.success('Record deleted');
    }
  };

  return (
    <RequireAuth>
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">My History</h1>
            <p className="text-lg text-muted-foreground">
              View and manage all your AI-generated content.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !history || history.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No generation history yet. Start creating!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((record) => {
                const previewUrl = previewUrls[record.recordId.toString()];
                return (
                  <Card key={record.recordId.toString()}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {getIcon(record.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{getTypeLabel(record.type)}</CardTitle>
                            <CardDescription>
                              {new Date(Number(record.createdAt)).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.recordId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Prompt:</p>
                        <p className="text-sm text-muted-foreground">{record.prompt}</p>
                      </div>
                      {(record.type === GenType.image || record.type === GenType.video) && (
                        <div>
                          {!previewUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(record.recordId, record.type, record.metadata)}
                            >
                              Load Preview
                            </Button>
                          ) : (
                            <div className="rounded-lg border overflow-hidden">
                              {record.type === GenType.image ? (
                                <img src={previewUrl} alt="Preview" className="w-full" />
                              ) : (
                                <video src={previewUrl} controls className="w-full" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
