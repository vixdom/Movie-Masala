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
        
        // ASMR-inspired gentle 'ding' sound (airplane call button style)
        const createASMRHitSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              const filterNode = audioContext.createBiquadFilter();
              const reverbNode = audioContext.createConvolver();
              
              oscillator.connect(filterNode);
              filterNode.connect(reverbNode);
              reverbNode.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Gentle airplane call button 'ding' - 600Hz base frequency
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.3);
              oscillator.type = 'triangle'; // Warmer than sine, softer than square
              
              // Soft low-pass filter for ASMR warmth
              filterNode.type = 'lowpass';
              filterNode.frequency.setValueAtTime(1200, audioContext.currentTime);
              filterNode.Q.setValueAtTime(1, audioContext.currentTime);
              
              // Create simple reverb for spaciousness
              const impulseLength = audioContext.sampleRate * 0.5;
              const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
              for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < impulseLength; i++) {
                  channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2) * 0.1;
                }
              }
              reverbNode.buffer = impulse;
              
              // Gentle ASMR envelope - slow attack, long decay
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05); // Gentle attack
              gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8); // Long, peaceful decay
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + 0.8);
              
              // Subtle haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(12);
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate(12);
              }
            }
          }
        });

        // Soothing success chime sequence (ASMR spa-like)
        const createChimeSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              // Create gentle, cascading chime notes
              const createSpaChimeNote = (freq: number, delay: number, duration: number = 1.2) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const filterNode = audioContext.createBiquadFilter();
                const reverbNode = audioContext.createConvolver();
                
                oscillator.connect(filterNode);
                filterNode.connect(reverbNode);
                reverbNode.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
                oscillator.type = 'sine'; // Pure, clean sine waves for ultimate smoothness
                
                // Warm low-pass filtering
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(2000, audioContext.currentTime + delay);
                filterNode.Q.setValueAtTime(0.7, audioContext.currentTime + delay);
                
                // Create lush reverb for spa-like ambience
                const impulseLength = audioContext.sampleRate * 0.8;
                const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
                for (let channel = 0; channel < 2; channel++) {
                  const channelData = impulse.getChannelData(channel);
                  for (let i = 0; i < impulseLength; i++) {
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 3) * 0.15;
                  }
                }
                reverbNode.buffer = impulse;
                
                // Extremely gentle, spa-like envelope
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + delay + 0.1); // Soft attack
                gainNode.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + delay + 0.3); // Gentle sustain
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration); // Long, peaceful release
                
                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + duration);
              };
              
              // Gentle cascading chimes in the requested 500-800Hz range
              // Based on a peaceful pentatonic scale for maximum harmony
              createSpaChimeNote(523, 0, 1.5);    // C5 (523Hz) - Base note
              createSpaChimeNote(659, 0.15, 1.4); // E5 (659Hz) - Harmony
              createSpaChimeNote(784, 0.3, 1.3);  // G5 (784Hz) - Perfect fifth
              createSpaChimeNote(523, 0.45, 1.2); // C5 again - Gentle echo
              
              // Gentle, rhythmic haptic pattern
              if (navigator.vibrate) {
                navigator.vibrate([25, 100, 15, 100, 10]); // Gentle wave pattern
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate([25, 100, 15, 100, 10]);
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
          hitSound: { 
            play: () => navigator.vibrate && navigator.vibrate(50) // Gentle 50ms tap
          },
          successSound: { 
            play: () => navigator.vibrate && navigator.vibrate([45, 120, 40, 80, 45, 100, 60]) // Joyful drumroll pattern
          }
        });
      }
    } catch (error) {
      // Final fallback with enhanced haptics
          hitSound: { 
            play: () => navigator.vibrate && navigator.vibrate(50) // Gentle 50ms tap
          },
          successSound: { 
            play: () => navigator.vibrate && navigator.vibrate([45, 120, 40, 80, 45, 100, 60]) // Joyful drumroll pattern
          }
        successSound: { play: () => navigator.vibrate && navigator.vibrate([25, 100, 15, 100, 10]) }
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
