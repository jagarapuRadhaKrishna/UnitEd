import { useMemo } from 'react';
import { useTheme } from 'next-themes';

export const usePalette = () => {
  const { theme, resolvedTheme } = useTheme();

  const isDark = useMemo(() => {
    const mode = theme === 'system' ? resolvedTheme : theme;
    return mode === 'dark';
  }, [theme, resolvedTheme]);

  const colors = useMemo(
    () => ({
      bg: isDark ? '#0b1220' : '#F9FAFB',
      card: isDark ? '#0f172a' : '#ffffff',
      border: isDark ? '#1f2937' : '#E5E7EB',
      heading: isDark ? '#e5e7eb' : '#111827',
      subtext: isDark ? '#9ca3af' : '#6B7280',
      chip: isDark ? '#111827' : '#F3F4F6',
      chipText: isDark ? '#ffffff' : '#111827',
      chipActiveBg: '#6C47FF',
      chipHover: isDark ? '#1f2937' : '#E5E7EB',
      avatarBg: isDark ? '#111827' : '#EEF2FF',
      accent: '#6C47FF',
      accentHover: '#5936E8',
      inputBg: isDark ? '#111827' : '#ffffff',
      inputBorder: isDark ? '#1f2937' : '#E5E7EB',
    }),
    [isDark]
  );

  return { isDark, colors };
};
