/**
 * Web Audio API Failsafe Sound Synthesizer Fallback
 * Guarantees that users always hear high-quality feedback sound effects (clapping, kaching/bell, shooting, thunder)
 * even if external sound URLs fail due to network, CORS policy blocks, or broken paths.
 */
export const synthesizeSfxFallback = (name: string) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Normalize string searching
    const term = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Check matchers
    if (term.includes("vo tay") || term.includes("applause") || term.includes("reo ho") || term.includes("khan gia") || term.includes("clapping") || term.includes("cheer")) {
      // Synthesize realistic stereo audience cheering & applause
      for (let i = 0; i < 24; i++) {
        const oscTime = ctx.currentTime + Math.random() * 1.8;
        const dur = 0.20 + Math.random() * 0.3;
        
        const bufferSize = ctx.sampleRate * dur;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(900 + Math.random() * 1400, oscTime);
        filter.Q.setValueAtTime(3.0, oscTime);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, oscTime);
        gain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.1, oscTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, oscTime + dur);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(oscTime);
      }
    } else if (term.includes("minion") || term.includes("cuoi vui") || term.includes("laugh") || term.includes("hehe")) {
      // Fast pitch vibrato high laughter (Minion)
      const baseTime = ctx.currentTime;
      for (let i = 0; i < 7; i++) {
        const t = baseTime + i * 0.11;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(750 + i * 45, t);
        osc.frequency.linearRampToValueAtTime(1100 + i * 45, t + 0.08);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      }
    } else if (term.includes("quy du") || term.includes("evil") || term.includes("cuoi quy") || term.includes("devil")) {
      // Low sinister dark devilish laugh sweep
      const baseTime = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const t = baseTime + i * 0.22;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(100 - i * 8, t);
        osc1.frequency.linearRampToValueAtTime(70, t + 0.18);
        
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(95 - i * 8, t);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, t);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.22);
        osc2.stop(t + 0.22);
      }
    } else if (term.includes("moaz") || term.includes("kiss") || term.includes("nu hon") || term.includes("hon")) {
      // Sucking sound "Mwah"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
      
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1500, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (term.includes("quac") || term.includes("qua") || term.includes("crow")) {
      // Crow caw audio synth
      const dur = 0.35;
      const osc = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const destGain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + dur);
      
      modulator.frequency.setValueAtTime(110, ctx.currentTime);
      modGain.gain.setValueAtTime(140, ctx.currentTime);
      
      modulator.connect(modGain);
      modGain.connect(osc.frequency);
      
      destGain.gain.setValueAtTime(0, ctx.currentTime);
      destGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      destGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(destGain);
      destGain.connect(ctx.destination);
      
      modulator.start();
      osc.start();
      modulator.stop(ctx.currentTime + dur);
      osc.stop(ctx.currentTime + dur);
    } else if (term.includes("hoi hop") || term.includes("suspense") || term.includes("thriller")) {
      // Cinematic pulsing suspense notes
      const tStart = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(75, tStart + i * 0.4);
        
        gain.gain.setValueAtTime(0, tStart + i * 0.4);
        gain.gain.linearRampToValueAtTime(0.28, tStart + i * 0.4 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + i * 0.4 + 0.38);
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(150, tStart + i * 0.4);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(tStart + i * 0.4);
        osc.stop(tStart + i * 0.4 + 0.4);
      }
    } else if (term.includes("countdown") || term.includes("dem nguoc") || term.includes("tich tac")) {
      // Classic metronome counting second click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (
      term.includes("bell") || 
      term.includes("ding") || 
      term.includes("tien vang") || 
      term.includes("cash") || 
      term.includes("kaching") || 
      term.includes("cachinh") ||
      term.includes("reco") ||
      term.includes("coi")
    ) {
      // High-fidelity Dual-Chime Coin register Ka-ching!
      const playChime = (time: number, freq: number) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, time);
        
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 1.498, time); // Perfect fifth harmonic
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.28, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + 0.7);
        osc2.stop(time + 0.7);
      };
      
      playChime(ctx.currentTime, 1046.50); // C6 Note
      playChime(ctx.currentTime + 0.10, 1396.91); // F6 Note
      
      // Repeating chimes for "lặp lại" cash register coins cascade
      playChime(ctx.currentTime + 0.38, 1174.66); // D6 Note
      playChime(ctx.currentTime + 0.48, 1567.98); // G6 Note
      
      playChime(ctx.currentTime + 0.76, 1318.51); // E6 Note
      playChime(ctx.currentTime + 0.86, 1760.00); // A6 Note
    } else if (term.includes("set danh") || term.includes("thunder") || term.includes("k10") || term.includes("set")) {
      // Deep low frequency Thunder rumble sweep
      const dur = 2.1;
      const bufferSize = ctx.sampleRate * dur;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let j = 0; j < bufferSize; j++) {
        const white = Math.random() * 2 - 1;
        data[j] = (lastOut * 0.93 + white * 0.07); // basic filter
        lastOut = data[j];
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(170, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + dur);
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.42, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (term.includes("ban sung") || term.includes("gunshot") || term.includes("ak47") || term.includes("ak") || term.includes("sung") || term.includes("ak40")) {
      // Rapid Triple Fire Automatic Shot
      for (let i = 0; i < 4; i++) {
        const t = ctx.currentTime + i * 0.12;
        const dur = 0.15;
        const bufferSize = ctx.sampleRate * dur;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(390, t);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.48, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(t);
      }
    } else {
      // Futuristic digital retro ring for generic memes (minion laughing/etc)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(750, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (err) {
    console.error("Critical: Sfx synthesizer fallback crash caught: ", err);
  }
};
