import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEVELOPERS } from '@/data/developers';
import { motion } from 'framer-motion';
import AnimatedLinkedinIcon from '@/components/icons/AnimatedLinkedinIcon';
import AnimatedGithubIcon from '@/components/icons/AnimatedGithubIcon';
import AnimatedGlobeIcon from '@/components/icons/AnimatedGlobeIcon';
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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.07,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const AboutDevelopersPage: React.FC = () => {
  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      <motion.h2
        className="text-xl font-bold mb-4"
        variants={cardVariants}
        custom={0}
      >
        About Developer
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEVELOPERS.map((developer, index) => (
          <motion.div key={developer.id} variants={cardVariants} custom={index + 1}>
            <Card className="transition-shadow duration-300 hover:shadow-md">
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
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutDevelopersPage;
