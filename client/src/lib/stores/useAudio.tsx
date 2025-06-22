import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: { play: () => void } | null;
  successSound: { play: () => void } | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: { play: () => void }) => void;
  setSuccessSound: (sound: { play: () => void }) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  initializeAudio: () => {
    try {
      // Create Web Audio API for mobile compatibility
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        
        const createBeep = (frequency: number, duration: number) => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              oscillator.frequency.value = frequency;
              oscillator.type = 'sine';
              
              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
              // Fallback to vibration only
              if (navigator.vibrate) {
                navigator.vibrate(50);
              }
            }
          }
        });
        
        set({ 
          hitSound: createBeep(800, 0.1),
          successSound: createBeep(600, 0.3)
        });
      } else {
        // Fallback: vibration only
        set({ 
          hitSound: { play: () => navigator.vibrate && navigator.vibrate(50) },
          successSound: { play: () => navigator.vibrate && navigator.vibrate([100, 50, 100]) }
        });
      }
    } catch (error) {
      // Final fallback
      set({ 
        hitSound: { play: () => navigator.vibrate && navigator.vibrate(50) },
        successSound: { play: () => navigator.vibrate && navigator.vibrate([100, 50, 100]) }
      });
    }
  },

  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      try {
        hitSound.play();
      } catch (error) {
        console.warn('Failed to play hit sound:', error);
      }
    }
  },

  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      try {
        successSound.play();
      } catch (error) {
        console.warn('Failed to play success sound:', error);
      }
    }
  }
}));
