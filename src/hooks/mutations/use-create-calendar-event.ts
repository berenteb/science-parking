import { useMutation } from '@tanstack/react-query';

import { createCalendarEvent } from '@/services/calendar.service';
import { CalendarEventItem } from '@/types/calendar.types';

interface CreateCalendarEventParams {
  summary: string;
  calendarId: string;
  startDate: Date;
  endDate: Date;
}

export function useCreateCalendarEvent() {
  return useMutation<CalendarEventItem, Error, CreateCalendarEventParams>({
    mutationFn: ({ summary, calendarId, startDate, endDate }) =>
      createCalendarEvent(calendarId, summary, startDate, endDate),
  });
}
