import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { TbCalendarPlus, TbLoader } from 'react-icons/tb';

import { CalendarDayAvailability } from '@/types/calendar.types';
import { cn } from '@/utils/style.utils';

import Tesla from './tesla.svg';

interface CalendarListItemDisplayProps {
  selected: boolean;
  onSelected: () => void;
  calendarDayAvailability: CalendarDayAvailability;
  isLoading: boolean;
  dateFrom: Date;
}

export function CalendarListItemDisplay({
  calendarDayAvailability,
  selected,
  onSelected,
  isLoading,
  dateFrom,
}: CalendarListItemDisplayProps) {
  const session = useSession();

  const hasOwnEvent = calendarDayAvailability.availability.some(
    (availability) => availability.creator === session.data?.user?.email
  );
  return (
    <button
      disabled={!calendarDayAvailability.fullPeriodAvailable}
      onClick={onSelected}
      className={cn(
        'border-b-8 border-slate-700 border-dashed w-60 h-32 first-of-type:border-t-8 py-2 bg-transparent px-0 rounded-none group hover:bg-transparent disabled:opacity-100'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between rounded-lg h-full w-full relative group-hover:bg-blue-400 overflow-hidden',
          {
            'bg-blue-500': selected,
            'bg-green-500': hasOwnEvent,
            'group-hover:bg-transparent': !calendarDayAvailability.fullPeriodAvailable,
          }
        )}
      >
        <p className='font-bold text-xl rotate-90 max-w-20 max-h-10 truncate'>
          {calendarDayAvailability.resource.room}
        </p>
        {isLoading ? (
          <TbLoader size={30} className='animate-spin flex-grow' />
        ) : (
          <TbCalendarPlus className='rotate-90 flex-grow' size={30} />
        )}
        <AnimatePresence>
          {!calendarDayAvailability.fullPeriodAvailable && !isLoading && (
            <motion.div
              className='absolute right-0 w-48'
              key={calendarDayAvailability.calendarId + dateFrom}
              initial={{
                translateX: -400,
                opacity: 0,
              }}
              animate={{
                translateX: 0,
                opacity: 1,
              }}
              exit={{
                translateX: [0, 200],
                opacity: [1, 0, 0],
              }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut',
              }}
            >
              <Image src={Tesla} alt='Tesla' width={300} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
