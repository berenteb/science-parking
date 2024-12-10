import { useQuery } from '@tanstack/react-query';
import { addHours, differenceInHours, endOfDay, isWithinInterval, startOfDay, startOfHour } from 'date-fns';

import { getCalendarEvents } from '@/services/calendar.service';
import {
  CalendarAvailabilityItem,
  CalendarDayAvailability,
  CalendarEventItem,
  CalendarListItem,
} from '@/types/calendar.types';
import { parseResource } from '@/utils/calendar.utils';

export function useCalendarAvailability(calendars: CalendarListItem[], startDate: Date, endDate: Date) {
  return useQuery<CalendarDayAvailability[]>({
    queryKey: [
      'calendar-availability',
      startDate.toISOString(),
      endDate.toISOString(),
      { calendars: calendars.map((c) => c.id) },
    ],
    queryFn: () => {
      return Promise.all(calendars.map((calendar) => getCalendarDayAvailability(calendar, startDate, endDate)));
    },
    initialData: calendars.map((calendar) => ({
      calendarId: calendar.id,
      resource: parseResource(calendar.summary),
      availability: [],
      fullPeriodAvailable: false,
    })),
    select: (data) => data.toSorted((a, b) => a.resource.room.localeCompare(b.resource.room)),
  });
}

async function getCalendarDayAvailability(
  calendar: CalendarListItem,
  startDate: Date,
  endDate: Date
): Promise<CalendarDayAvailability> {
  const items = await getCalendarEvents(calendar.id, startDate, endDate);
  return {
    calendarId: calendar.id,
    resource: parseResource(calendar.summary),
    availability: mapCalendarEventToAvailability(startDate, endDate, items),
    fullPeriodAvailable: items.length === 0,
  };
}

function mapCalendarEventToAvailability(
  startDate: Date,
  endDate: Date,
  events: CalendarEventItem[]
): CalendarAvailabilityItem[] {
  const periodsBetweenDates = differenceInHours(endDate, startDate);
  const availability: CalendarAvailabilityItem[] = [];
  for (let i = 0; i <= periodsBetweenDates; i++) {
    const currentDate = startOfHour(addHours(startDate, i));
    const currentDateEnd = addHours(currentDate, 1);
    const matchingEvent = events.find((event) => {
      const start = event.start?.dateTime ?? startOfDay(new Date()).toISOString();
      const end = event.end?.dateTime ?? endOfDay(new Date()).toISOString();
      return isWithinInterval(currentDate, { start, end }) || isWithinInterval(currentDateEnd, { start, end });
    });

    availability.push({
      dateFrom: currentDate,
      dateTo: addHours(currentDate, 1),
      available: !matchingEvent,
      creator: matchingEvent?.creator?.email ?? '',
    });
  }
  return availability;
}
