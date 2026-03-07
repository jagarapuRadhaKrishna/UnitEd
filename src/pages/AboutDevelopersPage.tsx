import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DEVELOPERS } from '@/data/developers';
import { motion } from 'framer-motion';
import AnimatedLinkedinIcon from '@/components/icons/AnimatedLinkedinIcon';
import AnimatedGithubIcon from '@/components/icons/AnimatedGithubIcon';
import AnimatedGlobeIcon from '@/components/icons/AnimatedGlobeIcon';
import AnimatedMailIcon from '@/components/icons/AnimatedMailIcon';
import { ExternalLink } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.07,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const formatLinkLabel = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.host.replace(/^www\./, '') + parsed.pathname.replace(/\/$/, '');
  } catch {
    return url;
  }
};

const AboutDevelopersPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-8">
      <motion.div variants={sectionVariants} custom={0}>
        <h2 className="text-xl font-bold text-foreground">About Developer</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Learn more about the developer behind this platform.
        </p>
      </motion.div>

      {DEVELOPERS.map((developer, index) => {
        const isExpanded = expandedId === developer.id;
        const fullDescription = developer.about_paragraphs || [];

        return (
          <motion.section
            key={developer.id}
            variants={sectionVariants}
            custom={index + 1}
            className="space-y-6"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <Avatar className="h-28 w-28 shrink-0 border-4 border-primary/10">
                <AvatarImage
                  src={developer.avatar_url || undefined}
                  alt={developer.name}
                  className="object-cover object-[center_18%] scale-125"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {developer.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{developer.name}</h3>
                <Badge variant="secondary" className="mt-2">
                  {developer.role}
                </Badge>

                <div className="mt-6 space-y-3">
                  <h4 className="text-lg font-semibold text-foreground">About the Developer</h4>

                  {!isExpanded ? (
                    <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {developer.about_preview}
                    </p>
                  ) : (
                    <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                      {fullDescription.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : developer.id)}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <AnimatedMailIcon width={16} height={16} strokeWidth={2} /> Gmail
                </span>
                {developer.email ? (
                  <a
                    href={`mailto:${developer.email}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {developer.email} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <AnimatedLinkedinIcon width={16} height={16} strokeWidth={2} /> LinkedIn
                </span>
                {developer.linkedin ? (
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[240px] items-center gap-1 truncate text-primary hover:underline"
                    title={developer.linkedin}
                  >
                    <span className="truncate">{formatLinkLabel(developer.linkedin)}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <AnimatedGithubIcon width={16} height={16} strokeWidth={2} /> GitHub
                </span>
                {developer.github ? (
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[240px] items-center gap-1 truncate text-primary hover:underline"
                    title={developer.github}
                  >
                    <span className="truncate">{formatLinkLabel(developer.github)}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <AnimatedGlobeIcon width={16} height={16} strokeWidth={2} /> Portfolio
                </span>
                {developer.portfolio ? (
                  <a
                    href={developer.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[240px] items-center gap-1 truncate text-primary hover:underline"
                    title={developer.portfolio}
                  >
                    <span className="truncate">{formatLinkLabel(developer.portfolio)}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </div>
            </div>
          </motion.section>
        );
      })}
    </motion.div>
  );
};

export default AboutDevelopersPage;
