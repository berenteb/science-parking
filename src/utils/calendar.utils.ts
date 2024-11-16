import { CalendarResource } from '@/types/calendar.types';

export function parseResource(resourceGeneratedName: string): CalendarResource {
  const replacedDoubleMinus = resourceGeneratedName.replace('--', '-N').replace(/\(\d+\)/, '');
  const parts = replacedDoubleMinus.split('-').map((part) => part.trim().replace(/^N/, '-'));

  return {
    building: String(parts[0]),
    floor: String(parts[1]),
    room: String(parts.length === 4 ? parts[3] : parts[2]),
  };
}