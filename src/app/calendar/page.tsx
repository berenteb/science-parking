'use client';

import { addDays, endOfDay, formatDate, startOfDay, subDays } from 'date-fns';
import Link from 'next/link';
import { SessionProvider, useSession } from 'next-auth/react';
import { useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

import { CalendarListItemDisplay } from '@/components/calendar-list-item';
import { useCreateCalendarEvent } from '@/hooks/mutations/use-create-calendar-event';
import { useCalendarAvailability } from '@/hooks/queries/use-calendar-availability';
import { useCalendarList } from '@/hooks/queries/use-calendar-list';

export default function CalendarPage() {
  const [date, setDate] = useState(startOfDay(new Date()));
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>();
  const calendarList = useCalendarList();
  const calendarAvailability = useCalendarAvailability(calendarList.data ?? [], startOfDay(date), endOfDay(date));
  const createCalendarEvent = useCreateCalendarEvent();
  const session = useSession();

  const onSelected = (calendarId: string) => {
    setSelectedCalendarId((prev) => (prev === calendarId ? undefined : calendarId));
  };

  const onDateIncrement = () => {
    setDate((prev) => addDays(prev, 1));
    setSelectedCalendarId(undefined);
  };

  const onDateDecrement = () => {
    setDate((prev) => subDays(prev, 1));
    setSelectedCalendarId(undefined);
  };

  const onJumpToToday = () => {
    setDate(startOfDay(new Date()));
    setSelectedCalendarId(undefined);
  };

  const userName = session.data?.user?.name;

  const onCreateEvent = () => {
    if (selectedCalendarId && userName) {
      createCalendarEvent.mutate({
        calendarId: selectedCalendarId,
        startDate: new Date(date.setHours(8, 0, 0, 0)),
        endDate: new Date(date.setHours(16, 0, 0, 0)),
        summary: `${userName}'s parking`,
      });
    }
  };

  return (
    <main>
      <h1 className='mb-10'>Science Parking</h1>
      <Link href='/'>
        <button>
          <TbChevronLeft /> Back to Home
        </button>
      </Link>
      <div className='flex items-center justify-center h-40'>
        <button onClick={onDateDecrement} className='h-full rounded-r-none px-2'>
          <TbChevronLeft size={30} />
        </button>
        <button
          className='text-3xl text-center block rounded-none border-x-2 border-slate-900 h-full'
          onClick={onJumpToToday}
        >
          {formatDate(date, 'E')}
          <br />
          <span className='font-bold'>{formatDate(date, 'd')}</span>
          <br />
          {formatDate(date, 'MMM')}
        </button>
        <button onClick={onDateIncrement} className='h-full rounded-l-none px-2'>
          <TbChevronRight size={30} />
        </button>
      </div>
      <SessionProvider>
        <div className='flex flex-col items-center'>
          {calendarAvailability.data?.map((availability) => (
            <CalendarListItemDisplay
              isLoading={calendarAvailability.isFetching}
              dateFrom={date}
              selected={availability.calendarId === selectedCalendarId}
              onSelected={() => onSelected(availability.calendarId)}
              key={availability.calendarId}
              calendarDayAvailability={availability}
            />
          ))}
        </div>
      </SessionProvider>
      <button onClick={onCreateEvent} disabled={!selectedCalendarId} className='primary px-8 py-4'>
        Reserve for {formatDate(date, 'E d MMM')}
      </button>
    </main>
  );
}
