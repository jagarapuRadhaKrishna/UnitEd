import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEVELOPERS } from '@/data/developers';
import AnimatedLinkedinIcon from '@/components/icons/AnimatedLinkedinIcon';
import AnimatedGithubIcon from '@/components/icons/AnimatedGithubIcon';
import AnimatedGlobeIcon from '@/components/icons/AnimatedGlobeIcon';
import { ExternalLink } from 'lucide-react';

const AboutDevelopersPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">About Developer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEVELOPERS.map((developer) => (
          <Card key={developer.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={developer.avatar_url || undefined} alt={developer.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {developer.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-base">{developer.name}</p>
                  <Badge variant="secondary" className="mt-1">
                    {developer.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <AnimatedLinkedinIcon width={16} height={16} strokeWidth={2} /> LinkedIn
                  </span>
                  {developer.linkedin ? (
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <AnimatedGithubIcon width={16} height={16} strokeWidth={2} /> GitHub
                  </span>
                  {developer.github ? (
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <AnimatedGlobeIcon width={16} height={16} strokeWidth={2} /> Portfolio
                  </span>
                  {developer.portfolio ? (
                    <a
                      href={developer.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutDevelopersPage;
