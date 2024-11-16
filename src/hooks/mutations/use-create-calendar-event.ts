import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endOfDay, startOfDay } from 'date-fns';

import { createCalendarEvent } from '@/services/calendar.service';
import { CalendarEventItem } from '@/types/calendar.types';

interface CreateCalendarEventParams {
  summary: string;
  calendarId: string;
  startDate: Date;
  endDate: Date;
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation<CalendarEventItem, Error, CreateCalendarEventParams>({
    mutationFn: ({ summary, calendarId, startDate, endDate }) =>
      createCalendarEvent(calendarId, summary, startDate, endDate),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [
          'calendar-availability',
          startOfDay(variables.startDate).toISOString(),
          endOfDay(variables.endDate).toISOString(),
        ],
      });
    },
    onError: (_, variables, context) => {
      if (context) {
        queryClient.setQueryData(['calendar-availability', variables.startDate, variables.endDate], context);
      }
    },
  });
}
