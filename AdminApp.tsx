import React, { useState, useEffect, useRef } from "react";
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
  Zap
} from "lucide-react";
import { io, Socket } from "socket.io-client";

// Types
interface License {
  email: string;
  maxHwids: number;
  hwids: string[];
  expire: string;
}

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
  hardwareId: string;
  enableExtendedGiftInfo: boolean;
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

export default function AdminApp() {
  // Navigation tabs
  type Tab = "dashboard" | "games" | "settings" | "admin" | "obs";
  const [activeTab, setActiveTab] = useState<Tab>("admin");
  const [webLang, setWebLang] = useState<string>("vi");

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
  
  // Form values for adding/editing licenses
  const [newLicEmail, setNewLicEmail] = useState("");
  const [newLicMaxHwids, setNewLicMaxHwids] = useState(1);
  const [newLicExpire, setNewLicExpire] = useState("2099-12-31");
  const [newLicRole, setNewLicRole] = useState<"basic" | "pro">("basic");
  const [presetDays, setPresetDays] = useState("permanent");

  // Manual configuration inputs (Temporary UI States before auto-save)
  const [tempUsername, setTempUsername] = useState("");
  const [tempCookie, setTempCookie] = useState("");
  const [tempIdc, setTempIdc] = useState("");
  const [showCookie, setShowCookie] = useState(false);
  const [showIdc, setShowIdc] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showBannedKeywords, setShowBannedKeywords] = useState(false);
  const [showSignatureSettings, setShowSignatureSettings] = useState(false);

  // Simulated metrics counter
  const [metrics, setMetrics] = useState({
    viewers: 0,
    comments: 0,
    followers: 0,
    likes: 0,
    gifts: 0,
    maxViewers: 0
  });

  // Safe client-side reference
  const terminalLogsEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Keygen utility helpers in Admin tab
  const [keygenEmail, setKeygenEmail] = useState("example@gmail.com");
  const [keygenResult, setKeygenResult] = useState("");

  // Simulated Interactions inputs
  const [simType, setSimType] = useState<"chat" | "like" | "follow" | "gift">("chat");
  const [simName, setSimName] = useState("Mỹ_Duyên_cute");
  const [simComment, setSimComment] = useState("Chào chủ phòng dễ thương quá! Gửi tặng tim nè!");
  const [simGift, setSimGift] = useState("Bông Hoa");
  const [simCount, setSimCount] = useState(5);

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
      statPeak: "Mắt Xem Peak",
      terminalTitle: "REALTIME ENGINE STREAM DECK TERMINAL LOGS",
      licTitle: "XÁC THỰC BẢN QUYỀN HỆ THỐNG",
      licBadge: "Hạn dùng: ",
      licActive: "Bản Quyền Đã Kích Hoạt",
      settingsTitle: "THAM SỐ LÕI TRỢ LÝ TRỰC TIẾP",
      welcomeActive: "Chào người mới vào phòng",
      followActive: "Cảm ơn khán giả Theo Dõi",
      likeActive: "Cảm ơn khán giả Thả Tim",
      giftActive: "Cảm ơn khán giả Tặng Quà",
      adminTitle: "MASTER SECURITY CLIENT LICENSE",
      obsTitle: "OBS OVERLAY COMPONENT PREVIEW",
      waitingConnection: "Chờ kết nối",
      streamingLabel: "Đang phát"
    },
    en: {
      subtitle: "Event queue processing system & intelligent multi-language translation AI switcher",
      connectTitle: "STREAM CONTROLLER & TRANSMISSION",
      statViewers: "Active Viewers",
      statComments: "Total Chats",
      statFollowers: "New followers",
      statLikes: "Total Likes",
      statGifts: "Clover Coins",
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
      waitingConnection: "Waiting for connection",
      streamingLabel: "Streaming"
    },
    zh: {
      subtitle: "事件队列处理 system 及智能 multi-language AI 翻译切换器",
      connectTitle: "直播线路调节与状态",
      statViewers: "在线观众人数",
      statComments: "互动高频词",
      statFollowers: "高频净增关注",
      statLikes: "累计点赞频次",
      statGifts: "贵重礼物汇总",
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
      waitingConnection: "等待连接",
      streamingLabel: "正在直播"
    }
  };

  const t = dicts[webLang] || dicts["vi"];

  // ==========================================
  // INITIAL STAGE LOADERS
  // ==========================================
  useEffect(() => {
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
      const container = terminalLogsEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
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
      console.log("Connected to Realtime Game Socket!");
    });

    socket.on("stream_status_change", (data: { connected: boolean, username: string }) => {
      setStreamConnected(data.connected);
      if (data.connected) {
        setStreamBadgeText(`Streaming: ${data.username} 🟢`);
      } else {
        setStreamBadgeText("Chờ kết nối");
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
          } else if (payload.event === "log") {
            const newLog: LogEntry = {
              id: Math.random().toString(),
              time: new Date().toLocaleTimeString(),
              tag: payload.tag || "LOG",
              message: payload.message || "",
              colorClass: payload.colorClass || "text-gray-300"
            };
            setTerminalLogs(prev => [...prev.slice(-150), newLog]);
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
          setStreamConnected(true);
          setStreamBadgeText(`Streaming: ${tempUsername} 🟢`);
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
      if (res.ok) {
        // Trigger simulated voice reading of comment / welcome
        if (config?.ttsActive) {
          let textSpeech = "";
          const resolveSimName = (val: any) => {
             const s = String(val || "").trim();
             return (!s || s === "undefined" || s === "null" || s === "[object Object]") ? "Khán giả" : s;
          };
          
          const sName = resolveSimName(simName);
          const sComment = simComment ? String(simComment).trim() : "";
          
          if (simType === "chat") {
            if (sComment && sComment !== "undefined") {
              textSpeech = `${sName} nói: ${sComment}`;
            }
          } else if (simType === "like") {
            textSpeech = `Cảm ơn ${sName} đã bão ${simCount} tim thích phòng live nhé!`;
          } else if (simType === "follow") {
            textSpeech = `Cảm ơn ${sName} đã nhấn theo dõi kênh, chúc bạn có một ngày tràn ngập niềm vui!`;
          } else if (simType === "gift") {
            textSpeech = `Anh ${sName} bão quà siêu xịn! Gửi tặng ${simCount} cái ${simGift} luôn!`;
          }
          speakClientSide(textSpeech);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const lastClientTtsTimeRef = useRef<number>(0);
  const speakClientSide = (text: string) => {
    if (!text) return;
    const now = Date.now();
    if (now - lastClientTtsTimeRef.current < 1500) return;
    lastClientTtsTimeRef.current = now;

    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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

  const handleLangChange = (lang: string) => {
    setWebLang(lang);
    updateConfigValue({ webLanguage: lang });
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

  const createOrUpdateLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setNewLicMaxHwids(1);
        setPresetDays("permanent");
        setNewLicExpire("2099-12-31");
        setNewLicRole("basic");
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200">
      
      {/* HEADER SECTION */}
      <header className="border-b border-white/5 bg-slate-900/60 px-6 py-4 shadow-xl backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent flex items-center gap-2">
                <Tv className="w-5 h-5 text-purple-400 animate-pulse" />
                TIKTOK LIVE MASTER ENGINE v17.6
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language switches */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ngôn ngữ:</span>
              <select 
                value={webLang} 
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-transparent font-bold text-purple-400 focus:outline-none cursor-pointer text-xs"
              >
                <option value="vi" className="bg-slate-900 text-slate-200">Vietnamese</option>
                <option value="en" className="bg-slate-900 text-slate-200">English</option>
                <option value="zh" className="bg-slate-900 text-slate-200">Chinese</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/20 rounded-xl px-4 py-2 text-xs font-bold text-purple-400">
              <ShieldCheck className="w-4 h-4 animate-pulse" />
              <span>HỆ THỐNG QUẢN TRỊ BẢN QUYỀN SỐ</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto p-4 md:p-6 space-y-6">
        <ErrorBoundary>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* CONNECTION PANELS */}
            <div className="space-y-4 lg:col-span-1">
              
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                  {t.connectTitle}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold ml-1">ID Kênh Live:</label>
                    <input 
                      type="text" 
                      value={tempUsername}
                      onChange={(e) => {
                        setTempUsername(e.target.value);
                        updateConfigValue({ lastConnectedUsername: e.target.value });
                      }}
                      placeholder="duchoabinh_channel..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 hover:border-purple-500/20 text-slate-200 placeholder:text-slate-600 mt-1 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold ml-1">Cookie Session ID (Cực Hạn):</label>
                    <div className="relative mt-1">
                      <input 
                        type={showCookie ? "text" : "password"}
                        value={tempCookie}
                        onChange={(e) => {
                          setTempCookie(e.target.value);
                          updateConfigValue({ cookieSessionId: e.target.value });
                        }}
                        placeholder="sessionid=••••••••"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-200 placeholder:text-slate-600 font-mono"
                      />
                      <button 
                        onClick={() => setShowCookie(!showCookie)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400"
                      >
                        {showCookie ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 ml-1 mt-1 leading-relaxed">
                      * Nếu gặp lỗi <b>200</b> (Unexpected response), bạn hãy dán mã <b>sessionid</b> từ Cookie trình duyệt vào đây.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold ml-1">ttTargetIdc (TikTok IDC):</label>
                    <div className="relative mt-1">
                      <input 
                        type={showIdc ? "text" : "password"}
                        value={tempIdc}
                        onChange={(e) => {
                          setTempIdc(e.target.value);
                          updateConfigValue({ ttTargetIdc: e.target.value });
                        }}
                        placeholder="hk, alisg, hg..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-200 placeholder:text-slate-600 font-mono"
                      />
                      <button 
                        onClick={() => setShowIdc(!showIdc)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400"
                      >
                        {showIdc ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={toggleStreamConnection}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 shadow-md ${
                        streamConnected 
                          ? "bg-red-600 hover:bg-red-500 text-white" 
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                    >
                      {streamConnected ? "Ngắt Kết Nối Luồng" : "Bật Kết Nối Luồng"}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-semibold">Trạng thái:</span>
                    <span className={`font-bold ${streamConnected ? "text-emerald-400 animate-pulse" : "text-amber-500"}`}>
                      {
                        streamBadgeText === "Chờ kết nối" ? (t.waitingConnection || "Chờ kết nối") :
                        streamBadgeText.startsWith("Streaming:") ? 
                          `${t.streamingLabel || "Đang phát"}: ${streamBadgeText.replace("Streaming:", "").replace("🟢", "").trim()} 🟢` : 
                          streamBadgeText
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING ACTION SIMULATOR CENTER */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
                <h3 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-550" />
                  BẢNG KIỂM THỬ SỰ KIỆN LIVE SIMULATOR
                </h3>
                <p className="text-[10px] text-slate-400 italic">
                  Dành riêng cho Streamer: Bạn có thể click giả lập comment, thả tim, follow, tặng quà ảo để kiểm thử tính năng AI hoặc MiniGames OBS khi chưa onstream!
                </p>

                <form onSubmit={handleSimulateEventSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Loại sự kiện:</label>
                    <select
                      value={simType}
                      onChange={(e) => setSimType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="chat">💬 Bình luận chat</option>
                      <option value="like">❤️ Thả tim bão</option>
                      <option value="follow">✨ Nhấn Follow kênh</option>
                      <option value="gift">🎁 Gửi tặng quà xu</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Tên khán giả:</label>
                      <input 
                        type="text" 
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    {simType === "chat" && (
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Cú pháp chat:</label>
                        <input 
                          type="text" 
                          value={simComment}
                          onChange={(e) => setSimComment(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}
                    {simType === "like" && (
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Số tim gửi:</label>
                        <input 
                          type="number" 
                          value={simCount}
                          onChange={(e) => setSimCount(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                        />
                      </div>
                    )}
                    {simType === "gift" && (
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Chọn quà:</label>
                        <select 
                          value={simGift}
                          onChange={(e) => setSimGift(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300"
                        >
                          <option value="Bông Hoa Hồng">Rose 🌹 (1 xu)</option>
                          <option value="Kem Ly">Ice Cream 🍦 (1 xu)</option>
                          <option value="Cây Vĩ Cầm">Cello 🎻 (10 xu)</option>
                          <option value="TikTok Logo">TikTok Logo 🎵 (20 xu)</option>
                          <option value="Siêu xe Ferrari">Sports Car 🏎️ (29999 xu)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    KÍCH SỰ KIỆN MÔ PHỎNG
                  </button>
                </form>
              </div>

            </div>

            {/* LIVE STREAM DECK TERMINAL LOGS */}
            <div className="lg:col-span-3 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col h-[650px] shadow-2xl">
              <div className="border-b border-white/5 px-5 py-3 flex justify-between items-center bg-slate-950/40 rounded-t-2xl">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  {t.terminalTitle}
                </h2>
                <button
                  onClick={() => setTerminalLogs([])}
                  className="text-xs text-slate-500 hover:text-red-400 font-bold px-2 py-1 bg-slate-950 border border-white/5 rounded-lg transition"
                >
                  Xóa màn hình
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 bg-slate-950/90 font-mono text-xs space-y-2">
                {terminalLogs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    [System Status]: Màn hình trống. Đang chờ log tương tác trực tiếp hoặc bấm "Mock Sự Kiện"...
                  </div>
                ) : (
                  terminalLogs.map((log) => (
                    <div key={log.id} className="flex gap-2 py-0.5 border-b border-white/5 leading-relaxed tracking-wide">
                      <span className="text-slate-500 font-bold shrink-0">[{log.time}]</span>
                      <span className={`font-extrabold uppercase shrink-0 ${log.colorClass}`}>
                        {log.tag}
                      </span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={terminalLogsEndRef} />
              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 2: CONTROL BOARD FOR INTERACTIVE MINIGAMES
            ======================================================= */}
        {activeTab === "games" && config && (
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-bold text-amber-500 flex items-center gap-1.5 uppercase">
                <Gamepad2 className="w-5 h-5 text-amber-500" />
                ĐIỀU KHIỂN BẬT TẮT TRÒ CHƠI MINIGAMES SWITCH
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kích hoạt hoặc gạt ngắt luồng kiểm tra hành động của các game, ngăn chặn troll spam hoặc thiết lập thời lượng treo live lý tưởng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Card Game 1 */}
              <div className={`p-4 rounded-xl border transition-all ${
                config.gameBattleActive 
                  ? "bg-purple-950/20 border-purple-500/50 game-glow" 
                  : "bg-slate-950 border-white/5"
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-purple-400 uppercase">1. Đấu Trường 💀</span>
                  <input 
                    type="checkbox" 
                    checked={config.gameBattleActive}
                    onChange={(e) => updateConfigValue({ gameBattleActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Cho phép người xem thi thố tranh đấu bằng lệnh <code className="text-purple-400 font-mono">!battle</code>.
                </p>
              </div>

              {/* Card Game 2 */}
              <div className={`p-4 rounded-xl border transition-all ${
                config.gameNoituActive 
                  ? "bg-purple-950/20 border-purple-500/50 game-glow" 
                  : "bg-slate-950 border-white/5"
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-blue-400 uppercase">2. Nối Từ VN 🔗</span>
                  <input 
                    type="checkbox" 
                    checked={config.gameNoituActive}
                    onChange={(e) => updateConfigValue({ gameNoituActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Bắt đầu trò chơi kiểm tra nối chuỗi từ vựng Việt Nam bằng cú pháp lệnh <code className="text-blue-400 font-mono">!noitu</code>.
                </p>
              </div>

              {/* Card Game 3 */}
              <div className={`p-4 rounded-xl border transition-all ${
                config.gameCauhoiActive 
                  ? "bg-purple-950/20 border-purple-500/50 game-glow" 
                  : "bg-slate-950 border-white/5"
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-pink-400 uppercase">3. Đố Vui 💡</span>
                  <input 
                    type="checkbox" 
                    checked={config.gameCauhoiActive}
                    onChange={(e) => updateConfigValue({ gameCauhoiActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Bung bộ câu hỏi trắc nghiệm đố vui có thưởng qua lệnh <code className="text-pink-400 font-mono">!cauhoi</code>.
                </p>
              </div>

              {/* Card Game 4 */}
              <div className={`p-4 rounded-xl border transition-all ${
                config.gameCoopActive 
                  ? "bg-purple-950/20 border-purple-500/50 game-glow" 
                  : "bg-slate-950 border-white/5"
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase">4. Đào Kho Báu 💎</span>
                  <input 
                    type="checkbox" 
                    checked={config.gameCoopActive}
                    onChange={(e) => updateConfigValue({ gameCoopActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Cả phòng tương tác cào đá hầm ngục tiêu diệt Boss thu thập quà qua lệnh <code className="text-emerald-400 font-mono">!chem</code>.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-white/5 bg-slate-950/50 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-300">Ý Nghĩa Vận Hành:</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Khi kích hoạt các ô trên, toàn bộ dữ liệu comment trực tiếp từ Stream TikTok sẽ được chuyển tiếp qua thuật toán phân tách cú pháp thông minh. Nếu comment trùng với từ khóa game, bot sẽ tự động thực hiện xử lý điểm số và phát tín hiệu cho thiết kế canvas game.html cập nhật trạng thái di chuyển đồ họa!
              </p>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 3: SYSTEM SETTINGS (AUTOREPLY, BLACKIST & COOLDOWN)
            ======================================================= */}
        {activeTab === "settings" && config && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMN LEFT: INTERACT SECTIONS */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-indigo-400 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4" />
                  KỊCH BẢN CHÀO / CÁM ƠN COOLDOWN
                </h3>
                <p className="text-[11px] text-slate-400">Thiết lập các mộc câu từ ngẫu nhiên để chatbot tự động xướng giọng đọc ngẫu thanh.</p>
              </div>

              <div className="space-y-4">
                {/* Welcome template text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={config.welcomeActive}
                        onChange={(e) => updateConfigValue({ welcomeActive: e.target.checked })}
                        className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                      />
                      Kịch bản chào mừng người mới:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">CD: {config.welcomeCooldown}s</span>
                  </div>
                  <textarea 
                    value={config.welcomeTemplates}
                    onChange={(e) => updateConfigValue({ welcomeTemplates: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-500 text-slate-300"
                  />
                </div>

                {/* Follow template text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={config.followActive}
                        onChange={(e) => updateConfigValue({ followActive: e.target.checked })}
                        className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                      />
                      Kịch bản cảm ơn follower mới:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">CD: {config.followCooldown}s</span>
                  </div>
                  <textarea 
                    value={config.followTemplates}
                    onChange={(e) => updateConfigValue({ followTemplates: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-500 text-slate-300"
                  />
                </div>

                {/* Like template text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={config.likeActive}
                        onChange={(e) => updateConfigValue({ likeActive: e.target.checked })}
                        className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                      />
                      Kịch bản cám ơn thả tim bão:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">CD: {config.likeCooldown}s</span>
                  </div>
                  <textarea 
                    value={config.likeTemplates}
                    onChange={(e) => updateConfigValue({ likeTemplates: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-500 text-slate-300"
                  />
                </div>

                {/* Gift template text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={config.giftActive}
                        onChange={(e) => updateConfigValue({ giftActive: e.target.checked })}
                        className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                      />
                      Kịch bản cám ơn tặng quà:
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">CD: {config.giftCooldown}s</span>
                  </div>
                  <textarea 
                    value={config.giftTemplates}
                    onChange={(e) => updateConfigValue({ giftTemplates: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-white/5 rounded-lg p-2 text-xs focus:outline-none focus:border-purple-500 text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* COLUMN RIGHT: AI DIALOGUE AGENT & BLACKLIST FILTER */}
            <div className="space-y-6">
              
              {/* AI Agent Configuration details */}
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    AI ASSISTANT INTELLIGENCE CONFIG
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold">Tự động trả lời AI:</span>
                    <input 
                      type="checkbox" 
                      checked={config.aiActive}
                      onChange={(e) => updateConfigValue({ aiActive: e.target.checked })}
                      className="w-3.5 h-3.5 accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Google Gemini API Key:</label>
                    <div className="relative mt-1">
                      <input 
                        type={showGeminiKey ? "text" : "password"}
                        value={config.geminiKey}
                        onChange={(e) => updateConfigValue({ geminiKey: e.target.value })}
                        placeholder="AIzaSy••••••••"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-300 placeholder:text-slate-700 font-mono focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400"
                      >
                        {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">OpenAI API Key:</label>
                    <div className="relative mt-1">
                      <input 
                        type={showOpenaiKey ? "text" : "password"}
                        value={config.openaiKey}
                        onChange={(e) => updateConfigValue({ openaiKey: e.target.value })}
                        placeholder="sk-proj-••••••••"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-300 placeholder:text-slate-700 font-mono focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400"
                      >
                        {showOpenaiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Thiết lập nhân cách AI trợ lý phòng Live (System Prompt):</label>
                  <textarea 
                    value={config.aiPrompt}
                    onChange={(e) => updateConfigValue({ aiPrompt: e.target.value })}
                    rows={3}
                    placeholder="Nhân cách giọng nói (ví dụ: Bạn là trợ lý phòng livestream vui tính...)"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      alert("🎉 Đã lưu cấu hình AI thành công lên máy chủ!");
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    Kiểm Tra & Lưu Lại
                  </button>
                </div>
              </div>

              {/* Banned Words and Auto Replies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5" />
                      Từ Khóa Vi Phạm Bị Cấm
                    </h4>
                    <button type="button" onClick={() => setShowBannedKeywords(!showBannedKeywords)} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                      {showBannedKeywords ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Bình luận chứa các từ này sẽ bị lọc hoàn toàn, không hiển thị trên logs.</p>
                  <textarea
                    style={{ WebkitTextSecurity: showBannedKeywords ? 'none' : 'disc' }}
                    value={config.bannedKeywords}
                    onChange={(e) => updateConfigValue({ bannedKeywords: e.target.value })}
                    rows={4}
                    placeholder="nhạy cảm, tục tĩu, troll, spam..."
                    className="w-full flex-1 bg-slate-950 border border-white/10 rounded-xl p-2 text-xs text-slate-300 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Bộ Lọc Phản Hồi Tự Động
                  </h4>
                  <p className="text-[10px] text-slate-500">Cú pháp đồng bộ (Từ khóa : câu trả lời). Gõ mỗi dòng 1 kịch bản.</p>
                  <textarea
                    value={config.autoReplyRawScript}
                    onChange={(e) => updateConfigValue({ autoReplyRawScript: e.target.value })}
                    rows={4}
                    placeholder="chao : Xin chào anh chị ghé live!&#10;shop : Xem giỏ hàng ở dưới nhé."
                    className="w-full flex-1 bg-slate-950 border border-white/10 rounded-xl p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 4: OBS CORE CANVAS SIMULATION PREVIEW
            ======================================================= */}
        {activeTab === "obs" && (
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h2 className="text-lg font-bold text-blue-400 flex items-center gap-1.5 uppercase">
                <Gamepad2 className="w-5 h-5 text-blue-500" />
                OBS GAME CANVAS OVERLAY ENGINE (4-IN-1 LIVE PREVIEW)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Giao diện giả lập OBS Game Overlay bằng HTML5 Canvas. Trình chơi này sẽ lắng nghe Socket.io trực tiếp và tự động dịch chuyển ô xe đua, đua thú, hoặc HP boxer khi có lượt thả tim / tặng quà từ simulator!
              </p>
            </div>

            {/* OBS EMBED SIMULATOR DISPLAY */}
            <div className="bg-slate-950 rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center relative min-h-[420px]">
              <div className="absolute top-4 left-4 bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-widest text-blue-400 font-mono z-10 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                OBS STREAM PREVIEW PANEL
              </div>

              {/* GAMEBOARD GRAPHICS LAYER */}
              <div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-xl p-6 text-center shadow-2xl space-y-4">
                <div className="text-sm font-bold text-slate-300 uppercase">HỆ THỐNG ĐANG HOẠT ĐỘNG TRÊN PORT 3000</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* RACING SIMULATION */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-left space-y-2">
                    <span className="text-xs font-bold text-purple-400 uppercase">🏎️ 1. Đua xe sấm sét (Racing Mode)</span>
                    <div className="space-y-1.5 pt-2">
                      <div className="h-6 bg-slate-900 rounded border border-white/5 relative flex items-center">
                        <span className="absolute left-2 text-[10px] text-purple-500 font-bold">PHE HỒNG:</span>
                        <div className="h-full bg-purple-500/20 rounded transition-all duration-300" style={{ width: `${Math.min(25 + metrics.likes * 1.5, 95)}%` }}></div>
                        <span className="absolute right-3 font-mono text-[10px] font-bold text-slate-300">Car #1</span>
                      </div>
                      <div className="h-6 bg-slate-900 rounded border border-white/5 relative flex items-center">
                        <span className="absolute left-2 text-[10px] text-blue-500 font-bold">PHE XANH:</span>
                        <div className="h-full bg-blue-500/20 rounded transition-all duration-300" style={{ width: `${Math.min(30 + metrics.followers * 15, 95)}%` }}></div>
                        <span className="absolute right-3 font-mono text-[10px] font-bold text-slate-300">Car #2</span>
                      </div>
                    </div>
                  </div>

                  {/* VERSUS HEALTH BATTLE */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-left space-y-2">
                    <span className="text-xs font-bold text-pink-400 uppercase">🥊 2. Song Đấu Sinh Tử (Versus Mode)</span>
                    <div className="space-y-2 pt-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-pink-500">PHE HỒNG HP (Likes)</span>
                          <span>100 / 100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-pink-500 h-full transition-all duration-300" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-blue-500">PHE XANH HP (Comments)</span>
                          <span>{Math.max(100 - metrics.gifts * 5, 20)} / 100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${Math.max(100 - metrics.gifts * 5, 20)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PLINKO SLOTS */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-left space-y-1.5 md:col-span-2">
                    <span className="text-xs font-bold text-amber-400 uppercase">🔮 3. Thả Bóng Plinko (Plinko System)</span>
                    <p className="text-[11px] text-slate-500">Khi có tương tác như Quà tặng xu hoặc Follow, bóng Plinko rơi tự do qua lưới peg chốt đinh để nhân số quà!</p>
                    <div className="h-10 bg-slate-900 rounded border border-white/5 flex items-center justify-around font-mono text-xs font-bold text-slate-400">
                      <div className="bg-slate-950 px-3 py-1 rounded border border-amber-500/20 text-red-400">X1</div>
                      <div className="bg-slate-950 px-3 py-1 rounded border border-amber-500/20 text-purple-400">X5</div>
                      <div className="bg-slate-950 px-3 py-1 rounded border border-amber-500/20 text-amber-400">X10</div>
                      <div className="bg-slate-950 px-3 py-1 rounded border border-amber-500/20 text-purple-400">X5</div>
                      <div className="bg-slate-950 px-3 py-1 rounded border border-amber-500/20 text-red-400">X1</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 italic">
                  Để đặt Canvas lên OBS màn hình thật: Nhúng link URL trang web này vào nguồn trình duyệt "Browser Source" của OBS!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 5: ADMIN SECURITY CONSOLE (GATED SECURE ACCESS)
            ======================================================= */}
        {activeTab === "admin" && (
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
            
            {/* Verification block */}
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-slate-950 border border-white/10 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto text-purple-400 text-3xl">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black tracking-wide text-white uppercase">XÁC THỰC QUYỀN TRỊ</h3>
                <p className="text-xs text-slate-500">Mật khẩu xác minh trung thâm server để kết xuất cơ sở dữ liệu bản quyền.</p>
                
                <div className="text-left py-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Mật khẩu lõi:</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-center font-mono tracking-widest text-purple-400 mt-1 focus:outline-none focus:border-purple-500"
                  />
                  {adminAuthError && (
                    <p className="text-[11px] text-red-400 font-semibold mt-2 text-center">{adminAuthError}</p>
                  )}
                </div>

                <button
                  onClick={handleVerifyAdminSubmit}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase py-3 rounded-xl transition shadow-lg active:scale-95"
                >
                  XÁC THỰC QUYỀN HẠN
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Admin authenticated successfully layout */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4 flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-purple-400 flex items-center gap-1.5 uppercase">
                      <Unlock className="w-5 h-5 text-purple-400 animate-pulse" />
                      HỆ THỐNG PHÂN PHỐI LICENSE & QUẢN TRỊ HWID REALTIME
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Xác thực thành công. Cơ sở dữ liệu bản quyền hiện hoạt động đồng bộ với tệp database.json trên server.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("admin_session_verified");
                      setIsAdminAuthenticated(false);
                    }}
                    className="px-4 py-2 bg-slate-950 border border-white/10 hover:border-red-500 rounded-xl text-xs text-slate-400 hover:text-red-400 font-bold transition flex items-center gap-1"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Đăng Xuất Khỏi Quản Trị
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Create New License Section */}
                  <section className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <UserPlus className="w-4 h-4" />
                      TẠO MỚI / CẬP NHẬT KEY CẤP QUYỀN
                    </h3>

                    <form onSubmit={createOrUpdateLicenseSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Email mua tool:</label>
                        <input 
                          type="email"
                          required
                          value={newLicEmail}
                          onChange={(e) => setNewLicEmail(e.target.value)}
                          placeholder="client-email@gmail.com"
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Số máy cấu hình tối đa (Max HWID):</label>
                        <input 
                          type="number"
                          min={1}
                          required
                          value={newLicMaxHwids}
                          onChange={(e) => setNewLicMaxHwids(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-amber-400 font-bold block mb-1">CHỌN GÓI BẢN QUYỀN:</label>
                        <select
                          value={newLicRole}
                          onChange={(e) => setNewLicRole(e.target.value as "basic" | "pro")}
                          className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-200 font-bold"
                        >
                          <option value="basic" className="bg-slate-950 text-slate-300">Gói Basic (Nhiều tính năng bị ẩn/khóa)</option>
                          <option value="pro" className="bg-slate-950 text-amber-400 font-bold">🔥 Gói Pro (Mở khóa toàn bộ tính năng cao cấp)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Hạn sử dụng giấy phép:</label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={presetDays}
                            onChange={(e) => handlePresetDaysChange(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-xl px-2 py-2 text-xs text-slate-200"
                          >
                            <option value="permanent">Vĩnh viễn</option>
                            <option value="30">30 ngày</option>
                            <option value="60">60 ngày</option>
                            <option value="120">120 ngày</option>
                          </select>
                          <input 
                            type="date"
                            disabled={presetDays === "permanent"}
                            value={newLicExpire}
                            onChange={(e) => setNewLicExpire(e.target.value)}
                            className="bg-slate-900 border border-white/5 rounded-xl px-2 py-2 text-xs text-slate-200 disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        XÁC NHẬN CẬP NHẬT DATABASE
                      </button>
                    </form>
                  </section>

                  {/* License List Table Details */}
                  <section className="bg-slate-950 border border-white/10 rounded-2xl p-5 lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-2">
                      CƠ SỞ DỮ LIỆU CẤP QUYỀN LICENSE HIỆN THỜI
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                            <th className="pb-3 text-left">Email khách</th>
                            <th className="pb-3 text-center">Gói cấp</th>
                            <th className="pb-3 text-center">Hạn sử dụng</th>
                            <th className="pb-3 text-center">Danh sách máy (HWIDs)</th>
                            <th className="pb-3 text-right">Điều khiển</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {licenses.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-slate-600 italic">
                                Không tìm thấy bản ghi nào.
                              </td>
                            </tr>
                          ) : (
                            licenses.map((lic) => (
                              <tr key={lic.email} className="hover:bg-white/5">
                                <td className="py-3 font-semibold text-slate-100">{lic.email}</td>
                                <td className="py-3 text-center">
                                  {lic.role === "pro" ? (
                                    <span className="text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded text-[10px] font-extrabold border border-amber-500/20 uppercase">🔥 Gói Pro</span>
                                  ) : (
                                    <span className="text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded text-[10px] border border-slate-500/10 uppercase">Gói Basic</span>
                                  )}
                                </td>
                                <td className="py-3 text-center font-mono">
                                  {lic.expire === "2099-12-31" ? (
                                    <span className="text-emerald-400 font-bold">VĨNH VIỄN</span>
                                  ) : (
                                    lic.expire
                                  )}
                                </td>
                                <td className="py-3 text-center">
                                  {lic.hwids.length === 0 ? (
                                    <span className="text-slate-600 italic">Trống</span>
                                  ) : (
                                    <div className="space-y-1">
                                      {lic.hwids.map((hw, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-900 border border-white/5 px-2 py-1 rounded text-[10px] font-mono gap-2">
                                          <span className="text-purple-400">{hw}</span>
                                          <button
                                            onClick={() => kickSpecificHwidRaw(lic.email, hw)}
                                            className="text-red-400 hover:text-red-500 font-extrabold uppercase text-[9px]"
                                          >
                                            Kích
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 text-right space-x-1">
                                  <button
                                    onClick={() => wipeLicenseHwids(lic.email)}
                                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[10px] font-bold uppercase rounded border border-amber-500/20"
                                  >
                                    Reset
                                  </button>
                                  <button
                                    onClick={() => deleteLicenseRecord(lic.email)}
                                    className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/20"
                                  >
                                    Xóa
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                </div>

                {/* Keygen Helper tool */}
                <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-450 uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    PHÂN HỆ KEYGEN TOKEN GENERATOR (BẢO MẬT ADMIN)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sử dụng để tính toán nhanh khóa token đồng bộ bảo mật cho mã nguồn ứng dụng .EXE khi cấp tay cho khách:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Email cần tạo Token:</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={keygenEmail}
                          onChange={(e) => setKeygenEmail(e.target.value)}
                          className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                        />
                        <button
                          onClick={handleKeygenRun}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                        >
                          TÍNH TOÁN
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400">Token bảo mật trả về:</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          readOnly
                          value={keygenResult}
                          className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-purple-400 font-mono"
                        />
                        <button
                          onClick={() => {
                            if (!keygenResult) return;
                            navigator.clipboard.writeText(keygenResult);
                            alert("Đã copy Token vào Clipboard!");
                          }}
                          className="bg-slate-900 border border-white/5 hover:border-purple-500 text-slate-300 hover:text-white px-3 text-xs font-bold rounded-xl flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          COPY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        </ErrorBoundary>
      </main>

      <footer className="border-t border-white/5 bg-slate-900/40 p-6 text-center text-slate-500 text-xs tracking-wider font-semibold">
        TIKTOK LIVE MASTER ASSISTANT © 2026 MASTER SYSTEMS. DESIGNED AND AUDITED WITH INDUSTRIAL GRADE HWID DEFENSE ALGORITHMS.
      </footer>
    </div>
  );
}
