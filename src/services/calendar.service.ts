import { endOfDay, startOfDay } from 'date-fns';

import { CalendarAxiosInstance } from '@/config/axios.config';
import {
  CalendarEventItem,
  CalendarEvents,
  CalendarList,
  CalendarListItem,
  CurrentParking,
} from '@/types/calendar.types';
import { parseResource } from '@/utils/calendar.utils';

export async function getCalendarList(): Promise<CalendarListItem[]> {
  const response = await CalendarAxiosInstance.get<CalendarList>('/users/me/calendarList', {
    params: {
      showHidden: true,
    },
  });
  return response.data.items.filter((calendar) => calendar.id.endsWith('@resource.calendar.google.com'));
}

export async function getCalendarEvents(
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEventItem[]> {
  const response = await CalendarAxiosInstance.get<CalendarEvents>(`/calendars/${calendarId}/events`, {
    params: {
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    },
  });
  return response.data.items;
}

export async function createCalendarEvent(
  calendarId: string,
  summary: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEventItem> {
  const response = await CalendarAxiosInstance.post<CalendarEventItem>(`/calendars/primary/events`, {
    summary,
    start: {
      dateTime: startDate.toISOString(),
    },
    end: {
      dateTime: endDate.toISOString(),
    },
    attendees: [
      {
        email: calendarId,
        resource: true,
      },
    ],
  });
  return response.data;
}

export async function getCurrentParking(calendars: CalendarListItem[]): Promise<CurrentParking | null> {
  const events = await getCalendarEvents('primary', startOfDay(new Date()), endOfDay(new Date()));
  const currentParkingEvent = events.find((event) =>
    event.attendees?.some((attendee) => calendars.some((calendar) => calendar.id === attendee.email))
  );
  if (!currentParkingEvent) return null;
  const calendarName = calendars.find((calendar) => calendar.id === currentParkingEvent.attendees?.[0].email)?.summary;
  if (!calendarName) return null;
  const parsedResource = parseResource(calendarName);
  return {
    summary: currentParkingEvent.summary || '',
    resourceName: parsedResource.room,
    dateFrom: new Date(currentParkingEvent.start?.dateTime || ''),
    dateTo: new Date(currentParkingEvent.end?.dateTime || ''),
  };
}
