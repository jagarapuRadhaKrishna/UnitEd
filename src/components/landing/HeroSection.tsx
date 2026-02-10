import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="min-h-screen flex items-center relative overflow-hidden pt-20"
      style={{
        backgroundImage: 'url(/pexels-ivan-s-7213362.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-foreground/50 z-0" />

      <div className="max-w-6xl mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-[58%]">
            {/* Headline */}
            <h1 className="text-primary-foreground text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-2">
              Unit<span className="text-primary">Ed</span>
            </h1>

            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-united-amber">
              Innovate • Create • Elevate
            </h2>

            {/* Subtitle */}
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-8">
              Join thousands of students and faculty in research, projects, and hackathons.
              AI-powered matching, real-time chat, and powerful features for seamless collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button asChild size="lg" className="bg-card text-primary hover:bg-muted px-8 py-6 text-lg font-bold">
                <Link to="/register">
                  Join Now <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg font-bold bg-transparent"
                onClick={() => scrollToSection('about')}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 flex-wrap">
              {[
                { number: '2000+', label: 'Active Students' },
                { number: '150+', label: 'Faculty Members' },
                { number: '500+', label: 'Projects Completed' },
              ].map((stat, index) => (
                <div key={index}>
                  <h3 className="text-primary-foreground text-3xl font-bold mb-1">{stat.number}</h3>
                  <p className="text-primary-foreground/80 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;