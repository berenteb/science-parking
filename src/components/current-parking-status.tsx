'use client';

import { formatDate } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { TbLoader } from 'react-icons/tb';

import { useCalendarList } from '@/hooks/queries/use-calendar-list';
import { useCurrentParking } from '@/hooks/queries/use-current-parking';

export function CurrentParkingStatus() {
  const calendars = useCalendarList();
  const currentParking = useCurrentParking(calendars.data ?? []);
  return (
    <AnimatePresence>
      {(!currentParking.data || !calendars.data) && (
        <div className='h-40 border-dashed rounded-xl border-4 border-slate-500 text-slate-500 p-5 flex items-center justify-center'>
          {!currentParking.isLoading && !calendars.isLoading && 'No parking selected'}
          {(currentParking.isLoading || calendars.isLoading) && <TbLoader className='animate-spin' />}
        </div>
      )}
      {currentParking.data && calendars.data && (
        <motion.div
          key='content'
          className='bg-white rounded-xl max-w-full'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <>
            <div className='relative flex gap-4 items-center border-b-slate-900 border-dashed border-b-4 p-2 pb-5'>
              <div className='absolute -bottom-3 -left-2.5 w-5 h-5 rounded-full bg-slate-900' />
              <div className='absolute -bottom-3 -right-2.5 w-5 h-5 rounded-full bg-slate-900' />
              <p className='bg-slate-900 rounded-md p-5 font-bold'>{currentParking.data.resourceName}</p>
              <p className='text-slate-900'>{currentParking.data.summary}</p>
            </div>
            <p className='text-slate-900 my-5 text-center'>
              {formatDate(currentParking.data.dateFrom, 'HH:mm')} - {formatDate(currentParking.data.dateTo, 'HH:mm')}
            </p>
          </>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
