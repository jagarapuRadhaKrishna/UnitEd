import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LandingStats {
  totalUsers: number | null;
  totalStudents: number | null;
  totalFaculty: number | null;
  completedProjects: number | null;
  coreFeatures: number;
}

const DEFAULT_STATS: LandingStats = {
  totalUsers: null,
  totalStudents: null,
  totalFaculty: null,
  completedProjects: null,
  coreFeatures: 11,
};

export const useLandingStats = () => {
  const [stats, setStats] = useState<LandingStats>(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_public_landing_stats');

        if (error) {
          console.error('Failed to fetch landing stats:', error);
          return;
        }

        if (!isMounted) return;

        const row = data?.[0];
        if (!row) return;

        setStats({
          totalUsers: row.total_users ?? 0,
          totalStudents: row.total_students ?? 0,
          totalFaculty: row.total_faculty ?? 0,
          completedProjects: row.completed_projects ?? 0,
          coreFeatures: DEFAULT_STATS.coreFeatures,
        });
      } catch (error) {
        console.error('Unexpected landing stats error:', error);
      }
    };

    fetchStats();
    const interval = window.setInterval(fetchStats, 15000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return stats;
};
