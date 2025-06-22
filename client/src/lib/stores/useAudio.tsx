import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
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
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Just update the muted state
    set({ isMuted: newMutedState });
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  initializeAudio: () => {
    try {
      const hitAudio = new Audio('/sounds/hit.mp3');
      const successAudio = new Audio('/sounds/success.mp3');
      
      hitAudio.volume = 0.4;
      successAudio.volume = 0.6;
      
      set({ 
        hitSound: hitAudio,
        successSound: successAudio 
      });
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  },

  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      try {
        hitSound.currentTime = 0;
        hitSound.play().catch(() => {});
      } catch (error) {
        console.warn('Failed to play hit sound:', error);
      }
    }
  },

  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      try {
        successSound.currentTime = 0;
        successSound.play().catch(() => {});
      } catch (error) {
        console.warn('Failed to play success sound:', error);
      }
    }
  }
}));
