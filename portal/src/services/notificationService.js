// Web Browser Desktop Notifications & Audio Chime Service

class NotificationService {
  constructor() {
    this.broadcastChannel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('xortlogix_portal_sync');
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }
    this.listeners = [];
    if (this.broadcastChannel) {
      this.broadcastChannel.onmessage = (event) => {
        this.notifyListeners(event.data);
      };
    }
  }

  // Subscribe component to broadcast events
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(l => {
      try { l(data); } catch (e) {}
    });
  }

  // Broadcast event across all tabs/windows in real time
  broadcast(type, payload) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      } catch (e) {}
    }
  }

  // Check current permission state
  getPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  // Request browser permission
  async requestPermission() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.playChime();
        this.sendDesktopNotification({
          title: 'Notifications Active',
          body: 'You will now receive desktop alerts for policy updates, leave approvals, and enterprise notices.',
          tag: 'system-ready'
        });
      }
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  // Subtle synthesized audio chime via Web Audio API
  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      // Note 2 (higher, upbeat)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain2.gain.setValueAtTime(0.16, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.48);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Send HTML5 desktop notification
  sendDesktopNotification({ title, body, icon, tag = 'xortlogix-alert', onClick }) {
    this.playChime();

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: icon || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
          badge: icon || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
          tag: tag,
          silent: false,
          renotify: true
        });

        if (onClick) {
          notif.onclick = () => {
            window.focus();
            onClick();
            notif.close();
          };
        } else {
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        }
        return true;
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }
    return false;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
