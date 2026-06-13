// Bollywood Live Audio Synthesizer Engine
// Powered by browser Web Audio API for unblocked, robust, zero-network custom playback.

export type InstrumentType = "sitar" | "flute" | "piano" | "synth";

interface PlayableNote {
  note: string;
  duration: number; // in seconds
}

// Frequencies map of musical notes
const NOTE_FREQS: Record<string, number> = {
  "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "B3": 246.94,
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99,
  "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
  "C5": 523.25, "C#5": 554.37, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99,
  "G5": 783.99, "G#5": 830.61, "A5": 880.00, "A#5": 932.33, "B5": 987.77,
  "C6": 1046.50
};

// C Major Pentatonic for beautiful safe procedural music (never sounds out of key!)
const PENTATONIC_NOTES = ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];

// Beautiful recognizable melodies for special hit songs
const ICONIC_MELODIES: Record<string, PlayableNote[]> = {
  "sajni": [
    { note: "E4", duration: 0.5 },
    { note: "G4", duration: 0.5 },
    { note: "A4", duration: 0.5 },
    { note: "B4", duration: 0.9 },
    { note: "B4", duration: 0.3 },
    { note: "A4", duration: 0.3 },
    { note: "G4", duration: 0.3 },
    { note: "A4", duration: 0.9 },
    { note: "G4", duration: 0.3 },
    { note: "F#4", duration: 0.3 },
    { note: "E4", duration: 0.3 },
    { note: "D4", duration: 0.5 },
    { note: "G4", duration: 0.4 },
    { note: "F#4", duration: 0.4 },
    { note: "E4", duration: 1.2 },
  ],
  "tujhe dekha to": [
    { note: "C4", duration: 0.4 },
    { note: "D4", duration: 0.4 },
    { note: "E4", duration: 0.4 },
    { note: "C4", duration: 0.4 },
    { note: "E4", duration: 0.4 },
    { note: "C4", duration: 0.4 },
    { note: "E4", duration: 0.4 },
    { note: "D4", duration: 0.8 },
    { note: "D4", duration: 0.4 },
    { note: "E4", duration: 0.4 },
    { note: "F4", duration: 0.4 },
    { note: "D4", duration: 0.4 },
    { note: "F4", duration: 0.4 },
    { note: "D4", duration: 0.4 },
    { note: "F4", duration: 0.4 },
    { note: "E4", duration: 1.0 },
  ],
  "kesariya": [
    { note: "G4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "B4", duration: 0.6 },
    { note: "B4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "G4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "B4", duration: 0.8 },
    { note: "C5", duration: 0.4 },
    { note: "B4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "G4", duration: 0.4 },
    { note: "F#4", duration: 0.4 },
    { note: "G4", duration: 0.4 },
    { note: "A4", duration: 1.0 },
  ],
  "chaiyya chaiyya": [
    { note: "E4", duration: 0.3 },
    { note: "E4", duration: 0.3 },
    { note: "G4", duration: 0.3 },
    { note: "G4", duration: 0.3 },
    { note: "A4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "G4", duration: 0.6 },
    { note: "E4", duration: 0.3 },
    { note: "E4", duration: 0.3 },
    { note: "G4", duration: 0.3 },
    { note: "G4", duration: 0.3 },
    { note: "A4", duration: 0.4 },
    { note: "A4", duration: 0.4 },
    { note: "E4", duration: 0.8 },
  ],
  "kal ho naa ho": [
    { note: "G4", duration: 0.5 },
    { note: "F4", duration: 0.5 },
    { note: "E4", duration: 0.5 },
    { note: "D4", duration: 0.5 },
    { note: "E4", duration: 0.4 },
    { note: "F4", duration: 0.4 },
    { note: "G4", duration: 1.0 },
    { note: "C4", duration: 0.5 },
    { note: "F4", duration: 0.5 },
    { note: "E4", duration: 0.5 },
    { note: "D4", duration: 0.5 },
    { note: "C4", duration: 0.4 },
    { note: "D4", duration: 0.4 },
    { note: "E4", duration: 1.0 },
  ]
};

class BollywoodSynthEngine {
  private audioCtx: AudioContext | null = null;
  private currentNotesTimeoutIds: number[] = [];
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private isCurrentlyPlaying = false;
  private instrumentType: InstrumentType = "sitar";
  private onNoteTriggeredCallback?: (noteName: string) => void;
  private onFinishedPlayingCallback?: () => void;

  private initCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  public setInstrument(type: InstrumentType) {
    this.instrumentType = type;
  }

  public stop() {
    this.isCurrentlyPlaying = false;
    
    // Clear scheduled timeouts
    this.currentNotesTimeoutIds.forEach(id => clearTimeout(id));
    this.currentNotesTimeoutIds = [];

    // Stop active oscillators immediately but smoothly
    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        if (this.audioCtx) {
          const now = this.audioCtx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
          setTimeout(() => {
            try {
              osc.stop();
              osc.disconnect();
              gain.disconnect();
            } catch (e) {}
          }, 150);
        } else {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        }
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  // Generate an interesting melody for any song procedural-style based on hashing
  private getProceduralMelody(title: string): PlayableNote[] {
    const cleanTitle = title.toLowerCase().trim();
    let hash = 0;
    for (let i = 0; i < cleanTitle.length; i++) {
      hash = cleanTitle.charCodeAt(i) + ((hash << 5) - hash);
    }

    const melody: PlayableNote[] = [];
    const length = 12 + (Math.abs(hash) % 5); // 12 to 16 notes

    for (let i = 0; i < length; i++) {
      const noteIndex = Math.abs((hash >> i) ^ (i * 3)) % PENTATONIC_NOTES.length;
      const note = PENTATONIC_NOTES[noteIndex];
      // alternate note lengths
      const durationIndex = (Math.abs(hash) + i) % 3;
      const duration = durationIndex === 0 ? 0.35 : durationIndex === 1 ? 0.5 : 0.7;
      melody.push({ note, duration });
    }
    return melody;
  }

  // Match genre to appropriate instrument
  public getGenreInstrument(genre: string): InstrumentType {
    const g = genre.toLowerCase();
    if (g.includes("classic") || g.includes("folk") || g.includes("wedding") || g.includes("classical")) {
      return "sitar";
    }
    if (g.includes("romantic") || g.includes("soft") || g.includes("devotional") || g.includes("love")) {
      return "flute";
    }
    if (g.includes("emotional") || g.includes("sad") || g.includes("patriotic")) {
      return "piano";
    }
    return "synth";
  }

  public playSong(
    title: string, 
    genre: string,
    onNoteTriggered?: (noteName: string) => void,
    onFinishedPlaying?: () => void
  ) {
    this.stop();
    this.initCtx();
    
    if (!this.audioCtx) return;

    this.isCurrentlyPlaying = true;
    this.onNoteTriggeredCallback = onNoteTriggered;
    this.onFinishedPlayingCallback = onFinishedPlaying;

    // Determine melody
    const cleanTitle = title.toLowerCase().trim();
    let melody = ICONIC_MELODIES[cleanTitle];
    if (!melody) {
      // check if any key fits
      const key = Object.keys(ICONIC_MELODIES).find(k => cleanTitle.includes(k));
      if (key) {
        melody = ICONIC_MELODIES[key];
      } else {
        melody = this.getProceduralMelody(title);
      }
    }

    // Assign appropriate instrument based on genre
    const inst = this.getGenreInstrument(genre);
    this.setInstrument(inst);

    // Schedule note playbacks
    let scheduleTimeSec = 0;
    
    melody.forEach((noteItem, index) => {
      const delayMs = scheduleTimeSec * 1000;
      scheduleTimeSec += noteItem.duration;

      const timeoutId = window.setTimeout(() => {
        if (!this.isCurrentlyPlaying) return;
        
        this.playSingleNote(noteItem.note, noteItem.duration);
        if (this.onNoteTriggeredCallback) {
          this.onNoteTriggeredCallback(noteItem.note);
        }

        // If it's the last note, invoke completion
        if (index === melody.length - 1) {
          const finishedTimeoutId = window.setTimeout(() => {
            if (this.isCurrentlyPlaying && this.onFinishedPlayingCallback) {
              this.onFinishedPlayingCallback();
            }
          }, noteItem.duration * 1000);
          this.currentNotesTimeoutIds.push(finishedTimeoutId);
        }
      }, delayMs);

      this.currentNotesTimeoutIds.push(timeoutId);
    });
  }

  private playSingleNote(noteName: string, durationSec: number) {
    if (!this.audioCtx) return;
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Create Main oscillator and gain
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Setup Instrument Timbre
    if (this.instrumentType === "sitar") {
      // Sitar effect: Plucked, complex harmonic timbre, slight buzz.
      osc.type = "sawtooth";
      
      // Let's create an additional subtle high metallic drone frequency for authentic sitar drone!
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "triangle";
      droneOsc.frequency.setValueAtTime(freq * 3, now);
      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);

      // Play drone and stop
      droneOsc.start(now);
      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      droneOsc.stop(now + durationSec + 0.1);

      // Sitar puck envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.02, now + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    } else if (this.instrumentType === "flute") {
      // Flute effect: Warm sine wave with subtle vibrato LFO and second harmonic
      osc.type = "sine";
      
      // Warm second harmonic
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmOsc.type = "sine";
      harmOsc.frequency.setValueAtTime(freq * 2, now);
      harmOsc.connect(harmGain);
      harmGain.connect(ctx.destination);

      harmOsc.start(now);
      harmGain.gain.setValueAtTime(0, now);
      harmGain.gain.linearRampToValueAtTime(0.03, now + 0.08);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      harmOsc.stop(now + durationSec + 0.1);

      // Add gentle vibrato
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(6.0, now); // 6 Hz vibrato
      vibratoGain.gain.setValueAtTime(5.0, now); // vibrato depth
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);
      
      vibrato.start(now);
      vibrato.stop(now + durationSec + 0.1);

      // Flute blowing envelope (slower attack)
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.08); // soft blow
      gainNode.gain.linearRampToValueAtTime(0.12, now + durationSec * 0.7);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    } else if (this.instrumentType === "piano") {
      // Piano: Triangle + soft Sine blend. Smooth attack and nice decay.
      osc.type = "triangle";

      // Blends
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.22, now + 0.01); // fast tap
      gainNode.gain.exponentialRampToValueAtTime(0.04, now + durationSec * 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    } else {
      // Synth / Party: Sawtooth with lowpass filter sweep
      osc.type = "sawtooth";
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.1);
      filter.frequency.exponentialRampToValueAtTime(300, now + durationSec);
      
      osc.disconnect(gainNode);
      osc.connect(filter);
      filter.connect(gainNode);

      // Synth Envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gainNode.gain.linearRampToValueAtTime(0.08, now + durationSec * 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    }

    osc.frequency.setValueAtTime(freq, now);
    osc.start(now);
    
    // Stop note
    osc.stop(now + durationSec + 0.05);

    const oscRecord = { osc, gain: gainNode };
    this.activeOscillators.push(oscRecord);

    // Cleanup reference
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(item => item !== oscRecord);
      try {
        osc.disconnect();
        gainNode.disconnect();
      } catch (e) {}
    }, (durationSec + 0.1) * 1000);
  }
}

export const BollywoodSynth = new BollywoodSynthEngine();
