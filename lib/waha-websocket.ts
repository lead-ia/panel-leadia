type WahaEvent = 'session.status' | 'message';

export class WahaWebsocket {
  private static instance: WahaWebsocket;
  private socket: WebSocket | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  private wsUrl: string;
  private sessionName: string;
  private isConnected: boolean = false;

  private constructor(sessionName: string, wsUrl: string = 'wss://api.leadia.com.br/ws') {
    this.sessionName = sessionName;
    this.wsUrl = wsUrl;
    this.connect();
  }

  public static getInstance(sessionName: string, wsUrl?: string): WahaWebsocket {
    if (!WahaWebsocket.instance) {
      WahaWebsocket.instance = new WahaWebsocket(sessionName, wsUrl);
    }
    return WahaWebsocket.instance;
  }

  private connect() {
    if (typeof window === 'undefined') return;
    if (this.isConnected) return;

    const session = this.sessionName;
    const events = ['session.status', 'message'];
    const apiKey = process.env.NEXT_PUBLIC_WAHA_API_KEY || '';

    const queryParams = new URLSearchParams({
      'x-api-key': apiKey,
      session,
    });
    
    events.forEach(event => queryParams.append('events', event));

    const fullWsUrl = `${this.wsUrl}?${queryParams.toString()}`;

    console.log('Connecting to WebSocket:', fullWsUrl);
    this.socket = new WebSocket(fullWsUrl);
    this.isConnected = true;

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log('WebSocket message received:', data);
        if (data.event) {
            this.notifyListeners(data.event, data);
        }
        // Also notify generic listeners if needed, or handle specific event mapping
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      // Simple reconnection logic
      setTimeout(() => this.connect(), 5000);
    };
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  public static destroyInstance() {
    if (WahaWebsocket.instance) {
      WahaWebsocket.instance.socket?.close();
    }
  }
}
