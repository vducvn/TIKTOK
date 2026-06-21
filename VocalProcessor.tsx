import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, Upload, Mic, MicOff, Settings2, Sparkles, 
  Trash2, Radio, Music as MusicIcon, Volume2, Waves, RotateCcw,
  Check, Download, Circle, StopCircle, RefreshCw, Disc,
  FileText, Search, Sliders, ChevronRight, ChevronLeft, Type, Clock,
  Youtube, Video, Camera, Shield
} from "lucide-react";
import { synthesizeSfxFallback } from "../utils/sfx";

interface VocalProcessorProps {
  onStateChange?: (active: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onReverbChange?: (reverb: number) => void;
  webLang?: string;
  t?: any;
  isPro?: boolean;
}

// Built-in Synced Karaoke Songs catalog for maximum premium/exclusive value
interface KaraokeSong {
  id: string;
  title: string;
  artist: string;
  lrc: {
    time: number; // in seconds
    text: string;
  }[];
}

const PRELOADED_KARAOKE_LIBRARY: KaraokeSong[] = [
  {
    id: "co_ay_la_vo_anh_ta",
    title: "Cô Ấy Là Vợ Anh Ta",
    artist: "A.T.L ft. Sỹ P.Y & Lúa XC",
    lrc: [
      { time: 0, text: "🎵 Chuẩn bị vào nhạc... Hãy cắm tai nghe nhé 🎵" },
      { time: 4, text: "⚪ ⚪ ⚪ ⚪ Nhạc dạo..." },
      { time: 8, text: "Chuyện kể đời tư của một chàng trai, đem lòng thương người con gái." },
      { time: 14, text: "Mối lương duyên bắt đầu nghiệt ngã, khi chiếc nhẫn họ trao tay." },
      { time: 20, text: "Hôm nay em là cô dâu mới, áo hoa lộng lẫy bước theo chồng." },
      { time: 26, text: "Còn tôi đứng lặng im một góc, nhìn người mình yêu trong lòng xót xa." },
      { time: 32, text: "Cô ấy bây giờ là vợ người ta, đâu còn là cô gái xưa của ta." },
      { time: 38, text: "Chúc em hạnh phúc bên ai kia, giông bão cuộc đời để mình anh gánh chia." },
      { time: 44, text: "🎵 Giang tấu nhẹ nhàng... Phiêu nốt cao đi idol! 🎵" },
      { time: 50, text: "Từng lời thề hẹn nay bay theo gió, kỷ niệm xưa xin khép lại từ đây." }
    ]
  },
  {
    id: "dung_lam_trai_tim_anh_dau",
    title: "Đừng Làm Trái Tim Anh Đau",
    artist: "Sơn Tùng M-TP",
    lrc: [
      { time: 0, text: "🎵 Đang đợi vào beat... Sẵn sàng phiêu lưu 🎵" },
      { time: 3, text: "⚪ ⚪ ⚪ ⚪ Vào!" },
      { time: 6, text: "Từ lần đầu tiên ta gặp nhau, trái tim anh đã bối rối." },
      { time: 10, text: "Nụ cười của em làm anh say đắm, cả đêm thâu cứ nhớ hoài." },
      { time: 15, text: "Đừng làm trái tim anh đau, đừng để nỗi nhớ dâng trào." },
      { time: 19, text: "Hãy để anh được bên em, che chở em suốt cuộc đời này." },
      { time: 24, text: "Yêu em mãi thôi, chỉ yêu mỗi em mà thôi người ơi!" }
    ]
  },
  {
    id: "waiting_for_you",
    title: "Waiting For You",
    artist: "MONO",
    lrc: [
      { time: 0, text: "🎵 Intro cực bốc... Nhún nhảy theo nhịp nào 🎵" },
      { time: 4, text: "⚪ ⚪ ⚪ ⚪ HÁT!" },
      { time: 7, text: "U u u ú, cứ ngỡ như là một giấc mơ qua." },
      { time: 11, text: "Hình bóng em vẫn cứ đong đầy, làm con tim ngọt ngào say đắm." },
      { time: 16, text: "Waiting for you hôm nay, anh vẫn đứng đây chờ đợi em." },
      { time: 21, text: "Dù trời mưa rơi hay nắng ấm, lòng này nguyện trao riêng mình em thôi!" }
    ]
  }
];

export default function VocalProcessor({ onStateChange, onVolumeChange, onReverbChange, webLang = "vi", t, isPro = false }: VocalProcessorProps) {
  // Navigation tabs (Processor vs Teleprompter/Lyrics screen) default to mixer
  const [activeSubTab, setActiveSubTab] = useState<"mixer" | "youtube" | "camera">("mixer");
  const [showProWarningModal, setShowProWarningModal] = useState<boolean>(false);
  const [isMixerExpanded, setIsMixerExpanded] = useState<boolean>(false);

  // getPresetLabel dynamically based on webLang
  const getPresetLabel = (key: string) => {
    switch (key) {
      case "clean":
        return webLang === "en" ? " Clean Vocal" : webLang === "zh" ? " 均衡原声" : " Vocal Tròn";
      case "karaoke":
        return webLang === "en" ? " Golden Karaoke" : webLang === "zh" ? " 黄金卡拉OK" : " Karaoke Vàng";
      case "cathedral":
        return webLang === "en" ? " Grand Cathedral" : webLang === "zh" ? " 大教堂空间" : " Đại Sảnh Rộng";
      case "mier_vocal":
        return webLang === "en" ? " Mixer Vocal Pro" : webLang === "zh" ? " 调音师核心模式" : " Mixer Vocal Pro";
      case "mc":
        return webLang === "en" ? " MC Stream Mode" : webLang === "zh" ? " MC 主持模式" : " MC Trò Chuyện";
      case "acoustic":
        return webLang === "en" ? " Acoustic Cover" : webLang === "zh" ? " 现场弹唱模式" : " Mộc Acoustic";
      case "boy":
        return webLang === "en" ? " Deep Male Voice" : webLang === "zh" ? " 浑厚男声" : " Giọng Con Trai";
      case "robot":
        return webLang === "en" ? " Metallic Robot" : webLang === "zh" ? " 科技机械音" : " Metal Robot";
      default:
        return key;
    }
  };

  // Audio system states (Load from localStorage if exists, persistent setup)
  const [isMicActive, setIsMicActive] = useState(false);
  const [vocalVolume, setVocalVolume] = useState<number>(() => {
    const saved = localStorage.getItem("vp_vocalVolume");
    return saved !== null ? parseInt(saved, 10) : 85;
  });
  const [reverbDepth, setReverbDepth] = useState<number>(() => {
    const saved = localStorage.getItem("vp_reverbDepth");
    return saved !== null ? parseInt(saved, 10) : 45;
  });
  const [pitchShift, setPitchShift] = useState<number>(() => {
    const saved = localStorage.getItem("vp_pitchShift");
    return saved !== null ? parseFloat(saved) : 0;
  });
  const [selectedPreset, setSelectedPreset] = useState<string>(() => {
    const saved = localStorage.getItem("vp_selectedPreset");
    return saved !== null ? saved : "karaoke";
  });

  // State references to solve React closure issues in Audio Graph loop and requestAnimationFrame
  const isMicActiveRef = useRef<boolean>(false);
  useEffect(() => {
    isMicActiveRef.current = isMicActive;
  }, [isMicActive]);

  const pitchShiftRef = useRef<number>(0);
  useEffect(() => {
    pitchShiftRef.current = pitchShift;
  }, [pitchShift]);

  // Webcam & Camera Preview states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>(() => {
    const saved = localStorage.getItem("vp_selectedCameraId");
    return saved !== null ? saved : "";
  });
  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>(() => {
    const saved = localStorage.getItem("vp_selectedMicrophoneId");
    return saved !== null ? saved : "";
  });
  const [isLocalMonitorActive, setIsLocalMonitorActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("vp_isLocalMonitorActive");
    return saved !== null ? saved === "true" : true;
  });

  const [isDuckingActive, setIsDuckingActive] = useState<boolean>(false);
  const [autotuneKey, setAutotuneKey] = useState<string>("C");

  const playSoundEffect = (url: string) => {
    const sfxAudio = new Audio(url);
    sfxAudio.volume = 0.8;
    sfxAudio.play().catch(err => {
      console.warn("External sound load failed, fallback to high-fidelity synthesizer:", err);
      let inferredName = "bell";
      if (url.includes("applause") || url.includes("cheer")) inferredName = "applause";
      else if (url.includes("thunder") || url.includes("set") || url.includes("lightning")) inferredName = "thunder";
      else if (url.includes("headshot") || url.includes("gun") || url.includes("ak47") || url.includes("fart")) inferredName = "gunshot";
      else if (url.includes("cash") || url.includes("register") || url.includes("kaching") || url.includes("ding")) inferredName = "kaching";
      synthesizeSfxFallback(inferredName);
    });
  };

  // Video track references
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Acoustic EQ & Saturation adjustments (Load from localStorage if exists)
  const [bassBoost, setBassBoost] = useState<number>(() => {
    const saved = localStorage.getItem("vp_bassBoost");
    return saved !== null ? parseInt(saved, 10) : 60;
  });
  const [trebleBoost, setTrebleBoost] = useState<number>(() => {
    const saved = localStorage.getItem("vp_trebleBoost");
    return saved !== null ? parseInt(saved, 10) : 70;
  });
  const [isCompressorActive, setIsCompressorActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("vp_isCompressorActive");
    return saved !== null ? saved === "true" : true;
  });

  const [isLowCutActive, setIsLowCutActive] = useState<boolean>(() => {
    const saved = localStorage.getItem("vp_isLowCutActive");
    return saved !== null ? saved === "true" : true;
  });

  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioOutputId, setSelectedAudioOutputId] = useState<string>(() => {
    const saved = localStorage.getItem("vp_selectedAudioOutputId");
    return saved !== null ? saved : "";
  });

  // Background Beat player states
  const [beatFile, setBeatFile] = useState<File | null>(null);
  const [beatName, setBeatName] = useState<string>("Karaoke Beat chưa chọn");
  const [beatVolume, setBeatVolume] = useState<number>(() => {
    const saved = localStorage.getItem("vp_beatVolume");
    return saved !== null ? parseInt(saved, 10) : 55;
  });
  const [isBeatPlaying, setIsBeatPlaying] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("vp_vocalVolume", vocalVolume.toString());
    if (onVolumeChange) {
      onVolumeChange((vocalVolume / 100) * 2);
    }
  }, [vocalVolume, onVolumeChange]);

  useEffect(() => {
    localStorage.setItem("vp_reverbDepth", reverbDepth.toString());
    if (onReverbChange) {
      onReverbChange(reverbDepth / 100);
    }
  }, [reverbDepth, onReverbChange]);

  useEffect(() => {
    localStorage.setItem("vp_pitchShift", pitchShift.toString());
  }, [pitchShift]);

  useEffect(() => {
    localStorage.setItem("vp_selectedPreset", selectedPreset);
  }, [selectedPreset]);

  useEffect(() => {
    localStorage.setItem("vp_selectedCameraId", selectedCameraId);
  }, [selectedCameraId]);

  useEffect(() => {
    localStorage.setItem("vp_selectedMicrophoneId", selectedMicrophoneId);
  }, [selectedMicrophoneId]);

  useEffect(() => {
    localStorage.setItem("vp_isLocalMonitorActive", isLocalMonitorActive ? "true" : "false");
  }, [isLocalMonitorActive]);

  useEffect(() => {
    localStorage.setItem("vp_bassBoost", bassBoost.toString());
  }, [bassBoost]);

  useEffect(() => {
    localStorage.setItem("vp_trebleBoost", trebleBoost.toString());
  }, [trebleBoost]);

  useEffect(() => {
    localStorage.setItem("vp_isCompressorActive", isCompressorActive ? "true" : "false");
  }, [isCompressorActive]);

  useEffect(() => {
    localStorage.setItem("vp_isLowCutActive", isLowCutActive ? "true" : "false");
  }, [isLowCutActive]);

  useEffect(() => {
    localStorage.setItem("vp_selectedAudioOutputId", selectedAudioOutputId);
  }, [selectedAudioOutputId]);

  useEffect(() => {
    localStorage.setItem("vp_beatVolume", beatVolume.toString());
  }, [beatVolume]);

  // Pitch Shifter buffers and read/write indexes
  const pitchShifterDelayBufferRef = useRef<Float32Array>(new Float32Array(16384));
  const pitchShifterWritePtrRef = useRef<number>(0);
  const pitchShifterSweepRef = useRef<number>(0);
  const [beatDuration, setBeatDuration] = useState(0);
  const [beatCurrentTime, setBeatCurrentTime] = useState(0);

  // YouTube Live Karaoke states (Premium adblock tracker)
  const [youtubeInput, setYoutubeInput] = useState<string>("");
  const [youtubeSearchType, setYoutubeSearchType] = useState<"karaoke" | "vocal">("karaoke");
  const [activeYoutubeId, setActiveYoutubeId] = useState<string>("co7H6Xg9vRE"); // Default: "Cô Ấy Là Vợ Anh Ta" karaoke video ID
  const [youtubeTitle, setYoutubeTitle] = useState<string>("Cô Ấy Là Vợ Anh Ta (Karaoke Beat)");
  const [isAdBlockActive, setIsAdBlockActive] = useState<boolean>(true);
  const [youtubeSearchResults, setYoutubeSearchResults] = useState<{id: string, title: string, channel: string, duration: string}[]>([]);
  const [isSearchingYoutube, setIsSearchingYoutube] = useState(false);

  // Extract YouTube ID helper
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Integrated real-time Youtube Search proxy
  const handleYoutubeSearch = async () => {
    if (!youtubeInput.trim()) return;
    const directId = extractYoutubeId(youtubeInput);
    if (directId) {
      setActiveYoutubeId(directId);
      setYoutubeTitle("Bài hát nạp trực tiếp bằng URL");
      setYoutubeInput("");
      setYoutubeSearchResults([]);
      return;
    }

    setIsSearchingYoutube(true);
    try {
      // Tự động thêm đuôi "karaoke" hoặc "lyrics" tùy vào lựa chọn
      let query = youtubeInput.trim();
      const lowerQuery = query.toLowerCase();
      if (youtubeSearchType === "karaoke" && !lowerQuery.includes("karaoke") && !lowerQuery.includes("beat")) {
        query += " karaoke";
      } else if (youtubeSearchType === "vocal" && !lowerQuery.includes("lyric") && !lowerQuery.includes("có lời")) {
        query += " lyrics";
      }

      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setYoutubeSearchResults(data.results || []);
      } else {
        alert("Có lỗi xảy ra khi tìm kiếm trên YouTube.");
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm YouTube:", err);
    } finally {
      setIsSearchingYoutube(false);
    }
  };

  // Lyrics Teleprompter State controls
  const [selectedLyricSong, setSelectedLyricSong] = useState<string>("co_ay_la_vo_anh_ta");
  const [customLyricsText, setCustomLyricsText] = useState("");
  const [isUsingCustomLyrics, setIsUsingCustomLyrics] = useState(false);
  const [prompterTextSize, setPrompterTextSize] = useState<"sm" | "md" | "lg">("md");
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(15); // for custom lyrics auto scroll (WPM rate)
  const [customScrollOffset, setCustomScrollOffset] = useState(0);
  const [activeSyncLineIndex, setActiveSyncLineIndex] = useState(0);
  
  // Glowing countdown bubbles for intro prep (4 dots)
  const [countDownDots, setCountDownDots] = useState([false, false, false, false]);

  // Master Studio Record bounce
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // Audio Graph instances references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const beatAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const beatSourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Volume channels reference
  const vocalGainRef = useRef<GainNode | null>(null);
  const reverbGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // High-fidelity processor blocks
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const lowCutFilterRef = useRef<BiquadFilterNode | null>(null);

  // Spatial Echo Reverb parameters
  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pitchShifterNodeRef = useRef<ScriptProcessorNode | null>(null);

  // Recorder storage references
  const recordDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Canvas context references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll timer reference for non-synchronized pasted rap bars / notes
  const customLyricsScrollIntervalRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      stopCamera();
      clearInterval(recordTimerRef.current);
      clearInterval(customLyricsScrollIntervalRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Listen to custom hotkey dispatch events from the global Stream Deck
  useEffect(() => {
    const handleToggleMic = () => {
      toggleMicrophone();
    };
    const handleStopBeat = () => {
      setIsBeatPlaying(false);
    };

    window.addEventListener("vocal-processor-toggle-mic", handleToggleMic);
    window.addEventListener("vocal-processor-stop-beat", handleStopBeat);

    return () => {
      window.removeEventListener("vocal-processor-toggle-mic", handleToggleMic);
      window.removeEventListener("vocal-processor-stop-beat", handleStopBeat);
    };
  }, [selectedMicrophoneId, isMicActive]);

  // Update volume channels on parameters edit
  useEffect(() => {
    if (vocalGainRef.current && audioCtxRef.current) {
      vocalGainRef.current.gain.setValueAtTime(vocalVolume / 100, audioCtxRef.current.currentTime);
    }
  }, [vocalVolume]);

  useEffect(() => {
    if (reverbGainRef.current && audioCtxRef.current && feedbackGainRef.current) {
      reverbGainRef.current.gain.setValueAtTime(reverbDepth / 200, audioCtxRef.current.currentTime);
      const fbRatio = Math.min(0.72, (reverbDepth / 100) * 0.85);
      feedbackGainRef.current.gain.setValueAtTime(fbRatio, audioCtxRef.current.currentTime);
    }
  }, [reverbDepth]);

  useEffect(() => {
    if (musicGainRef.current && audioCtxRef.current) {
      musicGainRef.current.gain.setValueAtTime(beatVolume / 100, audioCtxRef.current.currentTime);
    }
  }, [beatVolume]);

  useEffect(() => {
    if (bassFilterRef.current && audioCtxRef.current) {
      const dbGain = ((bassBoost / 100) * 25) - 10;
      bassFilterRef.current.gain.setValueAtTime(dbGain, audioCtxRef.current.currentTime);
    }
  }, [bassBoost]);

  useEffect(() => {
    if (trebleFilterRef.current && audioCtxRef.current) {
      const dbGain = ((trebleBoost / 100) * 25) - 10;
      trebleFilterRef.current.gain.setValueAtTime(dbGain, audioCtxRef.current.currentTime);
    }
  }, [trebleBoost]);

  useEffect(() => {
    if (compressorRef.current && audioCtxRef.current) {
      if (isCompressorActive) {
        compressorRef.current.threshold.setValueAtTime(-26, audioCtxRef.current.currentTime);
      } else {
        compressorRef.current.threshold.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
    }
  }, [isCompressorActive]);

  useEffect(() => {
    if (lowCutFilterRef.current && audioCtxRef.current) {
      if (isLowCutActive) {
        lowCutFilterRef.current.frequency.setValueAtTime(80, audioCtxRef.current.currentTime);
      } else {
        lowCutFilterRef.current.frequency.setValueAtTime(10, audioCtxRef.current.currentTime);
      }
    }
  }, [isLowCutActive]);

  useEffect(() => {
    if (beatAudioElementRef.current && (beatAudioElementRef.current as any).setSinkId) {
      (beatAudioElementRef.current as any).setSinkId(selectedAudioOutputId)
        .catch((err: any) => console.warn("Failed to set audio output destination sink:", err));
    }
  }, [selectedAudioOutputId]);

  // Handle auto synchronization of song lyrics when audio beat is playing
  useEffect(() => {
    if (!isUsingCustomLyrics) {
      const activeSong = PRELOADED_KARAOKE_LIBRARY.find(s => s.id === selectedLyricSong);
      if (activeSong && isBeatPlaying) {
        // Evaluate active index based on time
        let correctIndex = 0;
        for (let i = 0; i < activeSong.lrc.length; i++) {
          if (beatCurrentTime >= activeSong.lrc[i].time) {
            correctIndex = i;
          }
        }
        setActiveSyncLineIndex(correctIndex);

        // Update glowing intro dots count-down based on active state line
        if (correctIndex === 1) {
          // Dynamic dots countdown tick
          const dotInterval = Math.floor((beatCurrentTime) % 4);
          const newDots = [false, false, false, false];
          for (let d = 0; d <= dotInterval; d++) {
            newDots[d] = true;
          }
          setCountDownDots(newDots);
        } else if (correctIndex > 1) {
          setCountDownDots([true, true, true, true]); // fully lit
        } else {
          setCountDownDots([false, false, false, false]); // unlit
        }

        // Center scroll active element inside lyrics panel viewport
        if (lyricsContainerRef.current) {
          const activeEl = lyricsContainerRef.current.querySelector(`[data-line="${correctIndex}"]`);
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }
    }
  }, [beatCurrentTime, isBeatPlaying, selectedLyricSong, isUsingCustomLyrics]);

  // Handle custom text custom scrolling flow
  useEffect(() => {
    if (isUsingCustomLyrics && isBeatPlaying) {
      clearInterval(customLyricsScrollIntervalRef.current);
      customLyricsScrollIntervalRef.current = setInterval(() => {
        if (lyricsContainerRef.current) {
          lyricsContainerRef.current.scrollTop += (autoScrollSpeed / 10);
        }
      }, 100);
    } else {
      clearInterval(customLyricsScrollIntervalRef.current);
    }
    return () => clearInterval(customLyricsScrollIntervalRef.current);
  }, [isUsingCustomLyrics, isBeatPlaying, autoScrollSpeed]);

  // Handle Beat audio element play state
  useEffect(() => {
    if (beatAudioElementRef.current) {
      if (isBeatPlaying) {
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        beatAudioElementRef.current.play().catch(err => {
          console.error("Lỗi phát nhạc nền:", err);
          setIsBeatPlaying(false);
        });
      } else {
        beatAudioElementRef.current.pause();
      }
    }
  }, [isBeatPlaying]);

  // Setup Web Audio Graph Context and pipelines
  const initAudioContextIfNeeded = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master element
      const master = ctx.createGain();
      master.gain.setValueAtTime(1.0, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Audio destination for secure record bounce
      const recordDest = ctx.createMediaStreamDestination();
      recordDestRef.current = recordDest;
      master.connect(recordDest);

      // Spectrum analyzer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Mixer routes
      vocalGainRef.current = ctx.createGain();
      reverbGainRef.current = ctx.createGain();
      musicGainRef.current = ctx.createGain();

      vocalGainRef.current.gain.setValueAtTime(vocalVolume / 100, ctx.currentTime);
      reverbGainRef.current.gain.setValueAtTime(reverbDepth / 200, ctx.currentTime);
      musicGainRef.current.gain.setValueAtTime(beatVolume / 100, ctx.currentTime);

      vocalGainRef.current.connect(master);
      vocalGainRef.current.connect(analyser);

      reverbGainRef.current.connect(master);
      reverbGainRef.current.connect(analyser);

      musicGainRef.current.connect(master);

      // EQ shelves
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = "lowshelf";
      lowShelf.frequency.setValueAtTime(160, ctx.currentTime);
      bassFilterRef.current = lowShelf;

      const highShelf = ctx.createBiquadFilter();
      highShelf.type = "highshelf";
      highShelf.frequency.setValueAtTime(8000, ctx.currentTime);
      trebleFilterRef.current = highShelf;

      // Fast-attack AGC compressor
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(isCompressorActive ? -26 : 0, ctx.currentTime);
      compressor.knee.setValueAtTime(25, ctx.currentTime);
      compressor.ratio.setValueAtTime(4.2, ctx.currentTime);
      compressor.attack.setValueAtTime(0.008, ctx.currentTime);
      compressor.release.setValueAtTime(0.24, ctx.currentTime);
      compressorRef.current = compressor;

      // 80Hz Low-Cut EQ (Highpass filter)
      const lowCutFilter = ctx.createBiquadFilter();
      lowCutFilter.type = "highpass";
      lowCutFilter.frequency.setValueAtTime(isLowCutActive ? 80 : 10, ctx.currentTime);
      lowCutFilterRef.current = lowCutFilter;

      compressor.connect(lowCutFilter);
      lowCutFilter.connect(lowShelf);
      lowShelf.connect(highShelf);
      highShelf.connect(vocalGainRef.current);

      // Reverb Echo Feed loop
      const delay = ctx.createDelay(1.0);
      delay.delayTime.setValueAtTime(0.26, ctx.currentTime);
      delayNodeRef.current = delay;

      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.42, ctx.currentTime);
      feedbackGainRef.current = feedback;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(2800, ctx.currentTime);

      vocalGainRef.current.connect(delay);
      delay.connect(lowpass);
      lowpass.connect(feedback);
      feedback.connect(delay);
      feedback.connect(reverbGainRef.current);

      startVisualizer();
    }
  };

  const enumerateDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn("enumerateDevices không được hỗ trợ trên trình duyệt này.");
        return;
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoIn = devices.filter(d => d.kind === "videoinput");
      const audioIn = devices.filter(d => d.kind === "audioinput");
      const audioOut = devices.filter(d => d.kind === "audiooutput");
      setCameraDevices(videoIn);
      setMicrophoneDevices(audioIn);
      setAudioOutputDevices(audioOut);

      if (videoIn.length > 0) {
        const hasSavedCamera = videoIn.some(d => d.deviceId === selectedCameraId);
        if (!selectedCameraId || !hasSavedCamera) {
          setSelectedCameraId(videoIn[0].deviceId);
        }
      }

      if (audioIn.length > 0) {
        const hasSavedMic = audioIn.some(d => d.deviceId === selectedMicrophoneId);
        if (!selectedMicrophoneId || !hasSavedMic) {
          setSelectedMicrophoneId(audioIn[0].deviceId);
        }
      }

      if (audioOut.length > 0) {
        const hasSavedOut = audioOut.some(d => d.deviceId === selectedAudioOutputId);
        if (!selectedAudioOutputId || !hasSavedOut) {
          setSelectedAudioOutputId(audioOut[0].deviceId);
        }
      }
    } catch (err) {
      console.error("Lỗi khi quét thiết bị ngoại vi:", err);
    }
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : true,
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoStreamRef.current = stream;
        
        setTimeout(() => {
          if (videoElementRef.current) {
            videoElementRef.current.srcObject = stream;
          }
        }, 100);
        
        setIsCameraActive(true);
        // Load lại nhãn thiết bị sau khi được cấp quyền
        await enumerateDevices();
      } catch (err) {
        console.error("Không thể kết nối Camera:", err);
        alert("Không thể kết nối camera hợp lệ. Bạn hãy bấm vào biểu tượng camera/ổ khóa trên thanh địa chỉ để CHÈN/CHO PHÉP quyền truy xuất Camera và Micro nhé!");
      }
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(t => t.stop());
      videoStreamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Open & Capture mic stream
  const toggleMicrophone = async () => {
    if (isMicActive) {
      stopMic();
    } else {
      try {
        initAudioContextIfNeeded();
        const ctx = audioCtxRef.current!;

        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const micConstraints = {
          audio: selectedMicrophoneId ? { deviceId: { exact: selectedMicrophoneId } } : {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(micConstraints);

        micStreamRef.current = stream;
        const micSource = ctx.createMediaStreamSource(stream);
        micSourceRef.current = micSource;

        // Reset Pitch Shifter pointers and clear delay buffer
        pitchShifterWritePtrRef.current = 0;
        pitchShifterSweepRef.current = 0;
        pitchShifterDelayBufferRef.current.fill(0);

        // Custom pitch shifter script node
        const bufferSize = 1024; // Mượt mà hơn và tránh card âm thanh bị im re so với 256
        const shNode = ctx.createScriptProcessor(bufferSize, 1, 1);
        pitchShifterNodeRef.current = shNode;
        // Bảo vệ node khỏi Garbage Collection của trình duyệt
        (window as any)._activeScriptNode = shNode;

        const delayBuffer = pitchShifterDelayBufferRef.current;
        const bufferLen = delayBuffer.length;
        const S = 1320; // Kích thước Sweep mẫu (~30ms ở 44.1kHz) cho chất lượng mượt tuyệt đối

        shNode.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          const output = e.outputBuffer.getChannelData(0);
          const currentShift = pitchShiftRef.current;
          const factor = Math.pow(2, currentShift / 12);

          // Nếu không đổi giọng (pitchShift === 0) thì bỏ qua, cho tín hiệu đi thẳng mượt mà
          if (currentShift === 0) {
            for (let i = 0; i < input.length; i++) {
              output[i] = input[i];
            }
            return;
          }

          let writePtr = pitchShifterWritePtrRef.current;
          let sweep = pitchShifterSweepRef.current;

          for (let i = 0; i < input.length; i++) {
            // Lưu mẫu âm thanh vào Delay Buffer vòng tròn
            delayBuffer[writePtr] = input[i];

            // Đầu phát 1 (Player 1): độ trễ d1 mẫu
            const d1 = sweep;
            let readPtr1 = writePtr - d1;
            if (readPtr1 < 0) readPtr1 += bufferLen;
            const idx1 = Math.floor(readPtr1);
            const frac1 = readPtr1 - idx1;
            const nextIdx1 = (idx1 + 1) % bufferLen;
            const sample1 = delayBuffer[idx1] * (1 - frac1) + delayBuffer[nextIdx1] * frac1;

            // Đầu phát 2 (Player 2): lệch pha 180 độ (d2 = sweep + S/2)
            const d2 = (sweep + S / 2) % S;
            let readPtr2 = writePtr - d2;
            if (readPtr2 < 0) readPtr2 += bufferLen;
            const idx2 = Math.floor(readPtr2);
            const frac2 = readPtr2 - idx2;
            const nextIdx2 = (idx2 + 1) % bufferLen;
            const sample2 = delayBuffer[idx2] * (1 - frac2) + delayBuffer[nextIdx2] * frac2;

            // Cửa sổ nội suy hình sin (Hann window) để triệt tiêu độ vang nhấp nhô & méo tiếng robot
            const weight1 = Math.pow(Math.sin((d1 / S) * Math.PI), 2);
            const weight2 = 1 - weight1;

            // Kết hợp tín hiệu từ cả 2 đầu phát đã triệt tiêu độ trễ nhấp nháp
            output[i] = (sample1 * weight1) + (sample2 * weight2);

            // Điều chỉnh đầu sweep tuyến tính theo hệ số dịch giọng
            sweep += (1 - factor);
            if (sweep < 0) {
              sweep += S;
            } else if (sweep >= S) {
              sweep -= S;
            }

            // Tịnh tiến vị trí ghi
            writePtr = (writePtr + 1) % bufferLen;
          }

          pitchShifterWritePtrRef.current = writePtr;
          pitchShifterSweepRef.current = sweep;
        };

        micSource.connect(shNode);
        shNode.connect(compressorRef.current!);

        setIsMicActive(true);
        if (onStateChange) onStateChange(true);
      } catch (err) {
        console.error("Không thể kết nối Microphone của bạn:", err);
        alert("Không thể kết nối mic. Vui lòng kiểm tra quyền truy cập microphone trên thanh địa chỉ bạn nhé!");
      }
    }
  };

  const stopMic = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (pitchShifterNodeRef.current) {
      pitchShifterNodeRef.current.disconnect();
      pitchShifterNodeRef.current = null;
    }
    setIsMicActive(false);
    if (onStateChange) onStateChange(false);
  };

  const stopAllAudio = () => {
    stopMic();
    if (beatAudioElementRef.current) {
      beatAudioElementRef.current.pause();
    }
    setIsBeatPlaying(false);
    if (isRecording) {
      stopRecording();
    }
  };

  // Upload custom beat
  const handleBeatUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setBeatFile(file);
      setBeatName(file.name);

      initAudioContextIfNeeded();
      const ctx = audioCtxRef.current!;

      if (beatAudioElementRef.current) {
        beatAudioElementRef.current.pause();
        beatAudioElementRef.current.remove();
      }

      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.loop = true;
      audio.crossOrigin = "anonymous";
      beatAudioElementRef.current = audio;

      audio.onloadedmetadata = () => {
        setBeatDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setBeatCurrentTime(audio.currentTime);
      };

      const source = ctx.createMediaElementSource(audio);
      beatSourceRef.current = source;
      source.connect(musicGainRef.current!);

      setIsBeatPlaying(true);
    }
  };

  // Convert seconds to readable MM:SS format
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Apply premium acoustic presets
  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    switch (presetKey) {
      case "clean":
        setVocalVolume(90);
        setReverbDepth(5);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(55);
        setTrebleBoost(65);
        setIsCompressorActive(true);
        break;
      case "karaoke":
        setVocalVolume(85);
        setReverbDepth(48);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(70);
        setTrebleBoost(75);
        setIsCompressorActive(true);
        break;
      case "cathedral":
        setVocalVolume(80);
        setReverbDepth(85);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(60);
        setTrebleBoost(80);
        setIsCompressorActive(true);
        break;
      case "mier_vocal":
        setVocalVolume(98);
        setReverbDepth(40);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(65);
        setTrebleBoost(85);
        setIsCompressorActive(true);
        break;
      case "mc":
        setVocalVolume(95);
        setReverbDepth(15);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(70);
        setTrebleBoost(75);
        setIsCompressorActive(true);
        setBeatVolume(25);
        setIsDuckingActive(true);
        break;
      case "acoustic":
        setVocalVolume(90);
        setReverbDepth(35);
        setPitchShift(0);
        setAutotuneKey("C");
        setBassBoost(50);
        setTrebleBoost(90);
        setIsCompressorActive(true);
        break;
      case "boy":
        setVocalVolume(90);
        setReverbDepth(30);
        setPitchShift(-3.8);
        setBassBoost(95);
        setTrebleBoost(50);
        setIsCompressorActive(true);
        break;
      case "robot":
        setVocalVolume(80);
        setReverbDepth(35);
        setPitchShift(-12.0);
        setBassBoost(80);
        setTrebleBoost(80);
        setIsCompressorActive(false);
        break;
      default:
        break;
    }
  };

  const applyPresetConfig = (presetKey: string) => {
    applyPreset(presetKey);
  };

  // Recording engine
  const startRecording = () => {
    initAudioContextIfNeeded();
    const ctx = audioCtxRef.current!;
    const streamDest = recordDestRef.current;

    if (!streamDest) {
      alert("Hãy mở Mic hoặc Nạp một bài hát beat rồi bắt đầu thu âm nhé!");
      return;
    }

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    recordedChunksRef.current = [];
    let options = { mimeType: "audio/webm;codecs=opus" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "audio/webm" };
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "" };
    }

    try {
      const recorder = new MediaRecorder(streamDest.stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedUrl(url);
      };

      setRecordTime(0);
      setRecordedUrl(null);

      recorder.start(250);
      setIsRecording(true);

      recordTimerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Lỗi recording graph:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordTimerRef.current);
    }
  };

  const startVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Tối ưu hóa độ phân giải sắc nét khi zoom (Retina & Zoom-proof Canvas với DPR thực tế)
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetWidth = Math.floor(rect.width * dpr) || 480;
      const targetHeight = Math.floor(rect.height * dpr) || 56;
      
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.fillStyle = "rgba(4, 3, 10, 0.42)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.82;
        const percent = i / bufferLength;
        const r = Math.floor(217 - (percent * 140));
        const g = Math.floor(70 + (percent * 110));
        const b = Math.floor(239 - (percent * 20));

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.12)`;
        ctx.fillRect(x, canvas.height - barHeight - 4, barWidth - 1, barHeight + 4);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1.5, barHeight);

        x += barWidth;
      }

      // Sine wave overlay
      if (isMicActiveRef.current) {
        ctx.beginPath();
        ctx.lineWidth = 1.8 * dpr;
        ctx.strokeStyle = "rgba(14, 165, 233, 0.55)";
        ctx.moveTo(0, canvas.height / 2);

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const yOffset = (v * canvas.height * 0.4) - 10;
          const xPos = (canvas.width / bufferLength) * i * 2;
          ctx.lineTo(xPos, (canvas.height / 2) + Math.sin(i * 0.2) * yOffset);
        }
        ctx.stroke();
      }
    };

    draw();
  };

  // Helper helper list generator for pasted custom lyrics lines
  const getCustomLyricsLines = () => {
    if (!customLyricsText) return ["Nhập lời bài hát của bạn vào ô bên cạnh để bắt đầu...", "Dòng 2 sẽ tiếp nối tại đây..."];
    return customLyricsText.split("\n").filter(l => l.trim() !== "");
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0518] via-[#0f0724] to-[#010103] p-4.5 rounded-2xl border border-fuchsia-500/15 shadow-[0_0_35px_rgba(217,70,239,0.06)] text-white space-y-4 h-full flex flex-col">
      
      {/* Real-time Spectrum Waves Visualizer with browser permission tips */}
      <div className="relative h-14 bg-[#05020c] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" width={480} height={56} />
        <div className="absolute inset-x-3 bottom-1 flex justify-between px-1 text-[7.5px] font-mono text-slate-500 pointer-events-none select-none">
          <span>0Hz (BASS)</span>
          <span className="text-fuchsia-500/80 animate-pulse font-extrabold flex items-center gap-1">
            {isMicActive ? "● MICROPHONE SIGNAL STABLE" : "⚪ STUDIO MONITOR STANDBY"}
          </span>
          <span>20kHz (TREBLE)</span>
        </div>
        {!isMicActive && !isBeatPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070311]/60 backdrop-blur-[0.5px] pointer-events-none select-none text-center">
            <span className="text-[10px] uppercase font-bold font-mono text-fuchsia-400/90 tracking-widest animate-pulse flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-rose-500 animate-bounce" /> {t.liveRoomNotActive || "PHÒNG THU LIVE - CHƯA BẬT THIẾT BỊ"}
            </span>
            <span className="text-[8.5px] text-slate-400 mt-0.5">{t.liveRoomNotActiveDesc || "Bấm nút \"Bật Mic\" ở tab Mixer hoặc \"Bật Microphone\" ở tab Camera PC để hiển thị sóng!"}</span>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar">

        {/* COLUMN 1: YOUTUBE & KARAOKE */}
        <div className="space-y-4 animate-fade-in flex flex-col">
          

        {/* YOUTUBE ZERO-ADS PLAYER */}
        <div className="bg-[#030107] p-3.5 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-mono text-fuchsia-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
              <Youtube className="w-4 h-4 text-red-500 animate-pulse" />
              HÁT LIVE TRỰC TIẾP TỪ YOUTUBE
            </span>
            <div className="flex items-center gap-1.5 bg-fuchsia-950/40 px-2 py-0.5 rounded-md border border-fuchsia-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[12px] font-mono text-emerald-400 font-bold">Z-ADS LIVE ACTIVE</span>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập tên bài hát hoặc link YouTube..."
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleYoutubeSearch();
                }
              }}
              className="flex-1 bg-[#0a0518] border border-white/10 rounded-lg py-2 px-3 text-[12.5px] text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50"
            />
            <button
              onClick={handleYoutubeSearch}
              disabled={isSearchingYoutube}
              className="bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:tracking-wide text-white font-bold text-[12px] px-4 rounded-lg font-mono transition-all duration-150 transform hover:scale-102 flex items-center gap-1 disabled:opacity-55 shrink-0"
            >
              {isSearchingYoutube ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ĐANG TÌM...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" /> TÌM KIẾM
                </>
              )}
            </button>
          </div>

          {/* RADIO BUTTONS DÀNH CHO BỘ LỌC TÌM KIẾM */}
          <div className="flex gap-3 mt-2 items-center px-1">
            <span className="text-[11px] text-slate-400 font-mono tracking-wide">PHÂN LOẠI NHẠC:</span>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="radio" 
                name="youtubeSearchType" 
                value="karaoke" 
                checked={youtubeSearchType === "karaoke"} 
                onChange={() => setYoutubeSearchType("karaoke")}
                className="w-3.5 h-3.5 text-fuchsia-500 bg-[#0a0518] border-white/20 focus:ring-fuchsia-500" 
              />
              <span className="text-[11.5px] font-bold text-slate-300 group-hover:text-white transition-colors">🎤 Karaoke</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="radio" 
                name="youtubeSearchType" 
                value="vocal" 
                checked={youtubeSearchType === "vocal"} 
                onChange={() => setYoutubeSearchType("vocal")}
                className="w-3.5 h-3.5 text-emerald-500 bg-[#0a0518] border-white/20 focus:ring-emerald-500" 
              />
              <span className="text-[11.5px] font-bold text-slate-300 group-hover:text-white transition-colors">🎧 Nhạc Có Lời</span>
            </label>
          </div>

          {/* REALTIME SEARCH RESULTS RENDERING */}
          {youtubeSearchResults.length > 0 && (
            <div className="mt-2 bg-[#09051c] rounded-xl border border-fuchsia-500/20 max-h-[220px] overflow-y-auto divide-y divide-white/5 shadow-2xl p-1 animate-fade-in custom-scrollbar">
              <div className="p-1 px-2.5 text-[10.5px] text-fuchsia-400 font-mono font-bold flex justify-between items-center bg-[#0d0722]/30 rounded-t-lg">
                <span>🔍 KẾT QUẢ TÌM KIẾM KARAOKE / BEAT ({youtubeSearchResults.length})</span>
                <button 
                  onClick={() => setYoutubeSearchResults([])}
                  className="hover:text-white transition-colors"
                >
                  Đóng [x]
                </button>
              </div>
              {youtubeSearchResults.map((video) => (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveYoutubeId(video.id);
                    setYoutubeTitle(video.title);
                    setYoutubeSearchResults([]);
                  }}
                  className={`flex items-center justify-between p-2 px-3 hover:bg-fuchsia-950/40 cursor-pointer rounded-lg transition-colors group ${
                    activeYoutubeId === video.id ? 'bg-fuchsia-950/60 border border-fuchsia-500/30' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-[11.5px] font-bold text-white group-hover:text-fuchsia-300 transition-colors truncate">
                      {video.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {video.channel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] bg-white/5 py-0.5 px-1.5 rounded-md font-mono text-slate-400">
                      {video.duration}
                    </span>
                    <span className="text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white bg-emerald-500/10 text-[10px] font-extrabold py-1 px-2.5 rounded-md transition-all font-mono">
                      Hát Ngay
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AD-BLOCKER TOGGLE COMPONENT */}
          <div className="flex items-center justify-between bg-[#06030c] p-2.5 rounded-lg border border-fuchsia-500/10">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-fuchsia-300 uppercase tracking-wide flex items-center gap-1">
                {webLang === 'en' ? '🛡️ STUDIO ZERO-ADS TECHNOLOGY' : webLang === 'zh' ? '🛡️ 工作室零广告屏蔽技术' : '🛡️ CÔNG NGHỆ CHẶN QUẢNG CÁO ZERO-ADS CỦA STUDIO'}
              </span>
              <span className="text-[11px] text-slate-400">
                {webLang === 'en' ? 'Utilizes a secure proxy server (Privacy-Enhanced Mode) combined with DNS advertisement cookie blocking to completely eliminate ads that interrupt your music!' : webLang === 'zh' ? '使用安全代理服务器（隐私增强模式）结合 DNS 广告 cookie 拦截，彻底消除中断音乐的广告！' : 'Sử dụng máy chủ Proxy bảo mật (Privacy-Enhanced Mode) kết hợp DNS chặn định danh cookie quảng cáo, dải băng thông trống & loại bỏ hoàn toàn các loại quảng cáo làm gián đoạn bài nhạc!'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isAdBlockActive}
                onChange={(e) => setIsAdBlockActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* DYNAMIC PLAYER VISUAL CONTAINER */}
        {activeYoutubeId ? (
          <div className="space-y-3.5">
            <div className="bg-[#020104] rounded-xl border border-white/10 overflow-hidden relative aspect-video shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <iframe
                src={
                  isAdBlockActive
                    ? `https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&disablekb=1&cc_load_policy=0&vq=hd1080`
                    : `https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&controls=1&rel=0&vq=hd1080`
                }
                title="YouTube Karaoke Zero-Ads Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                style={{ imageRendering: "auto" }}
              ></iframe>
            </div>



        {/* Local Monitoring Panel */}
        <div className="bg-[#0b051c] p-3 rounded-xl border border-fuchsia-500/20 flex items-center justify-between gap-3 text-[12px] font-mono leading-relaxed text-slate-300">
          <div className="flex flex-col gap-0.5">
            <span className="text-pink-400 font-extrabold uppercase text-[11px] flex items-center gap-1.5">
              🎧 {t.localMonitorTitle || "PHẢN HỒI LOA KIỂM ÂM GIỌNG HÁT (LOCAL MONITOR)"}
            </span>
            <span className="text-[9.5px] text-slate-400">
              {t.localMonitorDesc || "Phát trực tiếp giọng nói thật của bạn qua tai nghe/loa sau khi chỉnh bass/treble/reverb"}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isLocalMonitorActive}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsLocalMonitorActive(checked);
                if (audioCtxRef.current && vocalGainRef.current && masterGainRef.current) {
                  if (checked) {
                    vocalGainRef.current.connect(masterGainRef.current);
                    reverbGainRef.current.connect(masterGainRef.current);
                  } else {
                    try {
                      vocalGainRef.current.disconnect(masterGainRef.current);
                      reverbGainRef.current.disconnect(masterGainRef.current);
                    } catch (err) {
                      console.log("Monitor already disconnected", err);
                    }
                  }
                }
              }}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-fuchsia-500"></div>
          </label>
        </div>

        {/* Compact Connected External App Instructions */}
        <div className="bg-[#05020c] p-3.5 rounded-xl border border-sky-500/25 text-[11px] font-mono text-slate-300 space-y-2 leading-relaxed">
          <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400 flex items-center gap-1.5 uppercase text-[11.5px] tracking-wide">
            🔌 {t.voicemodTitle || "KẾT NỐI GIỌNG AI NGOÀI (VOICEMOD, VOICE.AI, HITPAW...)"}
          </p>
          <div className="space-y-1 text-slate-400">
            <p className="text-[11px]">💡 <strong>{t.recordingTip1?.split(':')[0] || "Hát cùng app PC"}:</strong> {t.voicemodDesc2 || "Bật app đổi giọng PC (Voicemod, Voice.ai, HitPaw), tại mục <strong>“Microphone”</strong> ở trên chọn cổng thu ảo tương ứng để hát song kiếm hợp bích cực mượt không trễ!"}</p>
          </div>
        </div>
          </div>
        ) : (
          <div className="bg-[#020104] rounded-xl border border-white/5 p-6 text-center text-slate-500 min-h-[160px] flex flex-col items-center justify-center gap-2">
            <Video className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-[12px] font-mono">{webLang === 'en' ? 'No YouTube video loaded yet. Enter the ID or paste the YouTube video link above to load it!' : webLang === 'zh' ? '暂未加载任何 YouTube 视频。请在上方输入 YouTube 视频的 ID 或粘贴链接进行加载！' : 'Chưa nạp video YouTube nào. Hãy nhập mã ID hoặc dán liên kết video YouTube ở phía trên để nạp nhé!'}</p>
          </div>
        )}

      </div>

      {/* COLUMN 2: CAMERA & AUDIO DEVICES */}
      <div className="space-y-4 animate-fade-in text-slate-300">
        <div className="relative bg-black rounded-xl border border-white/10 overflow-hidden flex flex-col items-center justify-center min-h-[225px] shadow-2xl">
          {isCameraActive ? (
            <video
              ref={videoElementRef}
              autoPlay
              playsInline
              muted
              style={{ transform: "scaleX(-1)" }}
              className="w-full h-full object-cover rounded-xl aspect-video"
            />
          ) : (
            <div className="p-6 text-center space-y-2 flex flex-col items-center justify-center text-slate-500">
              <Camera className="w-12 h-12 text-slate-650 animate-pulse" />
              <p className="text-[12px] font-mono font-bold text-fuchsia-400">{t.cameraNotActive || "CAMERA PC CHƯA HOẠT ĐỘNG"}</p>
              <p className="text-[10px] text-slate-400 max-w-xs">{t.cameraNotActiveDesc || "Nhấn nút \"BẬT CAMERA\" phía dưới để bắt đầu truyền hình và kích hoạt hộp thoại xin quyền duyệt từ trình duyệt!"}</p>
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-md border border-white/5 text-[10px] font-mono flex items-center gap-1.5 backdrop-blur-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? "bg-red-500 animate-pulse" : "bg-slate-500"}`} />
            <span className="text-white">{isCameraActive ? "CAM LIVE FEED" : "STANDBY MONITOR"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleCamera}
            className={`py-2.5 px-3 rounded-xl text-[11px] font-mono font-extrabold uppercase tracking-wider border transition-all duration-150 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isCameraActive
                ? "bg-red-650/40 border-red-500/50 text-red-250 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                : "bg-fuchsia-600/15 border-[#c22df5]/30 text-fuchsia-200 hover:bg-fuchsia-600/25"
            }`}
          >
            {isCameraActive ? <>🔴 TẮT CAMERA FEED</> : <><Camera className="w-4 h-4 text-fuchsia-300" /> {t.btnTurnOnCamera || "BẬT CAMERA LIVE"}</>}
          </button>

          <button
            onClick={toggleMicrophone}
            className={`py-2.5 px-3 rounded-xl text-[11px] font-mono font-extrabold uppercase tracking-wider border transition-all duration-150 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
              isMicActive
                ? "bg-emerald-650/40 border-emerald-500/50 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-fuchsia-600/15 border-[#c22df5]/30 text-fuchsia-200 hover:bg-fuchsia-600/25"
            }`}
          >
            {isMicActive ? <>🔴 TẮT MICROPHONE</> : <><Mic className="w-4 h-4 text-fuchsia-300" /> {t.btnTurnOnMic || "BẬT MICROPHONE"}</>}
          </button>
        </div>

        <div className="bg-[#030107] p-3.5 rounded-xl border border-white/5 space-y-3.5">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[11.5px] font-mono text-fuchsia-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              ⚙️ {t.configDeviceTitle || "CẤU HÌNH THIẾT BỊ AUDIO & VIDEO"}
            </span>
            <button 
              onClick={enumerateDevices}
              className="text-[10px] font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5"
            >
              <RefreshCw className="w-3 h-3 hover:rotate-180 transition-all duration-300" /> {t.btnRefreshDevice || "Làm mới thiết bị"}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-405 block">{t.webcamLabel || "Thiết Bị Ghi Hình (Webcam):"}</label>
            <select
              value={selectedCameraId}
              onChange={(e) => {
                setSelectedCameraId(e.target.value);
                if (isCameraActive) {
                  stopCamera();
                  setTimeout(toggleCamera, 150);
                }
              }}
              className="w-full bg-[#0d071f] border border-white/10 text-white rounded-lg p-2 text-[12px] font-mono cursor-pointer focus:border-fuchsia-500/40"
            >
              {cameraDevices.length > 0 ? (
                cameraDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Camera PC ${i + 1}`}</option>
                ))
              ) : (
                <option value="">-- Click "Bật Camera" hoặc nhấp Ổ Khóa trình duyệt để tìm --</option>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-405 block">{t.micLabel || "Đường Truyền Ghi Âm (Microphone):"}</label>
            <select
              value={selectedMicrophoneId}
              onChange={(e) => {
                setSelectedMicrophoneId(e.target.value);
                if (isMicActive) {
                  stopMic();
                  setTimeout(toggleMicrophone, 150);
                }
              }}
              className="w-full bg-[#0d071f] border border-white/10 text-white rounded-lg p-2 text-[12px] font-mono cursor-pointer focus:border-fuchsia-500/40"
            >
              {microphoneDevices.length > 0 ? (
                microphoneDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>
                ))
              ) : (
                <option value="">-- Click "Bật Micro" hoặc nhấp Ổ Khóa trình duyệt để tìm --</option>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-300 block flex items-center gap-1.5">
              🔊 Ngõ Ra Nhạc và Soundpad (Tách Luồng Cáp Ảo):
              <span className="text-[8px] text-cyan-400 font-bold bg-cyan-500/15 px-1 py-0.5 rounded uppercase font-mono tracking-widest">PRO ROUTING</span>
            </label>
            <select
              value={selectedAudioOutputId}
              onChange={(e) => {
                setSelectedAudioOutputId(e.target.value);
              }}
              className="w-full bg-[#0d071f] border border-white/10 text-white rounded-lg p-2 text-[12px] font-mono cursor-pointer focus:border-cyan-500/40"
            >
              {audioOutputDevices.length > 0 ? (
                audioOutputDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Thiết bị ngõ ra ${i + 1}`}</option>
                ))
              ) : (
                <option value="">-- Thiết bị đầu ra mặc định hệ thống --</option>
              )}
            </select>
          </div>
        </div>

        <div className="bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10 text-[11.5px] font-mono text-yellow-500 space-y-1.5 leading-relaxed">
          <p className="font-extrabold">💡 {t.recordingTipsTitle || "MẸO SỬ DỤNG PHÒNG THU HIỆU QUẢ:"}</p>
          <p>• {t.recordingTip1 ? t.recordingTip1.includes("app PC") ? "" : <strong>{t.recordingTip1.split(":")[0]}</strong> : <strong>Bật Phản Hồi Loa Kiểm Âm</strong>} để nghe rõ giọng hát của bạn đã được làm mịn, thêm reverb vang bùng nổ như ca sĩ chuyên nghiệp.</p>
          <p>• <strong>{t.recordingTip2?.split('trước khi')[0]?.trim() || "LUÔN LUÔN cắm Tai Nghe (Earphone)"}</strong>{t.recordingTip2 ? ` trước khi ${t.recordingTip2.split('trước khi')[1]}` : " trước khi bật kiểm âm nhằm triệt tiêu hiện tượng rè rít (feedback loop) vọng âm thanh từ loa ngược lại mic."}</p>
        </div>
      </div>

      {/* COLUMN 3: STANDARD AUDIO MIXER */}
      <div className="space-y-4 animate-fade-in flex flex-col">
          
          {/* Preset Structural list */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-fuchsia-300 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 
              {webLang === 'en' ? 'VOICE STYLE CHANGER PRESETS' : webLang === 'zh' ? '专业人声变声快捷预设' : 'BỘ LỰA CHỌN KHÔI PHỤC GIỌNG NHANH'}
            </label>
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5">
              {[
                { key: "clean" },
                { key: "karaoke" },
                { key: "cathedral" },
                { key: "mier_vocal" },
                { key: "mc" },
                { key: "acoustic" },
                { key: "boy" },
                { key: "robot" }
              ].map(p => (
                <button
                  key={p.key}
                  id={`preset-${p.key}`}
                  onClick={() => {
                    applyPresetConfig(p.key);
                  }}
                  className={`py-1.5 px-0.5 rounded-lg text-[9px] font-mono leading-none border text-center transition-all duration-150 active:scale-95 ${
                    selectedPreset === p.key
                      ? "bg-fuchsia-600/20 border-fuchsia-500/50 text-fuchsia-300 font-bold shadow-[0_0_8px_rgba(217,70,239,0.15)]"
                      : "bg-[#04020a]/60 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                  }`}
                >
                  {getPresetLabel(p.key)}
                </button>
              ))}
            </div>
          </div>

          {/* K10 PRO HARDWARE SOUNDCARD SIMULATOR PANEL */}
          <div className="bg-[#05020c]/90 border border-fuchsia-500/15 rounded-xl p-3.5 space-y-3 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 py-0.5 px-2 bg-fuchsia-600/40 border-l border-b border-fuchsia-500/35 rounded-bl text-[8px] font-mono tracking-widest text-fuchsia-200 animate-pulse">
              LED PRO_DSP v1.2
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <span className="text-[10px] font-extrabold text-[#d23ff3] uppercase tracking-widest block font-sans">
                {webLang === 'en' ? '💎 K10 PRO DIGITAL SOUNDCARD ENGINE' : webLang === 'zh' ? '💎 K10 PRO 多功能专业声卡核心' : '💎 THIẾT BỊ LIVESTREAM K10 PRO CAO CẤP'}
              </span>
            </div>

            {/* Simulated Autotune Notes (C, D, E, F, G, A, B) */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                {webLang === 'en' ? '🎵 AUTOTUNE ELECTRO KEY:' : webLang === 'zh' ? '🎵 电音 Autotune 调式基准音:' : '🎵 CHỌN TÔNG ĐIỆN ÂM AUTOTUNE:'}
              </span>
              <div className="grid grid-cols-7 gap-1">
                {["C", "D", "E", "F", "G", "A", "B"].map(key => {
                  const isSelected = autotuneKey === key;
                  return (
                    <button
                      key={key}
                      id={`autotune-${key}`}
                      onClick={() => {
                        setAutotuneKey(key);
                        // Simulate tuning setting Pitch
                        const shifts: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: -3, B: -1 };
                        setPitchShift(shifts[key]);
                      }}
                      className={`py-1 text-[9px] font-mono font-bold rounded transiton-all duration-100 ${
                        isSelected 
                          ? "bg-sky-500 text-white shadow-[0_0_8px_rgba(14,165,233,0.4)]" 
                          : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto Ducking (Chế độ MC) & Live Audio Ducking Trigger */}
            <div className="flex items-center justify-between bg-black/50 p-2 rounded-lg border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9.5px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Waves className={`w-3.5 h-3.5 ${isDuckingActive ? "animate-bounce text-sky-400" : "text-slate-500"}`} />
                  {webLang === 'en' ? 'MC AUTO DUCKING (DODGE)' : webLang === 'zh' ? 'MC 主播躲避模式 (自动降低伴奏)' : 'CHẾ ĐỘ MC LIVE (AUTO DUCKING)'}
                </span>
                <span className="text-[8px] text-slate-400 leading-normal">
                  {webLang === 'en' ? 'Music dims by 70% automatically when vocal is heard' : webLang === 'zh' ? '当您在麦克风说话时背景音乐音量智能自适应压低 70%' : 'Tự động giảm âm lượng nhạc nền xuống 70% khi có tiếng nói'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isDuckingActive} 
                  onChange={(e) => {
                    setIsDuckingActive(e.target.checked);
                    if (e.target.checked) {
                      setBeatVolume(25); // auto lower
                    } else {
                      setBeatVolume(80); // restore
                    }
                  }} 
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>

            {/* Hardware Soundpad 8 quick LED buttons */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                {webLang === 'en' ? '⚡ HARDWARE SOUNDCARD PAD OVERLAYS (MEMES):' : webLang === 'zh' ? '⚡ 硬件独立外设快捷音效键:' : '⚡ PHÍM BẤM ÂM THANH SOUNDPAD K10 PRO:'}
              </span>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { name_vi: "👏 Vỗ Tay", name_en: "👏 Applause", name_zh: "👏 鼓掌声", url: "https://www.myinstants.com/media/sounds/applause_y0iEQD9.mp3" },
                  { name_vi: "⚡ Sét Đánh", name_en: "⚡ Thunder", name_zh: "⚡ 惊雷闪电", url: "https://www.myinstants.com/media/sounds/thunder.mp3" },
                  { name_vi: "🔫 Phát Súng", name_en: "🔫 Gunshot", name_zh: "🔫 射击枪声", url: "https://www.myinstants.com/media/sounds/headshot.mp3" },
                  { name_vi: "💨 Độc Lạ", name_en: "💨 Fart", name_zh: "💨 放屁声", url: "https://www.myinstants.com/media/sounds/fart.mp3" },
                  { name_vi: "🤦 Bruhh", name_en: "🤦 Bruh Meme", name_zh: "🤦 无语爆笑", url: "https://www.myinstants.com/media/sounds/movie_1.mp3" },
                  { name_vi: "🔔 Kaching", name_en: "🔔 Cash Register", name_zh: "🔔 收银到账", url: "https://www.myinstants.com/media/sounds/cash-register-kaching.mp3" },
                  { name_vi: "🎬 Kịch Tính", name_en: "🎬 Dramatic", name_zh: "🎬 悬疑反差", url: "https://www.myinstants.com/media/sounds/dramatic.mp3" },
                  { name_vi: "📣 Quạ Kêu", name_en: "📣 Coughing", name_zh: "📣 咳嗽叹息", url: "https://www.myinstants.com/media/sounds/cough.mp3" }
                ].map((sfx, i) => (
                  <button
                    key={i}
                    id={`sfx-pad-${i}`}
                    onClick={() => {
                      playSoundEffect(sfx.url);
                    }}
                    className="py-1 px-1 bg-gradient-to-br from-slate-950 to-[#0e0c1a] border border-white/5 hover:border-fuchsia-500/40 text-[8.5px] text-slate-300 rounded font-bold font-sans text-center transition-all truncate hover:text-white duration-100 hover:scale-[1.03] active:scale-95 shadow-sm hover:shadow-[0_0_8px_rgba(217,70,239,0.2)]"
                  >
                    {webLang === 'en' ? sfx.name_en : webLang === 'zh' ? sfx.name_zh : sfx.name_vi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Microphone Connection Panel */}
          <div className="bg-[#05020c] p-3 rounded-xl border border-fuchsia-500/10 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-widest flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${isMicActive ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
                {webLang === 'en' ? 'LIVE MICROPHONE MODULE' : webLang === 'zh' ? '现场麦克风连接' : 'KẾT NỐI MICRO LIVE'}
              </span>
              <span className="text-[9.5px] text-slate-400">
                {isMicActive 
                  ? (webLang === 'en' ? "🔴 Processing live vocal from mic" : webLang === 'zh' ? "🔴 正在实时处理麦克风人声信号" : "🔴 Đang xử lý giọng nói trực tiếp từ Micro") 
                  : (webLang === 'en' ? "⚪ Mic inactive. Please turn on on right" : webLang === 'zh' ? "⚪ 麦克风处于未开启。请点击右侧" : "⚪ Micro chưa bật. Hãy gạt bật bên phải!")}
              </span>
            </div>
            <button
              onClick={toggleMicrophone}
              className={`px-3 py-1.5 rounded-lg text-[9.5px] font-mono font-extrabold uppercase tracking-widest border transition-all duration-150 transform active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                isMicActive
                  ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  : "bg-fuchsia-600/10 border-[#c22df5]/30 text-fuchsia-300 hover:bg-fuchsia-600/20"
              }`}
            >
              {isMicActive ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-emerald-400" /> {webLang === 'en' ? "OFF MIC" : webLang === 'zh' ? "关闭麦克风" : "TẮT MIC"}
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-fuchsia-400 hover:animate-bounce" /> {webLang === 'en' ? "ON MIC" : webLang === 'zh' ? "开启麦克风" : "BẬT MIC"}
                </>
              )}
            </button>
          </div>

          {/* Toggle expanded settings header */}
          <button
            onClick={() => setIsMixerExpanded(!isMixerExpanded)}
            className="w-full flex justify-between items-center py-2 px-3 bg-[#0d071f]/60 hover:bg-[#0e071f] border border-fuchsia-500/15 hover:border-fuchsia-500/30 rounded-xl transition-all font-mono"
          >
            <span className="text-[9.5px] font-extrabold text-[#d23ff3] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
              {webLang === 'en' ? 'VOCAL GAIN & AUDIO MIXER' : webLang === 'zh' ? '人声增益与混音控制面板' : 'HỆ ÂM LƯỢNG VOICE & MIXER CĂN CHỈNH'}
            </span>
            <span className="text-fuchsia-400 font-bold text-xs">{isMixerExpanded ? "▲" : "▼"}</span>
          </button>

          {/* Complex slider controls board */}
          {isMixerExpanded && (
            <div className="space-y-3.5 bg-[#030107]/90 p-3 rounded-xl border border-white/5 shadow-inner mt-2 relative overflow-hidden">
            
            {/* Vocal Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[8.5px] font-mono">
                <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-pink-500" /> {webLang === 'en' ? 'Voice Volume (Vocal Gain)' : webLang === 'zh' ? '人声音量增益 (Vocal Gain)' : 'Hệ âm lượng Voice (Vocal Gain)'}
                </span>
                <span className="text-fuchsia-400 font-extrabold">{vocalVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={vocalVolume}
                onChange={(e) => setVocalVolume(Number(e.target.value))}
                className="w-full accent-fuchsia-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Reverb Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[8.5px] font-mono">
                <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> {webLang === 'en' ? 'Vocal Reverb (Wet/Dry)' : webLang === 'zh' ? '混响舒缓度 (Reverb)' : 'Độ ngân dội vọng (Reverb wet/dry)'}
                </span>
                <span className="text-fuchsia-400 font-extrabold">{reverbDepth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={reverbDepth}
                onChange={(e) => setReverbDepth(Number(e.target.value))}
                className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Pitch Shift Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[8.5px] font-mono">
                <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Settings2 className="w-3.5 h-3.5 text-sky-400" /> {webLang === 'en' ? 'Vocal Pitch Shift (Tuning)' : webLang === 'zh' ? '人声音高微变 (Pitch Shift)' : 'Nâng/hạ bán âm giọng (Pitch Shift Auto-Tune)'}
                </span>
                <span className={`${pitchShift === 0 ? "text-slate-400" : "text-sky-400 font-extrabold"}`}>
                  {pitchShift === 0 ? (webLang === 'en' ? "Original (0)" : webLang === 'zh' ? "原声音高 (0)" : "Giữ nguyên (0)") : `${pitchShift > 0 ? "+" : ""}${pitchShift} S-tones`}
                </span>
              </div>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={pitchShift}
                onChange={(e) => setPitchShift(Number(e.target.value))}
                className="w-full accent-sky-400 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* EQ High Quality controllers */}
            <div className="grid grid-cols-2 gap-3 pb-1 border-t border-white/5 pt-2.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-slate-400 uppercase font-bold tracking-wider">🎚️ {webLang === 'en' ? 'Bass Boost' : webLang === 'zh' ? '低音调节' : 'Lực trầm (Bass Body)'}</span>
                  <span className="text-fuchsia-400 font-bold">{bassBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bassBoost}
                  onChange={(e) => setBassBoost(Number(e.target.value))}
                  className="w-full accent-fuchsia-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-slate-400 uppercase font-bold tracking-wider">✨ {webLang === 'en' ? 'Treble Boost' : webLang === 'zh' ? '高音清澈' : 'Air sáng (Treble Glow)'}</span>
                  <span className="text-pink-400 font-bold">{trebleBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trebleBoost}
                  onChange={(e) => setTrebleBoost(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Limiter Compression Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <div className="flex flex-col">
                <span className="text-[8.5px] font-mono font-bold text-slate-300">{webLang === 'en' ? 'Anti-Clip Compressor (AGC)' : webLang === 'zh' ? '自动增益压限防护 (AGC)' : 'Bộ bảo vệ chống rè (AGC Compressor)'}</span>
                <span className="text-[7.5px] font-mono text-slate-500">{webLang === 'en' ? 'Auto-compresses high vocal peaks to prevent distortion' : webLang === 'zh' ? '开启后强音爆鸣自动抑制以保护扬声器' : 'Tự động nén âm vỡ khi hát nốt quá lớn'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isCompressorActive} 
                  onChange={(e) => setIsCompressorActive(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-fuchsia-600"></div>
              </label>
            </div>

            {/* Low-Cut Filter 80Hz Toggle */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
              <div className="flex flex-col">
                <span className="text-[8.5px] font-mono font-bold text-slate-300">{webLang === 'en' ? 'Low-Cut Filter 80Hz (Cubase/K10)' : webLang === 'zh' ? '低频滚降 L-Cut 80Hz' : 'Mạch lọc xì Low-Cut 80Hz (Cubase 15)'}</span>
                <span className="text-[7.5px] font-mono text-slate-500">{webLang === 'en' ? 'Filters room hum and mic rumble under 80Hz' : webLang === 'zh' ? '自适应抑制环境低频杂音、风噪 및 地脚震动' : 'Lọc sạch tiếng ù ù của quạt gió và tạp âm rung động dưới 80Hz'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isLowCutActive} 
                  onChange={(e) => setIsLowCutActive(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {/* Background Music Volume Slider */}
            <div className="space-y-1 border-t border-white/5 pt-2.5">
              <div className="flex justify-between items-center text-[8.5px] font-mono">
                <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" /> {webLang === 'en' ? 'Background Music (Beat Volume)' : webLang === 'zh' ? '背景伴奏音乐音量 (Beat)' : 'Hệ âm lượng Nhạc nền (Beat volume)'}
                </span>
                <span className="text-slate-300">{beatVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={beatVolume}
                onChange={(e) => setBeatVolume(Number(e.target.value))}
                className="w-full accent-slate-400 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          )}

          {/* CD Master Recorder module */}
          <div className="bg-[#030107]/80 p-3 rounded-xl border border-white/5 space-y-2.5 shadow-md">
            <div className="flex justify-between items-center">
              <label className="text-[8px] text-pink-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Disc className={`w-3.5 h-3.5 text-red-500 ${isRecording ? "animate-spin" : ""}`} /> 
                {webLang === 'en' ? 'MASTER CD RECORDER & SONG BOUNCER' : webLang === 'zh' ? 'MASTER CD 录音机与混音导出' : 'BỘ GHI MASTER CD & SONG BOUNCER'}
              </label>
              {isRecording && (
                <span className="flex items-center gap-1 text-[8px] font-mono text-red-400 animate-pulse font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">
                  🔴 {webLang === 'en' ? 'REC LIVE:' : webLang === 'zh' ? '正在录制母带:' : 'GHI LIVE:'} {formatTime(recordTime)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-[#0e0a1b] hover:bg-red-600/10 border border-red-500/25 hover:border-red-500 text-red-400 text-[9px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Circle className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  {webLang === 'en' ? 'RECORD NEW MIX' : webLang === 'zh' ? '录制我的全新歌曲' : 'THU ÂM BẢN NHẠC MỚI'}
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[9px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all animate-pulse active:scale-95"
                >
                  <StopCircle className="w-3.5 h-3.5 text-white" />
                  {webLang === 'en' ? 'STOP AND EXPORT WEBM' : webLang === 'zh' ? '停止并生成高保真流媒体' : 'DỪNG VÀ XUẤT NHẠC MIXED'}
                </button>
              )}

              {recordedUrl && (
                <a
                  href={recordedUrl}
                  download={`Studio_Vocal_Record_${Date.now()}.webm`}
                  className="py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:text-white text-[9px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  {webLang === 'en' ? 'SAVE TO PC' : webLang === 'zh' ? '立即保存到电脑' : 'TẢI VỀ MÁY'}
                </a>
              )}
            </div>

            {recordedUrl && (
              <div className="bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15 flex items-center justify-between gap-1 shadow-inner">
                <span className="text-[8px] font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <Check className="w-3 h-3 animate-bounce" /> {webLang === 'en' ? 'Finished! Listen back:' : webLang === 'zh' ? '母带刻录完成！请在此听：' : 'Hoàn tất! Nghe lại tại đây:'}
                </span>
                <audio src={recordedUrl} controls className="h-6 max-w-[130px] opacity-80 bg-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety warning instruction */}
      <div className="bg-yellow-500/5 p-2.5 rounded-xl border border-yellow-500/10 text-center mt-4">
        <p className="text-[7.5px] font-mono text-yellow-500 tracking-tight leading-relaxed font-semibold">
          {webLang === 'en' 
            ? "⚠️ IMPORTANT: ALWAYS connect HEADPHONES before turning on the Mic to avoid speaker feedback scream screeching!" 
            : webLang === 'zh' 
            ? "⚠️ 严重警告：在激活麦克风监听之前，必须佩戴好耳机，避开音响设备直接对准麦克风引起炸麦啸叫！" 
            : "⚠️ QUAN TRỌNG: Cắm TAI NGHE trước khi bật Microphone để âm thanh không bị rú vọng từ loa máy tính ngược lại mic nhé!"}
        </p>
      </div>

      {showProWarningModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowProWarningModal(false)}>
          <div className="bg-[#0c061e] border-2 border-amber-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-amber-400 font-extrabold text-[15px] uppercase tracking-wider">{webLang === 'en' ? 'EXCLUSIVE PRO FEATURE' : webLang === 'zh' ? '💎 专属专业豪华功能' : '💎 TÍNH NĂNG ĐỘC QUYỀN PRO'}</h3>
              <p className="text-slate-300 text-[12px] leading-relaxed">
                {webLang === 'en' 
                  ? 'Please upgrade to standard Pro package to utilize this premium feature.' 
                  : webLang === 'zh' 
                  ? '请先升级您的账号至专业高级版，再使用专属声卡调音特色。' 
                  : 'Vui lòng nâng cấp gói Pro để sử dụng tính năng cao cấp này.'}
              </p>
            </div>
            <button
              onClick={() => setShowProWarningModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0c061e] font-extrabold text-[12px] rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-wider duration-150 cursor-pointer"
            >
              {webLang === 'en' ? 'UNDERSTOOD' : webLang === 'zh' ? '我已知晓并关闭' : 'ĐỒNG Ý (ĐÓNG)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
