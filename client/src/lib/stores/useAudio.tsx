import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: { play: () => void } | null;
  successSound: { play: () => void } | null;
  ambientSound: { play: () => void } | null;
  hintRevealSound: { play: () => void } | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: { play: () => void }) => void;
  setSuccessSound: (sound: { play: () => void }) => void;
  setAmbientSound: (sound: { play: () => void }) => void;
  setHintRevealSound: (sound: { play: () => void }) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playAmbient: () => void;
  playHintReveal: () => void;
  initializeAudio: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  ambientSound: null,
  hintRevealSound: null,
  isMuted: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setAmbientSound: (sound) => set({ ambientSound: sound }),
  setHintRevealSound: (sound) => set({ hintRevealSound: sound }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  initializeAudio: () => {
    try {
      // Create Web Audio API for mobile compatibility
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        
        // Enhanced ASMR-inspired gentle 'ding' sound (airplane call button style)
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
              const chorusNode = audioContext.createDelay();
              const chorusGain = audioContext.createGain();
              
              oscillator.connect(filterNode);
              filterNode.connect(chorusNode);
              chorusNode.connect(chorusGain);
              chorusGain.connect(reverbNode);
              reverbNode.connect(gainNode);
              gainNode.connect(audioContext.destination);
              
              // Refined airplane call button 'ding' - 520Hz base frequency (warmer)
              oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.4);
              oscillator.type = 'triangle'; // Warm, organic tone
              
              // Enhanced low-pass filter for deeper ASMR warmth
              filterNode.type = 'lowpass';
              filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
              filterNode.Q.setValueAtTime(1.2, audioContext.currentTime);
              
              // Subtle chorus effect for richness
              chorusNode.delayTime.setValueAtTime(0.003, audioContext.currentTime);
              chorusGain.gain.setValueAtTime(0.3, audioContext.currentTime);
              
              // Create warm, intimate reverb
              const impulseLength = audioContext.sampleRate * 0.8;
              const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
              for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < impulseLength; i++) {
                  channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 3) * 0.12;
                }
              }
              reverbNode.buffer = impulse;
              
              // Ultra-gentle ASMR envelope - whisper-soft attack, extended decay
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.08); // Whisper-soft attack
              gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2); // Extended peaceful decay
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + 1.2);
              
              // Delicate haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(8);
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate(8);
              }
            }
          }
        });

        // Enhanced ethereal success chime sequence (ASMR cloud-like)
        const createChimeSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              // Create ethereal, floating chime notes
              const createEtherealChimeNote = (freq: number, delay: number, duration: number = 1.8) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const filterNode = audioContext.createBiquadFilter();
                const reverbNode = audioContext.createConvolver();
                const delayNode = audioContext.createDelay();
                const delayGain = audioContext.createGain();
                
                oscillator.connect(filterNode);
                filterNode.connect(delayNode);
                delayNode.connect(delayGain);
                delayGain.connect(reverbNode);
                filterNode.connect(reverbNode);
                reverbNode.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
                oscillator.type = 'sine'; // Pure, crystalline sine waves
                
                // Ethereal filtering for cloud-like softness
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1400, audioContext.currentTime + delay);
                filterNode.Q.setValueAtTime(0.5, audioContext.currentTime + delay);
                
                // Floating delay effect
                delayNode.delayTime.setValueAtTime(0.15, audioContext.currentTime + delay);
                delayGain.gain.setValueAtTime(0.2, audioContext.currentTime + delay);
                
                // Create expansive reverb for cloud-like ambience
                const impulseLength = audioContext.sampleRate * 1.2;
                const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
                for (let channel = 0; channel < 2; channel++) {
                  const channelData = impulse.getChannelData(channel);
                  for (let i = 0; i < impulseLength; i++) {
                    channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 4) * 0.18;
                  }
                }
                reverbNode.buffer = impulse;
                
                // Cloud-like envelope - breathable and weightless
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.045, audioContext.currentTime + delay + 0.15); // Breathable attack
                gainNode.gain.linearRampToValueAtTime(0.032, audioContext.currentTime + delay + 0.5); // Floating sustain
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration); // Weightless release
                
                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + duration);
              };
              
              // Ethereal cascading chimes in perfect harmony (500-800Hz range)
              // Based on a celestial pentatonic progression
              createEtherealChimeNote(523, 0, 2.0);    // C5 (523Hz) - Foundation
              createEtherealChimeNote(587, 0.2, 1.9);  // D5 (587Hz) - Gentle rise
              createEtherealChimeNote(659, 0.4, 1.8);  // E5 (659Hz) - Harmony bloom
              createEtherealChimeNote(698, 0.6, 1.7);  // F5 (698Hz) - Warm embrace
              createEtherealChimeNote(784, 0.8, 1.6);  // G5 (784Hz) - Perfect resolution
              createEtherealChimeNote(523, 1.0, 1.5);  // C5 return - Peaceful completion
              
              // Soft, wave-like haptic pattern
              if (navigator.vibrate) {
                navigator.vibrate([20, 150, 12, 120, 8, 100, 15]); // Ocean wave pattern
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate([20, 150, 12, 120, 8, 100, 15]);
              }
            }
          }
        });
        
        // Ambient background harmony (optional subtle background)
        const createAmbientSound = () => ({
          play: () => {
            try {
              if (audioContext.state === 'suspended') {
                audioContext.resume();
              }
              
              // Create subtle ambient drone
              const createAmbientDrone = (freq: number, duration: number = 8.0) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                const filterNode = audioContext.createBiquadFilter();
                
                oscillator.connect(filterNode);
                filterNode.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                // Very soft filtering
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(600, audioContext.currentTime);
                filterNode.Q.setValueAtTime(0.3, audioContext.currentTime);
                
                // Ultra-quiet ambient level
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.008, audioContext.currentTime + 2.0); // Very slow fade in
                gainNode.gain.linearRampToValueAtTime(0.005, audioContext.currentTime + duration - 2.0); // Gentle sustain
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration); // Slow fade out
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration);
              };
              
              // Subtle harmonic foundation - barely audible
              createAmbientDrone(220, 8.0); // A3 - Deep foundation
              createAmbientDrone(330, 7.5); // E4 - Perfect fifth harmony
              
            } catch (e) {
              // Silent fallback for ambient
            }
          }
        });
        
        // Hint reveal sound - crystalline bell
        const createHintRevealSound = () => ({
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
              
              // Crystalline bell tone - 660Hz (perfect E5)
              oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
              oscillator.frequency.exponentialRampToValueAtTime(550, audioContext.currentTime + 0.6);
              oscillator.type = 'sine'; // Pure crystal clarity
              
              // Crystal-clear filtering
              filterNode.type = 'lowpass';
              filterNode.frequency.setValueAtTime(1800, audioContext.currentTime);
              filterNode.Q.setValueAtTime(0.8, audioContext.currentTime);
              
              // Intimate reverb for hint discovery
              const impulseLength = audioContext.sampleRate * 0.6;
              const impulse = audioContext.createBuffer(2, impulseLength, audioContext.sampleRate);
              for (let channel = 0; channel < 2; channel++) {
                const channelData = impulse.getChannelData(channel);
                for (let i = 0; i < impulseLength; i++) {
                  channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2.5) * 0.1;
                }
              }
              reverbNode.buffer = impulse;
              
              // Enlightening envelope - moment of discovery
              gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.04, audioContext.currentTime + 0.02); // Quick illumination
              gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.2); // Understanding moment
              gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8); // Gentle fade
              
              oscillator.start();
              oscillator.stop(audioContext.currentTime + 0.8);
              
              // Gentle discovery haptic
              if (navigator.vibrate) {
                navigator.vibrate([15, 50, 10]); // Brief enlightenment pattern
              }
            } catch (e) {
              if (navigator.vibrate) {
                navigator.vibrate([15, 50, 10]);
              }
            }
          }
        });
        
        set({ 
          hitSound: createASMRHitSound(),
          successSound: createChimeSound(),
          ambientSound: createAmbientSound(),
          hintRevealSound: createHintRevealSound()
        });
      } else {
        // Fallback: refined vibration patterns only
        set({ 
          hitSound: { 
            play: () => navigator.vibrate && navigator.vibrate(35) // Soft 35ms tap
          },
          successSound: { 
            play: () => navigator.vibrate && navigator.vibrate([30, 150, 25, 120, 20, 100, 35]) // Gentle celebration
          },
          ambientSound: { 
            play: () => {} // Silent for vibration-only mode
          },
          hintRevealSound: { 
            play: () => navigator.vibrate && navigator.vibrate([15, 50, 10]) // Discovery pattern
          }
        });
      }
    } catch (error) {
      // Final fallback with refined haptics
      set({
        hitSound: { 
          play: () => navigator.vibrate && navigator.vibrate(35) // Soft tap
        },
        successSound: { 
          play: () => navigator.vibrate && navigator.vibrate([30, 150, 25, 120, 20, 100, 35]) // Gentle celebration
        },
        ambientSound: { 
          play: () => {} // Silent fallback
        },
        hintRevealSound: { 
          play: () => navigator.vibrate && navigator.vibrate([15, 50, 10]) // Discovery pattern
        }
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

  playAmbient: () => {
    const { ambientSound, isMuted } = get();
    if (ambientSound && !isMuted) {
      try {
        ambientSound.play();
      } catch (error) {
        console.warn('Failed to play ambient sound:', error);
      }
    }
  },

  playHintReveal: () => {
    const { hintRevealSound, isMuted } = get();
    if (hintRevealSound && !isMuted) {
      try {
        hintRevealSound.play();
      } catch (error) {
        console.warn('Failed to play hint reveal sound:', error);
      }
    }
  }

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
