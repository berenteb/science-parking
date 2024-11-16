import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createCalendarEvent } from '@/services/calendar.service';
import { CalendarDayAvailability, CalendarEventItem } from '@/types/calendar.types';

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
    onMutate: async ({ calendarId, startDate, endDate }) => {
      const queryKey = ['calendar-availability', startDate.toISOString(), endDate.toISOString()];
      await queryClient.cancelQueries({ queryKey });
      const previousAvailability = queryClient.getQueryData<CalendarDayAvailability[]>(queryKey);
      queryClient.setQueryData<CalendarDayAvailability[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((availability) => {
          if (availability.calendarId === calendarId) {
            return {
              ...availability,
              fullPeriodAvailable: false,
              availability: [
                ...availability.availability,
                {
                  dateFrom: startDate,
                  dateTo: endDate,
                  available: false,
                  isOwn: true,
                },
              ],
            };
          }
          return availability;
        });
      });

      return previousAvailability;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-availability', variables.startDate.toISOString(), variables.endDate.toISOString()],
      });
    },
    onError: (err, variables, context) => {
      if (context) {
        queryClient.setQueryData(['calendar-availability', variables.startDate, variables.endDate], context);
      }
    },
  });
}
