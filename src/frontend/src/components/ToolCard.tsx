import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconColor?: string;
}

export default function ToolCard({ title, description, icon: Icon, href, iconColor = 'text-primary' }: ToolCardProps) {
  return (
    <Card className="group transition-all hover:shadow-glow-sm">
      <CardHeader>
        <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={href}>
          <Button className="w-full gap-2 group-hover:gap-3 transition-all">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
