import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Info, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          About Unit<span className="text-primary">Ed</span>
        </h1>
        <p className="text-muted-foreground">
          Learn about the platform and the team behind it.
        </p>
      </div>

      <div className="mb-6 p-1 rounded-xl border bg-card inline-flex gap-1">
        <NavLink
          to="/about/application"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <Info className="w-4 h-4" /> About Application
        </NavLink>
        <NavLink
          to="/about/developers"
          className={({ isActive }) =>
            `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <Users className="w-4 h-4" /> About Developer
        </NavLink>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;
