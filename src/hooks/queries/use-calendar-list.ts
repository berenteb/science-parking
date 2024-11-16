import { useQuery } from '@tanstack/react-query';

import { getCalendarList } from '@/services/calendar.service';

export function useCalendarList() {
  return useQuery({
    queryKey: ['calendar-list'],
    queryFn: getCalendarList,
  });
}
