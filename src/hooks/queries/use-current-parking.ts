import { useQuery } from '@tanstack/react-query';

import { getCurrentParking } from '@/services/calendar.service';
import { CalendarListItem, CurrentParking } from '@/types/calendar.types';

export const useCurrentParking = (calendars: CalendarListItem[]) => {
  return useQuery<CurrentParking | null>({
    queryKey: ['currentParking', { calendars: calendars.map((c) => c.id) }],
    queryFn: () => getCurrentParking(calendars),
    enabled: calendars.length > 0,
  });
};
