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
        
        // Gentle 'bup' sound in ASMR frequency range
        const createASMRHitSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              const filterNode = audioContext.createBiquadFilter();
              
              oscillator.connect(filterNode);
              filterNode.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Soft ASMR tone in 200Hz range
              oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.06);
              oscillator.type = 'sine';
              
              // Soft low-pass filter for gentle sound
              filterNode.type = 'lowpass';
              filterNode.frequency.setValueAtTime(600, audioContext.currentTime);
              
              // Very gentle volume for ASMR effect
              gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06);
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + 0.06);
              
              // Gentle haptic bump
              if (navigator.vibrate) {
                navigator.vibrate(15);
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate(15);
              }
            }
          }
        });

        // Pleasant chime for word completion
        const createChimeSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              // Create multiple oscillators for rich chime sound
              const createChimeNote = (freq: number, delay: number) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0.18, audioContext.currentTime + delay);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.35);
                
                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + 0.35);
              };
              
              // Pleasant chord progression: C5-E5-G5
              createChimeNote(523, 0);    // C5
              createChimeNote(659, 0.08); // E5
              createChimeNote(784, 0.16); // G5
              
              // 'Clap' haptic pattern
              if (navigator.vibrate) {
                navigator.vibrate([80, 40, 80]);
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate([80, 40, 80]);
              }
            }
          }
        });
        
        set({ 
          hitSound: createASMRHitSound(),
          successSound: createChimeSound()
        });
      } else {
        // Fallback: enhanced vibration only
        set({ 
          hitSound: { play: () => navigator.vibrate && navigator.vibrate(15) },
          successSound: { play: () => navigator.vibrate && navigator.vibrate([80, 40, 80]) }
        });
      }
    } catch (error) {
      // Final fallback with enhanced haptics
      set({ 
        hitSound: { play: () => navigator.vibrate && navigator.vibrate(15) },
        successSound: { play: () => navigator.vibrate && navigator.vibrate([80, 40, 80]) }
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
