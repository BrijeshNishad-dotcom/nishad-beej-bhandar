import { prisma } from '@/lib/db';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { cache } from 'react';

/**
 * Server-side helper to fetch settings from the database.
 * Merges them with DEFAULT_SETTINGS to ensure every key is populated.
 * Wrapped in React cache() to avoid duplicate database hits in the same render pass.
 */
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const config: Record<string, string> = { ...DEFAULT_SETTINGS };
  try {
    const settingsList = await prisma.setting.findMany();
    settingsList.forEach((s) => {
      config[s.key] = s.value;
    });
  } catch (error) {
    console.error('Failed to fetch settings from database, using DEFAULT_SETTINGS:', error);
  }
  return config;
});
