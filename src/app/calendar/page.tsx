'use client';

import { addDays, endOfDay, formatDate, isSameDay, startOfDay, subDays } from 'date-fns';
import Link from 'next/link';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { TbChevronLeft, TbChevronRight, TbLoader } from 'react-icons/tb';

import { CalendarListItemDisplay } from '@/components/calendar-list-item';
import { useCreateCalendarEvent } from '@/hooks/mutations/use-create-calendar-event';
import { useCalendarAvailability } from '@/hooks/queries/use-calendar-availability';
import { useCalendarList } from '@/hooks/queries/use-calendar-list';
import { cn } from '@/utils/style.utils';

export default function CalendarPage() {
  const [date, setDate] = useState(startOfDay(new Date()));
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>();
  const calendarList = useCalendarList();
  const calendarAvailability = useCalendarAvailability(calendarList.data ?? [], startOfDay(date), endOfDay(date));
  const createCalendarEvent = useCreateCalendarEvent();
  const session = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-list') && !target.closest('.primary')) {
        setSelectedCalendarId(undefined);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const onSelected = (calendarId: string) => {
    setSelectedCalendarId((prev) => (prev === calendarId ? undefined : calendarId));
  };

  const onDateIncrement = () => {
    setDate((prev) => addDays(prev, 1));
    setSelectedCalendarId(undefined);
    createCalendarEvent.reset();
  };

  const onDateDecrement = () => {
    setDate((prev) => subDays(prev, 1));
    setSelectedCalendarId(undefined);
    createCalendarEvent.reset();
  };

  const onJumpToToday = () => {
    setDate(startOfDay(new Date()));
    setSelectedCalendarId(undefined);
    createCalendarEvent.reset();
  };

  const userName = session.data?.user?.name;

  const onCreateEvent = () => {
    if (selectedCalendarId && userName) {
      createCalendarEvent
        .mutateAsync({
          calendarId: selectedCalendarId,
          startDate: new Date(date.setHours(8, 0, 0, 0)),
          endDate: new Date(date.setHours(16, 0, 0, 0)),
          summary: `${userName}'s parking`,
        })
        .then(() =>
          setTimeout(() => {
            calendarAvailability.refetch();
            setSelectedCalendarId(undefined);
          }, 2000)
        );
    }
  };

  const isToday = isSameDay(date, new Date());

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
          className={cn('text-3xl text-center block rounded-none border-x-2 border-slate-900 h-full', {
            'border-blue-500 border': isToday,
          })}
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
      {calendarList.isLoading && (
        <div className='flex flex-col items-center animate-pulse'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='border-b-8 border-slate-700 border-dashed w-60 h-32 first-of-type:border-t-8' />
          ))}
        </div>
      )}
      <SessionProvider>
        <div className='flex flex-col items-center calendar-list'>
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
      <button onClick={onCreateEvent} disabled={!selectedCalendarId} className='primary large'>
        {createCalendarEvent.isPending && <TbLoader className='animate-spin' />}
        Reserve for {formatDate(date, 'E d MMM')}
      </button>
      {createCalendarEvent.error && <p className='error'>{createCalendarEvent.error.message}</p>}
      {createCalendarEvent.isSuccess && <p className='success'>Event created successfully</p>}
    </main>
  );
}
