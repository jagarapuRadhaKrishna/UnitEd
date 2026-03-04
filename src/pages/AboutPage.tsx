import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Info, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  const location = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.35,
        staggerChildren: 0.08,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div className="mb-6" variants={sectionVariants}>
        <h1 className="text-3xl font-bold text-foreground mb-1">
          About Unit<span className="text-primary">Ed</span>
        </h1>
        <p className="text-muted-foreground">
          Learn about the platform and the team behind it.
        </p>
      </motion.div>

      <motion.div className="mb-6 p-1 rounded-xl border bg-card inline-flex gap-1" variants={sectionVariants}>
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
      </motion.div>

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
    </motion.div>
  );
};

export default AboutPage;
