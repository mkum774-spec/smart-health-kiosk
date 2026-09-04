// Real-time synchronization layer for Kiosk and Staff interfaces
// Uses BroadcastChannel + window storage event fallback

type EventHandler = (data: any) => void;

class RealtimeChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private channelName = "smart_health_kiosk_sync_bus";

  constructor() {
    if (typeof window !== 'undefined') {
      if ('BroadcastChannel' in window) {
        try {
          this.channel = new BroadcastChannel(this.channelName);
          this.channel.onmessage = (event) => {
            this.dispatch(event.data.type, event.data.payload);
          };
        } catch (e) {
          console.warn("BroadcastChannel initialization error:", e);
        }
      }

      // Fallback: localStorage storage events (fires across different tabs of same origin)
      window.addEventListener('storage', (event) => {
        if (event.key === this.channelName && event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            this.dispatch(parsed.type, parsed.payload);
          } catch (e) {
            console.error("Failed to parse storage event payload:", e);
          }
        }
      });
    }
  }

  public subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(handler);
      }
    };
  }

  public broadcast(type: string, payload: any) {
    // 1. Broadcast to channel
    if (this.channel) {
      try {
        this.channel.postMessage({ type, payload });
      } catch (e) {
        console.warn("Broadcast error:", e);
      }
    }

    // 2. Broadcast via storage event for multi-tab support
    if (typeof window !== 'undefined') {
      try {
        const message = JSON.stringify({ type, payload, _ts: Date.now() });
        localStorage.setItem(this.channelName, message);
      } catch (e) {}
    }

    // 3. Dispatch locally within the same window
    this.dispatch(type, payload);
  }

  private dispatch(type: string, payload: any) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`Error in handler for ${type}:`, err);
        }
      });
    }

    // Also dispatch to wildcard listeners
    const allHandlers = this.listeners.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => {
        try {
          handler({ type, payload });
        } catch (err) {
          console.error("Error in wildcard handler:", err);
        }
      });
    }
  }
}

export const realtimeChannel = new RealtimeChannel();
