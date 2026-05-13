import type { TechItem } from './types';

export function getTechName(item: TechItem): string {
  return typeof item === 'string' ? item : item.name;
}

export function getTechIconUrl(item: TechItem): string | null {
  if (typeof item === 'object' && item.icon) return item.icon;
  return null;
}
