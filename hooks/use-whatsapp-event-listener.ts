import { useEffect } from 'react';
import { WahaWebsocket } from '@/lib/waha-websocket';

export function useWhatsappEventListener(
  sessionName: string,
  event: string,
  callback: (data: any) => void
) {
  useEffect(() => {
    const ws = WahaWebsocket.getInstance(sessionName);
    
    const handler = (data: any) => {
      callback(data);
    };

    ws.on(event, handler);

    return () => {
      ws.off(event, handler);
    };
  }, [sessionName, event, callback]);
}
