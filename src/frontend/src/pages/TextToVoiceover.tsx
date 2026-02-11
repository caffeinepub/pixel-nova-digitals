import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Mic } from 'lucide-react';
import { VoiceoverController } from '../lib/voiceover';
import { useAddGenRecord, useUpdateGenRecord } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { GenType } from '../backend';
import { parseReEditParams } from '../utils/urlParams';

export default function TextToVoiceover() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [controller] = useState(() => new VoiceoverController());
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [reEditRecordId, setReEditRecordId] = useState<bigint | null>(null);
  const { mutate: addRecord } = useAddGenRecord();
  const { mutate: updateRecord } = useUpdateGenRecord();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      controller.stop();
    };
  }, [controller, selectedVoice]);

  useEffect(() => {
    // Parse URL parameters on mount
    const searchParams = new URLSearchParams(window.location.search);
    const { recordId, prompt: urlPrompt } = parseReEditParams(searchParams);
    
    if (recordId && urlPrompt) {
      setReEditRecordId(recordId);
      setText(urlPrompt);
    }
  }, []);

  const handlePlay = () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    const voice = voices.find((v) => v.name === selectedVoice);
    controller.speak(text, voice, {
      onStart: () => setStatus('playing'),
      onEnd: () => setStatus('idle'),
      onPause: () => setStatus('paused'),
      onResume: () => setStatus('playing'),
    });

    // Save to history if authenticated
    if (identity && status === 'idle') {
      const metadata = JSON.stringify({
        voiceName: voice?.name || 'default',
        lang: voice?.lang || 'en-US',
      });

      if (reEditRecordId) {
        // Update existing record
        updateRecord({
          recordId: reEditRecordId,
          type: GenType.sound,
          prompt: text,
          metadata,
        });
        toast.success('Voiceover updated in history!');
      } else {
        // Create new record
        addRecord({
          type: GenType.sound,
          prompt: text,
          metadata,
        });
        toast.success('Voiceover saved to history!');
      }
    }
  };

  const handlePause = () => {
    controller.pause();
  };

  const handleResume = () => {
    controller.resume();
  };

  const handleStop = () => {
    controller.stop();
    setStatus('idle');
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            {reEditRecordId ? 'Re-edit Voiceover' : 'Text to Voiceover'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {reEditRecordId
              ? 'Modify your text and regenerate the voiceover.'
              : 'Convert your text into natural-sounding speech with our AI voiceover tool.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Voiceover Text</CardTitle>
              <CardDescription>
                Enter the text you want to convert to speech.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Your Text</Label>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to hear as a voiceover..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Playback Controls</CardTitle>
              <CardDescription>
                Control your voiceover playback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/20">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Mic className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {status === 'playing' ? 'Playing...' : status === 'paused' ? 'Paused' : 'Ready to play'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {status === 'idle' && (
                  <Button onClick={handlePlay} disabled={!text.trim()} className="flex-1 gap-2">
                    <Play className="h-4 w-4" />
                    Play
                  </Button>
                )}
                {status === 'playing' && (
                  <>
                    <Button onClick={handlePause} variant="outline" className="flex-1 gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                    <Button onClick={handleStop} variant="outline" className="flex-1 gap-2">
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
                {status === 'paused' && (
                  <>
                    <Button onClick={handleResume} className="flex-1 gap-2">
                      <Play className="h-4 w-4" />
                      Resume
                    </Button>
                    <Button onClick={handleStop} variant="outline" className="flex-1 gap-2">
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
