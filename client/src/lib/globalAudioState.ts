// Global audio state shared across all audio components
class GlobalAudioState {
  private muted: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    // Notify all listeners
    this.listeners.forEach(listener => listener(muted));
    // Also dispatch window event for backwards compatibility
    window.dispatchEvent(new CustomEvent('globalAudioToggle', { detail: { muted } }));
  }

  subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Create singleton instance
export const globalAudioState = new GlobalAudioState();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).globalAudioState = globalAudioState;
}
