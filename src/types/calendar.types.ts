export interface CalendarListItem {
  id: string;
  summary: string;
}

export interface CalendarList {
  items: Array<CalendarListItem>;
}

export interface CalendarEventItem {
  id: string;
  summary?: string;
  start?: { dateTime: string };
  end?: { dateTime: string };
  creator?: { email: string };
  attendees?: Array<{ email: string }>;
}

export interface CalendarEvents {
  items: Array<{
    id: string;
    summary?: string;
    start?: { dateTime: string };
    end?: { dateTime: string };
  }>;
}

export interface CalendarAvailabilityItem {
  dateFrom: Date;
  dateTo: Date;
  available: boolean;
  creator: string;
}

export interface CalendarDayAvailability {
  calendarId: string;
  resource: CalendarResource;
  availability: Array<CalendarAvailabilityItem>;
  fullPeriodAvailable: boolean;
}

export interface CalendarResource {
  building: string;
  floor: string;
  room: string;
}

export interface CurrentParking {
  summary: string;
  resourceName: string;
  dateFrom: Date;
  dateTo: Date;
}
