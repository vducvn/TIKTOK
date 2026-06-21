import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Terminal, 
  Settings2, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  UserPlus, 
  Gift, 
  Music,
  TrendingUp, 
  Info, 
  Trash2, 
  RefreshCw, 
  Play, 
  AlertTriangle, 
  Mic, 
  Volume2, 
  Gamepad2, 
  Ban, 
  Copy, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Send,
  Zap,
  Share2,
  ExternalLink,
  Globe,
  Palette,
  Wand2,
  ChevronUp,
  Shield,
  X,
  Link2,
  Check,
  Crown,
  Activity,
  ChevronDown,
  ChevronRight,
  Laptop,
  MoreVertical,
  Flame,
  User,
  LogOut,
  Folder,
  Key,
  Monitor,
  CheckCircle2,
  Mail,
  Cpu,
  Clock,
  Camera,
  MemoryStick,
  Package
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { synthesizeSfxFallback } from "./utils/sfx";
import LiveDashboard from "./components/LiveDashboard";
import ConnectionSettings from "./components/ConnectionSettings";
import TtsConfiguration from "./components/TtsConfiguration";
import SecurityFilters from "./components/SecurityFilters";
import MemeSoundpad from "./components/MemeSoundpad";
import LiveMinigames from "./components/LiveMinigames";
import UserGuide from "./components/UserGuide";

let globalAudioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!globalAudioCtx) {
     const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
     if (AudioContextClass) {
       globalAudioCtx = new AudioContextClass();
     }
  }
  return globalAudioCtx;
};

// Types
interface License {
  email: string;
  maxHwids: number;
  hwids: string[];
  expire: string;
  role?: string;
  createdAt?: string;
}

import { translateEmojiToVietnamese } from "./emojiDict";
import VocalProcessor from "./components/VocalProcessor";

interface LogEntry {
  id: string;
  time: string;
  tag: string;
  message: string;
  colorClass: string;
}

interface SystemConfig {
  webLanguage: string;
  translateSource: string;
  translateTarget: string;
  ttsLanguage: string;
  ttsEngine: string;
  ttsApiKey: string;
  ttsZaloKey: string;
  ttsMicrosoftKey: string;
  registeredEmail: string;
  lastConnectedUsername: string;
  cookieSessionId: string;
  ttTargetIdc: string;
  ttsActive: boolean;
  translateActive: boolean;
  ttsOnlyTranslated: boolean;
  ttsSkipEmoji: boolean;
  aiActive: boolean;
  openaiKey: string;
  geminiKey: string;
  aiPrompt: string;
  bannedKeywords: string;
  autoReplyRawScript: string;
  welcomeTemplates: string;
  followTemplates: string;
  likeTemplates: string;
  giftTemplates: string;
  welcomeActive: boolean;
  followActive: boolean;
  likeActive: boolean;
  giftActive: boolean;
  welcomeCooldown: number;
  followCooldown: number;
  likeCooldown: number;
  giftCooldown: number;
  gameBattleActive: boolean;
  gameNoituActive: boolean;
  gameCauhoiActive: boolean;
  gameCoopActive: boolean;
  gameCaroActive: boolean;
  gameHorseActive: boolean;
  gameFarmActive: boolean;
  gameBombActive: boolean;
  hardwareId: string;
  bannedUsernames: string;
  uiTheme: string;
  uiBgColor: string;
  uiTextColor: string;
  uiFontFamily?: string;
  uiShowSparkles?: boolean;
  uiGlassmorphismBlur?: boolean;
  uiUppercaseAll?: boolean;
  randomGreetingActive: boolean;
  licenseEmail?: string;
  ownerName?: string;
  ownerAvatar?: string;
  licenseStatus?: 'unverified' | 'valid' | 'invalid';
  licenseMessage?: string;
  licenseExpire?: string;
  autoPlayGiftMusic: boolean;
  giftMusicTriggerCoins: number;
  giftMusicPlayMode: "stop" | "loop" | "next";
  enableExtendedGiftInfo: boolean;
  ttsLogFontSize: number;
  ttsLogFontColor: string;
  ttsLogBgColor: string;
  ttsReadSpeed: number;
  autoReconnectStream: boolean;
  likeGroupingThreshold: number;
  ttsQueueLimit: number;
  planLevel?: 'basic' | 'pro';
  aiGiftComposerActive?: boolean;
  aiGiftComposerMode?: "poetry" | "lyria";
  aiGiftComposerGenre?: string;
  aiGiftComposerVibe?: string;
  aiInteractivityActive?: boolean;
  aiSilenceResponderActive?: boolean;
  aiSilenceTimeout?: number;
  aiFlirtVibe?: string;
  antiScanEvasionActive?: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };
  props: { children: React.ReactNode };

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-950/80 border border-red-500/30 rounded-xl text-white font-mono text-xs space-y-4">
          <h2 className="text-sm font-bold text-red-100 mt-2">⚠️ ĐÃ XẢY RA LỖI GIAO DIỆN (RENDER ERROR)</h2>
          <p className="text-red-300 font-bold">{this.state.error?.toString()}</p>
          <pre className="bg-black/50 p-4 rounded overflow-auto max-h-60 text-slate-400">
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => {
              sessionStorage.removeItem("admin_session_verified");
              window.location.reload();
            }} 
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-xs uppercase font-bold"
          >
            Đăng xuất & Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const resolveName = (raw: any): string => {
  let s = String(raw || "").trim();
  if (!s || s === "undefined" || s === "null" || s === "[object Object]") return "Khán giả";
  if (/^user\d{5,}$/i.test(s) || /^user_\d{5,}$/i.test(s)) {
    return "bạn user";
  }
  return s;
};

const adjustTimeBasedPhrases = (text: string): string => {
  if (!text) return "";
  const hour = new Date().getHours();
  let s = text;
  
  if (hour >= 21 || hour < 4) { // Night / Khuya: 21h00 to 3h59
    s = s.replace(/buổi (sáng|trưa|chiều|tối)/gi, "buổi tối");
  } else if (hour >= 4 && hour < 11) { // Morning: 4h00 to 10h59
    s = s.replace(/buổi (trưa|chiều|tối)/gi, "buổi sáng");
  } else if (hour >= 11 && hour < 17) { // Noon / Afternoon: 11h00 to 16h59
    s = s.replace(/buổi (sáng|tối)/gi, "buổi chiều");
  } else { // Evening: 17h00 to 20h59
    s = s.replace(/buổi (sáng|trưa|chiều)/gi, "buổi tối");
  }
  return s;
};

const ProFeatureOverlay = ({ children, active }: { children: React.ReactNode, active: boolean }) => {
  if (!active) return <>{children}</>;
  return (
    <div className="relative group/pro overflow-hidden rounded-xl h-full">
      <div className="opacity-40 pointer-events-none grayscale blur-[1px] select-none h-full w-full transition-all">
        {children}
      </div>
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
         <div className="bg-[#030308]/90 border border-amber-500/50 p-4 rounded-xl text-center shadow-2xl backdrop-blur-md max-w-sm">
            <h3 className="text-amber-400 font-bold uppercase text-[11px] mb-1">Tính năng Độc Quyền Pro</h3>
            <p className="text-slate-300 text-[10px]">Vui lòng nâng cấp gói Pro để cấu hình tính năng cao cấp này.</p>
         </div>
      </div>
    </div>
  );
};

const UptimeDisplay = () => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    let startTimestamp = sessionStorage.getItem("uptimeStartTimestamp");
    if (!startTimestamp) {
      startTimestamp = Date.now().toString();
      sessionStorage.setItem("uptimeStartTimestamp", startTimestamp);
    }

    const updateUptime = () => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - parseInt(startTimestamp!)) / 1000);
      setUptimeSeconds(diffInSeconds);
    };

    updateUptime(); // Cập nhật ngay lần đầu
    const timer = setInterval(updateUptime, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return <div className="text-lg font-black text-white font-mono leading-tight mt-0.5">{formatUptime(uptimeSeconds)}</div>;
};

export default function App() {
  // Navigation tabs
  type Tab = "dashboard" | "settings" | "pro" | "media" | "games" | "admin" | "blacklist" | "studio_mixer" | "guide" | "ai_config";
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = sessionStorage.getItem("activeTab");
    return (saved as Tab) || "dashboard";
  });
  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Real-time dynamic state for User Session IP
  const [userIp, setUserIp] = useState("Đang tải...");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json())
      .then(data => {
        if (data && data.ip) {
          setUserIp(data.ip);
        }
      })
      .catch(() => {
        setUserIp("14.226.8.12"); // Fallback premium VN IP
      });
  }, []);

  const getLicenseName = (email?: string) => {
    if (config?.ownerName) return config.ownerName;
    if (!email) return "SYSTEM GUEST";
    return email.split('@')[0].toUpperCase().replace(/[._-]/g, ' ');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            updateConfigValue({ ownerAvatar: compressedBase64 });
          } else {
            updateConfigValue({ ownerAvatar: reader.result as string });
          }
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };


  // Sidebar Layout States
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["overview", "core", "security", "media", "games", "studio_sound", "admin"]);
  const [expandedSubFolders, setExpandedSubFolders] = useState<string[]>(["ai_subfolder"]);
  const toggleSubFolder = (subId: string) => {
    if (expandedSubFolders.includes(subId)) {
      setExpandedSubFolders(expandedSubFolders.filter(id => id !== subId));
    } else {
      setExpandedSubFolders([...expandedSubFolders, subId]);
    }
  };
  const [activeSubTab, setActiveSubTab] = useState<string>(() => {
    const saved = sessionStorage.getItem("activeSubTab");
    return saved || "dashboard";
  });
  useEffect(() => {
    sessionStorage.setItem("activeSubTab", activeSubTab);
  }, [activeSubTab]);

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };
  const [webLang, setWebLang] = useState<string>("vi");
  const [webTextScale, setWebTextScale] = useState<number>(() => {
    const saved = localStorage.getItem("webTextScale");
    return saved ? parseInt(saved, 10) : 100;
  });

  useEffect(() => {
    localStorage.setItem("webTextScale", webTextScale.toString());
  }, [webTextScale]);

  useEffect(() => {
    // Preload speech synthesis voices
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Auth Overlay / Admin Check
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState("");
  
  // App configs & states loaded dynamically from server
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [streamConnected, setStreamConnected] = useState(false);
  const [streamBadgeText, setStreamBadgeText] = useState("Chờ kết nối");
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([]);
  const terminalLogContainerRef = useRef<HTMLDivElement>(null);
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [leaderboard, setLeaderboard] = useState<{name: string, coins: number}[]>([]);
  
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showBannedKeywords, setShowBannedKeywords] = useState(false);
  const [showSignatureSettings, setShowSignatureSettings] = useState(false);
  const [showTtsVisualSettings, setShowTtsVisualSettings] = useState(false);
  const [showLeaderboardDropdown, setShowLeaderboardDropdown] = useState(false);
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);
  
  // Form values for adding/editing licenses
  const [newLicEmail, setNewLicEmail] = useState("");
  const [newLicRole, setNewLicRole] = useState<"basic" | "pro" | "Admin">("basic");
  const [newLicMaxHwids, setNewLicMaxHwids] = useState(1);
  const [newLicExpire, setNewLicExpire] = useState("2099-12-31");
  const [presetDays, setPresetDays] = useState("permanent");

  // Vocal VocalProcessor state values inside App for Web Audio effects on TTS
  const [vocalGain, setVocalGain] = useState(1.0);
  const [reverbLevel, setReverbLevel] = useState(0.4);

  const [currentBgm, setCurrentBgm] = useState<HTMLAudioElement | null>(null);
  const [currentMemeAudio, setCurrentMemeAudio] = useState<HTMLAudioElement | null>(null);

  const [memeList, setMemeList] = useState<{name: string, url?: string, isText?: boolean, data?: string}[]>(() => {
    const saved = localStorage.getItem("memeList_k10_pro_v5");
    if (saved) return JSON.parse(saved);
    return [
      { name: "👏 Vỗ Tay Reo Hò", url: "https://www.myinstants.com/media/sounds/cheering-and-clapping.mp3" },
      { name: "👏 Vỗ Tay Khán Giả", url: "https://www.myinstants.com/media/sounds/applause_y0iEQD9.mp3" },
      { name: "😆 Minion Cười", url: "https://www.myinstants.com/media/sounds/minion_giggle.mp3" },
      { name: "😈 Cười Quỷ Dữ", url: "https://www.myinstants.com/media/sounds/evil-laugh.mp3" },
      { name: "⚡ Sét Đánh K10", url: "https://www.myinstants.com/media/sounds/thunder_bmb7K8J.mp3" },
      { name: "🔫 Bắn Súng AK47", url: "https://www.myinstants.com/media/sounds/ak47-1.mp3" },
      { name: "💋 Nụ Hôn Moaz", url: "https://www.myinstants.com/media/sounds/anime-kiss.mp3" },
      { name: "🐦 Quạ Kêu Quác", url: "https://www.myinstants.com/media/sounds/crow-sound.mp3" },
      { name: "🚨 Nhạc Hồi Hộp", url: "https://www.myinstants.com/media/sounds/dramatic-sound-effect.mp3" },
      { name: "🔢 Đếm Ngược", url: "https://www.myinstants.com/media/sounds/countdown_S5E0ccl.mp3" },
      { name: "🔔 Ding Tiền Vàng", url: "https://www.myinstants.com/media/sounds/cash-register-kaching.mp3" },
      { name: "😢 Sad Violin", url: "https://www.myinstants.com/media/sounds/sad-violin.mp3" },
      { name: "Bruhhh Meme", url: "https://www.myinstants.com/media/sounds/movie_1.mp3" },
      { name: "Naniiii?! Meme", url: "https://www.myinstants.com/media/sounds/nani_1.mp3" },
      { name: "Oh No Meme", url: "https://www.myinstants.com/media/sounds/oh-no-no-no-tik-tok-song.mp3" },
      { name: "Woww! Meme", url: "https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3" },
      { name: "Đỉnh Nóc", isText: true, data: "Đỉnh nóc, kịch trần, bay phấp phới!" },
      { name: "Xịt Keo", isText: true, data: "Xịt keo cứng ngắc luôn á." },
      { name: "Trôn VN", isText: true, data: "Trôn trôn Việt Nam. Bất ngờ chưa?" },
      { name: "Ngoan Xinh Yêu", isText: true, data: "Ngoan xinh yêu của mẹ đâu rồi?" },
      { name: "Check Var", isText: true, data: "Tổ trọng tài chuẩn bị check var ca này!" },
      { name: "Flex", isText: true, data: "Cho phép tôi được flex một chút." },
      { name: "Độc Lạ BD", isText: true, data: "Đúng là chỉ có ở Độc lạ Bình Dương." },
      { name: "Mắc Cỡ", isText: true, data: "Trời ơi, mắc cỡ quá hai ơi." },
      { name: "Ra Dẻ", isText: true, data: "Sao mà hay ra dẻ quá à." },
      { name: "Mai Đẹt Ti Ni", isText: true, data: "Du a mai đẹt ti ni." },
      { name: "Gwenchana", isText: true, data: "Gwen chá na, tang ti rập tề." },
      { name: "Cứu Tui", isText: true, data: "Trời ơi cứu tui, cứu tui trời ơi!" },
      { name: "Thăm Ngàn", isText: true, data: "Thăm ngàn, kẹp ngần, kẹp ngần thăm ngàn." },
      { name: "Ối Dồi Ôi", isText: true, data: "Ối dồi ôi!" },
      { name: "Ét Ô Ét", isText: true, data: "Ét ô ét! Giải cứu, giải cứu!" },
      { name: "Hảo Hán", isText: true, data: "Hảo hán! Xin nhận của tại hạ một lạy." },
      { name: "Hết Cứu", isText: true, data: "Ca này thì hết cứu, bó tay rồi." },
      { name: "Kiếp Nạn 82", isText: true, data: "Lại là kiếp nạn thứ 82 nữa rồi." },
      { name: "Xà Lơ", isText: true, data: "Ăn nói xà lơ! Sao con nói dị?" },
      { name: "Cảm Lạnh", isText: true, data: "Nghe xong thấy cảm lạnh thực sự." },
      { name: "Mười Điểm", isText: true, data: "Tuyệt vời, mười điểm không có nhưng." },
      { name: "Gì Dẫy Trời", isText: true, data: "Ủa gì dẫy trời?" },
      { name: "Bất Ngờ Chưa", isText: true, data: "Bất ngờ chưa bà già!" },
      { name: "Còn Cái Nịt", isText: true, data: "Còn đúng cái nịt thôi nhé!" },
      { name: "Thế Là Dở", isText: true, data: "Làm thế là dở rồi!" },
      { name: "Chằm Kẽm", isText: true, data: "Trầm cảm luôn á trời." },
      { name: "Đúng Nhận", isText: true, data: "Đúng nhận sai cãi cô cái!" },
      { name: "Ôi Hoàng Tử", isText: true, data: "Ôi hoàng tử, hãy tha thứ cho người em gái bị trúng lời nguyền." },
      { name: "Cười Gian", isText: true, data: "Khà khà khà, chuẩn bị tinh thần đi." }
    ];
  });

  const [bgmList, setBgmList] = useState<{name: string, url: string}[]>(() => {
    const saved = localStorage.getItem("bgmList");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Nhạc Trẻ Phố Remix 2024", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
      { name: "Chill Lofi Không Lời - Đêm", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { name: "Vinahouse Bass Cực Căng", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
      { name: "Epic Nhạc Vào Trận Lửa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { name: "Phật Ca - Thiền Tâm Tĩnh", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
      { name: "Nhạc Khóc Sầu Bi Ai", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
      { name: "Cyberpunk Action", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
      { name: "Nhạc Meme Troll Nhau", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
    ];
  });

  const [giftMusicList, setGiftMusicList] = useState<{name: string, url: string}[]>(() => {
    const saved = localStorage.getItem("giftMusicList");
    if (saved) return JSON.parse(saved);
    return [
      { name: "Pháo Hoa Nổ Tung", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
      { name: "Cảm Ơn Đã Tặng Quà", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
    ];
  });
  const [currentGiftMusic, setCurrentGiftMusic] = useState<HTMLAudioElement | null>(null);

  const configRef = useRef<SystemConfig | null>(null);
  const giftMusicListRef = useRef<{name: string, url: string}[]>([]);
  const currentGiftMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { localStorage.setItem("memeList_k10_pro_v5", JSON.stringify(memeList)); }, [memeList]);
  useEffect(() => { localStorage.setItem("bgmList", JSON.stringify(bgmList)); }, [bgmList]);
  useEffect(() => { localStorage.setItem("giftMusicList", JSON.stringify(giftMusicList)); }, [giftMusicList]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    giftMusicListRef.current = giftMusicList;
  }, [giftMusicList]);

  useEffect(() => {
    currentGiftMusicRef.current = currentGiftMusic;
  }, [currentGiftMusic]);

  // Global hotkeys (Stream Deck Ảo / Virtual Hotkeys)
  useEffect(() => {
    const handleGlobalHotkeys = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea/select or contentEditable elements
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Handle 'm' to toggle Mic (dispatches event to VocalProcessor)
      if (key === "m") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("vocal-processor-toggle-mic"));
        return;
      }

      // Handle 's' to stop BGM and beat player
      if (key === "s") {
        e.preventDefault();
        stopBGM(); // Stop App.tsx BGM
        window.dispatchEvent(new CustomEvent("vocal-processor-stop-beat")); // Stop VocalProcessor beat
        return;
      }

      // Handle numbers 1-9 to play corresponding memes from the memeList
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const index = parseInt(e.key, 10) - 1;
        if (memeList && memeList[index]) {
          const meme = memeList[index];
          handlePlayMeme(meme.name, meme.url, meme.isText, meme.data);
        }
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalHotkeys);
    return () => {
      window.removeEventListener("keydown", handleGlobalHotkeys);
    };
  }, [memeList, currentBgm]);

  // States of the Gemini AI Composer playground
  const [playgroundUser, setPlaygroundUser] = useState("Anh Quyết");
  const [playgroundGift, setPlaygroundGift] = useState("Bông Hồng");
  const [playgroundCount, setPlaygroundCount] = useState(10);
  const [playgroundMode, setPlaygroundMode] = useState<"poetry" | "lyria">("poetry");
  const [playgroundGenre, setPlaygroundGenre] = useState("rap");
  const [playgroundVibe, setPlaygroundVibe] = useState("funny");
  const [isLoadingComposer, setIsLoadingComposer] = useState(false);
  const [composedLyrics, setComposedLyrics] = useState("");
  const [composerError, setComposerError] = useState("");
  const [currentPlayingAiMusicUrl, setCurrentPlayingAiMusicUrl] = useState("");
  const [aiComposerAudio, setAiComposerAudio] = useState<HTMLAudioElement | null>(null);

  // Helper to compose AI music or poetry vocals dynamically
  const generateAiMusic = async (customParams?: { username: string, giftName: string, count: number }) => {
    setIsLoadingComposer(true);
    setComposerError("");
    setComposedLyrics("");
    
    // Stop any existing AI music playing
    if (aiComposerAudio) {
      try {
        aiComposerAudio.pause();
      } catch (e) {}
      setAiComposerAudio(null);
    }
    setCurrentPlayingAiMusicUrl("");

    const targetUser = customParams?.username || playgroundUser;
    const targetGift = customParams?.giftName || playgroundGift;
    const targetCount = customParams?.count || playgroundCount;

    try {
      const res = await fetch("/api/gemini/generate-vocal-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: targetUser,
          giftName: targetGift,
          count: targetCount,
          mode: customParams ? (config?.aiGiftComposerMode || "poetry") : playgroundMode,
          genre: customParams ? (config?.aiGiftComposerGenre || "rap") : playgroundGenre,
          vibe: customParams ? (config?.aiGiftComposerVibe || "funny") : playgroundVibe,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp sự cố kết nối tới máy chủ.");
      }

      if (data.success) {
        setComposedLyrics(data.lyrics);
        if (data.audioData) {
          const audio = new Audio(data.audioData);
          setAiComposerAudio(audio);
          setCurrentPlayingAiMusicUrl(data.audioData);
          audio.play().catch((err) => {
            console.error("Auto play failed:", err);
          });
        }
      } else {
        if (data.fallback) {
          // If Lyria fails because of package/account constraints, we show a helpful message and trigger standard Poetry Mode instead
          console.warn("[Lyria Fail Fallback]", data.message);
          setComposerError(`${data.message || 'Mô hình Lyria chưa khả dụng.'} Đang tự động chuyển đổi sang chế độ MC Thơ/Vè cực kì chất lượng...`);
          
          // Retry using Poetry mode instantly
          const retryRes = await fetch("/api/gemini/generate-vocal-music", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: targetUser,
              giftName: targetGift,
              count: targetCount,
              mode: "poetry",
              genre: customParams ? (config?.aiGiftComposerGenre || "rap") : playgroundGenre,
              vibe: customParams ? (config?.aiGiftComposerVibe || "funny") : playgroundVibe,
            }),
          });
          const retryData = await retryRes.json();
          if (retryRes.ok && retryData.success) {
            setComposedLyrics(retryData.lyrics);
            if (retryData.audioData) {
              const audio = new Audio(retryData.audioData);
              setAiComposerAudio(audio);
              setCurrentPlayingAiMusicUrl(retryData.audioData);
              audio.play().catch((err) => console.error(err));
            }
          } else {
            throw new Error(retryData.error || "Không thể tạo thơ phụ.");
          }
        } else {
          throw new Error(data.error || "Lỗi tạo nội dung từ Gemini.");
        }
      }
    } catch (err: any) {
      console.error("[Composer Error]", err);
      setComposerError(err.message || "Gặp sự cố không mong muốn khi tạo nhạc.");
    } finally {
      setIsLoadingComposer(false);
    }
  };

  const fileInputRefMeme = useRef<HTMLInputElement>(null);
  const fileInputRefBgm = useRef<HTMLInputElement>(null);
  const fileInputRefGiftMusic = useRef<HTMLInputElement>(null);

  const handleMemeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setMemeList(prev => [...prev, { name: file.name.substring(0, 15), url }]);
      // Reset input
      if (fileInputRefMeme.current) fileInputRefMeme.current.value = "";
    }
  };

  const handleBgmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBgmList(prev => [...prev, { name: file.name.substring(0, 20), url }]);
      // Reset input
      if (fileInputRefBgm.current) fileInputRefBgm.current.value = "";
    }
  };

  const handleGiftMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setGiftMusicList(prev => [...prev, { name: file.name.substring(0, 20), url }]);
      // Reset input
      if (fileInputRefGiftMusic.current) fileInputRefGiftMusic.current.value = "";
    }
  };

  const deleteMeme = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemeList(prev => prev.filter((_, i) => i !== idx));
  };

  const deleteBgm = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBgmList(prev => prev.filter((_, i) => i !== idx));
  };

  const deleteGiftMusic = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGiftMusicList(prev => prev.filter((_, i) => i !== idx));
  };

  const stopBGM = () => {
    if (currentBgm) {
      currentBgm.pause();
      currentBgm.currentTime = 0;
      setCurrentBgm(null);
    }
  };

  const playRandomGiftMusic = () => {
    const list = giftMusicListRef.current;
    if (!list || list.length === 0) return;
    
    // Stop current if any
    if (currentGiftMusicRef.current) {
      currentGiftMusicRef.current.pause();
      currentGiftMusicRef.current.currentTime = 0;
    }

    const randomIdx = Math.floor(Math.random() * list.length);
    const track = list[randomIdx];
    const audio = new Audio(track.url);
    audio.volume = 0.5;

    audio.onended = () => {
      const mode = configRef.current?.giftMusicPlayMode || "stop";
      if (mode === "loop") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (mode === "next") {
        playRandomGiftMusic();
      } else {
        setCurrentGiftMusic(null);
      }
    };

    audio.play().catch(() => console.error(`🔊 Auto-play failed for gift music`));
    setCurrentGiftMusic(audio);
  };

  const stopMeme = () => {
    if (currentMemeAudio) {
      try {
        currentMemeAudio.pause();
        currentMemeAudio.currentTime = 0;
      } catch (err) {
        console.error("Error pausing meme:", err);
      }
      setCurrentMemeAudio(null);
    }
  };

  const handlePlayMeme = (memeName: string, customUrl?: string, isText?: boolean, textData?: string) => {
    if (isText && textData) {
      speakText(textData);
      return;
    }
    
    // Stop previous meme if it exists
    stopMeme();

    if (!customUrl) return;

    const audio = new Audio(customUrl);
    audio.volume = 0.8;
    audio.onerror = () => {
      console.warn(`🔊 Audio file error for meme: ${memeName}, calling synthesizer fallback!`);
      synthesizeSfxFallback(memeName);
    };
    audio.play()
      .then(() => {
        setCurrentMemeAudio(audio);
      })
      .catch((err) => {
        console.warn(`🔊 Auto-play failed for meme: ${memeName}, calling synthesizer fallback!`, err);
        synthesizeSfxFallback(memeName);
      });

    audio.onended = () => {
      setCurrentMemeAudio(null);
    };
  };

  const handlePlayBGM = (trackName: string, customUrl: string) => {
    if (currentBgm) {
      currentBgm.pause();
      currentBgm.currentTime = 0;
      setCurrentBgm(null);
      // Restart if clicked a different song
      if (currentBgm.src !== customUrl) {
         const audio = new Audio(customUrl);
         audio.loop = true;
         audio.volume = 0.3;
         audio.play().catch(() => alert(`🎵 Phát nhạc nền: ${trackName}`));
         setCurrentBgm(audio);
      }
      return; 
    }
    const audio = new Audio(customUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => alert(`🎵 Phát nhạc nền: ${trackName}`));
    setCurrentBgm(audio);
  };


  // Manual configuration inputs (Temporary UI States before auto-save)
  const [tempUsername, setTempUsername] = useState("");
  const [tempCookie, setTempCookie] = useState("");
  const [tempIdc, setTempIdc] = useState("");
  const [showCookie, setShowCookie] = useState(false);
  const [showIdc, setShowIdc] = useState(false);

  // Simulated metrics counter
  const [metrics, setMetrics] = useState({
    viewers: 0,
    comments: 0,
    followers: 0,
    likes: 0,
    gifts: 0,
    maxViewers: 0
  });

  const [systemMetrics, setSystemMetrics] = useState({
    cpuLoad: 0,
    cpuSpeed: 0,
    cpuCores: 0,
    ramUsage: 0,
    ramUsedMB: 0,
    ramTotalMB: 0,
    uptime: "0h 0p 0s",
    version: "7.16.2"
  });

  useEffect(() => {
    const fetchSysMetrics = async () => {
      try {
        const res = await fetch("/api/system-metrics");
        if (res.ok) {
          const data = await res.json();
          setSystemMetrics({
            cpuLoad: data.cpu.load,
            cpuSpeed: data.cpu.speed,
            cpuCores: data.cpu.cores,
            ramUsage: data.ram.usage,
            ramUsedMB: data.ram.usedMB,
            ramTotalMB: data.ram.totalMB,
            uptime: data.uptime,
            version: data.version
          });
        }
      } catch (e) {
        // ignore
      }
    };
    fetchSysMetrics();
    const interval = setInterval(fetchSysMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const [isAdminPanelRoute, setIsAdminPanelRoute] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/admin-panel-secret") {
      setIsAdminPanelRoute(true);
    }
  }, []);

  // Safe client-side reference (removed unused terminalLogsEndRef)
  const socketRef = useRef<Socket | null>(null);

  // Keygen utility helpers in Admin tab
  const [keygenEmail, setKeygenEmail] = useState("example@gmail.com");
  const [keygenResult, setKeygenResult] = useState("");

  // Simulated Interactions inputs
  const [simType, setSimType] = useState<"chat" | "like" | "follow" | "gift" | "join">("chat");
  const [simName, setSimName] = useState("anh Trung béo");
  const [simComment, setSimComment] = useState("Chào chủ phòng dễ thương quá! Gửi tặng tim nè!");
  const [simGift, setSimGift] = useState("Bông Hoa");
  const [simCount, setSimCount] = useState(5);
  const [simLoading, setSimLoading] = useState(false);

  // ==========================================
  // TEXT TRANSLATIONS PRESET
  // ==========================================
  const dicts: Record<string, any> = {
    vi: {
      subtitle: "Hệ thống xử lý hàng đợi sự kiện & Chuyển mạch AI dịch thuật đa ngôn ngữ thông minh",
      connectTitle: "BẢNG ĐIỀU KHIỂN & ĐƯỜNG TRUYỀN",
      statViewers: "Mắt Xem Live",
      statComments: "Tổng Bình Luận",
      statFollowers: "Follower Mới",
      statLikes: "Tổng Lượt Thích",
      statGifts: "Quà Tặng Xu",
      statShares: "Lượt Chia Sẻ",
      statPeak: "Mắt Xem Peak",
      terminalTitle: "REALTIME ENGINE STREAM DECK TERMINAL LOGS",
      licTitle: "XÁC THỰC BẢN QUYỀN HỆ THỐNG",
      licBadge: "Hạn dùng: ",
      licActive: "Bản Quyền Đã Kích Hoạt",
      settingsTitle: "THAM SỐ LÕI TRỢ LÝ TRỰC TIẾP",
      welcomeActive: "Chào người mới vào",
      followActive: "Cảm ơn Follow",
      likeActive: "Cảm ơn Thả Tim",
      giftActive: "Cảm ơn Tặng Quà",
      adminTitle: "MASTER SECURITY HUB (BẢN QUYỀN HỆ THỐNG)",
      obsTitle: "MÀN HÌNH QUẢN TRỊ (OBS OVERLAY PREVIEW)",
      tabDashboard: "BẢNG LIVE",
      tabSettings: "CẤU HÌNH",
      tabProFeatures: "💎 TÍNH NĂNG PRO",
      tabMedia: "ÂM THANH & MEDIA",
      tabGames: "QUẢN LÝ MINIGAMES",
      tabAdmin: "BẢN QUYỀN",
      guideLogin: "HƯỚNG DẪN XÁC MINH BẢN QUYỀN & ĐĂNG NHẬP DỮ LIỆU TIKTOK",
      guideLoginStep1: "1. Vui lòng cung cấp Hardware ID (Cookie) hoặc Key bản quyền của bạn cho hệ thống quản lý.",
      guideLoginStep2: "2. Hệ thống sẽ cấp phát Email và Mã Bí Mật để tiến hành xác thực tài khoản.",
      guideLoginStep3: "3. Nhấn vào tab BẢN QUYỀN để kiểm tra tình trạng active của phần mềm.",
      guideLoginStep4: "4. Tại tab BẢNG LIVE, dán Cookie hoặc Room ID của bạn vào và kết nối Socket. Khuyến khích sử dụng SessionID để tránh bị ngắt kết nối.",
      translateSource: "Nguồn (Bình luận gốc):",
      translateTarget: "Đích (Dịch sang):",
      autoReply: "Trợ Lý Trả Lời Tự Động",
      aiPrompt: "Kịch Bản Tính Cách (Roleplay)",
      blockedKeywords: "Từ Khóa Bị Cấm Đọc/Dịch",
      blockedUsers: "Người Tham Gia Bị Cấm (Blacklist User)",
      filterSecurity: "BỘ LỌC KIỂM DUYỆT (BLACKLIST)",
      ttsTitle: "BỘ PHÁT GIỌNG NÓI (TTS)",
      translateTitle: "HỆ THỐNG DỊCH TỰ ĐỘNG (TRANSLATE)",
      navOverview: "TỔNG QUAN",
      navDashboard: "Bảng Điều Khiển",
      navCore: "CẤU HÌNH TƯƠNG TÁC",
      navSettings: "Cấu Hình",
      navAI: "Cấu Hình AI",
      navSecurity: "BẢO MẬT & PRO",
      navBlacklist: "Bộ Lọc Security (Blacklist)",
      navMediaGrp: "SỢI DÂY LIÊN KẾT",
      navSoundpad: "Soundpad & Music",
      navMinigamesGrp: "MINIGAMES",
      navMinigames: "Quản Lý Minigames",
      navStudioGrp: "STUDIO ÂM THANH",
      navStudioMixer: "Bộ Mixer & Cấu hình AI",
      navStudioGuide: "Hướng Dẫn Sử Dụng",
      navInfo: "THÔNG TIN",
      navProfile: "Thông Tin Cá Nhân",
      navUptime: "UPTIME HOẠT ĐỘNG",
      aiConfigTitle: "CẤU HÌNH TRỢ LÝ AI (AI ASSISTANT CONFIG)",
      eventsTitle: "KỊCH BẢN TƯƠNG TÁC SỰ KIỆN",
      themeTitle: "GIAO DIỆN & TÙY CHỈNH MÀU SẮC",
      uiLang: "Giao diện:",
      uiThemeLabel: "Chế độ:",
      bgColor: "Màu Bg:",
      textColor: "Màu Chữ:",
      ttsEngineLabel: "Động Cơ Âm Thanh TTS:",
      ignoreIconPrefix: "🔇 Không Đọc Ký Tự (Icon)",
      connectStreamPrefix: "Bật Kết Nối Luồng",
      stopBgm: "Dừng Phát Nhạc",
      tiktokIdLabel: "ID Kênh TikTok:",
      unregisteredEmail: "❌ Email chưa được đăng ký kích hoạt bản quyền!",
      leaderboardTitle: "TOP ỦNG HỘ KÊNH (LEADERBOARD)",
      terminalQueueTitle: "BẢNG HIỂN THỊ BÌNH LUẬN TRỰC TIẾP",
      statusLive: "Trạng thái:",
      soundpadTitle: "BẢNG HIỆU ỨNG ÂM THANH (SOUNDPAD)",
      bgmTitle: "NHẠC NỀN CHƯƠNG TRÌNH STREAM (BGM)",
      systemAudioTitle: "HỆ THỐNG PHÁT AUDIO (VOL)",
      obsVol: "Âm lượng OBS Game:",
      ttsVol: "Âm lượng TTS AI:",
      autoPlay: "Auto Play Nhạc Nền",
      addMp3: "+ Thêm Mới MP3",
      clearScreen: "Xóa màn hình",
      emptyBoard: "Chưa có thông tin...",
      waitingComments: "Đang chờ người xem bình luận...",
      customizeDisplay: "Tùy chỉnh hiển thị",
      customScreen: "TÙY CHỈNH MÀN HÌNH",
      fontSizeLive: "CỠ CHỮ BẢNG LIVE (PX)",
      defaultTextColor: "MÀU CHỮ MẶC ĐỊNH",
      bgColorLive: "MÀU NỀN BẢNG",
      readSpeed: "TỐC ĐỘ ĐỌC:",
      autoReconnect: "Tự động kết nối lại khi lỗi",
      resetBtn: "Khôi phục",
      closeBtn: "Đóng",
      noGiftsYet: "Chưa có lượt đóng góp quà...",
      licenseHeader: "BẢN QUYỀN THIẾT BỊ",
      unverified: "Chưa xác minh",
      verified: "Đã kích hoạt",
      emailLicense: "Email Mua Bản Quyền:",
      deviceId: "Mã Thiết Bị (Device ID):",
      verifyBtn: "Xác Minh",
      resetColors: "Khôi Phục Màu Sáng/Tối Gốc",
      minigamesHeader: "QUẢN LÝ MINIGAMES & HƯỚNG DẪN SỬ DỤNG",
      minigamesDesc: "Kích hoạt luồng game và xem cấu trúc lệnh trên luồng Livestream.",
      themeVi: "Giao diện: Tiếng Việt (VN)",
      themeEn: "Giao diện: English (EN)",
      themeZh: "Giao diện: 中文 (ZH)",
      modeDark: "Chế độ: Tối (Dark)",
      modeLight: "Chế độ: Sáng (Light)",
      bgColorText: "Màu Bg:",
      textColorText: "Màu Chữ:",
      noCharRead: "🔇 Không Đọc Ký Tự (Icon)",
      connectStreamBtn: "Bật Kết Nối Luồng",
      disconnectStreamBtn: "Ngắt Kết Nối",
      checkKey: "Kiểm tra Key",
      verifyingLicense: "Đang xác minh...",
      tiktokIdPlaceholder: "ID Kênh TikTok...",
      ttTargetIdcLabel: "Mã ttTargetIdc (MDC):",
      coopGameDesc: "Game nhập vai mô phỏng văn minh. Tạo tinh thần đoàn kết dồn dame giết Boss ngàn máu chia bạc.",
      cmdSyntax: "Cú pháp lệnh:",
      chemTip: "!chem / !ban / - Gây sát thương tích lũy. Mẹo: Phần thưởng chia đều theo %% sát thương!",
      stopMusic: "Dừng Phát",
      giftMusicTitle: "Tự Phát Quà VIP",
      autoPlayMode: "Bật/Tắt:",
      giftCoins: "Số xu...",
      playModeStop: "Dừng tắt",
      playModeLoop: "Lặp lại",
      playModeNext: "Bài ngẫu nhiên",
      waitingConnection: "Chờ kết nối",
      streamingLabel: "Đang phát",
      proAiHeading: "NHÂN VẬT & BẢN SẮC AI CORE",
      proActivateAi: "Kích Hoạt Trí Tuệ Gemini",
      proAiSubtext: "Cho phép trí tuệ nhân tạo tự động phản hồi lém lỉnh, thay thế mẫu có sẵn.",
      proFlirtVibeLabel: "🎭 Sắc Thái & Vibe Bản Thân (Flirt Vibe):",
      vibeSweet: "🍭 Ngọt ngào, nũng nịu cưng chiều",
      vibeFunny: "🤪 Lầy lội, có muối, siêu hài hước",
      vibeSassy: "💅 Đanh đá, sắc bén, đáp trả cực gắt",
      vibePoetic: "🌸 Nhã nhặn, chất thi sỹ thích thả thơ",
      vibeSwag: "🎧 Dân chơi, swag cá tính sành điệu",
      proPersonaLabel: "🧠 Kịch Bản Tính Cách (Core Persona Prompt):",
      proPersonaPlaceholder: "Chỉ dẫn phong cách nói chuyện của bạn ví dụ: Xưng em gọi các anh cưng chiều, thích nói lái gieo vần lém lỉnh...",
      proPersonaTip: "💡 MẸO: Viết chỉ dẫn phong phú, rõ ràng sẽ giúp AI Streamer phản hồi siêu ngầu, tránh tẻ nhạt rập khuôn.",
      proComposerHeading: "SÁNG TÁC NHẠC & GIỌNG NÓI V2",
      proAutoSinger: "Gieo Vần & Hát Nhạc Quà Tặng AI",
      proAutoSingerSub: "Tự động gieo vần, sáng tạo thơ vui chúc mừng khi fan tặng quà.",
      proRhymeLabel: "🎙️ Chế Độ Gieo Vần",
      proBeatLabel: "🎸 Nhịp Điệu Nền (Beat)",
      proExpressionLabel: "🌈 Thần Thái/Cảm Xúc Thể Hiện:",
      proObsTitle: "Nhân vật OBS há mồm theo Audio",
      proObsDesc: "Được kích hoạt tự động. Môi của Avatar 2D/3D trên màn hình stream OBS sẽ tự động mấp máy nhảy múa đồng bộ hoàn hảo với giọng nói phát ra!",
      proRealtimeTitle: "TƯƠNG TÁC THỜI GIAN THỰC AI",
      proAutoFlirt: "AI Tự Động Trò Chuyện & Thả Thính",
      proAutoFlirtDesc: "Tự nghĩ lời thả thính, cảm ơn khi user thích/theo dõi/vào phòng thay vì máy móc.",
      proSilenceTitle: "Đánh Thức Phòng Live (Silence)",
      proSilenceDesc: "Khi phòng stream im ắng không bình luận, AI tự lên tiếng bắt chuyện náo nhiệt.",
      proSilenceLimit: "⏱️ Giới Hạn Khoảng Lặng Tự Nói:",
      proMinigameCommentary: "🎮 AI Thuyết Minh Minigames",
      proMinigameCommentaryDesc: "Khi khán giả chơi Minigame (Boss Arena, Caro, Pet, Đua ngựa), AI Streamer sẽ tự thuyết minh tiếng Việt siêu tấu hài trực tiếp dòng chảy game!",
      proEvasionTitle: "PHÒNG THỦ & LÁCH LUẬT LIVE",
      proEvasionLabel: "Lách Quét / Nói Lảng Tránh AI",
      proEvasionDesc: "Tự động lảng tránh các câu hỏi dính bản quyền hoặc mượn nợ nhạy cảm.",
      proSensitiveList: "🛡️ Danh Sách Từ Khóa Nhạy Cảm:",
      proSensitivePlaceholder: "Điền các từ cấm cách nhau bởi dấu phẩy, ví dụ: chửi bậy, lừa đảo, cướp...",
      proSlangTitle: "🏷️ Từ Điển Chuyển Đổi TikTok (TikTok Safe Slangs)",
      proFeatureActivated: "TÍNH NĂNG ĐỘC QUYỀN PRO (ĐÃ KÍCH HOẠT)",
      proFeatureLocked: "TÍNH NĂNG ĐỘC QUYỀN PRO:",
      proItem1: "Bộ trộn âm thanh Mixer Vocal Livestream Cao Cấp",
      proItem2: "Thay đổi giọng nói AI thế hệ mới",
      proItem3: "Tương tác bình luận giọng nói Google & Azure AI",
      proItem4: "Tự động phát nhạc quà tặng của Fan",
      proItem5: "Trí tuệ nhân tạo AI tự động trả lời Live Chat",
      proItem6: "Tải lên & Tùy chọn kho Soundpad livestream phong phú",
      spamFilterTitle: "BỘ CHẶN TỪ KHÓA BẨN (SPAM FILTER)",
      spamFilterDesc: "Nhập các từ rác, thô tục, xúc phạm hoặc từ nhạy cảm TikTok cấm để hệ thống tự động lọc bỏ, ngăn đọc ra luồng livestream. Phân cách nhau bằng dấu phẩy (,).",
      spamFilterList: "DANH SÁCH TỪ (,) :",
      blacklistTitle: "CHẶN USERNAME NGƯỜI DÙNG (SPAMMER BLACKLIST)",
      blacklistDesc: "Khi những tài khoản quấy phá này bình luận hoặc tương tác trên luồng Live, Robot AI và hệ thống đọc phát âm TTS sẽ tự động phớt lờ, lờ đi. Nhập ID/Username TikTok của họ, ngăn cách nhau bằng dấu phẩy (,).",
      blacklistList: "DANH SÁCH TÀI KHOẢN CHẶN (,) :",
      liveRoomNotActive: "PHÒNG THU LIVE - CHƯA BẬT THIẾT BỊ!",
      liveRoomNotActiveDesc: "Bấm nút \"Bật Mic\" ở tab Mixer hoặc \"Bật Microphone\" ở tab Camera PC để hiển thị sóng âm thanh!",
      cameraNotActive: "CAMERA PC CHƯA HOẠT ĐỘNG",
      cameraNotActiveDesc: "Nhấn nút \"BẬT CAMERA\" phía dưới để bắt đầu truyền hình và kích hoạt hộp thoại xin quyền duyệt từ trình duyệt!",
      btnTurnOnCamera: "BẬT CAMERA LIVE",
      btnTurnOnMic: "BẬT MICROPHONE",
      configDeviceTitle: "CẤU HÌNH THIẾT BỊ AUDIO & VIDEO",
      btnRefreshDevice: "Làm mới thiết bị",
      webcamLabel: "Thiết Bị Ghi Hình (Webcam):",
      micLabel: "Đường Truyền Ghi Âm (Microphone):",
      localMonitorTitle: "PHẢN HỒI LOA KIỂM ÂM GIỌNG HÁT (LOCAL MONITOR)",
      localMonitorDesc: "Phát trực tiếp giọng nói thật của bạn qua tai nghe/loa sau khi chỉnh bass/treble/reverb",
      voicemodTitle: "KẾT NỐI GIỌNG AI NGOÀI (VOICEMOD, VOICE.AI, HITPAW...)",
      voicemodDesc: "Tương thích hoàn hảo với các trình đổi giọng nói PC phổ biến hiện nay.",
      voicemodDesc2: "Khi bật app đổi giọng PC (Voicemod, Voice.ai, HitPaw), tại mục \"Microphone\" ở trên chọn cổng thu ảo tương ứng để hát song kiếm hợp bích cực mượt không trễ!",
      recordingTipsTitle: "MẸO SỬ DỤNG PHÒNG THU HIỆU QUẢ:",
      recordingTip1: "Hát cùng app PC: Bật app đổi giọng PC (Voicemod, Voice.ai, làm mịn, thêm reverb vang bùng nổ như ca sĩ chuyên nghiệp.",
      recordingTip2: "LUÔN LUÔN cắm Tai Nghe (Earphone) trước khi bật kiểm âm nhằm triệt tiêu hiện tượng rè rít (feedback loop) vọng âm thanh từ loa ngược lại mic.",
      recordingWarning: "Nghiêm cấm: Khi âm thanh vang dội rít chói tai, phải tắt Microphone/Loa Kiểm Âm ngay lập tức để bảo vệ thính giác và loa. Điều chỉnh lại Volume trước khi thử lại!"
    },
    en: {
      subtitle: "Event queue processing system & intelligent multi-language translation AI switcher",
      connectTitle: "STREAM CONTROLLER & TRANSMISSION",
      statViewers: "Active Viewers",
      statComments: "Total Chats",
      statFollowers: "New Followers",
      statLikes: "Total Likes",
      statGifts: "Clover Coins",
      statShares: "Total Shares",
      statPeak: "Peak Multipliers",
      terminalTitle: "REALTIME ENGINE STREAM DECK TERMINAL LOGS",
      licTitle: "SOFTWARE LICENSE SYSTEM",
      licBadge: "Expiry info: ",
      licActive: "License active",
      settingsTitle: "ASSISTANT CORE LIVE PARAMETERS",
      welcomeActive: "Welcome new viewers",
      followActive: "Thank new followers",
      likeActive: "Thank new likes",
      giftActive: "Thank new gift senders",
      adminTitle: "MASTER SECURE LICENSE HUB",
      obsTitle: "REALTIME OBS CANVAS PREVIEW",
      tabDashboard: "LIVE BOARD",
      tabSettings: "CORE CFG",
      tabProFeatures: "💎 PRO FEATURES",
      tabMedia: "AUDIO/MEDIA",
      tabGames: "MINIGAMES MGR",
      tabAdmin: "LICENSE",
      guideLogin: "GUIDE EN: HOW TO VERIFY LICENSE & TIKTOK LOGIN",
      guideLoginStep1: "1. Please provide your Hardware ID or License Key to the admin.",
      guideLoginStep2: "2. You will receive an Email and Secret Code to verify your account.",
      guideLoginStep3: "3. Click on the LICENSE tab to check the status of your software.",
      guideLoginStep4: "4. At the LIVE BOARD tab, paste your Cookie or Room ID to connect to Socket. SessionID is recommended.",
      translateSource: "Source (Original Comment):",
      translateTarget: "Target (Translate To):",
      autoReply: "Auto Reply Assistant",
      aiPrompt: "Character Prompt (Roleplay)",
      blockedKeywords: "Banned Keywords (Read/Translate)",
      blockedUsers: "Banned Users (Blacklist)",
      filterSecurity: "SECURITY FILTERS (BLACKLIST)",
      ttsTitle: "AUDIO ENGINE (TTS)",
      translateTitle: "AUTO TRANSLATION",
      navOverview: "OVERVIEW",
      navDashboard: "Dashboard",
      navCore: "INTERACTIVE CONFIG",
      navSettings: "Settings",
      navAI: "AI Personas",
      navSecurity: "SECURITY & PRO",
      navBlacklist: "Security Filter",
      navMediaGrp: "MEDIA STRINGS",
      navSoundpad: "Soundpad & Music",
      navMinigamesGrp: "MINIGAMES",
      navMinigames: "Minigame Manager",
      navStudioGrp: "STUDIO AUDIO",
      navStudioMixer: "Mixer & AI Tuning",
      navStudioGuide: "User Guide & Manual",
      navInfo: "INFORMATION",
      navProfile: "Profile",
      navUptime: "UPTIME LOG",
      tiktokIdLabel: "TikTok Channel ID:",
      unregisteredEmail: "❌ Email is not registered to activate the license!",
      aiConfigTitle: "AI ASSISTANT CONFIG",
      eventsTitle: "EVENT SCRIPTS",
      themeTitle: "UI & CUSTOMIZATION",
      leaderboardTitle: "TOP SUPPORTERS",
      terminalQueueTitle: "REALTIME ENGINE TERMINAL QUEUE",
      statusLive: "Status:",
      soundpadTitle: "MEME SOUNDPAD",
      bgmTitle: "STREAM BACKGROUND MUSIC",
      systemAudioTitle: "AUDIO PLAYBACK SYSTEM",
      obsVol: "OBS Game Volume:",
      ttsVol: "AI TTS Volume:",
      autoPlay: "Auto Play BGM",
      addMp3: "+ Add MP3",
      clearScreen: "Clear screen",
      emptyBoard: "No data available...",
      waitingComments: "Waiting for comments...",
      customizeDisplay: "Customize Display",
      customScreen: "CUSTOMIZE SCREEN",
      fontSizeLive: "LIVE BOARD FONT SIZE (PX)",
      defaultTextColor: "DEFAULT TEXT COLOR",
      bgColorLive: "BOARD BACKGROUND COLOR",
      readSpeed: "READING SPEED:",
      autoReconnect: "Auto reconnect on error",
      resetBtn: "Reset",
      closeBtn: "Close",
      noGiftsYet: "No gifts contributed yet...",
      licenseHeader: "DEVICE LICENSE",
      unverified: "Unverified",
      verified: "Activated",
      emailLicense: "License Email:",
      deviceId: "Device ID (HWID):",
      verifyBtn: "Verify",
      resetColors: "Reset Light/Dark Colors",
      minigamesHeader: "MINIGAMES MANAGER & GUIDE",
      minigamesDesc: "Activate game streams and view command structures for the Livestream.",
      themeVi: "Interface: Vietnamese (VN)",
      themeEn: "Interface: English (EN)",
      themeZh: "Interface: Chinese (ZH)",
      modeDark: "Mode: Dark",
      modeLight: "Mode: Light",
      bgColorText: "Bg Color:",
      textColorText: "Text Color:",
      ttsEngineLabel: "TTS Engine:",
      noCharRead: "🔇 No Emoji Spelling",
      connectStreamBtn: "Connect Stream",
      disconnectStreamBtn: "Disconnect",
      checkKey: "Check API Key",
      verifyingLicense: "Verifying...",
      tiktokIdPlaceholder: "TikTok Channel ID...",
      ttTargetIdcLabel: "ttTargetIdc (MDC):",
      coopGameDesc: "Civilization simulation RPG. Unite to deal damage, kill the high-HP Boss, and split the coins.",
      cmdSyntax: "Command syntax:",
      chemTip: "!chem / !ban / - Deal cumulative damage. Tip: Rewards are split by damage %!",
      stopMusic: "Stop Music",
      giftMusicTitle: "Auto VIP Gift Music",
      autoPlayMode: "Auto-Play:",
      giftCoins: "Coins...",
      playModeStop: "Stop after",
      playModeLoop: "Loop current",
      playModeNext: "Play random",
      waitingConnection: "Waiting for connection",
      streamingLabel: "Streaming",
      proAiHeading: "AI PERSONA & IDENTITY CORE",
      proActivateAi: "Activate Gemini Intellect",
      proAiSubtext: "Allows AI to automatically reply wittily, replacing pre-configured templates.",
      proFlirtVibeLabel: "🎭 Flirt Vibe & Self Attitude Level:",
      vibeSweet: "🍭 Sweet, caring and spoiled style",
      vibeFunny: "🤪 Trollish, salty, extremely funny",
      vibeSassy: "💅 Sassy, sharp, fierce clapbacks",
      vibePoetic: "🌸 Elegant, poetic soul who loves rhymes",
      vibeSwag: "🎧 Swag, trendy, stylish gamer vibe",
      proPersonaLabel: "🧠 Core Persona Guidelines (Roleplay Instructions):",
      proPersonaPlaceholder: "Guidelines for your persona talking style, e.g. sweet sister xoxo, uses active slang, playful...",
      proPersonaTip: "💡 TIP: Detailed and clear guidelines help the AI Streamer respond creatively and avoid generic answers.",
      proComposerHeading: "MUSIC & VOICE COMPOSER V2",
      proAutoSinger: "AI Lyricist & Live Gift Singer",
      proAutoSingerSub: "Automatically rhymes and creates funny congratulatory poems when gifts are received.",
      proRhymeLabel: "🎙️ Rhyming Mode",
      proBeatLabel: "🎸 Background Beat",
      proExpressionLabel: "🌈 Expression & Emotion Style:",
      proObsTitle: "Sync OBS Avatar Mouth Movement",
      proObsDesc: "Automatically enabled. The 2D/3D Live2D avatar lips on the OBS stream will seamlessly talk and move sync'd with the audio speech!",
      proRealtimeTitle: "REAL-TIME AI ENGAGEMENT & LIVEBOT",
      proAutoFlirt: "AI Automatic Chatting & Seductive Jokes",
      proAutoFlirtDesc: "Spontaneously creates jokes & pick-up lines of gratitude when users like/follow/enter instead of boring templates.",
      proSilenceTitle: "Revive Dead Stream (Silence Trigger)",
      proSilenceDesc: "When the chat gets quiet, AI automatically speaks up to start new lively conversations.",
      proSilenceLimit: "⏱️ Silence Limit Before Speech:",
      proMinigameCommentary: "🎮 AI Minigames Commentary",
      proMinigameCommentaryDesc: "When viewers play Minigames (Boss Arena, TicTacToe, Pets, Horse Racing), the AI will commentate on the gameplay flow in local language wittily!",
      proEvasionTitle: "COMPLIANCE & SAFEGUARD MODE",
      proEvasionLabel: "Restricted Word Evasion / Dodge",
      proEvasionDesc: "Automatically avoids copyrighted or debt/finance sensitive questions wittily.",
      proSensitiveList: "🛡️ Restricted / Sensitive Keyword List:",
      proSensitivePlaceholder: "Enter banned words separated by commas, e.g., fraud, scam, swear...",
      proSlangTitle: "🏷️ TikTok Safe Slangs Conversion Dictionary",
      proFeatureActivated: "EXCLUSIVE PRO FEATURES (ACTIVATED)",
      proFeatureLocked: "EXCLUSIVE PRO FEATURES:",
      proItem1: "High-End Vocal Livestream Mixer Engine",
      proItem2: "Change to advanced new AI voices",
      proItem3: "Smart voice comment interaction by Google & Azure AI",
      proItem4: "Auto play fan's music gifts",
      proItem5: "AI automatically replies to Live Chat",
      proItem6: "Upload & Customize rich Livestream Soundpad",
      spamFilterTitle: "SPAM FILTER (BANNED WORDS)",
      spamFilterDesc: "Enter junk, vulgar, offensive, or sensitive words banned by TikTok for the system to automatically filter and prevent them from being read out on the livestream. Separate by commas (,).",
      spamFilterList: "WORD LIST (,) :",
      blacklistTitle: "USER BLACKLIST (SPAMMERS)",
      blacklistDesc: "When these disruptive accounts comment or interact on the Live stream, the AI Robot and TTS pronunciation system will automatically ignore them. Enter their TikTok ID/Username, separated by commas (,).",
      blacklistList: "BLOCKED ACCOUNTS LIST (,) :",
      liveRoomNotActive: "LIVE STUDIO - DEVICE NOT ACTIVE!",
      liveRoomNotActiveDesc: "Click 'Turn On Mic' in the Mixer tab or 'Turn On Microphone' in the PC Camera tab to display audio waves!",
      cameraNotActive: "PC CAMERA NOT ACTIVE",
      cameraNotActiveDesc: "Click the 'TURN ON CAMERA' button below to start broadcasting and trigger the browser permission dialog!",
      btnTurnOnCamera: "TURN ON LIVE CAMERA",
      btnTurnOnMic: "TURN ON MICROPHONE",
      configDeviceTitle: "AUDIO & VIDEO DEVICE CONFIGURATION",
      btnRefreshDevice: "Refresh devices",
      webcamLabel: "Video Device (Webcam):",
      micLabel: "Audio Input (Microphone):",
      localMonitorTitle: "VOCAL LOCAL MONITOR FEEDBACK",
      localMonitorDesc: "Live playback of your real voice through headphones/speakers after adjusting bass/treble/reverb",
      voicemodTitle: "EXTERNAL AI VOICE CONNECTION (VOICEMOD, VOICE.AI...)",
      voicemodDesc: "Live playback of your real voice through headphones/speakers after adjusting bass/treble/reverb",
      voicemodDesc2: "When using a PC voice changer app (Voicemod, Voice.ai, HitPaw), select the corresponding virtual input port under 'Microphone' above for ultra-smooth, zero-latency singing synergy!",
      recordingTipsTitle: "TIPS FOR EFFECTIVE STUDIO USE:",
      recordingTip1: "Singing with PC app: Turn on PC voice changer app (Voicemod, Voice.ai) to smooth and add explosive reverb like a professional singer.",
      recordingTip2: "ALWAYS plug in Earphones before turning on the monitor to eliminate feedback loops echoing from speakers back to the mic.",
      recordingWarning: "Strictly Prohibited: When a piercing echo/squeal occurs, you must turn off the Microphone/Local Monitor immediately to protect your hearing and speakers. Adjust Volume before trying again!"
    },
    zh: {
      subtitle: "事件队列处理 system 及智能 multi-language AI 翻译切换器",
      connectTitle: "直播线路调节与状态",
      statViewers: "在线观众人数",
      statComments: "互动高频词",
      statFollowers: "高频净增关注",
      statLikes: "累计点赞频次",
      statGifts: "贵重礼物汇总",
      statShares: "分享次数",
      statPeak: "波段历史极值",
      terminalTitle: "实时日志核心事件流队列",
      licTitle: "授权核心准入验证",
      licBadge: "授权到期信息: ",
      licActive: "授权检查通过",
      settingsTitle: "AI 智能回复与人设参数微调",
      welcomeActive: "新粉入场自动欢迎",
      followActive: "新增关注瞬间播报",
      likeActive: "高频点赞感谢广播",
      giftActive: "贵重礼物连击答谢",
      adminTitle: "大师级授权管理证书控制中心",
      obsTitle: "OBS 直播挂机画布模拟器",
      tabDashboard: "直播面板",
      tabSettings: "核心配置",
      tabProFeatures: "💎 PRO 功能",
      tabAdvanced: "虚拟世界",
      tabMedia: "媒体音频",
      tabGames: "游戏与指南",
      tabObs: "OBS 引擎",
      tabAdmin: "许可证",
      guideLogin: "认证与登录指南",
      guideLoginStep1: "1. 请将您的硬件 ID 或授权密钥提供给管理员。",
      guideLoginStep2: "2. 系统将分配电子邮件和密钥供您验证账户。",
      guideLoginStep3: "3. 单击“许可证”选项卡以检查软件的激活状态。",
      guideLoginStep4: "4. 在“直播面板”选项卡，粘贴您的Cookie或房间ID连接Socket。建议使用SessionID。",
      translateSource: "来源 (原始评论):",
      translateTarget: "目标 (翻译为):",
      autoReply: "自动回复助手",
      aiPrompt: "角色设定 (Roleplay)",
      blockedKeywords: "禁止关键词",
      blockedUsers: "黑名单用户",
      filterSecurity: "安全过滤器 (黑名单)",
      ttsTitle: "音频引擎 (TTS)",
      translateTitle: "自动翻译 (TRANSLATE)",
      navOverview: "概览",
      navDashboard: "仪表板",
      navCore: "互动配置",
      navSettings: "设置",
      navAI: "AI 配置",
      navSecurity: "安全与专业版",
      navBlacklist: "安全过滤器",
      navMediaGrp: "媒体链接",
      navSoundpad: "音效面板",
      navMinigamesGrp: "小游戏",
      navMinigames: "游戏管理",
      navStudioGrp: "音频工作室",
      navStudioMixer: "调音台与 AI 配置",
      navStudioGuide: "使用指南手册",
      navInfo: "信息",
      navProfile: "个人资料",
      navUptime: "运行时间",
      tiktokIdLabel: "TikTok 频道 ID:",
      unregisteredEmail: "❌ 该电子邮件未注册激活授权！",
      aiConfigTitle: "AI 助手配置",
      eventsTitle: "事件脚本 (EVENTS)",
      themeTitle: "界面与定制",
      leaderboardTitle: "感谢土豪排行榜",
      terminalQueueTitle: "实时弹幕监控终端",
      statusLive: "状态:",
      soundpadTitle: "音效板",
      bgmTitle: "直播间背景音乐",
      systemAudioTitle: "音频播放系统",
      obsVol: "OBS游戏音量:",
      ttsVol: "人工智能TTS音量:",
      autoPlay: "自动播放BGM",
      addMp3: "+ 添加MP3",
      clearScreen: "清屏",
      emptyBoard: "暂无数据...",
      waitingComments: "等待观众评论中...",
      customizeDisplay: "自定义显示",
      customScreen: "自定义屏幕",
      fontSizeLive: "实时面板字体大小 (PX)",
      defaultTextColor: "默认文字颜色",
      bgColorLive: "面板背景颜色",
      readSpeed: "阅读速度:",
      autoReconnect: "发生错误时自动重连",
      resetBtn: "重置",
      closeBtn: "关闭",
      noGiftsYet: "暂无礼物捐赠...",
      licenseHeader: "设备授权",
      unverified: "未验证",
      verified: "已激活",
      emailLicense: "授权邮箱:",
      deviceId: "设备ID (HWID):",
      verifyBtn: "验证",
      resetColors: "重置界面的主题颜色",
      minigamesHeader: "迷你游戏管理及指南",
      minigamesDesc: "激活游戏流并查看直播的命令结构。",
      themeVi: "界面：越南语 (VN)",
      themeEn: "界面：英语 (EN)",
      themeZh: "界面：中文 (ZH)",
      modeDark: "模式：黑暗 (Dark)",
      modeLight: "模式：明亮 (Light)",
      bgColorText: "背景颜色:",
      textColorText: "文字颜色:",
      ttsEngineLabel: "TTS Engine:",
      noCharRead: "🔇 不读表情符号/图标",
      connectStreamBtn: "连接直播流",
      disconnectStreamBtn: "断开连接",
      checkKey: "检查 API Key",
      verifyingLicense: "验证中...",
      tiktokIdPlaceholder: "TikTok 房间 ID...",
      ttTargetIdcLabel: "ttTargetIdc (MDC):",
      coopGameDesc: "文明模拟 RPG。团结输出击杀高血量 Boss，平分金币。",
      cmdSyntax: "命令语法：",
      chemTip: "!chem / !ban / - 造成累积伤害。提示：奖励按伤害百分比分配！",
      stopMusic: "停止音乐",
      giftMusicTitle: "自动播放 VIP 礼物音乐",
      autoPlayMode: "自动播放:",
      giftCoins: "硬币...",
      playModeStop: "播放后停止",
      playModeLoop: "循环播放",
      playModeNext: "随机播放下一首",
      waitingConnection: "等待连接",
      streamingLabel: "正在直播",
      proAiHeading: "AI 形象与核心角色设定",
      proActivateAi: "启用 Gemini 智驾智能",
      proAiSubtext: "支持 AI 主播根据公屏内容自动进行妙语连珠的生成式回复，取代死板模板。",
      proFlirtVibeLabel: "🎭 极品人设特征与互动调性:",
      vibeSweet: "🍭 甜腻粘人，超级可爱宠溺风",
      vibeFunny: "🤪 搞怪整蛊，充满笑点超级幽默",
      vibeSassy: "💅 辛辣犀利，高情商霸气爽快回怼",
      vibePoetic: "🌸 优雅知性，喜欢作诗吟词才女范",
      vibeSwag: "🎧 拽姐拽哥，潮流摇滚极速说唱风",
      proPersonaLabel: "🧠 核心人格调教脚本 (Custom System Prompt):",
      proPersonaPlaceholder: "请录入您给AI主播设定的语气指导，如：称呼大哥为领导，多用幽默颜文字...",
      proPersonaTip: "💡 提示：更充实和多样的扮演要求会让 AI 的回复出类拔萃，拒绝千篇一律。",
      proComposerHeading: "押韵作曲与人工智能声音 V2",
      proAutoSinger: "AI 押韵填词与答谢献唱",
      proAutoSingerSub: "当收到大哥送礼时，自动快速即兴押韵，创作趣味答谢打油诗。",
      proRhymeLabel: "🎙️ 押韵填词模式",
      proBeatLabel: "🎸 直播间伴奏 Beat",
      proExpressionLabel: "🌈 情绪渲染与情感级别:",
      proObsTitle: "OBS 直播挂机角色音频对口型",
      proObsDesc: "自动启动！OBS 直播环境中的 Live2D 形象嘴部将完美地与 TTS 播报音源同步轻盈缩放，生动对型！",
      proRealtimeTitle: "AI 实时动态活跃气氛插件",
      proAutoFlirt: "AI 暖场撩妹与甜言蜜语",
      proAutoFlirtDesc: "代替生硬套词，自动创作风幽默、撩人感恩话术犒劳点赞与关注的粉丝。",
      proSilenceTitle: "防冷场自动互动暖场 (Silence)",
      proSilenceDesc: "当公屏静止无新发言达到阈值时，AI 将自动切入挑选逗趣话题聊天暖场。",
      proSilenceLimit: "⏱️ 静默认定上限秒数:",
      proMinigameCommentary: "🎮 AI 迷你游戏实况搞笑解说",
      proMinigameCommentaryDesc: "在大哥参与主页内置游戏(Boss战/棋类/宠物)时，AI 主播可进行生动的解说及神级大话吐槽！",
      proEvasionTitle: "直播防御与风控规避",
      proEvasionLabel: "直播违规词汇智能闪避迂回",
      proEvasionDesc: "自动在对话流中对金融、纠纷及擦边敏感词条进行智能规避，安全防封锁。",
      proSensitiveList: "🛡️ 直播间禁用词库汇编:",
      proSensitivePlaceholder: "在这里编辑需屏蔽的词（用逗号分隔，例：挂机, 辅助...）",
      proSlangTitle: "🏷️ 抖音/TikTok 避审安全替代字典",
      proFeatureActivated: "独家专业功能 (已激活)",
      proFeatureLocked: "独家专业功能:",
      proItem1: "高端 Vocal 直播混音器引擎",
      proItem2: "更改为高级现代 AI 语音",
      proItem3: "Google & Azure AI 智能语音互动",
      proItem4: "自动播放粉丝音乐礼物",
      proItem5: "人工智能自动回复直播",
      proItem6: "上传和定制丰富的音效面板",
      spamFilterTitle: "垃圾邮件过滤器 (违禁词)",
      spamFilterDesc: "输入被 TikTok 禁止的垃圾、粗俗、冒犯或敏感词语，系统会自动过滤并防止它们在直播中被读出。用逗号 (,) 分隔。",
      spamFilterList: "单词列表 (,) ：",
      blacklistTitle: "用户黑名单 (垃圾邮件发送者)",
      blacklistDesc: "当这些破坏性账号在直播中评论或互动时，人工智能机器人和 TTS 发音系统会自动忽略它们。输入他们的 TikTok ID/用户名，用逗号 (,) 分隔。",
      blacklistList: "被封锁账户列表 (,) ：",
      liveRoomNotActive: "直播工作室 - 设备未激活！",
      liveRoomNotActiveDesc: "点击混音器标签中的“打开麦克风”或 PC 相机标签中的“打开麦克风”以显示声波！",
      cameraNotActive: "PC 摄像头未激活",
      cameraNotActiveDesc: "单击下面的“打开摄像头”按钮开始广播并触发浏览器权限对话框！",
      btnTurnOnCamera: "打开实时摄像头",
      btnTurnOnMic: "打开麦克风",
      configDeviceTitle: "音频和视频设备配置",
      btnRefreshDevice: "刷新设备",
      webcamLabel: "视频设备 (Webcam) ：",
      micLabel: "音频输入 (Microphone) ：",
      localMonitorTitle: "人声本地监听反馈",
      localMonitorDesc: "通过调整低音/高音/混响后，通过耳机/扬声器实时播放您的真实声音",
      voicemodTitle: "外部 AI 语音连接 (VOICEMOD、VOICE.AI...)",
      voicemodDesc: "通过调整低音/高音/混响后，通过耳机/扬声器实时播放您的真实声音",
      voicemodDesc2: "使用电脑变声应用 (Voicemod, Voice.ai, HitPaw) 时，请在上方“麦克风”下选择对应的虚拟输入端口，实现超顺滑、零延迟的唱歌协同！",
      recordingTipsTitle: "有效使用工作室的技巧：",
      recordingTip1: "使用电脑应用程序唱歌：打开电脑变声应用程序（Voicemod、Voice.ai）进行平滑处理，并像专业歌手一样增加爆炸性混响。",
      recordingTip2: "打开监听器之前始终戴上耳机，以消除声音从扬声器回流至麦克风的反馈回路。",
      recordingWarning: "严禁：当出现刺耳的回声/尖叫声时，必须立即关闭麦克风/本地监听器，以保护您的听力和扬声器。调整音量后再重试！"
    }
  };

  const t = dicts[webLang] || dicts["vi"];

  const isPro = config?.planLevel === 'pro' || config?.planLevel === 'Admin';

  // ==========================================
  // INITIAL STAGE LOADERS
  // ==========================================
  useEffect(() => {
    window.speechSynthesis.cancel();
    fetchConfig();
    const cleanup = initializeSocketAndSse();

    // Check if authenticated locally
    const authSaved = sessionStorage.getItem("admin_session_verified");
    if (authSaved === "true") {
      setIsAdminAuthenticated(true);
      fetchLicenses();
    }

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (terminalLogsEndRef.current) {
      terminalLogContainerRef.current?.scrollTo({
        top: terminalLogContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLogs]);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/get-config");
      const data: SystemConfig = await res.json();
      setConfig(data);
      setWebLang(data.webLanguage || "vi");
      setTempUsername(data.lastConnectedUsername || "");
      setTempCookie(data.cookieSessionId || "");
      setTempIdc(data.ttTargetIdc || "");

      // Premium Auto-Verification on startup
      if (data.licenseEmail) {
        try {
          const hwid = data.hardwareId || "DEVICE-F7X9-10V";
          const licRes = await fetch("/api/verify-license", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.licenseEmail, hwid })
          });
          if (licRes.ok) {
            const licData = await licRes.json();
            if (licData.status === "valid") {
              const expireText = licData.expire === "2099-12-31" ? " vĩnh viễn" : (licData.expire ? ` (Hạn: ${licData.expire})` : '');
              setConfig(prev => prev ? {
                ...prev,
                licenseStatus: 'valid',
                licenseMessage: `✅ Xác minh thành công!${expireText}`,
                planLevel: licData.role,
                licenseExpire: licData.expire
              } : prev);
            } else {
              setConfig(prev => prev ? {
                ...prev,
                licenseStatus: 'invalid',
                licenseMessage: `❌ ${licData.message || 'Truy cập bị từ chối'}`
              } : prev);
            }
          }
        } catch (licErr) {
          console.error("Auto license check failed:", licErr);
        }
      }

      const statusRes = await fetch("/api/stream-status");
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStreamConnected(statusData.connected);
        if (statusData.connected) {
          setStreamBadgeText(`Streaming: ${statusData.username} 🟢`);
        } else {
          setStreamBadgeText("Chờ kết nối");
        }
      }
    } catch (e) {
      console.error("Lỗi lấy cấu hình:", e);
    }
  };

  const fetchLicenses = async (passwordOverride?: string) => {
    const activePass = passwordOverride || adminPassword || sessionStorage.getItem("admin_password_token") || "";
    try {
      const res = await fetch("/api/admin/licenses", {
        headers: {
          "x-admin-password": activePass
        }
      });
      if (res.ok) {
        const data: License[] = await res.json();
        setLicenses(data);
        sessionStorage.setItem("admin_password_token", activePass);
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to fetch licenses:", e);
      return false;
    }
  };

  const initializeSocketAndSse = () => {
    // Connect Socket.io client
    const socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      // realtime game connected
    });

    socket.on("stream_status_change", (data: { connected: boolean, username: string }) => {
      setStreamConnected(data.connected);
      if (data.connected) {
        setStreamBadgeText(`Streaming: ${data.username} 🟢`);
      } else {
        setStreamBadgeText("Chờ kết nối");
      }
    });

    socket.on("kick_client_force", (data: { email: string }) => {
      const currentEmail = localStorage.getItem("lic_email");
      if (currentEmail === data.email) {
        localStorage.removeItem("lic_email");
        localStorage.removeItem("lic_hwid");
        window.location.reload();
      }
    });

    socket.on("kick_specific_hwid_force", (data: { email: string, hwid: string }) => {
      const currentEmail = localStorage.getItem("lic_email");
      const currentHwid = localStorage.getItem("lic_hwid");
      if (currentEmail === data.email && currentHwid === data.hwid) {
        localStorage.removeItem("lic_email");
        localStorage.removeItem("lic_hwid");
        window.location.reload();
      }
    });

    socket.on("admin_reload_data", () => {
      if (sessionStorage.getItem("admin_session_verified") === "true") {
        fetchLicenses();
      }
    });

    socket.on("admin_attack_alert", (data: { email: string }) => {
      alert(`⚠️ CẢNH BÁO: Phát hiện email [${data.email}] đăng nhập vượt số máy tối đa!`);
    });

    // Start Realtime SSE logger with robust auto-reconnecting strategy
    let sseInstance: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isCleanedUp = false;

    const setupSse = () => {
      if (isCleanedUp) return;
      if (sseInstance) {
        sseInstance.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      const sse = new EventSource("/api/stream-logs");
      sseInstance = sse;

      sse.onmessage = (event) => {
        if (isCleanedUp) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "stream_status") {
            setStreamConnected(payload.connected);
            if (payload.connected) {
              setStreamBadgeText(`Streaming: ${payload.username} 🟢`);
            } else {
              setStreamBadgeText("Chờ kết nối");
            }
            // Clear TTS
            ttsQueueRef.current = [];
            isSpeakingRef.current = false;
            window.speechSynthesis.cancel();
          } else if (payload.event === "stats") {
            const raw = payload.data || {};
            setMetrics({
              viewers: raw.viewerCount ?? raw.viewers ?? 0,
              comments: raw.totalComments ?? raw.comments ?? 0,
              followers: raw.totalFollowers ?? raw.followers ?? 0,
              likes: raw.totalLikes ?? raw.likes ?? 0,
              gifts: raw.totalGifts ?? raw.gifts ?? 0,
              maxViewers: raw.maxViewers ?? 0
            });
            if (raw.leaderboard) {
              setLeaderboard(raw.leaderboard);
            }
          } else if (payload.event === "log") {
            const newLog: LogEntry = {
              id: Math.random().toString(),
              time: new Date().toLocaleTimeString(),
              tag: payload.tag || "LOG",
              message: payload.message || "",
              colorClass: payload.colorClass || "text-gray-300"
            };
            setTerminalLogs(prev => [...prev.slice(-150), newLog]);
          } else if (payload.event === "tts") {
            const currentConfig = configRef.current;
            
            if (payload.ttsType === "gift") {
               const sName = resolveName(payload.sender);
               if (currentConfig?.aiGiftComposerActive) {
                  // Trigger Gemini AI Composer
                  setTimeout(() => {
                     generateAiMusic({
                       username: sName,
                       giftName: payload.giftName || "Quà",
                       count: parseInt(payload.count) || 1
                     });
                  }, 1500);
               } else {
                  // Fall back to standard BGM
                  const triggerCoins = currentConfig?.giftMusicTriggerCoins || 100;
                  const giftVal = parseInt(payload.count) || 1;
                  if (currentConfig?.autoPlayGiftMusic && giftVal >= triggerCoins) {
                     setTimeout(() => {
                        playRandomGiftMusic();
                     }, 2000);
                  }
               }
            }

            if (currentConfig?.ttsActive) {
              let textSpeech = "";

              const cleanVoicePronouns = (text: string): string => {
                if (!text) return "";
                let s = text;
                const dupWords = ["anh", "chị", "dì", "cô", "bác", "chú", "mợ", "thím", "ông", "bà", "em"];
                for (const w of dupWords) {
                  const regexDup = new RegExp(`\\b(${w})\\s+(${w})\\b`, "gi");
                  s = s.replace(regexDup, (match, p1, p2) => p2);
                  const regexBan = new RegExp(`\\b(bạn|anh chị|khán giả)\\s+(${w})\\b`, "gi");
                  s = s.replace(regexBan, (match, p1, p2) => p2);
                }
                return s;
              };

              const avoidTikTokScanningSensors = (text: string): string => {
                if (!text) return "";
                let s = text;
                const mappings = [
                  { pattern: /\btặng quà\b/gi, replacement: "gửi kẹo ngọt" },
                  { pattern: /\btặng\b/gi, replacement: "gửi" },
                  { pattern: /\bquà\b/gi, replacement: "vật phẩm" },
                  { pattern: /\btheo dõi\b/gi, replacement: "đồng hành" },
                  { pattern: /\bfollow\b/gi, replacement: "kết nối" },
                  { pattern: /\bthả tim\b/gi, replacement: "bắn nút yêu thương" },
                  { pattern: /\bbão tim\b/gi, replacement: "bão yêu thương" },
                  { pattern: /\btim\b/gi, replacement: "yêu thương" },
                  { pattern: /\bxu\b/gi, replacement: "hạt dẻ" },
                  { pattern: /\btiền\b/gi, replacement: "lúa" },
                  { pattern: /\bđô la\b/gi, replacement: "đá ngọt" },
                  { pattern: /\bđô\b/gi, replacement: "đá ngọt" },
                  { pattern: /\bcoin[s]?\b/gi, replacement: "ngôi sao bay" },
                  { pattern: /\bnạp tiền\b/gi, replacement: "tưới nước" },
                  { pattern: /\bnạp\b/gi, replacement: "làm ấm tài khoản" },
                  { pattern: /\bchia sẻ\b/gi, replacement: "gieo hạt yêu thương" },
                  { pattern: /\bshare\b/gi, replacement: "gieo hạt yêu thương" }
                ];
                for (const m of mappings) {
                  s = s.replace(m.pattern, m.replacement);
                }
                return s;
              };

              const parseDynamicTemplate = (template: string, username: string, count: string | number = "", gift: string = "") => {
                if (!template) return "";
                const hour = new Date().getHours();
                let timeOfDay = "buổi sáng";
                if (hour >= 12 && hour < 18) timeOfDay = "buổi chiều";
                else if (hour >= 18) timeOfDay = "buổi tối";

                let userPronoun = "bạn";
                let cleanUsername = username || "";
                if (/^user\d{5,}$/i.test(cleanUsername) || /^user_\d{5,}$/i.test(cleanUsername)) {
                  cleanUsername = "bạn user";
                }
                const lowerName = cleanUsername.toLowerCase();
                const prefixes = ["anh ", "chị ", "cô ", "dì ", "chú ", "bác ", "mợ ", "thím ", "ông ", "bà ", "em ", "anh", "chị", "em", "cô", "chú", "bác", "ông", "bà"];
                let hasPrefix = false;
                for (const prefix of prefixes) {
                    if (lowerName.startsWith(prefix)) {
                        userPronoun = prefix.trim();
                        hasPrefix = true;
                        break;
                    }
                }
                let result = template;
                const lines = result.split('\n').filter(l => l.trim() !== "");
                if (lines.length > 0) {
                   result = lines[Math.floor(Math.random() * lines.length)].trim();
                }
                result = result.replace(/buổi (sáng|trưa|chiều|tối)/gi, `buổi ${timeOfDay}`);
                if (hasPrefix) {
                  // Direct name: remove redundant pronouns directly preceding [user] placeholder
                  result = result
                    .replace(/(bạn|anh chị|anh|chị|cưng|em|bác|dì|thím|đại ca|chú)\s+\[user\]/gi, "[user]")
                    .replace(/(bạn|anh chị|anh|chị|cưng|em|bác|dì|thím|đại ca|chú)\s+\[user\]/gi, "[user]");
                } else {
                  if (userPronoun !== "bạn") {
                     result = result.replace(/\bbạn\b/gi, userPronoun);
                     result = result.replace(/\banh chị\b/gi, userPronoun);
                  }
                }
                result = result.replace(/\[user\]/g, cleanUsername).replace(/\[count\]/g, String(count)).replace(/\[gift\]/g, String(gift));
                result = adjustTimeBasedPhrases(result);
                return result;
              };

              const resolveName = (raw: any): string => {
                let s = String(raw || "").trim();
                if (!s || s === "undefined" || s === "null" || s === "[object Object]") return "Khán giả";
                if (/^user\d{5,}$/i.test(s) || /^user_\d{5,}$/i.test(s)) {
                  return "bạn user";
                }
                return s;
              };

              if (payload.ttsType === "chat") {
                const sName = resolveName(payload.sender);
                const sMsg = payload.message || "";
                if (sMsg && sMsg !== "undefined") {
                  const cleanedMsg = sMsg.replace(/@/g, "").trim();
                  if (cleanedMsg) {
                    textSpeech = `${sName} đã viết: ${cleanedMsg}`;
                  }
                }
              } else if (payload.ttsType === "like") {
                const sName = resolveName(payload.sender);
                textSpeech = payload.aiMessage || parseDynamicTemplate(currentConfig?.likeTemplates || "Cảm ơn [user] đã thả [count] tim!", sName, payload.count);
              } else if (payload.ttsType === "follow") {
                const sName = resolveName(payload.sender);
                textSpeech = payload.aiMessage || parseDynamicTemplate(currentConfig?.followTemplates || "Cảm ơn [user] đã nhấn theo dõi kênh!", sName);
              } else if (payload.ttsType === "welcome" || payload.ttsType === "join") {
                const sName = resolveName(payload.sender);
                textSpeech = payload.aiMessage || parseDynamicTemplate(currentConfig?.welcomeTemplates || "Chào mừng [user] đã ghé phòng live của em nha!", sName);
              } else if (payload.ttsType === "gift") {
                const sName = resolveName(payload.sender);
                textSpeech = payload.aiMessage || parseDynamicTemplate(currentConfig?.giftTemplates || "Cảm ơn [user] đã tặng [count] [gift]!", sName, payload.count, payload.giftName || "Quà");
              } else if (payload.ttsType === "ai" || payload.ttsType === "bot") {
                const sMsg = payload.message || "";
                if (sMsg && sMsg !== "undefined") {
                  textSpeech = sMsg;
                }
              }

              if (textSpeech) {
                let cleanedSpeech = textSpeech;
                
                // Clean repetitive pronouns
                cleanedSpeech = cleanVoicePronouns(cleanedSpeech);

                // Adjust greetings and greetings based on PC client local time
                cleanedSpeech = adjustTimeBasedPhrases(cleanedSpeech);
                
                // Apply TikTok safe evasion filter if active
                if (currentConfig?.antiScanEvasionActive !== false) {
                  cleanedSpeech = avoidTikTokScanningSensors(cleanedSpeech);
                }
                
                const processedSpeech = translateEmojiToVietnamese(cleanedSpeech, currentConfig?.ttsSkipEmoji || false);
                speakText(processedSpeech);
              }
            }
          }
        } catch (err) {
          console.error("Error reading SSE stream log:", err);
        }
      };

      sse.onerror = (e) => {
        if (isCleanedUp) return;
        console.log("SSE stream disconnected - checking status for auto fallback", e);
        sse.close();
        reconnectTimeout = setTimeout(() => {
          if (isCleanedUp) return;
          const autoReconnectLog: LogEntry = {
            id: Math.random().toString(),
            time: new Date().toLocaleTimeString(),
            tag: "HỆ THỐNG",
            message: "🛠️ Mất kết nối luồng dữ liệu SSE, đang tự động kết nối lại...",
            colorClass: "text-amber-400 font-bold"
          };
          setTerminalLogs(prev => [...prev.slice(-150), autoReconnectLog]);
          setupSse();
        }, 3000);
      };
    };

    setupSse();

    return () => {
      isCleanedUp = true;
      if (sseInstance) sseInstance.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      socket.disconnect();
    };
  };

  // ==========================================
  // STREAM HANDLERS
  // ==========================================
  const toggleStreamConnection = async () => {
    if (streamConnected) {
      try {
        const res = await fetch("/api/disconnect-live", { method: "POST" });
        if (res.ok) {
          setStreamConnected(false);
          setStreamBadgeText("Chờ kết nối");
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      if (!tempUsername.trim()) {
        alert("Vui lòng nhập ID phòng live TikTok!");
        return;
      }
      try {
        const res = await fetch("/api/connect-live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: tempUsername,
            cookieSessionId: tempCookie,
            ttTargetIdc: tempIdc
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStreamConnected(true);
            setStreamBadgeText(`Streaming: ${tempUsername} 🟢`);
          } else {
            // handle failure implicitly via logs over SSE
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSimulateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamConnected) {
      alert("Vui lòng bật 'Kết nối luồng' trước khi mô phỏng sự kiện!");
      return;
    }
    setSimLoading(true);
    try {
      const res = await fetch("/api/simulate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: simType,
          sender: simName,
          comment: simComment,
          count: simCount,
          giftName: simGift
        })
      });
      // TTS is broadcasted back via SSE, so we don't speak it here directly!
    } catch (err) {
      console.error(err);
    } finally {
      setSimLoading(false);
    }
  };

  const ttsQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const processTtsQueue = () => {
    if (isSpeakingRef.current || ttsQueueRef.current.length === 0) return;

    const text = ttsQueueRef.current.shift();
    if (!text) return;

    isSpeakingRef.current = true;
    const ttsEngine = configRef.current?.ttsEngine || "browser";
    
    // Giới hạn hàng chờ tránh bị dồn ứ (nếu xếp hàng quá dài thì drop)
    const queueLimit = configRef.current?.ttsQueueLimit || 15;
    if (ttsQueueRef.current.length > queueLimit) {
        ttsQueueRef.current = ttsQueueRef.current.slice(-queueLimit);
    }

    // 🚀 ENGINE 1: GOOGLE TTS ONLINE (BẢN PRO STUDIO)
    if (ttsEngine === "google" || ttsEngine !== "browser") {
      const lang = configRef.current?.ttsLanguage || "vi";
      const sanitizedText = encodeURIComponent(text);
      const audioUrl = `/api/tts?text=${sanitizedText}&lang=${lang}`;
      
      const audio = new Audio(audioUrl);
      audio.playbackRate = configRef.current?.ttsReadSpeed || 1.1; // Tốc độ đọc
      // === RÚT GỌN PHÒNG THU CHO TTS ĐỂ TRÁNH QUÁ TẢI (TRÁNH LỖI MẤT TIẾNG & VANG) ===
      audio.volume = vocalGain;
      currentAudioRef.current = audio;

      const safetyAudioTimeout = setTimeout(() => {
        if (isSpeakingRef.current) {
          audio.pause();
          isSpeakingRef.current = false;
          processTtsQueue();
        }
      }, 15000);

      audio.onended = () => {
        clearTimeout(safetyAudioTimeout);
        isSpeakingRef.current = false;
        setTimeout(processTtsQueue, 300); // Chờ 0.3s rồi đọc câu tiếp theo
      };

      audio.onerror = () => {
        clearTimeout(safetyAudioTimeout);
        console.error("❌ Trình duyệt không thể phát âm thanh Google TTS!");
        isSpeakingRef.current = false;
        processTtsQueue();
      };

      // Play audio (có catch lỗi lỡ trình duyệt chặn autoplay)
      getAudioContext()?.resume().catch(console.warn);
      audio.play().catch((err) => {
        clearTimeout(safetyAudioTimeout);
        console.warn("⚠️ Trình duyệt chặn Autoplay. Hãy click vào trang web 1 lần trước khi phát:", err);
        isSpeakingRef.current = false;
        processTtsQueue();
      });
      
      return; // Kết thúc tại đây, không gọi Backend nữa
    }

    // ==========================================
    // NẾU DÙNG BROWSER TTS (GIỌNG MẶC ĐỊNH CỦA WINDOWS)
    // ==========================================
    if (!window.speechSynthesis) {
      // Tự động chuyển vùng sang Google TTS nếu Máy không hỗ trợ TTS Speech
      playGoogleTtsBackup(text);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    synthUtteranceRef.current = utterance;
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang === "vi-VN" || v.lang === "vi_VN") || 
                    voices.find(v => v.lang.toLowerCase().includes("vi"));

    if (viVoice) {
      utterance.voice = viVoice;
      utterance.lang = "vi-VN";
      utterance.rate = configRef.current?.ttsReadSpeed || 1.1;

      const safetyTimeout = setTimeout(() => {
        if (isSpeakingRef.current) {
          window.speechSynthesis.cancel();
          isSpeakingRef.current = false;
          processTtsQueue();
        }
      }, 15000);

      utterance.onend = () => {
        clearTimeout(safetyTimeout);
        isSpeakingRef.current = false;
        setTimeout(processTtsQueue, 300);
      };

      utterance.onerror = () => {
        clearTimeout(safetyTimeout);
        console.warn("Browser SpeechSynthesis failed, falling back to Google TTS");
        playGoogleTtsBackup(text);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // ⚠️ TỰ ĐỘNG CHUYỂN SANG GOOGLE TTS NẾU TRÌNH DUYỆT THIẾU GIỌNG TIẾNG VIỆT
      console.warn("[TTS] Không tìm thấy giọng Tiếng Việt của trình duyệt -> Tự động dùng Google TTS Proxy!");
      playGoogleTtsBackup(text);
    }
  };

  const playGoogleTtsBackup = (txt: string) => {
    const lang = configRef.current?.ttsLanguage || "vi";
    const sanitizedText = encodeURIComponent(txt);
    const audioUrl = `/api/tts?text=${sanitizedText}&lang=${lang}`;
    
    const audio = new Audio(audioUrl);
    audio.playbackRate = configRef.current?.ttsReadSpeed || 1.1;
    // === RÚT GỌN PHÒNG THU CHO TTS ĐỂ TRÁNH QUÁ TẢI (TRÁNH LỖI MẤT TIẾNG & VANG) ===
    audio.volume = vocalGain;
    currentAudioRef.current = audio;

    const safetyTimeout = setTimeout(() => {
      if (isSpeakingRef.current) {
        audio.pause();
        isSpeakingRef.current = false;
        processTtsQueue();
      }
    }, 15000);

    audio.onended = () => {
      clearTimeout(safetyTimeout);
      isSpeakingRef.current = false;
      setTimeout(processTtsQueue, 300);
    };

    audio.onerror = () => {
      clearTimeout(safetyTimeout);
      console.error("❌ Google TTS Backup also failed!");
      isSpeakingRef.current = false;
      processTtsQueue();
    };

    getAudioContext()?.resume().catch(console.warn);
    audio.play().catch((err) => {
      clearTimeout(safetyTimeout);
      console.warn("⚠️ Autoplay block on Google TTS Backup:", err);
      isSpeakingRef.current = false;
      processTtsQueue();
    });
  };

  const speakText = (text: string) => {
    if (!text) return;
    
    // Safety: If queue gets too huge, discard old ones to stay relevant
    const limit = configRef.current?.ttsQueueLimit || 15;
    if (ttsQueueRef.current.length > limit) {
      ttsQueueRef.current = ttsQueueRef.current.slice(-limit);
    }

    ttsQueueRef.current.push(text);
    processTtsQueue();
  };

  // ==========================================
  // CONFIG AUTO SAVING HANDLERS WITH TRAILING-EDGE DEBOUNCE
  // ==========================================
  const pendingUpdatesRef = useRef<Partial<SystemConfig>>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateConfigValue = (newFields: Partial<SystemConfig>) => {
    if (!config) return;
    
    // 1. Update local state immediately so inputs, selections, and checkboxes remain highly responsive
    const merged = { ...config, ...newFields };
    setConfig(merged);
    
    // 2. Accumulate pending updates
    pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...newFields };
    
    // If it's a critical single-event update like ownerAvatar, ownerName, or license-related, save immediately!
    const isInstantSave = 'ownerAvatar' in newFields || 'ownerName' in newFields || 'licenseEmail' in newFields;
    
    if (isInstantSave) {
      const updatesToSend = { ...pendingUpdatesRef.current };
      pendingUpdatesRef.current = {};
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = null;
      
      fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatesToSend)
      }).catch(e => console.error("Save config instant error:", e));
      return;
    }

    // 3. Debounce actual network write by 1.2 seconds to allow user to finish typing
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      const updatesToSend = { ...pendingUpdatesRef.current };
      pendingUpdatesRef.current = {};
      saveTimeoutRef.current = null;
      
      try {
        await fetch("/api/save-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatesToSend)
        });
      } catch (e) {
        console.error("Save config error:", e);
      }
    }, 1200);
  };

  const templateDict = {
    vi: {
      welcome: "dạ chào [user] nha, chúc bạn xem live vui vẻ nè!\nmừng [user] ghé chơi nha, dễ thương thế!\nchào [user] ạ, một nhịp live xôm tụ nha bạn ơi!\nCảm ơn [user] đã đến với phòng live của em hôm nay nhé!\n[user] ơi, tìm chỗ ngồi thoải mái xem live em nha!\nÔi [user] vào rồi kìa, hoan nghênh anh lọt hố live em nha!\nThiên thần [user] hạ phàm ghé thăm phòng live của em nè!\nLâu lắm mới thấy [user] ghé ủng hộ em đó nha!\nNhiệt liệt chào mừng [user] đến chốn này chung vui cùng em!\n[user] vừa vào, chớp mắt thấy bạn mỉm cười xinh quá!\nChào [user] cục cưng nha, vào chơi cùng em một lát nào!",
      follow: "dạ em cảm ơn [user] đã theo dõi kênh nha, yêu thương nhiều ạ!\nbiết ơn [user] đã follow, tạo thêm động lực cho em lắm đó!\nTrời ơi, cám ơn [user] đã ấn follow ủng hộ kênh bé xíu nha!\nTuyệt vời quá, cảm ơn [user] đã nhấn theo dõi em nha!\nYêu [user] nhiều vì đã follow, thả tim cho tình yêu này nha!\nCú click follow của [user] làm em xao xuyến quá đi!\n[user] ơi, cảm ơn bạn đã chính thức trở thành fan cứng của kênh nha!\nMãi yêu [user], nút follow của bạn là năng lượng nguyên ngày của em đó!",
      like: "chu choa, cảm ơn [user] đã thả [count] bão tim tuyệt vời nha!\nanh [user] bão tim sung sức quá đi, em biết ơn rất nhiều ạ!\nÔi trời ơi [count] tim từ [user], em sướng rơn cả người!\nCảm ơn [user] vì [count] cái nhấp tay đầy yêu thương cho em nha!\nMàn múa ngón tay quá đỉnh của [user] với [count] lượt bão tim, yêu lắm cơ!\nThả [count] tim thế này thì tim em bay ra khỏi lồng ngực mất [user] ơi!\nCảm ơn anh [user] đã cày [count] tim muốn rớt cái màn hình cho em nha!",
      gift: "ôi xịn quá! em cảm ơn anh [user] đã gửi tặng [count] bão [gift] dễ thương nha!\nTrời đất ơi, [user] hào phóng quá, cho hẳn [count] cái [gift] sướng rơn!\nCảm ơn đại gia [user] đã tài trợ [count] [gift] vô cùng xịn xò!\nTing ting, quà [gift] của [user] đến rồi, cám ơn anh rất nhiều nha!\n[user] cưng quá đi, tặng em hẳn [count] [gift], tối nay ngủ ngon nhức nách!\nTuyệt cú mèo [user] ơi, nhận xong [count] món [gift] của anh làm em vui xỉu!\nCám ơn [user] nạp năng lượng [gift] đỉnh cao cho em nha, bắn tim tim tim!",
      banned: "vcl, clm, đm, dcm, cặc, lồn",
      autoReply: "hi : Dạ em chào buổi tối anh chị thân thương ghé live ạ! ❤️\nshop : Dạ giỏ hàng ở dưới góc trái màn hình nha cả nhà!\napp : Link tải tool nằm ở ghim bình luận ạ.\ngame : Chúng ta đang chơi mini-games tương tác, gõ 1 hoặc 2 để chọn phe nè!",
      prompt: "Bạn tên là AI Mộc Lan, 18 tuổi, 1 nữ streamer xinh đẹp, thân thiện, vui vẻ. Mục đích: phản hồi ngắn gọn (dưới 20 chữ), dễ nghe, dùng từ giới trẻ ngọt ngào. Trả lời các comment bằng tiếng Việt."
    },
    en: {
      welcome: "sweet morning [user], hope you enjoy the livestream!\nwelcome [user], thanks for stopping by!\nhello sweet [user], crossing paths feels great!",
      follow: "thank you so much [user] for following the channel!\nso grateful for your follow [user], it means a lot sweetie!",
      like: "wow, thank you [user] for sending [count] likes sweetie!\n[user] you're amazing, thanks for the continuous likes!",
      gift: "oh my god! thank you [user] for gifting [count] sweet [gift]!",
      banned: "fuck, shit, bitch, cunt, dick, slut",
      autoReply: "hi : Good evening everyone! Welcome to the stream! ❤️\nshop : The shopping cart is on the bottom left corner cuties!\napp : Download link pinned in comments!\ngame : Minigame time: type 1 or 2 to pick a side!",
      prompt: "Your name is AI Lily, 18 years old, a beautiful female streamer, friendly, sweet and cute. Goal: reply very short (under 15 words) and sweet. Speak English only."
    },
    zh: {
      welcome: "欢迎亲爱的 [user] 宝贝来到直播间！\n欢迎新朋友 [user] 过来玩，你好可爱呀！\n[user] 宝贝你好呀，祝你每天开心！",
      follow: "非常感谢 [user] 宝贝关注我们的频道！\n谢谢 [user] 的关注，给我好大的动力呀！",
      like: "哇，感谢 [user] 连续送出 [count] 个点赞！\n[user] 宝贝点赞太猛啦，感激不尽呀！",
      gift: "天哪太棒了！感谢 [user] 送的 [count] 个漂亮 [gift] 呀！",
      banned: "傻逼, 操你妈, 肏, 贱人, 妈的",
      autoReply: "hi : 各位宝贝们，欢迎来到直播间！❤️\nshop : 购物车在左下角哦，大家随便看看！\napp : 工具下载链接在置顶评论里呀。\ngame : 我们正在玩互动游戏，扣1或2选阵营哦！",
      prompt: "你叫美兰，18岁，是一个非常漂亮、友善、可爱的女主播。目标：用中文简短地回答（15字以内），语气甜美可爱。"
    }
  };

  const handleLangChange = (lang: 'vi' | 'en' | 'zh' | string) => {
    setWebLang(lang);
    const validLang = (lang === 'vi' || lang === 'en' || lang === 'zh') ? lang : 'vi';
    const dict = templateDict[validLang];

    updateConfigValue({ 
      webLanguage: lang,
      welcomeTemplates: dict.welcome,
      followTemplates: dict.follow,
      likeTemplates: dict.like,
      giftTemplates: dict.gift,
      bannedKeywords: dict.banned,
      autoReplyRawScript: dict.autoReply,
      aiPrompt: dict.prompt
    });
  };

  const handleCheckAIKey = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/check-key-balance", {
        method: "POST"
      });
      const data = await res.json();
      alert(`🔍 Kết quả kiểm tra API Key:\n\n${data.message || data.status || JSON.stringify(data)}`);
    } catch (e) {
      alert("❌ Lỗi kiểm tra API Key. Máy chủ không phản hồi!");
    }
  };

  // ==========================================
  // ADMIN CONTROL ACTIONS
  // ==========================================
  const handleVerifyAdminSubmit = async () => {
    const success = await fetchLicenses(adminPassword);
    if (success) {
      sessionStorage.setItem("admin_session_verified", "true");
      setAdminAuthError("");
    } else {
      setAdminAuthError("Mật mã quản trị viên không chính xác. Vui lòng kiểm tra lại!");
    }
  };

  const generateLicenseTokenClient = (email: string) => {
    if (!email) return "";
    let hash = 0;
    const keygenSalt = "MasterKey2026@&";
    const combinedText = email + keygenSalt;
    for (let i = 0; i < combinedText.length; i++) {
        const char = combinedText.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const base64Part = btoa(email.substring(0, 3));
    return "SEC_HASH_" + Math.abs(hash).toString(16).toUpperCase() + "_" + base64Part;
  };

  const handleKeygenRun = () => {
    if (!keygenEmail) return;
    const token = generateLicenseTokenClient(keygenEmail);
    setKeygenResult(token);
  };

  const handlePresetDaysChange = (val: string) => {
    setPresetDays(val);
    if (val === "permanent") {
      setNewLicExpire("2099-12-31");
    } else {
      const days = parseInt(val);
      const d = new Date();
      d.setDate(d.getDate() + days);
      setNewLicExpire(d.toISOString().split("T")[0]);
    }
  };

  const createOrUpdateLicenseSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (!newLicEmail.trim()) {
      alert("Vui lòng điền địa chỉ email!");
      return;
    }
    const activePass = adminPassword || sessionStorage.getItem("admin_password_token") || "";
    try {
      const res = await fetch("/api/admin/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass
        },
        body: JSON.stringify({
          email: newLicEmail,
          maxHwids: newLicMaxHwids,
          expire: newLicExpire,
          role: newLicRole
        })
      });
      if (res.ok) {
        alert("🎉 Lưu thông tin bản quyền thành công!");
        setNewLicEmail("");
        setNewLicRole("basic");
        setNewLicMaxHwids(1);
        setPresetDays("permanent");
        setNewLicExpire("2099-12-31");
        fetchLicenses();
      }
    } catch (e) {
      alert("Lỗi máy chủ khi tạo license!");
    }
  };

  const wipeLicenseHwids = async (email: string) => {
    if (!confirm(`Bạn chắc chắn muốn giải phóng (Wipe) toàn bộ thiết bị đã khóa của email: [${email}]?`)) return;
    const activePass = adminPassword || sessionStorage.getItem("admin_password_token") || "";
    try {
      const res = await fetch("/api/admin/licenses/wipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass
        },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        alert("Đã giải phóng toàn bộ thiết bị thành công!");
        fetchLicenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLicenseRecord = async (email: string) => {
    if (!confirm(`CẢNH BÁO CỰC BẢO MẬT:\n\nBạn chắc chắn muốn XÓA VĨNH VIỄN giấy phép của khách hàng [${email}]?`)) return;
    const activePass = adminPassword || sessionStorage.getItem("admin_password_token") || "";
    try {
      const res = await fetch(`/api/admin/licenses/${encodeURIComponent(email)}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": activePass
        }
      });
      if (res.ok) {
        alert("Đã xóa vĩnh viễn dữ liệu bản quyền!");
        fetchLicenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const kickSpecificHwidRaw = async (email: string, hwid: string) => {
    if (!confirm(`Khóa vĩnh viễn thiết bị [${hwid}] của tài khoản ${email}?`)) return;
    const activePass = adminPassword || sessionStorage.getItem("admin_password_token") || "";
    try {
      const res = await fetch("/api/admin/licenses/delete-hwid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": activePass
        },
        body: JSON.stringify({ email, hwid })
      });
      if (res.ok) {
        if (socketRef.current) {
          socketRef.current.emit("kick_specific_hwid_signal", { email, hwid });
        }
        alert(`Đã ngắt liên kết và cấm thiết bị ${hwid} thành công!`);
        fetchLicenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isAdminPanelRoute) {
    return (
      <div className="min-h-screen bg-[#030308] text-slate-100 font-sans p-6">
        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 uppercase mb-8">
           LICENSE STRATEGIC DASHBOARD
        </h2>
        <ErrorBoundary>
          {!isAdminAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto w-full gap-4 mt-20">
                <Lock className="w-12 h-12 text-slate-500 mb-2" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest text-center">Xác Thực Quản Trị Viên</h3>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  placeholder="Mật khẩu Admin..." 
                  className="w-full bg-[#030308]/80 border border-white/10 focus:border-emerald-500 outline-none rounded-xl p-3 text-sm text-center tracking-widest font-mono text-white transition-colors"
                />
                <button 
                  onClick={handleVerifyAdminSubmit} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                >
                  Mở Khóa
                </button>
                {adminAuthError && <p className="text-rose-400 text-[10px] text-center font-mono mt-2">{adminAuthError}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase border-b border-white/5 pb-3">Cấp Mới License</h3>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">Email / Tài Khoản Khách</label>
                          <input type="email" value={newLicEmail} onChange={(e) => setNewLicEmail(e.target.value)} placeholder="Email..." className="w-full bg-[#030308]/60 border border-white/10 rounded-lg p-2.5 text-[11px] outline-none focus:border-emerald-500 font-mono text-slate-300" />
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">Ngày Hết Hạn</label>
                          <input type="date" value={newLicExpire} onChange={(e) => setNewLicExpire(e.target.value)} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg p-2 text-[11px] outline-none focus:border-emerald-500 text-slate-300" />
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">Phân Quyền (Gói)</label>
                          <select value={newLicRole} onChange={(e) => setNewLicRole(e.target.value as any)} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg p-2 text-[11px] outline-none focus:border-emerald-500 text-slate-300">
                              <option value="basic">Gói Thường (Basic)</option>
                              <option value="pro">Gói Pro (Full Tính Năng)</option>
                              <option value="Admin">Quản Trị Viên (Admin)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold pl-1">Số Máy Tối Đa (HWIDs)</label>
                          <input type="number" min="1" value={newLicMaxHwids} onChange={(e) => setNewLicMaxHwids(parseInt(e.target.value)||1)} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg p-2 text-[11px] outline-none text-center focus:border-emerald-500 text-slate-300" />
                      </div>
                  </div>
                  <button onClick={createOrUpdateLicenseSubmit} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 mt-4 rounded-lg uppercase tracking-wider text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">Lưu License</button>
                </div>
                
                <div className="md:col-span-2 glass-panel p-6 rounded-xl border border-white/5 flex flex-col">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase border-b border-white/5 pb-3 mb-4 flex justify-between items-center">
                     <span>Quản Lý Danh Sách ({licenses?.length || 0})</span>
                     <button onClick={() => fetchLicenses()} className="text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
                  </h3>
                  <div className="flex-1 space-y-4">
                    {(Array.isArray(licenses) ? licenses : []).filter(Boolean).map((lic, i) => (
                      <div key={i} className="bg-[#030308]/60 border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-colors space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-emerald-300">{lic.email}</p>
                            <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-400">
                                <span>Tạo: {(() => {
                                  if (!lic.createdAt) return "N/A";
                                  try {
                                    const d = new Date(lic.createdAt);
                                    if (isNaN(d.getTime())) return "N/A";
                                    return d.toISOString().split("T")[0];
                                  } catch (e) {
                                    return "N/A";
                                  }
                                })()}</span>
                                <span>|</span>
                                <span>Hạn: {lic.expire}</span>
                                <span>|</span>
                                <span>Role: <b className="text-emerald-500">{lic.role || "User"}</b></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded font-mono text-slate-300 font-bold">{(lic.hwids || []).length} / {lic.maxHwids} HWID</span>
                             <button onClick={() => wipeLicenseHwids(lic.email)} className="bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-white px-3 py-1.5 rounded transition-colors text-[10px] font-bold uppercase" title="Giải phóng toàn bộ thiết bị">Giải phóng</button>
                             <button onClick={() => deleteLicenseRecord(lic.email)} className="bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded transition-colors text-[10px] font-bold uppercase" title="Xóa khách hàng">Xóa</button>
                          </div>
                        </div>
                        {(lic.hwids || []).length > 0 && (
                          <div className="pt-3 border-t border-white/5 space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Các mã máy đang sử dụng:</p>
                            {(lic.hwids || []).map((hw, hi) => (
                              <div key={hi} className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg border border-emerald-500/10">
                                <span className="text-xs text-slate-300 font-mono">{hw}</span>
                                <button onClick={() => kickSpecificHwidRaw(lic.email, hw)} className="text-rose-400 border border-rose-400/30 px-2 py-1 rounded hover:bg-rose-500 hover:text-white text-[10px] uppercase tracking-wider font-bold transition-colors">Khóa Máy</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {(!licenses || licenses.length === 0) && <p className="text-center text-slate-500 text-xs mt-10 font-mono">Chưa có license nào được đăng ký.</p>}
                  </div>
                </div>
              </div>
            )}
        </ErrorBoundary>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    const licenseName = config?.licenseStatus === 'valid' && config?.licenseEmail ? getLicenseName(config.licenseEmail) : (webLang === 'en' ? 'User' : webLang === 'zh' ? '用户' : 'Bạn ơi');
    
    let greetingsMorning, greetingsAfternoon, greetingsEvening;
    
    if (webLang === 'en') {
      greetingsMorning = [`Good morning ${licenseName}! ☀️`, `Have an energetic day ${licenseName}! 🌸`, `Morning ${licenseName}! Stay happy! 💖`];
      greetingsAfternoon = [`Good afternoon ${licenseName}! Smile 😊`, `Relaxing afternoon ${licenseName}! 🌿`, `Take a short break ${licenseName}! ☕`, `Time for a coffee break ${licenseName}! ☕`];
      greetingsEvening = [`Warm evening to you ${licenseName}! 🌙`, `Happy evening ${licenseName}! ✨`, `Have a peaceful night ${licenseName}! 🌟`];
    } else if (webLang === 'zh') {
      greetingsMorning = [`早安，${licenseName}！☀️`, `充满活力的一天，${licenseName}！🌸`, `早上好 ${licenseName}，保持开心！💖`];
      greetingsAfternoon = [`下午好 ${licenseName}！笑一个吧 😊`, `悠闲的下午，${licenseName}！🌿`, `休息一下吧，${licenseName}！☕`, `喝杯咖啡休息一下，${licenseName}！☕`];
      greetingsEvening = [`温馨的夜晚，${licenseName}！🌙`, `${licenseName}，晚上好！✨`, `祝你有个宁静的夜晚，${licenseName}！🌟`];
    } else {
      greetingsMorning = [`Chào buổi sáng ngọt ngào nhé ${licenseName}! ☀️`, `Ngày mới tràn đầy năng lượng nha ${licenseName}! 🌸`, `Sáng rực rỡ và thành công nhé ${licenseName}! 💖`, `Chào buổi sáng an lành nha ${licenseName}! 🍀`];
      greetingsAfternoon = [`Chào buổi chiều nha ${licenseName}! Cười lên nào 😊`, `Chiều thảnh thơi nhấm nháp trà chiều nhé ${licenseName}! 🌿`, `Nghỉ ngơi xíu đi ${licenseName}! ☕`, `Căng thẳng quá thì làm ly cafe nhé ${licenseName}! ☕`, `Một buổi chiều thật chill nhé ${licenseName}! 🎵`];
      greetingsEvening = [`Chào buổi tối ấm áp ${licenseName}! 🌙`, `Một buổi tối bình yên nha ${licenseName}! ✨`, `Nghỉ ngơi thôi, tối an lành nhé ${licenseName}! 🌟`, `Làm việc vất vả rồi, nghe nhạc xíu nhé ${licenseName}! 🎧`];
    }

    if (hour < 12) return greetingsMorning[Math.floor(Math.random() * greetingsMorning.length)];
    if (hour < 18) return greetingsAfternoon[Math.floor(Math.random() * greetingsAfternoon.length)];
    return greetingsEvening[Math.floor(Math.random() * greetingsEvening.length)];
  };

  return (
    <div 
      className="min-h-screen font-sans selection:bg-cyan-500/40 selection:text-cyan-100 flex flex-col relative overflow-x-hidden bg-[#030308]"
      style={{
        backgroundColor: config?.uiBgColor || "#030308",
        color: config?.uiTextColor || "#f1f5f9",
        zoom: (webTextScale / 100) as any
      }}
    >
      <style>
        {`
          * {
            font-family: ${config?.uiFontFamily ? `'${config.uiFontFamily}', sans-serif` : 'sans-serif'} !important;
            ${config?.uiUppercaseAll ? 'text-transform: uppercase !important;' : ''}
          }
          .glass-panel {
            background-color: ${config?.uiTheme === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(15, 23, 42, 0.45)'} !important;
            backdrop-filter: ${config?.uiGlassmorphismBlur !== false ? 'blur(12px)' : 'none'} !important;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 99px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 99px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/25 rounded-full blur-[140px] pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-900/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0" />
      
      {/* FULL WRAPPER SIDEBAR LAYOUT */}
      <div className="flex flex-1 relative z-10 w-full min-h-0">
        {/* SIDEBAR LEFT */}
        <aside className="w-72 bg-[#05050C]/95 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar sticky top-0 h-screen hidden lg:flex">
          {/* LOGO AREA */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3 font-sans">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#ec4899] shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <span className="text-white text-xs font-black">⚙️</span>
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest text-[#818cf8]">LIVE MASTER</h2>
              <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase block mt-0.5">ELITE PRO V5</span>
            </div>
          </div>

          {/* USER PROFILE CARD */}
          <div 
            onClick={() => {
              setActiveTab("admin");
              setActiveSubTab("admin");
            }}
            className="p-4 mx-4 my-3 bg-[#0d0f1c]/80 rounded-2xl border border-white/5 flex items-center gap-3 hover:border-emerald-500/30 hover:bg-[#0d0f1c] cursor-pointer transition-all duration-200 group"
          >
             <div className="relative shrink-0">
               <img 
                 src={config?.ownerAvatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80"} 
                 alt="Avatar"
                 referrerPolicy="no-referrer"
                 className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-200"
               />
               <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center border border-[#0d0f1c] text-[8px] font-black text-white shadow-md">
                 ME
               </span>
             </div>
             <div className="flex-1 min-w-0 font-sans">
               <span className="text-[12px] font-extrabold text-white block truncate tracking-wide uppercase group-hover:text-emerald-300 transition-colors">
                 {config?.licenseStatus === 'valid' && config?.licenseEmail 
                    ? getLicenseName(config.licenseEmail) 
                    : (webLang === 'en' ? 'TRIAL USER' : webLang === 'zh' ? '试用用户' : 'KHÁCH DÙNG THỬ')}
               </span>
               <div className="flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${config?.licenseStatus === 'valid' && config?.licenseEmail ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className={`text-[8px] font-mono tracking-widest uppercase font-bold ${config?.licenseStatus === 'valid' && config?.licenseEmail ? "text-emerald-400" : "text-amber-400"}`}>
                    {config?.licenseStatus === 'valid' && config?.licenseEmail 
                      ? 'LICENSE VALID' 
                      : (webLang === 'en' ? 'UNACTIVATED' : webLang === 'zh' ? '未激活' : 'CHƯA KÍCH HOẠT')}
                  </span>
               </div>
             </div>
          </div>

          {/* SIDEBAR NAVIGATION ITEMS */}
          <nav className="flex-1 px-4 py-3 space-y-4">
             {[
               { id: "overview", title: t.navOverview || "TỔNG QUAN", items: [{ id: "dashboard", label: `📊 ${t.navDashboard || "Bảng Điều Khiển"}` }] },
               { id: "core", title: t.navCore || "CẤU HÌNH TƯƠNG TÁC", items: [
                 { id: "settings", label: `⚙️ ${t.navSettings || "Cấu Hình Chung"}` },
                 { id: "ai_config", label: `🤖 ${webLang === 'en' ? 'AI Assistant Brain' : 'Cấu Hình Trợ Lý AI'}` },
               ] },
               { id: "security", title: t.navSecurity || "BẢO MẬT & PRO", items: [{ id: "blacklist", label: `🛡️ ${t.navBlacklist || "Bộ Lọc Security (Blacklist)"}` }] },
               { id: "games", title: t.navMinigamesGrp || "MINIGAMES", items: [{ id: "games", label: `🎮 ${t.navMinigames || "Quản Lý Minigames"}` }] },
               { id: "studio_sound", title: t.navStudioGrp || "STUDIO ÂM THANH", items: [
                 { id: "studio_mixer", label: `🎛️ ${webLang === 'en' ? 'Vocal Studio & Mixer' : 'Phòng Thu & Bộ Trộn Vocal'}` },
                 { id: "media", label: `🎵 ${t.navSoundpad || "Soundpad & Music"}` },
                 { id: "guide", label: `📖 ${t.navStudioGuide || "Hướng Dẫn Sử Dụng"}` }
               ] },
               { id: "admin", title: t.navInfo || "THÔNG TIN", items: [{ id: "admin", label: `👤 ${t.navProfile || "Thông Tin Cá Nhân"}` }] }
             ].map((category) => {
               const isExpanded = expandedMenus.includes(category.id);
               return (
                 <div key={category.id} className="space-y-1">
                   <button 
                     onClick={() => toggleMenu(category.id)}
                     className="w-full flex items-center justify-between text-slate-400 hover:text-white px-2 py-1 text-[9px] font-black uppercase tracking-widest transition-colors font-mono"
                   >
                     <span>{category.title}</span>
                     <span>{isExpanded ? "▼" : "▶"}</span>
                   </button>
                   {isExpanded && (
                     <div className="pl-1 flex flex-col gap-0.5">
                       {category.items.map((item: any) => {
                                                   if (item.isFolder) {
                            const isSubFolderExpanded = expandedSubFolders.includes(item.id);
                            return (
                              <div key={item.id} className="space-y-0.5">
                                <button
                                  type="button"
                                  onClick={() => toggleSubFolder(item.id)}
                                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left font-sans uppercase tracking-wider"
                                >
                                  <span className="flex items-center gap-2">{item.label}</span>
                                  <span className="text-[8px] font-mono">{isSubFolderExpanded ? "▼" : "▶"}</span>
                                </button>
                                {isSubFolderExpanded && (
                                  <div className="pl-3 border-l border-white/10 ml-3.5 flex flex-col gap-0.5">
                                    {item.children?.map((child: any) => {
                                      const isChildActive = activeSubTab === child.id;
                                      return (
                                        <button
                                          key={child.id}
                                          type="button"
                                          onClick={() => {
                                            setActiveSubTab(child.id);
                                            setActiveTab(child.id as any);
                                          }}
                                          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all text-left font-sans ${isChildActive ? "bg-[#818cf8]/20 text-white border border-[#818cf8]/30 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                                        >
                                          {child.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          const isSubActive = activeSubTab === item.id;
                         return (
                           <button
                             key={item.id}
                             onClick={() => {
                               setActiveSubTab(item.id);
                               setActiveTab(item.id as any);
                             }}
                             className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all text-left font-sans ${isSubActive ? "bg-indigo-600/20 text-white border border-indigo-500/20 shadow" : "text-slate-450 hover:text-slate-200"}`}
                           >
                             {item.label}
                           </button>
                         );
                       })}
                     </div>
                   )}
                 </div>
               );
             })}
          </nav>
        </aside>

        {/* RIGHT CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col h-screen min-w-0">
          <header className="border-b border-white/[0.05] glass-panel px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
            <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col font-sans">
                <h1 className="text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-br from-white via-indigo-100 to-slate-450 bg-clip-text text-transparent">
                  {getGreeting()}
                </h1>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-mono">
                  {t.subtitle || "HỆ THỐNG TRÍ TUỆ GIẢI LẬP & LỌC TƯƠNG TÁC TIKTOK LIVE"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setWebLang(webLang === "vi" ? "en" : webLang === "en" ? "zh" : "vi")}
                   className="px-3 py-1.5 bg-[#030308]/60 hover:bg-slate-800 border border-white/5 rounded-xl text-[10px] text-slate-300 font-bold uppercase transition-all tracking-wider font-sans"
                 >
                   🌐 {webLang === "vi" ? "Tiếng Việt 🇻🇳" : webLang === "en" ? "English 🇺🇸" : "中文 🇨🇳"}
                 </button>
                 <button 
                   onClick={() => setWebTextScale(webTextScale === 100 ? 120 : webTextScale === 120 ? 80 : 100)}
                   className="px-3 py-1.5 bg-[#030308]/60 hover:bg-slate-800 border border-white/5 rounded-xl text-[10px] text-slate-350 font-mono font-bold transition-all font-sans"
                 >
                   {webTextScale}% ZOOM
                 </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-[1700px] w-full mx-auto relative z-10 flex flex-col min-h-0">
            <div className="h-full flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-h-0 overflow-y-auto w-full custom-scrollbar pb-6 flex flex-col"
                >
                  {activeTab === "dashboard" && config && (
                    <div className="flex flex-col gap-5 flex-1 min-h-[0px] h-full w-full">
                      {/* BĂNG METRICS LIVE TOÀN CẢNH */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                        {/* 1. CPU Load */}
                        <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3.5 relative overflow-hidden bg-[#0a0f1d]/60">
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex justify-between">
                              <span>CPU Load</span>
                              <Cpu className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-black text-white font-sans mt-0.5">{systemMetrics.cpuLoad}%</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-3">{systemMetrics.cpuSpeed} MHz/{systemMetrics.cpuCores} Core</div>
                          </div>
                        </div>

                        {/* 2. RAM Usage */}
                        <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3.5 relative overflow-hidden bg-[#0a0f1d]/60">
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex justify-between">
                              <span>RAM Usage</span>
                              <MemoryStick className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-black text-white font-sans mt-0.5">{systemMetrics.ramUsage}%</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-3">{systemMetrics.ramUsedMB}/{systemMetrics.ramTotalMB}MB</div>
                          </div>
                        </div>

                        {/* 3. Uptime */}
                        <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3.5 relative overflow-hidden bg-[#0a0f1d]/60">
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex justify-between">
                              <span>Uptime</span>
                              <Clock className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-black text-white font-sans mt-0.5">{systemMetrics.uptime}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-3">Thời gian hoạt động</div>
                          </div>
                        </div>

                        {/* 4. Version */}
                        <div className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-3.5 relative overflow-hidden bg-[#0a0f1d]/60">
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex justify-between">
                              <span>Version</span>
                              <Package className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-black text-white font-sans mt-0.5">{systemMetrics.version}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-3">Phiên bản phần mềm</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1 items-stretch min-h-[400px] lg:h-[calc(100vh-220px)] overflow-hidden">
                {/* Cột 1: Điều khiển Luồng & Bản Quyền */}
                <div className="space-y-4 lg:col-span-1 flex flex-col h-full min-h-0 overflow-y-auto custom-scrollbar pr-1">
                  {/* AUTH LOGIC MOCK */}
                  <div className="glass-panel p-4 rounded-xl flex border border-white/10 hover:border-blue-500/30 flex-col flex-shrink-0 transition-all bg-gradient-to-tr from-blue-900/10 to-transparent">
                    <h3 className="mb-3 text-[11px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-blue-400" /> {t.licenseHeader || "BẢN QUYỀN THIẾT BỊ"}</span>
                      {config.licenseStatus === 'valid' ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">{t.verified || "Đã kích hoạt"}</span>
                      ) : (
                        <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">{t.unverified || "Chưa xác minh"}</span>
                      )}
                    </h3>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[9px] text-slate-400 mb-1 tracking-widest font-mono uppercase">{t.emailLicense || "Email Mua Bản Quyền:"}</label>
                        <input 
                          type="email" 
                          value={config.licenseEmail || ''}
                          onChange={(e) => updateConfigValue({ licenseEmail: e.target.value, licenseStatus: 'unverified' })}
                          placeholder="..." 
                          className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-[11px] bg-[#030308]/60 text-white outline-none focus:border-blue-500 font-mono transition-colors"
                        />
                      </div>
                    </div>
                    {config.licenseStatus !== 'valid' && (
                      <div className="pt-3">
                        <button 
                          onClick={async () => {
                            if (!(config.licenseEmail || '').includes('@')) {
                              updateConfigValue({ licenseMessage: 'Email không hợp lệ!', licenseStatus: 'invalid' });
                              return;
                            }
                            updateConfigValue({ licenseMessage: t.verifyingLicense || 'Đang xác minh...', licenseStatus: 'unverified' });
                            try {
                              const hwid = config.hardwareId || "DEVICE-F7X9-10V";
                              const res = await fetch("/api/verify-license", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: config.licenseEmail, hwid })
                              });
                              const data = await res.json();
                              if (data.status === "valid") {
                                const expireText = data.expire === "2099-12-31" ? " vĩnh viễn" : (data.expire ? ` (Hạn: ${data.expire})` : '');
                                updateConfigValue({ 
                                  licenseStatus: 'valid', 
                                  licenseMessage: `✅ Xác minh thành công!${expireText}`,
                                  planLevel: data.role,
                                  licenseExpire: data.expire || "2099-12-31"
                                });
                              } else {
                                updateConfigValue({ 
                                  licenseStatus: 'invalid', 
                                  licenseMessage: `❌ ${data.message || 'Truy cập bị từ chối'}` 
                                });
                              }
                            } catch (err) {
                              updateConfigValue({ 
                                licenseStatus: 'invalid', 
                                  licenseMessage: '❌ Không thể kết nối máy chủ' 
                              });
                            }
                          }}
                          className="w-full rounded-lg py-1.5 text-[10px] font-bold text-white transition bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 uppercase tracking-wider relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          {t.verifyBtn || "Xác Minh"}
                        </button>
                      </div>
                    )}
                    {config.licenseMessage && config.licenseStatus !== 'valid' && (
                       <p className="text-[10px] font-mono mt-2 text-center text-rose-400">
                         {config.licenseMessage === 'Email không hợp lệ!' ? (t.unregisteredEmail || '❌ Email không hợp lệ!') : config.licenseMessage}
                       </p>
                    )}

                    {/* DANH SÁCH TÍNH NĂNG ĐỘC QUYỀN PRO */}
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                       <span className="block text-[10px] text-amber-400 font-extrabold tracking-widest uppercase flex items-center gap-1">
                         👑 {isPro ? (t.proFeatureActivated || "TÍNH NĂNG ĐỘC QUYỀN PRO (ĐÃ KÍCH HOẠT)") : (t.proFeatureLocked || "TÍNH NĂNG ĐỘC QUYỀN PRO:")}
                       </span>
                       <ul className="text-[10px] space-y-1.5 text-slate-300 font-medium">
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem1 || "Bộ trộn âm thanh Mixer Vocal Livestream Cao Cấp"}</span>
                         </li>
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem2 || "Thay đổi giọng nói AI thế hệ mới"}</span>
                         </li>
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem3 || "Tương tác bình luận giọng nói Google & Azure AI"}</span>
                         </li>
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem4 || "Tự động phát nhạc quà tặng của Fan"}</span>
                         </li>
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem5 || "Trí tuệ nhân tạo AI tự động trả lời Live Chat"}</span>
                         </li>
                         <li className="flex items-start gap-1.5">
                           <span className={isPro ? "text-emerald-400 font-bold" : "text-amber-500 font-bold font-mono"}>★</span>
                           <span className={isPro ? "" : "text-slate-400"}>{t.proItem6 || "Tải lên & Tùy chọn kho Soundpad livestream phong phú"}</span>
                         </li>
                       </ul>
                    </div>
                  </div>

                  <div className="glass-panel p-4 rounded-xl flex border border-white/10 hover:border-purple-500/30 flex-col flex-1 min-h-0 transition-all">
                    <h3 className="mb-3 text-[11px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-2 border-b border-white/5 pb-2">
                       <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> {t.connectTitle || "BẢNG ĐIỀU KHIỂN"}
                    </h3>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[9px] text-cyan-400/80 mb-1 tracking-widest font-mono uppercase">{t.tiktokIdLabel || "ID Kênh TikTok:"}</label>
                        <input 
                          type="text" 
                          value={tempUsername}
                          onChange={(e) => {
                            setTempUsername(e.target.value);
                            updateConfigValue({ lastConnectedUsername: e.target.value });
                          }}
                          placeholder={t.tiktokIdPlaceholder || "ID Kênh TikTok..."} 
                          className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-[11px] bg-[#030308]/60 text-white outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                      <div>
                          <div>
                            <label className="block text-[9px] text-purple-400/80 mb-1 tracking-widest font-mono uppercase">Cookie Session ID:</label>
                            <input 
                              type={showCookie ? "text" : "password"}
                              value={tempCookie}
                              onChange={(e) => {
                                setTempCookie(e.target.value);
                                updateConfigValue({ cookieSessionId: e.target.value });
                              }}
                              placeholder="sessionid=••••••••" 
                              className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-[11px] bg-[#030308]/60 text-white outline-none focus:border-purple-500 font-mono"
                            />
                            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                              {webLang === 'en' ? (
                                <>* REQUIRED if encountering error <b>200</b>. Go to TikTok.com on PC → F12 → Application → Cookies → Copy <b>sessionid</b> value.</>
                              ) : webLang === 'zh' ? (
                                <>* 遇到 <b>200</b> 错误时必填。在电脑上打开 TikTok.com → F12 → Application → Cookies → 复制 <b>sessionid</b> 值。</>
                              ) : (
                                <>* BẮT BUỘC nếu gặp lỗi <b>200</b>. Vào TikTok.com trên máy tính → F12 → Application → Cookies → Copy giá trị <b>sessionid</b>.</>
                              )}
                            </p>
                          </div>
                      </div>
                      <div>
                        <label className="block text-[11px] text-emerald-400/80 mb-1 tracking-widest font-mono uppercase">{t.ttTargetIdcLabel || "Mã ttTargetIdc (MDC):"}</label>
                        <input 
                          type={showIdc ? "text" : "password"}
                          value={tempIdc}
                          onChange={(e) => {
                            setTempIdc(e.target.value);
                            updateConfigValue({ ttTargetIdc: e.target.value });
                          }}
                          placeholder="Ví dụ: hg, alisg..." 
                          className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-[11px] bg-[#030308]/60 text-white outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>

                    <div className="pt-3">
                      <button 
                        onClick={toggleStreamConnection}
                        disabled={config.licenseStatus !== 'valid'}
                        className={`w-full rounded-lg py-2.5 text-[10px] font-bold text-white transition shadow-sm uppercase tracking-wider ${
                          config.licenseStatus !== 'valid' ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
                          streamConnected ? "bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)]" : "bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] bg-gradient-to-r from-emerald-600 to-teal-500"
                        }`}
                      >
                        {streamConnected ? (t.disconnectStreamBtn || "Ngắt Kết Nối") : (t.connectStreamBtn || "Bật Kết Nối Luồng")}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-2 text-center border-t border-white/5 pt-2">
                       {t.statusLive || "Trạng thái:"} <span className={`font-bold ml-1 ${streamConnected ? "text-emerald-400" : "text-amber-500"}`}>
                         {
                           streamBadgeText === "Chờ kết nối" ? (t.waitingConnection || "Chờ kết nối") :
                           streamBadgeText.startsWith("Streaming:") ? 
                             `${t.streamingLabel || "Đang phát"}: ${streamBadgeText.replace("Streaming:", "").replace("🟢", "").trim()} 🟢` : 
                             streamBadgeText
                         }
                       </span>
                    </p>
                  </div>
                </div>
              </div>

                {/* Cột Lớn: Terminal Queue */}
                <div className="lg:col-span-3 h-full rounded-2xl glass-panel border border-white/10 shadow-2xl flex flex-col relative z-10 overflow-hidden min-h-0">
                  <div className="border-b border-white/5 px-6 py-4 flex justify-between items-center bg-[#05050A]/80 flex-shrink-0">
                    <h2 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-widest flex items-center gap-2">
                       <Terminal className="w-4 h-4 text-cyan-400" /> {t.terminalQueueTitle || "Realtime Engine Terminal Queue"}
                    </h2>
                    <div className="flex items-center gap-2 relative">
                      <button 
                        onClick={() => setShowTtsVisualSettings(!showTtsVisualSettings)}
                        className={`p-1.5 rounded-full border transition-colors ${showTtsVisualSettings ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-500 hover:text-cyan-400'}`}
                        title="Tùy chỉnh hiển thị"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setShowLeaderboardDropdown(!showLeaderboardDropdown)}
                        className={`text-[10px] font-bold px-3 py-1 border rounded-full transition-colors flex items-center gap-1 uppercase ${
                          showLeaderboardDropdown 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                            : "bg-white/5 border-white/5 text-slate-500 hover:text-yellow-400"
                        }`}
                      >
                        <Shield className="w-3 h-3 text-yellow-500" /> {t.leaderboardTitle || "TOP ỦNG HỘ KÊNH"}
                      </button>

                      <button 
                        onClick={() => setTerminalLogs([])}
                        className="text-[10px] text-slate-500 hover:text-rose-400 font-bold px-3 py-1 bg-white/5 border border-white/5 rounded-full transition-colors flex items-center gap-1 uppercase"
                      >
                        <Trash2 className="w-3 h-3" /> {t.clearScreen || "Xóa màn hình"}
                      </button>

                      <AnimatePresence>
                        {showLeaderboardDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-72 bg-[#0A0A10] border border-yellow-500/30 shadow-2xl rounded-2xl p-4 z-50 flex flex-col gap-3 backdrop-blur-md"
                          >
                            <h3 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 border-b border-white/10 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                              🏆 {t.leaderboardTitle || "TOP ỦNG HỘ KÊNH"}
                            </h3>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                              {leaderboard && leaderboard.length > 0 ? (
                                leaderboard.map((user, idx) => (
                                   <div key={idx} className="flex justify-between items-center bg-[#030308]/90 p-2 rounded-xl border border-white/5 relative overflow-hidden group">
                                     {idx === 0 && <div className="absolute inset-0 bg-yellow-500/10 pointer-events-none group-hover:bg-yellow-500/20 transition-colors" />}
                                     <div className="flex items-center gap-2 z-10">
                                       <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                                         idx === 0 ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]" : 
                                         idx === 1 ? "bg-slate-300 text-black shadow-[0_0_8px_rgba(203,213,225,0.5)]" : 
                                         idx === 2 ? "bg-amber-700 text-white shadow-[0_0_8px_rgba(180,83,9,0.5)]" : 
                                         "bg-white/10 text-slate-300"
                                       }`}>
                                         {idx + 1}
                                       </span>
                                       <span className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{user.name}</span>
                                     </div>
                                     <span className="text-[10px] font-mono text-yellow-400 z-10 font-bold">{user.coins} 🪙</span>
                                   </div>
                                ))
                              ) : (
                                <div className="py-6 flex items-center justify-center text-slate-500 text-[10px] italic">
                                   {t.emptyBoard || "Chưa có thông tin..."}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {showTtsVisualSettings && config && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-[#0A0A10] border border-white/10 shadow-2xl rounded-xl p-4 z-50 flex flex-col gap-3"
                          >
                            <h3 className="text-xs font-bold text-cyan-400 border-b border-white/10 pb-2">TÙY CHỈNH MÀN HÌNH BÌNH LUẬN</h3>
                            
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Cỡ chữ bảng bình luận (px)</label>
                              <input type="number" min="10" max="30" value={config.ttsLogFontSize || 13} onChange={e => updateConfigValue({ ttsLogFontSize: parseInt(e.target.value) || 13 })} className="bg-[#030308] border border-white/10 rounded px-2 py-1 text-xs text-white" />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Màu chữ mặc định</label>
                              <input type="color" value={config.ttsLogFontColor || "#cbd5e1"} onChange={e => updateConfigValue({ ttsLogFontColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer rounded" />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Màu nền bảng chữ</label>
                              <input type="color" value={config.ttsLogBgColor || "#0f172a"} onChange={e => updateConfigValue({ ttsLogBgColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer rounded" />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Tốc độ đọc TTS</label>
                              <input type="range" min="0.5" max="2.0" step="0.1" value={config.ttsReadSpeed || 1.1} onChange={e => updateConfigValue({ ttsReadSpeed: parseFloat(e.target.value) })} className="accent-cyan-500" />
                              <div className="text-[9px] text-right text-cyan-400 font-mono">{config.ttsReadSpeed || 1.1}x</div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] text-slate-400 font-bold uppercase">Giới hạn số bình luận chờ đọc (Đỡ trễ)</label>
                              <input type="number" min="1" max="100" value={config.ttsQueueLimit || 50} onChange={e => updateConfigValue({ ttsQueueLimit: parseInt(e.target.value) || 50 })} className="bg-[#030308] border border-white/10 rounded px-2 py-1 text-xs text-white" />
                            </div>
                            
                            <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-3">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Gộp thả tim ({config.likeGroupingThreshold} tim / lần)</span>
                              <input type="number" min="1" max="1000" value={config.likeGroupingThreshold || 50} onChange={e => updateConfigValue({ likeGroupingThreshold: parseInt(e.target.value) || 50 })} className="bg-[#030308] w-16 border border-white/10 text-center rounded px-2 py-1 text-xs text-white" />
                            </div>
                            
                            <label className="flex items-center gap-2 mt-2">
                               <input type="checkbox" checked={config.autoReconnectStream ?? true} onChange={e => updateConfigValue({ autoReconnectStream: e.target.checked })} className="accent-cyan-500" />
                               <span className="text-[10px] text-slate-300">Tự động kết nối lại khi rớt mạng</span>
                            </label>
                            
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => updateConfigValue({ 
                                ttsLogFontSize: 13, ttsLogFontColor: "#cbd5e1", ttsLogBgColor: "#0f172a", ttsReadSpeed: 1.1, likeGroupingThreshold: 50
                              })} className="flex-1 text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 py-1.5 rounded font-bold transition-colors">
                                Mặc Định
                              </button>
                              <button onClick={() => setShowTtsVisualSettings(false)} className="flex-1 text-[10px] bg-white/10 hover:bg-white/20 py-1.5 rounded text-white font-bold transition-colors">Đóng</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div 
                    ref={terminalLogContainerRef}
                    className="flex-1 overflow-y-auto p-6 font-mono custom-scrollbar min-h-0"
                    style={{
                      backgroundColor: config?.ttsLogBgColor || "#0f172a",
                      fontSize: `${config?.ttsLogFontSize || 13}px`,
                      color: config?.ttsLogFontColor || "#cbd5e1"
                    }}
                  >
                    <div className="flex flex-col justify-start gap-2.5">
                      {terminalLogs.length === 0 ? (
                        <div className="py-6 flex flex-col items-center justify-center opacity-40">
                           <Terminal className="w-10 h-10 mb-2" />
                           <span className="text-slate-400 italic" style={{ fontSize: `${config?.ttsLogFontSize || 13}px` }}>{t.waitingComments || "Đang chờ người xem bình luận..."}</span>
                        </div>
                      ) : (
                        terminalLogs.map((log) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={log.id} 
                            className="flex gap-2 py-1 px-2 rounded hover:bg-white/5 transition-colors leading-relaxed tracking-wider border-l-2 border-white/5 font-mono"
                          >
                            <span className="text-slate-500/70 font-bold shrink-0">[{log.time}]</span>
                            <span className={`font-extrabold uppercase shrink-0 w-[85px] ${log.colorClass}`}>
                              {log.tag}
                            </span>
                            <span className="break-all pointer-events-none" style={{ color: config?.ttsLogFontColor || "#cbd5e1" }}>{log.message}</span>
                          </motion.div>
                        ))
                      )}
                      {/* Dòng ẩn ở cuối để scroll */}
                      <div ref={terminalLogsEndRef} className="h-1 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* =======================================================
            TAB 3: QUẢN LÝ MINIGAMES (4 Ô BẰNG NHAU)
            ======================================================= */}
        {activeTab === "games" && config && (
          <div className="flex flex-col gap-4 w-full mb-6">
              <div className="glass-panel rounded-xl p-4 shadow-xl space-y-4 animate-fade-in border border-white/10">
              <div className="border-b border-white/[0.05] pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2 uppercase tracking-wide">
                    <Gamepad2 className="w-4 h-4 text-amber-500" />
                    {t.minigamesHeader || "QUẢN LÝ MINIGAMES & HƯỚNG DẪN SỬ DỤNG"}
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-mono">
                    {t.minigamesDesc || "Kích hoạt luồng game và xem cấu trúc lệnh trên luồng Livestream."}
                  </p>
                </div>
                <div className="flex bg-[#030308]/60 p-1 rounded-lg border border-white/10 gap-1 absolute top-4 right-4 hidden lg:flex">
                  <a href="https://game.thuisoft.com" target="_blank" rel="noopener noreferrer" className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded text-[10px] font-bold font-mono transition-all flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {webLang === 'vi' ? 'LINK GAME THUI' : 'THUI GAME LINK'}
                  </a>
                </div>
              </div>

              <div className="bg-[#030308]/60 p-4 rounded-xl border border-white/5">
                 <h3 className="text-xs font-bold text-slate-200 mb-2 uppercase flex items-center gap-2 tracking-widest">
                   <Link2 className="w-4 h-4 text-emerald-400" />
                   {webLang === 'en' ? 'OBS BROWSER SOURCE LINK (FOR GAMING)' : webLang === 'zh' ? 'OBS 浏览器源链接 (用于游戏)' : 'LINK OBS BROWSER SOURCE (ĐỂ CHƠI GAME)'}
                 </h3>
                 <div className="flex items-center gap-2">
                   <input
                     type="text"
                     readOnly
                     value={window.location.origin + "/game"}
                     className="flex-1 bg-[#0f172a] text-emerald-400 font-mono text-[11px] p-2 rounded-lg border border-white/10 select-all"
                   />
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + "/game");
                        alert("Đã Copy Link OBS!");
                     }}
                     className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-4 py-2 font-bold text-[10px] rounded-lg transition-colors border border-emerald-500/30 whitespace-nowrap"
                   >
                     {webLang === 'en' ? 'COPY FOR OBS' : webLang === 'zh' ? '复制到 OBS' : 'COPY KHỚP OBS'}
                   </button>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2 italic font-mono">
                   {webLang === 'en' ? 'Note: Open OBS, add Browser Source, paste the link above with Width=1920 / Height=1080.' : webLang === 'zh' ? '注意：打开 OBS，添加浏览器源，粘贴上面的链接，宽度=1920 / 高度=1080。' : 'Lưu ý: Mở OBS, thêm Browser Source, dán link trên với Width=1920 / Height=1080.'}
                 </p>
              </div>

              {/* Bố cục 4 ô bằng nhau */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
                
                {/* Ô 1: Đấu Trường Sinh Tử */}
                <div className={`p-4 rounded-xl border flex flex-col transition-all duration-300 relative group h-full ${
                  config.gameBattleActive ? "bg-purple-900/10 border-purple-500/40" : "bg-[#030308]/40 border-white/5 hover:border-white/20"
                }`}>
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <h3 className="text-sm font-extrabold text-purple-400 uppercase flex items-center gap-2">
                       {webLang === 'en' ? '⚔️ Battle Royale' : webLang === 'zh' ? '⚔️ 大逃杀' : '⚔️ Đấu Trường Sinh Tử'}
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={config.gameBattleActive}
                      onChange={(e) => updateConfigValue({ gameBattleActive: e.target.checked })}
                      className="w-4 h-4 accent-purple-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {webLang === 'en' ? 'Keep viewers engaged with competitive survival. Last one standing wins.' : webLang === 'zh' ? '保持观众参与竞技生存游戏。战斗到最后的人获胜。' : 'Thu hút người xem ở lại live lâu hơn nhờ tính tranh đấu. Mô phỏng chiến đấu Battle Royale, loại trừ đến khi còn "Vua Nhân Phẩm".'}
                    </p>
                    <div className="bg-[#0f172a]/60 rounded-xl p-3 border border-white/5 space-y-2">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.cmdSyntax || "Cú pháp lệnh:"}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <code className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">!battle</code>
                         <span className="text-slate-500">-</span> {webLang === 'vi' ? 'Tham gia hàng chờ.' : 'Join queue.'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                     <span className="text-[10px] text-slate-500 font-mono italic">{webLang === 'vi' ? 'Mẹo: Hệ thống tự trích xuất người thắng cuộc cuối cùng.' : 'Tip: System auto extracts the final winner.'}</span>
                  </div>
                </div>

                {/* Ô 3: Đố Vui Trí Tuệ */}
                <div className={`p-4 rounded-xl border flex flex-col transition-all duration-300 relative group h-full ${
                  config.gameCauhoiActive ? "bg-pink-900/10 border-pink-500/40" : "bg-[#030308]/40 border-white/5 hover:border-white/20"
                }`}>
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <h3 className="text-sm font-extrabold text-pink-400 uppercase flex items-center gap-2">
                      {webLang === 'en' ? '💡 Smart Trivia Quiz' : webLang === 'zh' ? '💡 智力问答' : '💡 Đố Vui Trí Tuệ'}
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={config.gameCauhoiActive}
                      onChange={(e) => updateConfigValue({ gameCauhoiActive: e.target.checked })}
                      className="w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {webLang === 'en' ? 'Increase Retention Rate. Show questions, fastest correct answer gets points.' : webLang === 'zh' ? '提高留存率。显示问题，答对最快者得点。' : 'Tăng Retention Rate. Bung câu hỏi lên màn hình, người chat đúng đáp án nhanh nhất được cộng điểm.'}
                    </p>
                    <div className="bg-[#0f172a]/60 rounded-xl p-3 border border-white/5 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.cmdSyntax || "Cú pháp lệnh:"}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <code className="text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded">!cauhoi</code>
                        <span className="text-slate-500">-</span> {webLang === 'vi' ? 'Bot xuất ngân hàng câu hỏi.' : 'Bot asks questions.'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <code className="text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded">!topclover</code>
                        <span className="text-slate-500">-</span> {webLang === 'vi' ? 'Xem BXH học thức.' : 'View rankings.'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono italic">{webLang === 'vi' ? 'Mẹo: Hệ thống tự động vinh danh tag tên.' : 'Tip: System auto tags winners.'}</span>
                  </div>
                </div>

                {/* Ô 2: Nối Từ Tiếng Việt */}
                <div className={`p-4 rounded-xl border flex flex-col transition-all duration-300 relative group h-full ${
                  config.gameNoituActive ? "bg-cyan-900/10 border-cyan-500/40" : "bg-[#030308]/40 border-white/5 hover:border-white/20"
                }`}>
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <h3 className="text-sm font-extrabold text-cyan-400 uppercase flex items-center gap-2">
                      {webLang === 'en' ? '🔗 Word Chain' : webLang === 'zh' ? '🔗 词语接龙' : '🔗 Nối Từ Tiếng Việt'}
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={config.gameNoituActive}
                      onChange={(e) => updateConfigValue({ gameNoituActive: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {webLang === 'en' ? 'Stimulate the brain, force continuous chat chains. Must start with previous end letter.' : webLang === 'zh' ? '刺激大脑，强迫持续聊天保持连锁。必须以前一个末尾字母开头。' : 'Kích thích trí não, buộc người xem tập trung chat liên tục giữ chuỗi. Nối từ bắt đầu bằng chữ cuối của từ trước.'}
                    </p>
                    <div className="bg-[#0f172a]/60 rounded-xl p-3 border border-white/5 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.cmdSyntax || "Cú pháp lệnh:"}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <code className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">!noitu</code>
                        <span className="text-slate-500">-</span> {webLang === 'vi' ? 'Bắt đầu / Nối từ.' : 'Start / Link.'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1">
                        {webLang === 'vi' ? 'VD: "Học hành" -> "Hành quân"' : 'Ex: "Sun" -> "Night"'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono italic">{webLang === 'vi' ? 'Mẹo: Nối sai hoặc từ vô nghĩa sẽ bị loại!' : 'Tip: Wrong / invalid gets kicked!'}</span>
                  </div>
                </div>

                {/* Ô 4: Đào Kho Báu / Diệt Boss (Co-op RPG) */}
                <div className={`p-4 rounded-xl border flex flex-col transition-all duration-300 relative group h-full ${
                  config.gameCoopActive ? "bg-emerald-900/10 border-emerald-500/40" : "bg-[#030308]/40 border-white/5 hover:border-white/20"
                }`}>
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <h3 className="text-sm font-extrabold text-emerald-400 uppercase flex items-center gap-2">
                      {webLang === 'en' ? '🐲 Co-op RPG Boss Raid' : webLang === 'zh' ? '🐲 合作打Boss' : '🐲 Co-op RPG Đánh Boss'}
                    </h3>
                    <input 
                      type="checkbox" 
                      checked={config.gameCoopActive}
                      onChange={(e) => updateConfigValue({ gameCoopActive: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                      {t.coopGameDesc || "Game nhập vai mô phỏng văn minh. Tạo tinh thần đoàn kết dồn dame giết Boss ngàn máu chia bạc."}
                    </p>
                    <div className="bg-[#0f172a]/60 rounded-xl p-3 border border-white/5 space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.cmdSyntax || "Cú pháp lệnh:"}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
                        <code className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">!chem</code> / <code className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">!ban</code>
                        <span className="text-slate-500">-</span> {t.chemTip || "!chem / !ban / - Gây sát thương tích lũy. Mẹo: Phần thưởng chia đều theo %% sát thương!"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-1">
                        VD: "Học hành" {`->`} "Hành quân"
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono italic">Mẹo: Nối sai hoặc từ vô nghĩa sẽ bị loại!</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            TAB 2: CẤU HÌNH LÕI (4 CỘT)
            ======================================================= */}
        {activeTab === "settings" && config && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch w-full mb-6">
            
            {/* CỘT 1: CẤU HÌNH TỰ ĐỘNG (AUTO-REPLY) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col hover:border-purple-500/30 transition-colors h-full">
                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                  <h4 className="text-[11px] font-extrabold text-purple-400 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> KỊCH BẢN TỰ ĐỘNG
                  </h4>
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col">
                  
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t.autoReply}</label>
                    </div>
                    <textarea placeholder="!gia=Xem inbox nha" value={config.autoReplyRawScript} onChange={(e) => updateConfigValue({ autoReplyRawScript: e.target.value })} className="w-full flex-1 bg-[#030308]/60 border border-white/10 rounded-lg p-3 text-[11px] font-mono outline-none resize-none text-slate-300 focus:border-purple-500 transition-colors custom-scrollbar" />
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT 2: DỊCH THUẬT & ÂM THANH KẾT NỐI */}
            <div className="flex flex-col gap-4 h-full">
              {/* Dịch Thuật */}
              <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col hover:border-blue-500/30 transition-colors flex-[1.2]">
                <h4 className="text-[11px] font-extrabold text-blue-400 uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Globe className="w-4 h-4" /> {t.translateTitle}
                </h4>
                <div className="space-y-3 flex flex-col flex-1">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold mb-1.5 block">{t.translateSource}</label>
                    <select value={config.translateSource} onChange={(e) => updateConfigValue({ translateSource: e.target.value })} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-blue-500 transition-colors">
                      <option value="auto">🌍 Auto Detect</option>
                      <option value="vn">Tiếng Việt</option>
                      <option value="us">English</option>
                      <option value="cn">中文</option>
                      <option value="jp">日本語</option>
                      <option value="kr">한국어</option>
                      <option value="fr">Français</option>
                      <option value="es">Tiếng Tây Ban Nha</option>
                      <option value="de">Tiếng Đức</option>
                      <option value="ru">Tiếng Nga</option>
                      <option value="sa">Tiếng Ả Rập</option>
                      <option value="pt">Tiếng Bồ Đào Nha</option>
                      <option value="it">Tiếng Ý</option>
                      <option value="th">Tiếng Thái</option>
                      <option value="kh">Tiếng Khmer</option>
                      <option value="la">Tiếng Lào</option>
                      <option value="mm">Tiếng Miến Điện</option>
                      <option value="id">Tiếng Indonesia</option>
                      <option value="my">Tiếng Mã Lai</option>
                      <option value="ph">Tiếng Tagalog</option>
                      <option value="tr">Tiếng Thổ Nhĩ Kỳ</option>
                      <option value="nl">Tiếng Hà Lan</option>
                      <option value="pl">Tiếng Ba Lan</option>
                      <option value="hi">Tiếng Hindi</option>
                      <option value="gr">Tiếng Hy Lạp</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold mb-1.5 block">{t.translateTarget}</label>
                    <select value={config.translateTarget} onChange={(e) => updateConfigValue({ translateTarget: e.target.value })} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-blue-500 transition-colors">
                      <option value="vn">Tiếng Việt</option>
                      <option value="us">English</option>
                      <option value="cn">中文</option>
                      <option value="jp">日本語</option>
                      <option value="kr">한국어</option>
                      <option value="fr">Français</option>
                      <option value="es">Tiếng Tây Ban Nha</option>
                      <option value="de">Tiếng Đức</option>
                      <option value="ru">Tiếng Nga</option>
                      <option value="sa">Tiếng Ả Rập</option>
                      <option value="pt">Tiếng Bồ Đào Nha</option>
                      <option value="it">Tiếng Ý</option>
                      <option value="th">Tiếng Thái</option>
                      <option value="kh">Tiếng Khmer</option>
                      <option value="la">Tiếng Lào</option>
                      <option value="mm">Tiếng Miến Điện</option>
                      <option value="id">Tiếng Indonesia</option>
                      <option value="my">Tiếng Mã Lai</option>
                      <option value="ph">Tiếng Tagalog</option>
                      <option value="tr">Tiếng Thổ Nhĩ Kỳ</option>
                      <option value="nl">Tiếng Hà Lan</option>
                      <option value="pl">Tiếng Ba Lan</option>
                      <option value="hi">Tiếng Hindi</option>
                      <option value="gr">Tiếng Hy Lạp</option>
                    </select>
                  </div>
                  <label className="mt-auto flex items-center justify-between p-2.5 bg-[#030308]/60 border border-white/5 rounded-lg cursor-pointer hover:border-blue-500/30 transition-colors">
                    <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">AUTO TRANSLATE</span>
                    <input type="checkbox" checked={config.translateActive} onChange={(e) => updateConfigValue({ translateActive: e.target.checked })} className="w-4 h-4 accent-blue-500 rounded" />
                  </label>
                </div>
              </div>

              {/* Âm Thanh Băng Thông (TTS) */}
              <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col hover:border-fuchsia-500/30 transition-colors flex-1">
                <h4 className="text-[11px] font-extrabold text-fuchsia-400 uppercase mb-3 flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="flex items-center gap-2"><Mic className="w-4 h-4" /> {t.ttsTitle}</span>
                  <input type="checkbox" checked={config.ttsActive} onChange={(e) => updateConfigValue({ ttsActive: e.target.checked })} className="w-3.5 h-3.5 accent-fuchsia-500 rounded cursor-pointer" />
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold mb-1.5 block">{t.ttsEngineLabel || "TTS Engine:"}</label>
                    <select value={config.ttsEngine} onChange={(e) => updateConfigValue({ ttsEngine: e.target.value })} className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-emerald-400 font-bold outline-none cursor-pointer">
                      <option value="browser">Browser Speech Synthesis (Local)</option>
                      <option value="google">Google Translate TTS (Free)</option>
                      <option value="fpt">FPT.AI Speech Engine (Premium)</option>
                      <option value="zalo">Zalo Ai Speech Engine (Premium)</option>
                      <option value="azure">Microsoft Azure Cognitive (Premium)</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex justify-between items-center bg-[#030308]/60 p-1.5 rounded-lg border border-white/10">
                      <span className="text-[9px] text-slate-300 font-bold uppercase">{t.bgColorText || "Màu Bg:"}</span>
                      <input type="color" value={config.uiBgColor || "#000000"} onChange={(e) => updateConfigValue({ uiBgColor: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-none bg-transparent" />
                    </div>
                    <div className="flex-1 flex justify-between items-center bg-[#030308]/60 p-1.5 rounded-lg border border-white/10">
                      <span className="text-[9px] text-slate-300 font-bold uppercase">{t.textColorText || "Màu Chữ:"}</span>
                      <input type="color" value={config.uiTextColor || "#ffffff"} onChange={(e) => updateConfigValue({ uiTextColor: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-none bg-transparent" />
                    </div>
                  </div>

                {/* ĐIỀU CHỈNH KÍCH THƯỚC CHỮ WEB */}
                <div className="bg-[#030308]/60 p-2.5 rounded-xl border border-white/10 space-y-1.5 mt-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-300">
                    <span>CỠ CHỮ THEO TỶ LỆ (ZOOM):</span>
                    <span className="text-emerald-400 font-mono font-black">{webTextScale}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={150}
                    step={5}
                    value={webTextScale}
                    onChange={(e) => setWebTextScale(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-slate-900"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>70% (Nhỏ)</span>
                    <span>100% (Chuẩn)</span>
                    <span>150% (To)</span>
                  </div>
                </div>

                {/* Phần Cấu Hình Cho Bảng Bình Luận TTS */}
                 {/* Ngôn ngữ Web */}
                 <h5 className="text-[10px] font-bold text-amber-400 border-t border-white/5 pt-2 mt-2 uppercase tracking-wider">
                   {webLang === 'en' ? 'Select Web Language' : webLang === 'zh' ? '选择网页语言' : 'Chọn Ngôn Ngữ Web'}
                 </h5>
                 <div className="grid grid-cols-3 gap-2">
                   <button 
                     onClick={() => handleLangChange("vi")}
                     className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all ${webLang === "vi" ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-[#030308]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                   >
                     <span className="text-lg">🇻🇳</span>
                     <span className="mt-1 font-sans">Tiếng Việt</span>
                   </button>
                   <button 
                     onClick={() => handleLangChange("en")}
                     className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all ${webLang === "en" ? "bg-[#6366f1]/20 border-[#6366f1] text-[#6366f1]" : "bg-[#030308]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                   >
                     <span className="text-lg">🇺🇸</span>
                     <span className="mt-1 font-sans">English</span>
                   </button>
                   <button 
                     onClick={() => handleLangChange("zh")}
                     className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all ${webLang === "zh" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-[#030308]/60 border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                   >
                     <span className="text-lg">🇨🇳</span>
                     <span className="mt-1 font-sans">中文</span>
                   </button>
                 </div>
                
                <button 
                  onClick={() => updateConfigValue({ 
                    uiTheme: "dark", uiBgColor: "#030308", uiTextColor: "#ffffff",
                    ttsLogFontSize: 13, ttsLogFontColor: "#cbd5e1", ttsLogBgColor: "#0f172a", ttsReadSpeed: 1.1, likeGroupingThreshold: 50
                  })}
                  className="w-full bg-[#030308]/60 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 p-1.5 rounded-lg text-[9px] font-bold uppercase transition-colors"
                >
                  {t.resetColors || "Khôi Phục Màu & Style Gốc"}
                </button>
              </div>
            </div>
            </div>

            {/* CỘT 3: GIAO DIỆN & TÙY CHỈNH */}
            <div className="flex flex-col gap-4 h-full">
              <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col hover:border-emerald-500/30 transition-colors flex-1">
                <h4 className="text-[11px] font-extrabold text-emerald-400 uppercase mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Palette className="w-4 h-4 text-emerald-400" /> {webLang === 'en' ? '🎨 Custom UI & Theme' : webLang === 'zh' ? '🎨 自定义界面与主题' : '🎨 GIAO DIỆN & TÙY CHỈNH'}
                </h4>
                
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Preset Themes */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {webLang === 'en' ? 'Quick Preset Themes:' : webLang === 'zh' ? '快速预设主题:' : 'CHỦ ĐỀ PRESET NHANH:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => updateConfigValue({ 
                          uiTextColor: "#06b6d4", 
                          uiBgColor: "#050e14",
                          ttsLogFontColor: "#22d3ee",
                          ttsLogBgColor: "#01070a"
                        })}
                        className="bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 p-2 rounded-lg text-[9px] font-bold text-cyan-400 transition-colors flex flex-col items-center gap-1 uppercase"
                      >
                        <span className="text-sm">🌌</span> Cyber Neon
                      </button>
                      <button 
                        onClick={() => updateConfigValue({ 
                          uiTextColor: "#e11d48", 
                          uiBgColor: "#140509",
                          ttsLogFontColor: "#fb7185",
                          ttsLogBgColor: "#080103"
                        })}
                        className="bg-rose-950/40 border border-rose-500/30 hover:border-rose-400 p-2 rounded-lg text-[9px] font-bold text-rose-400 transition-colors flex flex-col items-center gap-1 uppercase"
                      >
                        <span className="text-sm">🌹</span> Vampire Cyber
                      </button>
                      <button 
                        onClick={() => updateConfigValue({ 
                          uiTextColor: "#f59e0b", 
                          uiBgColor: "#140e05",
                          ttsLogFontColor: "#fbbf24",
                          ttsLogBgColor: "#080501"
                        })}
                        className="bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 p-2 rounded-lg text-[9px] font-bold text-amber-400 transition-colors flex flex-col items-center gap-1 uppercase"
                      >
                        <span className="text-sm">👑</span> Zen Golden
                      </button>
                      <button 
                        onClick={() => updateConfigValue({ 
                          uiTextColor: "#a855f7", 
                          uiBgColor: "#0f0514",
                          ttsLogFontColor: "#c084fc",
                          ttsLogBgColor: "#06010a"
                        })}
                        className="bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 p-2 rounded-lg text-[9px] font-bold text-purple-400 transition-colors flex flex-col items-center gap-1 uppercase"
                      >
                        <span className="text-sm">🔮</span> Deep Amethyst
                      </button>
                    </div>
                  </div>

                  {/* Font Customization */}
                  <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {webLang === 'en' ? 'Primary Robot Font:' : 'PHÔNG CHỮ ROBOT CHÍNH:'}
                      </label>
                    <select 
                      value={config.uiFontFamily || "Inter"} 
                      onChange={(e) => updateConfigValue({ uiFontFamily: e.target.value })} 
                      className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <option value="Inter">Standard Sans (Inter)</option>
                      <option value="Space Grotesk">Tech Modern (Space Grotesk)</option>
                      <option value="JetBrains Mono">Terminal Code (JetBrains Mono)</option>
                      <option value="Playfair Display">Editorial Serif (Playfair Display)</option>
                    </select>
                  </div>

                  {/* Font Size for Streamer Dashboard Console */}
                  <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {webLang === 'en' ? 'Comment Queue Font Size (px):' : 'CỚ CHỮ HÀNG QUEUE BÌNH LUẬN (PX):'}
                      </label>
                    <div className="flex items-center gap-3 bg-[#030308]/60 p-2 rounded-lg border border-white/10">
                      <input 
                        type="range" 
                        min="10" 
                        max="24" 
                        value={config.ttsLogFontSize || 13} 
                        onChange={(e) => updateConfigValue({ ttsLogFontSize: parseInt(e.target.value) || 13 })} 
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-emerald-400 w-8 text-center shrink-0">{config.ttsLogFontSize || 13}px</span>
                    </div>
                  </div>

                  {/* UI Customization Option Toggles */}
                  <div className="space-y-2 mt-2 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        TÙY CHỌN HIỆU ỨNG:
                      </label>
                    <div className="space-y-2 bg-[#030308]/60 p-2.5 rounded-lg border border-white/10">
                      <label className="flex justify-between items-center cursor-pointer group">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                          {webLang === 'en' ? 'Show Sparkles Robot' : 'Hiển thị Sparkles Robot'}
                        </span>
                        <input 
                          type="checkbox" 
                          checked={config.uiShowSparkles !== false} 
                          onChange={(e) => updateConfigValue({ uiShowSparkles: e.target.checked })} 
                          className="w-3.5 h-3.5 accent-emerald-500 rounded" 
                        />
                      </label>
                      <label className="flex justify-between items-center cursor-pointer group">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wide group-hover:text-white transition-colors">Làm mờ nền Glassmorphism</span>
                        <input 
                          type="checkbox" 
                          checked={config.uiGlassmorphismBlur !== false} 
                          onChange={(e) => updateConfigValue({ uiGlassmorphismBlur: e.target.checked })} 
                          className="w-3.5 h-3.5 accent-emerald-500 rounded" 
                        />
                      </label>
                      <label className="flex justify-between items-center cursor-pointer group">
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                          Chữ In Hoa Toàn Diện
                        </span>
                        <input 
                          type="checkbox" 
                          checked={config.uiUppercaseAll === true} 
                          onChange={(e) => updateConfigValue({ uiUppercaseAll: e.target.checked })} 
                          className="w-3.5 h-3.5 accent-emerald-500 rounded" 
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-white/5 pt-3 text-left">
                    <p className="text-[9px] text-slate-500 italic leading-relaxed">
                      * Các thay đổi về giao diện sẽ được áp đặt ngay lập tức trên luồng Stream OBS Preview và tất cả các thiết bị kết nối.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT 4: KỊCH BẢN SỰ KIỆN PHÒNG LIVE */}
            <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col hover:border-indigo-500/30 transition-colors h-full max-h-[800px] text-left">
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <h4 className="text-[11px] font-extrabold text-indigo-400 uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4" /> {t.eventsTitle || "Khung Sự Kiện"}
                </h4>
              </div>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {[
                  { label: "Chào người mới vào", active: config.welcomeActive, toggle: "welcomeActive", text: config.welcomeTemplates, textKey: "welcomeTemplates", cd: config.welcomeCooldown },
                  { label: "Cảm ơn Follow", active: config.followActive, toggle: "followActive", text: config.followTemplates, textKey: "followTemplates", cd: config.followCooldown },
                  { label: "Cảm ơn Thả Tim", active: config.likeActive, toggle: "likeActive", text: config.likeTemplates, textKey: "likeTemplates", cd: config.likeCooldown },
                  { label: "Cảm ơn Tặng Quà", active: config.giftActive, toggle: "giftActive", text: config.giftTemplates, textKey: "giftTemplates", cd: config.giftCooldown }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#030308]/60 rounded-xl border border-white/5 overflow-hidden shrink-0 flex flex-col">
                    <div className="p-2.5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <label className="flex items-center gap-2 cursor-pointer filter hover:brightness-125 transition-all">
                        <input type="checkbox" checked={item.active} onChange={(e) => updateConfigValue({ [item.toggle]: e.target.checked })} className="w-3.5 h-3.5 accent-indigo-500 rounded" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{item.label}</span>
                      </label>
                      <div className="flex items-center gap-1 bg-[#0f172a] px-2 py-0.5 rounded border border-white/10">
                        <span className="text-[9px] text-fuchsia-400 font-mono">CD: {item.cd}s</span>
                      </div>
                    </div>
                    <textarea 
                      value={item.text}
                      onChange={(e) => updateConfigValue({ [item.textKey]: e.target.value })}
                      className="w-full bg-transparent p-2.5 text-[10px] text-slate-300 font-mono outline-none resize-none h-[64px] custom-scrollbar focus:bg-white/[0.01] transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 2.3: TRỢ LÝ AI ASSISTANT (ROBOT BRAIN)
            ======================================================= */}
        {activeTab === "ai_config" && config && (
          <div className="space-y-6 w-full mb-6 p-1 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-2">
              <div className="flex flex-col text-left">
                <h2 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 flex items-center gap-2 tracking-wide uppercase">
                  <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
                  {webLang === 'en' ? 'INTELLECTUAL AI SYSTEM' : 'CẤU HÌNH TRỢ LÝ TRÍ TUỆ AI (ROBOT BRAIN)'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 pb-1">
                  {webLang === 'en' ? 'Manage OpenAI & Gemini core API keys, and custom roleplay guidelines.' : 'Thiết lập khoá kết nối OpenAI & Gemini, tuỳ chỉnh phong cách xưng hô bóng bẩy, bẻ cong tính cách lém lỉnh, ngọt ngào.'}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#030308]/60 px-4 py-2 border border-white/10 rounded-xl">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                  {webLang === 'en' ? 'ACTIVATE AI ROBOT:' : 'KÍCH HOẠT ROBOT AI:'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.aiActive} 
                    onChange={(e) => updateConfigValue({ aiActive: e.target.checked })} 
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500"></div>
                </label>
              </div>
            </div>

            <ProFeatureOverlay active={!isPro}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch w-full mb-6">
                
                {/* COL 1: LIÊN KẾT KEY API & CHỌN VIBE */}
                <div className="flex flex-col gap-5 h-full">
                <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col hover:border-purple-500/30 transition-all bg-[#030308]/40 flex-1">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
                      <h4 className="text-[12px] font-extrabold text-purple-400 uppercase flex items-center gap-1.5">
                        <Key className="w-4 h-4 text-purple-400" />
                        {webLang === 'en' ? 'AI CREDENTIALS & VIBES' : 'ĐỊNH DANH API & VIBE BẢN SẮC'}
                      </h4>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">OpenAI Token Key</label>
                      <div className="relative">
                        <input 
                          type={showOpenaiKey ? "text" : "password"} 
                          value={config.openaiKey || ""} 
                          onChange={(e) => updateConfigValue({ openaiKey: e.target.value })} 
                          placeholder="sk-..." 
                          className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2.5 text-[11px] font-mono text-slate-300 outline-none focus:border-purple-500 transition-colors" 
                        />
                        <button type="button" onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-3.5 -translate-y-1/2 text-slate-500 hover:text-white">
                          {showOpenaiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gemini Core Key</label>
                      <div className="relative">
                        <input 
                          type={showGeminiKey ? "text" : "password"} 
                          value={config.geminiKey || ""} 
                          onChange={(e) => updateConfigValue({ geminiKey: e.target.value })} 
                          placeholder="AIza..." 
                          className="w-full bg-[#030308]/60 border border-white/10 rounded-lg px-3 py-2.5 text-[11px] font-mono text-slate-300 outline-none focus:border-purple-500 transition-colors" 
                        />
                        <button type="button" onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-3.5 -translate-y-1/2 text-slate-500 hover:text-white">
                          {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex justify-between items-center bg-[#030308]/60 p-2.5 rounded-lg border border-white/5 mt-1">
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                         {webLang === 'en' ? 'API Status:' : 'Trạng thái API:'}
                       </span>
                       <button onClick={handleCheckAIKey} className="px-3 py-1.5 bg-gradient-to-r from-purple-600/50 to-cyan-500/50 hover:from-purple-500 hover:to-cyan-400 border border-purple-500/30 font-bold text-[9px] text-white rounded transition uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                         <RefreshCw className="w-3 h-3" /> {t.checkKey || "Kiểm tra Key"}
                       </button>
                    </div>

                    <div className="space-y-1.5 text-left pt-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        🎭 Sắc Thái & Vibe Bản Thân (Flirt Vibe):
                      </label>
                      <select 
                        value={config.aiFlirtVibe || "ngọt ngào"} 
                        onChange={(e) => updateConfigValue({ aiFlirtVibe: e.target.value })}
                        className="w-full bg-[#030308]/80 text-emerald-400 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold outline-none cursor-pointer focus:border-purple-500 transition-colors text-left font-sans"
                      >
                        <option value="ngọt ngào">🍭 {webLang === 'en' ? 'Sweet, caring and spoiled style' : 'Ngọt ngào, nũng nịu cưng chiều'}</option>
                        <option value="lầy lội">🤪 {webLang === 'en' ? 'Trollish, salty, extremely funny' : 'Lầy lội, có muối, siêu hài hước'}</option>
                        <option value="sắc sảo">💅 {webLang === 'en' ? 'Sassy, sharp, fierce clapbacks' : 'Đanh đá, sắc bén, đáp trả cực gắt'}</option>
                        <option value="thi sỹ">🌸 {webLang === 'en' ? 'Poetic soul who loves writing rhymes' : 'Nhã nhặn, chất thi sỹ thích thả thơ'}</option>
                        <option value="chất chơi">🎧 {webLang === 'en' ? 'Swag, trendy, stylish gamer vibe' : 'Dân chơi, swag cá tính sành điệu'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#12071f]/60 p-3 rounded-xl border border-purple-500/10 text-[10px] font-sans text-purple-300 leading-relaxed mt-4 text-left">
                    🌟 {webLang === 'en' 
                      ? 'Note: Selecting any specific Flirt Vibe will instruct the AI to process every dialogue tone precisely in that aesthetic manner.'
                      : 'Mẹo: Mỗi lựa chọn Vibe sẽ trực tiếp bẻ cong toàn bộ suy nghĩ và cấu trúc phản hồi của AI Streamer theo đúng phong cách đó.'}
                  </div>
                </div>

                {/* CARD 2: KỊCH BẢN TÍNH CÁCH (Core Persona Prompt) */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col hover:border-indigo-500/30 transition-all bg-[#030308]/40 flex-1">
                  <div className="space-y-4 flex-1 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
                      <h4 className="text-[12px] font-extrabold text-indigo-400 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        {webLang === 'en' ? 'CORE PERSONA PROMPT' : '🧠 KỊCH BẢN CHỈ DẪN BAN SƠ'}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">Gemini Intellect Ready</span>
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col h-full text-left">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t.aiPrompt}</label>
                      <textarea 
                        value={config.aiPrompt} 
                        onChange={(e) => updateConfigValue({ aiPrompt: e.target.value })} 
                        placeholder="Chỉ dẫn phong cách nói chuyện của bạn ví dụ: Xưng em gọi các anh cưng chiều, thích nói lái gieo vần lém lỉnh..." 
                        className="w-full flex-1 bg-[#030308]/60 border border-white/10 rounded-lg p-3 text-[11px] font-mono text-slate-300 outline-none resize-none focus:border-indigo-500 transition-colors custom-scrollbar leading-relaxed min-h-[140px]" 
                      />
                    </div>
                  </div>

                  <div className="bg-[#0b172a]/60 p-3 rounded-xl border border-white/5 text-[10px] text-slate-400 leading-relaxed mt-4 text-left">
                    💡 {webLang === 'en' 
                      ? 'Provide a concise guide detailing names, age, speech patterns, and catchphrases to make the AI genuinely unique.'
                      : 'Hãy viết chi tiết về tuổi tác, biệt danh, sở ghét, cách bày tỏ tình cảm để robot live mượt mà và thông minh hơn, hạn chế các câu từ chung chung.'}
                  </div>
                </div>
              </div>

              {/* COL 2: PHÒNG THỦ & LÁCH LUẬT LIVE */}
              <div className="flex flex-col h-full">
                <div className="space-y-5 flex flex-col bg-[#030308]/40 rounded-2xl p-5 border border-white/5 relative text-left h-full">
                  <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
                    <h4 className="text-[12px] font-extrabold text-red-400 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      {webLang === 'en' ? 'SAFE COMPLIANCE MODE' : '🛡️ PHÒNG THỦ & LÁCH LUẬT LIVE'}
                    </h4>
                    <span className="px-1.5 py-0.5 text-[8px] bg-red-500/20 text-red-300 rounded font-mono font-bold uppercase">SAFE_ENG</span>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="bg-[#030308]/60 rounded-xl p-3 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                          LÁCH QUÉT / BỌC CHỮ NHẠY CẢM AI
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={!!config.antiScanEvasionActive} 
                            onChange={(e) => updateConfigValue({ antiScanEvasionActive: e.target.checked })} 
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                        Khi luồng chat xuất hiện từ ngữ nằm trong vùng xám nhạy cảm, AI sẽ tự trò chuyện lảng tránh lém lỉnh, đánh lạc hướng bot quét kiểm duyệt của nền tảng phát sóng để giữ căn phòng luôn an toàn.
                      </p>
                    </div>

                    <div className="bg-[#1c0a0f]/60 rounded-xl p-3.5 border border-red-500/10 text-[10px] text-red-300 leading-relaxed space-y-2 mt-4">
                      <span className="font-extrabold block">⚠️ LƯU Ý KHI SETUP:</span>
                      <span>Hãy cài đặt thêm Bộ Lọc Key Blacklist trong Tab 'Bộ Lọc Security' để các từ khoá bậy bạ hoặc vi phạm pháp luật bị huỷ chặn tận rễ ngay lập tức trước khi bot AI đọc được.</span>
                    </div>
                  </div>

                  <div className="bg-[#030308]/60 p-3 rounded-xl border border-white/5 text-[9px] text-slate-500 italic text-left leading-relaxed mt-4 mt-auto">
                    * Hệ thống phòng thủ an toàn liên tục đồng bộ với các thuật toán quét OCR và âm thanh mới nhất của TikTok Live Việt Nam.
                  </div>
                </div>
              </div>

              {/* COL 3: TƯƠNG TÁC AI THỜI GIAN THỰC (PRO) */}
              <div className="flex flex-col h-full">
                <div className="space-y-5 flex flex-col h-full bg-[#030308]/40 border border-white/5 rounded-2xl relative text-left">
                  <div className="glass-panel p-5 rounded-2xl border border-sky-500/15 shadow-[0_0_20px_rgba(14,165,233,0.02)] flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2.5">
                        <h4 className="text-[13px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 uppercase flex items-center gap-2">
                          <Zap className="w-4 h-4 text-sky-400 animate-pulse" /> 
                          {webLang === 'en' ? 'AI INTERACTIVE SUITE' : 'TƯƠNG TÁC AI THỰC (PRO)'}
                        </h4>
                        <span className="px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded font-mono font-bold tracking-widest uppercase">PRO ONLY</span>
                      </div>

                      <p className="text-[12px] text-slate-300 font-sans leading-relaxed mb-4">
                        Các tính năng nâng cao độc quyền của gói PRO bao gồm tự động trò chuyện & thả thính, tự gợi ý chào mừng nịnh fan, đánh thức phòng live khi im lặng và thuyết minh minigames tự động thông minh.
                      </p>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="text-sky-400 font-extrabold">★</span> <span>{webLang === 'en' ? 'Auto Chat & Live Flirt' : 'Tự Động Trò Chuyện & Thả Thính AI'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-sky-400 font-extrabold">★</span> <span>{webLang === 'en' ? 'Auto Wakeup / Quiet Room' : 'Đánh Thức Phòng Live khi Khán Giả Im Lặng'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span className="text-sky-400 font-extrabold">★</span> <span>{webLang === 'en' ? 'Real-time Game Commentaries' : 'Thuyết Minh Trực Tiếp Minigame Tik Tok'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0b172a]/80 p-3 rounded-xl border border-sky-500/15 text-center mt-6">
                      <span className="text-[11px] font-extrabold text-sky-400 uppercase">🔒 TÍNH NĂNG KHÓA BẢN PRO</span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Hãy kích hoạt mã bản quyền PRO tại mục 'Thông Tin Cá Nhân' để mở khóa toàn bộ bảng kết nối tương tác robot này.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            </ProFeatureOverlay>
          </div>
        )}

        {/* =======================================================
            TAB 2.5: SIÊU CẤU HÌNH VOCAL & AUDIO MIXER
            ======================================================= */}
        {activeTab === "studio_mixer" && config && (
          <div className="space-y-6 w-full mb-6 p-1">
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4 mb-2">
              <h2 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 flex items-center gap-2 tracking-wide text-left uppercase">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                {webLang === 'en' ? 'AUDIO STUDIO & VOCAL MIXER' : webLang === 'zh' ? '音频演播室与调音台' : 'BỘ MIXER VOCAL & CONFIG STUDIO'}
              </h2>
              <p className="text-[11px] text-slate-400 text-left">
                {webLang === 'en' ? 'Fine-tune live stream acoustics, vocal compressors, and virtual sound card.' : webLang === 'zh' ? '微调直播声学、人声压限以及声卡排线。' : 'Hiệu chuẩn âm sắc phòng thu, bộ nén Vocal Compressor và thiết lập kết nối Audio.'}
              </p>
            </div>

            <ProFeatureOverlay active={!isPro}>
              <div className="w-full items-stretch">
                <div className="flex flex-col h-full space-y-4">
                  <VocalProcessor onVolumeChange={setVocalGain} onReverbChange={setReverbLevel} webLang={webLang} t={t} isPro={isPro} />
                </div>
              </div>
            </ProFeatureOverlay>
          </div>
        )}

        {activeTab === "guide" && config && (
          <div className="h-full w-full pb-10">
            <UserGuide webLang={webLang} />
          </div>
        )}

        {activeTab === "blacklist" && config && (
          <div className="h-full">
            <SecurityFilters 
              config={config} 
              updateConfigValue={updateConfigValue} 
              showBannedKeywords={showBannedKeywords} 
              setShowBannedKeywords={setShowBannedKeywords} 
              t={t}
            />
          </div>
        )}

        {/* =======================================================
            TAB 4: ÂM THANH & MEDIA
            ======================================================= */}
        {activeTab === "media" && config && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-full items-stretch">
            {/* Cột 1: Cấu Hình */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-violet-500/30 transition-all">
              <h4 className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase mb-3 flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Settings2 className="w-4 h-4 text-violet-400" /> {t.systemAudioTitle || "Hệ Thống Phát Audio"}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block flex justify-between">
                    <span>{t.obsVol || "Âm lượng OBS Game:"}</span>
                    <span className="text-violet-400 font-bold">100%</span>
                  </label>
                  <input type="range" className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block flex justify-between">
                    <span>{t.ttsVol || "Âm lượng TTS AI:"}</span>
                    <span className="text-violet-400 font-bold">85%</span>
                  </label>
                  <input type="range" className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500" defaultValue="85" />
                </div>
                <div className="bg-[#030308]/60 p-3 rounded-xl border border-white/5 flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.autoPlay || "Auto Play Nhạc Nền"}</span>
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 accent-violet-500" defaultChecked />
                </div>
              </div>
            </div>

            {/* Cột 2 & 3: Soundpad Meme */}
            <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-[#ffffff]/10 hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" /> {t.soundpadTitle || "Bảng Soundpad Meme"} 
                </h4>
                <div className="flex gap-2 relative items-center">
                  <input type="file" accept="audio/*" ref={fileInputRefMeme} onChange={handleMemeUpload} className="hidden" />
                  {currentMemeAudio && (
                    <button 
                      onClick={stopMeme} 
                      className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold transition-colors animate-pulse"
                    >
                      ⏹ {webLang === "vi" ? "DỪNG MEME" : "STOP MEME"}
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (!isPro) {
                        setShowProUpgradeModal(true);
                        return;
                      }
                      fileInputRefMeme.current?.click();
                    }} 
                    className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/40 rounded-lg text-[10px] font-bold text-emerald-300 transition-colors uppercase cursor-pointer"
                  >
                    {t.addMp3 || "+ Thêm MP3"} {!isPro && "🔒"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {memeList.map((meme, i) => (
                    <button key={i} onClick={() => handlePlayMeme(meme.name, meme.url, meme.isText, meme.data)} className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 hover:border-emerald-500/50 hover:from-[#1e293b] rounded-xl p-2.5 text-center transition-all group flex flex-col items-center justify-center gap-2 active:scale-95 shadow-lg relative" title={meme.name}>
                      {isPro && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => deleteMeme(i, e)}>
                          <X className="w-3.5 h-3.5 text-rose-400 hover:text-rose-500 bg-black/50 rounded-full p-0.5" />
                        </div>
                      )}
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <span className="text-emerald-400 text-[10px] font-bold">▶</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider break-all">{meme.name}</span>
                    </button>
                 ))}
              </div>
            </div>

            {/* Cột 4: Playlist Nhạc Trẻ */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-rose-500/30 transition-all h-full">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-rose-400" /> {t.bgmTitle || "Nhạc Nền Stream BGM"}
                </h4>
                <div className="flex gap-2">
                  <input type="file" accept="audio/*" ref={fileInputRefBgm} onChange={handleBgmUpload} className="hidden" />
                  <button 
                    onClick={() => {
                      if (!isPro) {
                        setShowProUpgradeModal(true);
                        return;
                      }
                      fileInputRefBgm.current?.click();
                    }} 
                    className="px-2.5 py-1 bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-emerald-500/40 rounded-lg text-[10px] font-bold text-emerald-300 transition-colors cursor-pointer" 
                    title={webLang==='vi'?"Thêm MP3 Server/Local":"Add MP3 Server/Local"}
                  >
                    + {!isPro && "🔒"}
                  </button>
                  {currentBgm && <button onClick={stopBGM} className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-400 rounded-lg text-[10px] font-bold transition-colors">{t.stopBgm || "Dừng Phát"}</button>}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-0">
                {bgmList.map((track, i) => (
                  <div key={i} onClick={() => handlePlayBGM(track.name, track.url)} className={`flex items-center justify-between p-2.5 hover:bg-rose-500/10 border ${currentBgm && currentBgm.src === track.url ? "bg-rose-500/20 border-rose-500/50" : "bg-[#030308]/60 border-white/5"} rounded-lg cursor-pointer transition-colors group relative`}>
                    <span className={`text-[9px] font-mono flex-1 whitespace-nowrap overflow-hidden text-ellipsis transition-colors uppercase tracking-widest ${currentBgm && currentBgm.src === track.url ? "text-rose-400" : "text-fuchsia-300 group-hover:text-rose-400"}`}>{track.name}</span>
                    <div className="flex items-center gap-2 z-10">
                      <button className={`${currentBgm && currentBgm.src === track.url ? "text-rose-400 animate-pulse" : "text-slate-500 group-hover:text-rose-400"} px-2 transition-colors`}>{currentBgm && currentBgm.src === track.url ? '⏸' : '▶'}</button>
                      {isPro && (
                        <button className="text-rose-400/50 hover:text-rose-500 transition-colors" onClick={(e) => deleteBgm(i, e)}><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột 5: Playlist Nhạc Tặng Quà */}
            <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-amber-500/30 transition-all h-full relative font-sans">
              <div className="flex flex-col gap-2 border-b border-white/5 pb-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 uppercase flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" /> {t.giftMusicTitle || "Tự Phát Quà VIP"}
                  </h4>
                  <div className="flex gap-2">
                    <input type="file" accept="audio/*" ref={fileInputRefGiftMusic} onChange={handleGiftMusicUpload} className="hidden" />
                    <button 
                      onClick={() => {
                        if (!isPro) {
                          setShowProUpgradeModal(true);
                          return;
                        }
                        fileInputRefGiftMusic.current?.click();
                      }} 
                      className="px-2.5 py-1 bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-emerald-500/40 rounded-lg text-[10px] font-bold text-emerald-300 transition-colors cursor-pointer"
                    >
                      + {!isPro && "🔒"}
                    </button>
                  </div>
                </div>
                <div 
                  onClickCapture={(e) => {
                    if (!isPro) {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowProUpgradeModal(true);
                    }
                  }}
                  className="flex items-center gap-2 mt-1"
                >
                  <label className="text-[9px] text-[#ffffff]/65 uppercase font-mono bg-[#030308]/60 px-2 py-1 rounded">{t.autoPlayMode || "Bật/Tắt:"}</label>
                  <input type="checkbox" disabled={!isPro} checked={isPro && config.autoPlayGiftMusic} onChange={(e) => updateConfigValue({ autoPlayGiftMusic: e.target.checked })} className="w-3.5 h-3.5 accent-amber-500 disabled:opacity-50" />
                  <input type="number" disabled={!isPro} value={isPro ? (config.giftMusicTriggerCoins || 100) : 100} onChange={(e) => updateConfigValue({ giftMusicTriggerCoins: parseInt(e.target.value) || 100 })} className="w-16 bg-[#030308]/80 text-white text-[10px] rounded px-1 flex-1 border border-white/10 disabled:opacity-50" placeholder={t.giftCoins || "Số xu..."} />
                  <select disabled={!isPro} value={isPro ? config.giftMusicPlayMode : "stop"} onChange={(e) => {
                    if (isPro) updateConfigValue({ giftMusicPlayMode: e.target.value as any });
                  }} className="bg-[#030308]/80 text-[9px] text-slate-300 border border-white/10 rounded disabled:opacity-50 font-mono">
                    <option value="stop">{t.playModeStop || "Dừng tắt"}</option>
                    <option value="loop">{t.playModeLoop || "Lặp lại"}</option>
                    <option value="next">{t.playModeNext || "Bài ngẫu nhiên"}</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-0">
                {giftMusicList.map((track, i) => (
                  <div key={i} className={`flex items-center justify-between p-2.5 hover:bg-amber-500/10 border bg-[#030308]/60 border-white/5 rounded-lg transition-colors group relative`}>
                    <span className={`text-[9px] font-mono flex-1 whitespace-nowrap overflow-hidden text-ellipsis transition-colors uppercase tracking-widest text-amber-300 group-hover:text-amber-400`}>{track.name}</span>
                    <div className="flex items-center gap-2 z-10">
                      {isPro && (
                        <button className="text-amber-400/50 hover:text-amber-500 transition-colors" onClick={(e) => deleteGiftMusic(i, e)}><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 6: THÔNG TIN CÁ NHÂN
            ======================================================= */}
        {activeTab === "admin" && config && (
          <div className="glass-panel rounded-3xl p-6 md:p-10 border border-white/5 space-y-8 shadow-2xl relative overflow-hidden bg-[#050914]/85 backdrop-blur-md">
            
            {/* Header section with profile badge */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0 w-16 h-16">
                  <img 
                    src={config.ownerAvatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&h=150&q=80"} 
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full border-2 border-emerald-500/40 object-cover shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:border-emerald-400 transition-all duration-200"
                  />
                  <label 
                    htmlFor="profile-avatar-upload"
                    className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200 text-[9px] text-white font-bold text-center px-1"
                  >
                    <Camera className="w-4 h-4 text-emerald-400 mb-0.5" />
                    <span>Tải ảnh</span>
                  </label>
                  <input 
                    type="file" 
                    id="profile-avatar-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 leading-tight">
                    {config.licenseStatus === 'valid' && config.licenseEmail ? getLicenseName(config.licenseEmail) : (webLang === 'en' ? 'TRIAL USER' : webLang === 'zh' ? '试用用户' : 'KHÁCH DÙNG THỬ')}
                  </h2>
                  <p className="text-[11px] font-mono tracking-widest uppercase mt-0.5 flex items-center gap-1.5 font-bold">
                    {config.licenseStatus === 'valid' && config.licenseEmail ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-400">
                          {isPro 
                            ? (webLang === 'en' ? 'VIP PRO CLIENT LICENSE ACTIVATED' : webLang === 'zh' ? '⭐ VIP 专业高级授权' : 'HỆ THỐNG PRO CHUYÊN NGHIỆP ĐÃ XÁC MINH') 
                            : (webLang === 'en' ? 'BASIC VERIFIED LICENSE' : webLang === 'zh' ? '⭐ 基础授权已通过验证' : 'HỆ THỐNG BASIC ĐÃ XÁC MINH')}
                        </span>
                      </>
                    ) : config.licenseStatus === 'invalid' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-rose-400">
                          {webLang === 'en' ? 'LICENSE EXPIRED / INVALID' : webLang === 'zh' ? '授权失效或非法' : 'BẢN QUYỀN KHÔNG HỢP LỆ / HẾT HẠN'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-amber-400">
                          {webLang === 'en' ? 'UNACTIVATED SYSTEM / TRIAL' : webLang === 'zh' ? '未激活系统 / 试用' : 'HỆ THỐNG CHƯA KÍCH HOẠT / EMULATOR'}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {config.licenseStatus === 'valid' && config.licenseEmail ? (
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider font-mono">
                    {isPro ? "Gói Sở Hữu: VIP PRO" : "Gói Sở Hữu: BASIC"}
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider font-mono">
                    Gói Sở Hữu: CHƯA KÍCH HOẠT
                  </span>
                )}
                <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider font-mono">
                  VER v5.2.4
                </span>
              </div>
            </div>

            {/* Grid structure for data items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Profile & Mail */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#030308]/60 flex flex-col gap-4 hover:border-emerald-500/20 transition-all duration-200">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" /> {webLang === 'en' ? 'PERSONAL & CONTACT' : webLang === 'zh' ? '个人信息与联系' : 'CÁ NHÂN & LIÊN HỆ'}
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      👤 {webLang === 'en' ? 'Owner Name' : webLang === 'zh' ? '所有者姓名' : 'Họ và tên chủ máy'}
                    </span>
                    <input 
                      type="text"
                      className="w-full bg-[#030308]/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-semibold outline-none focus:border-emerald-500 transition-colors uppercase tracking-wide"
                      value={config.ownerName || ''}
                      onChange={(e) => updateConfigValue({ ownerName: e.target.value })}
                      placeholder="DATA RỖNG"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {webLang === 'en' ? 'Registered License Email' : webLang === 'zh' ? '注册许可证邮箱' : 'Email đăng kí bản quyền'}
                    </span>
                    <input 
                      type="email"
                      className="w-full bg-[#030308]/80 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#818cf8] font-mono outline-none focus:border-emerald-500 transition-colors"
                      value={config.licenseEmail || ''}
                      onChange={(e) => updateConfigValue({ licenseEmail: e.target.value })}
                      placeholder="chaokhonglong@gmail.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      🔑 {webLang === 'en' ? 'License Duration & Plan' : webLang === 'zh' ? '授权期限与计划' : 'Thời hạn & Gói bản quyền'}
                    </span>
                    {config.licenseStatus === 'valid' ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase font-mono">
                          {config.licenseExpire === "2099-12-31" 
                            ? (webLang === 'en' ? 'LIFETIME (FOREVER)' : webLang === 'zh' ? '终身 (永久)' : 'VĨNH VIỄN (TRỌN ĐỜI)') 
                            : (webLang === 'en' ? `EXPIRES: ${config.licenseExpire || 'Unknown'}` : webLang === 'zh' ? `有效期至: ${config.licenseExpire || '未知'}` : `HẠN DÙNG: ${config.licenseExpire || 'Chưa rõ'}`)}
                        </span>
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                          {config.planLevel ? `${config.planLevel} ACTIVE` : 'ACTIVE VIP'}
                        </span>
                      </div>
                    ) : config.licenseStatus === 'invalid' ? (
                      <div className="bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-rose-400 tracking-wider uppercase font-mono">
                          {webLang === 'en' ? 'INVALID OR EXPIRED' : webLang === 'zh' ? '无效或已过期' : 'BẢN QUYỀN KHÔNG HỢP LỆ'}
                        </span>
                        <span className="text-[8px] bg-rose-500/20 text-rose-400 font-mono font-bold px-1.5 py-0.5 rounded uppercase">LOCKED</span>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-amber-400 tracking-wider uppercase font-mono">
                          {webLang === 'en' ? 'UNVERIFIED LICENSE' : webLang === 'zh' ? '未经验证的授权' : 'BẢN QUYỀN CHƯA XÁC MINH'}
                        </span>
                        <span className="text-[8px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase">PENDING</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Box 2: Diagnostics & Access */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#030308]/60 flex flex-col gap-4 hover:border-emerald-500/20 transition-all duration-200">
                <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest border-b border-white/5 pb-2.5 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-400" /> {webLang === 'en' ? 'DEVICE & ACCESS DIAGNOSTICS' : webLang === 'zh' ? '设备与访问诊断' : 'THIẾT BI & ĐỊA CHỈ TRUY CẬP'}
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      💻 {webLang === 'en' ? 'Hardware ID (HWID)' : webLang === 'zh' ? '硬件标识符 (HWID)' : 'Mã định danh phần cứng (HWID)'}
                    </span>
                    <span className="text-sm font-semibold text-rose-400 font-mono tracking-widest pl-5 uppercase">
                      {config.hardwareId || "DEVICE-F7X9-10V"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> {webLang === 'en' ? 'Login IP Address' : webLang === 'zh' ? '登录 IP 地址' : 'Địa chỉ IP Đăng nhập'}
                    </span>
                    <span className="text-sm font-semibold text-emerald-400 font-mono tracking-wide pl-5">
                      {userIp}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Diagnostics footnote */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-[10px] text-emerald-300 leading-relaxed font-semibold italic flex items-start gap-2.5">
              <span className="text-base">🛡️</span>
              <span>
                {webLang === 'en' ? 'The Live Master Assistant system encrypts your personal information through a symmetrical military-grade SHA-256 security algorithm. Your HWID is directly tied to the physical processor; hardware modifications or sharing licenses to another PC without untying the device in admin panel will result in a temporary Account Lockout state.' : webLang === 'zh' ? 'Live Master Assistant 系统通过对称军用级 SHA-256 安全算法加密您的个人信息。HWID 直接绑定到物理处理器；在未经后台释放设备的情况下修改硬件或共享许可到其他计算机，将导致帐户临时锁定状态。' : 'Hệ thống Live Master Assistant mã hóa thông tin cá nhân của bạn thông qua thuật toán bảo mật cấp quân sự SHA-256 đối xứng. HWID được liên kết trực tiếp với vi xử lý vật lý; việc thay đổi linh kiện hoặc chia sẻ license cho máy tính khác mà không giải phóng thiết bị trong trang quản trị sẽ dẫn đến trạng thái Khóa Tài Khoản tạm thời.'}
              </span>
            </div>

            {/* Premium Purchased Package Features Section */}
            {config.licenseStatus === 'valid' && isPro && (
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/25 bg-[#0a0518]/70 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-amber-500/15 pb-3">
                <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-widest">
                  👑 TÍNH NĂNG ĐỘC QUYỀN GÓI PRO (ĐÃ KÍCH HOẠT)
                </h4>
              </div>
              
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  Xin chúc mừng! Hệ thống nhận diện tài khoản <strong className="text-amber-400 font-extrabold uppercase">{config.ownerName || "KHÁCH HÀNG VIP"}</strong> đang kích hoạt gói dịch vụ quyền lực cao nhất: <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-md font-bold font-mono tracking-wider ml-1">VIP PRO VĨNH VIỄN</span>.
                </p>
                <p className="text-slate-400">
                  Dưới đây là chi tiết danh sách chính xác các tính năng độc quyền mà bạn đang được mở khóa sử dụng trọn vẹn:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">🚀</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">XỬ LÝ ÂM THANH CHUYÊN NGHIỆP</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Tự do căn chỉnh thanh gạt Vocal, Reverb, Bass Boost, Treble Boost mà không bị giới hạn.</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">🎙️</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">CHẾ ĐỘ MC AUTO DUCKING (DODGE)</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Hệ thống đo nồng độ âm thanh Micro thời gian thực, tự động gạt hạ âm lượng beat nhạc xuống 25% khi MC cất lời nói.</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">🎵</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">ELECTRO AUTOTUNE ĐA TÔNG (C - B)</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Tự do chuyển đổi linh hoạt các tông Electro Key từ C, D, E, F, G, A, B để hát live chuẩn cao độ.</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">📺</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">YOUTUBE ZERO-ADS (HÁT KARAOKE)</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Tích hợp sẵn bộ máy triệt tiêu quảng cáo video YouTube, hát livestream liên tục mượt mà.</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">🤖</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">AI ASSISTANT CONFIG (TRÍ TUỆ GEMINI)</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Kích hoạt quyền điều khiển AI Streamer ảo tự suy nghĩ câu trả lời lém lỉnh, chào mừng, cảm ơn tim, gieo vần lôi cuốn.</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">⚡</span>
                    <div>
                      <span className="text-[12px] font-black text-slate-200 block">BÀN PHÍM SOUNDPAD MEMES CAO CẤP</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">8 nút âm thanh soundpad nhanh nhạy (vỗ tay, sét đánh, còi, bruh) bấm trực tiếp khuấy động phòng live.</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-amber-500/10 pt-3 flex items-center justify-between text-[11px] text-amber-300 font-mono">
                  <span>Trạng thái dịch vụ: ĐANG HOẠT ĐỘNG HOÀN HẢO</span>
                  <span>ID Thiết Bị: {config.hardwareId || "DEVICE-ACTIVE-F7X9"}</span>
                </div>
              </div>
            </div>
            )}

          </div>
        )}
          </motion.div>
        </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-white/5 bg-slate-900/40 p-6 text-center text-slate-500 text-xs tracking-wider font-semibold">
        TIKTOK LIVE MASTER ASSISTANT © 2026 MASTER SYSTEMS. DESIGNED AND AUDITED WITH INDUSTRIAL GRADE HWID DEFENSE ALGORITHMS.
      </footer>

      {showProUpgradeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={() => setShowProUpgradeModal(false)}>
          <div className="bg-[#0b031a] border-2 border-amber-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-amber-400 font-extrabold text-[15px] uppercase tracking-wider">{webLang === 'en' ? 'EXCLUSIVE PRO AUDIO FEATURE' : webLang === 'zh' ? '💎 专属专业豪华功能' : '💎 TÍNH NĂNG ĐỘC QUYỀN PRO'}</h3>
              <p className="text-slate-300 text-[12px] leading-relaxed">
                {webLang === 'en' 
                  ? 'Please upgrade your license key to the standard Pro package to utilize this premium feature.' 
                  : webLang === 'zh' 
                  ? '请先升级您的授权秘钥至专业高级版，体验顶级声效外设与自定义 Soundpad 加载。' 
                  : 'Vui lòng nâng cấp gói Pro để sử dụng tính năng cao cấp này.'}
              </p>
            </div>
            <button
              onClick={() => setShowProUpgradeModal(false)}
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
