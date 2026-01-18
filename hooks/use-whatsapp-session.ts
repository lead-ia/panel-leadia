import { useState, useCallback } from 'react';
import { useWhatsappEventListener } from './use-whatsapp-event-listener';
import { WhatsappSession } from '@/lib/models/whatsapp-session';

export function useWhatsappSession(sessionName: string) {
  const [session, setSession] = useState<WhatsappSession | null>(null);

  const handleSessionStatus = useCallback((data: any) => {
    console.log('Session status update:', data);
    if (data.event === 'session.status') {
      setSession({
        session: data.session,
        me: data.me,
        payload: data.payload,
      });
    }
  }, []);

  useWhatsappEventListener(sessionName, 'session.status', handleSessionStatus);

  return session;
}
