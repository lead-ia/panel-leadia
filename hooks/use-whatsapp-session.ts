import { useState, useCallback, useEffect } from 'react';
import { useWhatsappEventListener } from './use-whatsapp-event-listener';
import { WhatsappSession } from '@/lib/models/whatsapp-session';
import { WahaChatRepository } from '@/lib/repositories/waha-chat-repository';

type WhatsappSessionStatus =
  'WORKING' | 'STARTING' | 'SCAN_QR_CODE' | 'STOPPED' | 'FAILED';


export function useWhatsappSession(sessionName: string) {
  const [session, setSession] = useState<WhatsappSession | null>(null);
  const [sessionStatus, setSessionStatus] = useState<WhatsappSessionStatus| null >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new WahaChatRepository(sessionName);

  const handleSessionStatus = useCallback((data: any) => {
    console.log('Session status update:', data);
    if (data.event === 'session.status') {
      setSession({
        session: data.session,
        me: data.me,
        payload: data.payload,
      });
      setSessionStatus(data.payload.status);
    }
  }, []);

  useWhatsappEventListener(sessionName, 'session.status', handleSessionStatus);

  const checkSession = useCallback(async () => {
    if (!sessionName) return;
    setIsLoading(true);
    try {
      const data = await repository.getSessionByName(sessionName);
      if (data) {
           setSessionStatus(data.status);
           return;
      }
      // Means there's not session with that session name, let's create and start it
      startSession();
    } catch (err) {
      console.log('No session found: ', err)
    } finally {
      setIsLoading(false);
    }
  }, [sessionName]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const startSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      switch (sessionStatus) {
        case 'FAILED':
          await repository.restartSession(sessionName)
          break;
          case 'STOPPED':
            await repository.startSession(sessionName)
            break;
        default:
          await repository.createSession(sessionName)
      }
      // After starting, we expect updates via websocket, but we can also re-check
      await checkSession();
    } catch (err) {
      console.error("Error starting session:", err);
      setError("Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  const getQrCode = async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await repository.getQrCode(sessionName);
      if (blob) {
        return URL.createObjectURL(blob);
      }
      return null;
    } catch (err) {
      console.error("Error fetching QR code:", err);
      setError("Failed to fetch QR code");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const stopSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await repository.stopSession(sessionName);
    } catch (err) {
      console.error("Error stopping session:", err);
      setError("Failed to stop session");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    isLoading,
    error,
    sessionStatus,
    startSession,
    stopSession,
    getQrCode,
    checkSession,
  };
}
