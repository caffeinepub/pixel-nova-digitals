import { Image, Video, Mic, Sparkles } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useGetHomepageContent } from '../hooks/useHomepageContent';
import { mergeWithDefaults } from '../lib/homepageDefaults';

export default function Home() {
  const navigate = useNavigate();
  const { data: backendContent } = useGetHomepageContent();
  
  const content = mergeWithDefaults(backendContent ?? null);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary w-fit">
                <Sparkles className="h-4 w-4" />
                {content.branding.heroBadge}
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {content.heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate({ to: '/text-to-image' })} className="gap-2">
                  Start Creating
                  <Sparkles className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/my-history' })}>
                  View My History
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/pnd-hero.dim_1600x900.png"
                alt="AI Creative Tools"
                className="rounded-2xl shadow-2xl animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Free AI Tools
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose from our collection of powerful AI tools to bring your creative vision to life.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ToolCard
            title="Text to Image"
            description="Generate unique images from text descriptions using AI-powered visualization."
            icon={Image}
            href="/text-to-image"
          />
          <ToolCard
            title="Text to Video"
            description="Create animated videos from your text prompts with dynamic visual effects."
            icon={Video}
            href="/text-to-video"
          />
          <ToolCard
            title="Text to Voiceover"
            description="Convert your text into natural-sounding speech with customizable voices."
            icon={Mic}
            href="/text-to-voiceover"
          />
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 rounded-2xl border-2 border-dashed bg-muted/30 p-8 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="mb-2 text-2xl font-bold">More Tools Coming Soon</h3>
          <p className="text-muted-foreground">
            We're constantly working on new AI-powered tools to enhance your creative workflow. Stay tuned!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">100% Free</h3>
              <p className="text-muted-foreground">
                {content.freeSection}
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Instant Results</h3>
              <p className="text-muted-foreground">
                Generate your content in seconds. No waiting, no queues.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Save Your Work</h3>
              <p className="text-muted-foreground">
                {content.premiumSection}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
