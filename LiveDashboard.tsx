import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Users, 
  MessageSquare, 
  UserPlus, 
  Heart, 
  Gift, 
  Terminal, 
  Trash2, 
  Settings2, 
  Crown 
} from "lucide-react";

interface LogEntry {
  id: string;
  time: string;
  tag: string;
  message: string;
  colorClass: string;
}

interface LiveDashboardProps {
  metrics: { viewers?: number; comments?: number; followers?: number; likes?: number; gifts?: number };
  terminalLogs: LogEntry[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  leaderboard: { name: string; coins: number }[];
  config: any;
  updateConfigValue: (val: any) => void;
  showTtsVisualSettings: boolean;
  setShowTtsVisualSettings: (val: boolean) => void;
  t: any;
  terminalLogsEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function LiveDashboard({
  metrics,
  terminalLogs,
  setTerminalLogs,
  leaderboard,
  config,
  updateConfigValue,
  showTtsVisualSettings,
  setShowTtsVisualSettings,
  t,
  terminalLogsEndRef
}: LiveDashboardProps) {
  return (
    <div className="animate-fade-in flex flex-col h-full space-y-4">
      {/* Dashboard Headers */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" /> {t.tabDashboard || "TRUNG TÂM GIÁM SÁT REAL-TIME"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Phân tích dữ liệu Livestream và hiệu suất AI theo thời gian thực.</p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider font-mono">LIVE ACTIVE</span>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 w-full shrink-0">
        <div className="glass-panel rounded-xl p-3 bg-[#0f172a] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">{t.statViewers || "MẮT XEM"}</span>
            <Users className="w-3.5 h-3.5 text-cyan-400 opacity-50" />
          </div>
          <p className="text-lg font-bold text-white mt-1 font-mono">{metrics.viewers ?? 0}</p>
        </div>

        <div className="glass-panel rounded-xl p-3 bg-[#0f172a] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">{t.statComments || "BÌNH LUẬN"}</span>
            <MessageSquare className="w-3.5 h-3.5 text-purple-400 opacity-50" />
          </div>
          <p className="text-lg font-bold text-white mt-1 font-mono">{metrics.comments ?? 0}</p>
        </div>

        <div className="glass-panel rounded-xl p-3 bg-[#0f172a] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">{t.statFollowers || "FOLLOWS"}</span>
            <UserPlus className="w-3.5 h-3.5 text-pink-400 opacity-50" />
          </div>
          <p className="text-lg font-bold text-white mt-1 font-mono">{metrics.followers ?? 0}</p>
        </div>

        <div className="glass-panel rounded-xl p-3 bg-[#0f172a] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">{t.statLikes || "THÍCH"}</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 opacity-50" />
          </div>
          <p className="text-lg font-bold text-white mt-1 font-mono">{(metrics.likes ?? 0).toLocaleString()}</p>
        </div>

        <div className="glass-panel rounded-xl p-3 bg-[#0f172a] border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">{t.statGifts || "QUÀ TẶNG"}</span>
            <Gift className="w-3.5 h-3.5 text-amber-400 opacity-50" />
          </div>
          <p className="text-lg font-bold text-white mt-1 font-mono">{metrics.gifts ?? 0}</p>
        </div>
      </div>

      {/* TERMINAL AND LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-[350px]">
        {/* Terminal Log View */}
        <div className="lg:col-span-3 rounded-xl glass-panel border border-white/10 shadow-2xl flex flex-col overflow-hidden h-full">
          <div className="border-b border-white/5 px-4 py-3 flex justify-between items-center bg-[#05050A]/80 shrink-0">
            <h3 className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
               <Terminal className="w-3.5 h-3.5 text-cyan-400" /> {t.terminalQueueTitle || "BẢNG ĐỌC BÌNH LUẬN TRỰC TIẾP"}
            </h3>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowTtsVisualSettings(!showTtsVisualSettings)}
                className={`p-1.5 rounded-lg border transition-colors ${showTtsVisualSettings ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-500 hover:text-cyan-400'}`}
                title={t.customizeDisplay || "Tùy chỉnh hiển thị"}
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTerminalLogs([])}
                className="text-[9px] text-slate-550 hover:text-rose-400 font-mono font-semibold px-2.5 py-1.5 bg-white/5 border border-white/5 rounded-lg transition-colors flex items-center gap-1 uppercase"
              >
                <Trash2 className="w-3 h-3" /> {t.clearScreen || "Xóa"}
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-[#030308] overflow-hidden flex flex-col min-h-[300px]">
            <div 
              className="flex-1 overflow-y-auto p-4 font-mono flex flex-col-reverse custom-scrollbar"
              style={{
                backgroundColor: config?.ttsLogBgColor || "#0f172a",
                fontSize: `${config?.ttsLogFontSize || 13}px`,
                color: config?.ttsLogFontColor || "#cbd5e1"
              }}
            >
              <div className="flex flex-col-reverse justify-start gap-2">
                {terminalLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
                     <Terminal className="w-10 h-10 mb-2 animate-pulse text-indigo-400" />
                     <span className="italic" style={{ fontSize: `${config?.ttsLogFontSize || 13}px` }}>{t.waitingComments || "Đang chờ bình luận live..."}</span>
                  </div>
                ) : (
                  [...terminalLogs].reverse().map((log) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={log.id} 
                      className="flex gap-2 py-1 px-1.5 rounded hover:bg-white/5 transition-colors leading-relaxed tracking-wide font-mono"
                    >
                      <span className="text-slate-500/75 shrink-0 select-none">[{log.time}]</span>
                      <span className={`font-extrabold uppercase shrink-0 w-[80px] ${log.colorClass}`}>
                        {log.tag}
                      </span>
                      <span className="break-all" style={{ color: config?.ttsLogFontColor || "#cbd5e1" }}>{log.message}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <AnimatePresence>
              {showTtsVisualSettings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-3 top-3 w-64 bg-[#0a0f1d] border border-white/10 shadow-2xl rounded-xl p-4 z-50 flex flex-col gap-3 backdrop-blur-md font-sans"
                >
                  <h3 className="text-xs font-bold text-cyan-400 border-b border-white/10 pb-1.5 uppercase tracking-wider">{t.customScreen || "TÙY CHỈNH MÀN HÌNH"}</h3>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase font-mono">{t.fontSizeLive || "CỠ CHỮ BẢNG LIVE (PX)"}</label>
                    <input type="number" min="10" max="30" value={config?.ttsLogFontSize || 13} onChange={e => updateConfigValue({ ttsLogFontSize: parseInt(e.target.value) || 13 })} className="bg-[#030308] border border-white/10 rounded px-2 py-1 text-xs text-white outline-none font-mono" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase font-mono">{t.defaultTextColor || "MÀU CHỮ MẶC ĐỊNH"}</label>
                    <input type="color" value={config?.ttsLogFontColor || "#cbd5e1"} onChange={e => updateConfigValue({ ttsLogFontColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer rounded" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase font-mono">{t.bgColorLive || "MÀU NỀN BẢNG"}</label>
                    <input type="color" value={config?.ttsLogBgColor || "#0f172a"} onChange={e => updateConfigValue({ ttsLogBgColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer rounded" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase font-mono">{t.readSpeed || "TỐC ĐỘ ĐỌC:"} {config?.ttsReadSpeed || 1.1}x</label>
                    <input type="range" min="0.5" max="2.0" step="0.1" value={config?.ttsReadSpeed || 1.1} onChange={e => updateConfigValue({ ttsReadSpeed: parseFloat(e.target.value) })} className="accent-cyan-500" />
                  </div>
                  <label className="flex items-center gap-2 mt-1">
                    <input type="checkbox" checked={config?.autoReconnectStream ?? true} onChange={e => updateConfigValue({ autoReconnectStream: e.target.checked })} className="accent-cyan-500 w-3.5 h-3.5" />
                    <span className="text-[10px] text-slate-350 select-none">{t.autoReconnect || "Tự động kết nối lại khi lỗi"}</span>
                  </label>
                  <div className="flex gap-2 mt-1 pt-2 border-t border-white/5">
                    <button onClick={() => updateConfigValue({ ttsLogFontSize: 13, ttsLogFontColor: "#cbd5e1", ttsLogBgColor: "#0f172a", ttsReadSpeed: 1.1 })} className="flex-1 text-[9px] bg-red-500/15 text-red-400 hover:bg-red-500/25 py-1.5 rounded font-bold uppercase tracking-wider">{t.resetBtn || "Reset"}</button>
                    <button onClick={() => setShowTtsVisualSettings(false)} className="flex-1 text-[9px] bg-white/10 hover:bg-white/20 py-1.5 rounded text-white font-bold uppercase tracking-wider">{t.closeBtn || "Đóng"}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-[#0f172a] rounded-xl border border-white/5 flex flex-col h-full overflow-hidden relative min-h-[300px]">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-sans">
              <Crown className="w-4 h-4 text-yellow-400 animate-bounce" /> {t.leaderboardTitle || "TOP TẶNG QUÀ"}
            </h3>
            <span className="text-[9px] text-yellow-400 font-bold bg-yellow-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">LIVE</span>
          </div>
          <div className="flex-1 bg-[#030308] p-3 overflow-y-auto custom-scrollbar space-y-2">
            {leaderboard && leaderboard.length > 0 ? (
              leaderboard.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[#0d0f1b] p-2 rounded-lg border border-white/5 relative overflow-hidden group transition-all hover:bg-white/[0.03]">
                  {idx === 0 && <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none" />}
                  <div className="flex items-center gap-2 z-10">
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold ${
                      idx === 0 ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]" : 
                      idx === 1 ? "bg-slate-300 text-black" : 
                      idx === 2 ? "bg-amber-600 text-white" : "bg-white/10 text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 truncate max-w-[110px] font-sans">{user.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-yellow-400 font-bold z-10 flex items-center gap-1">{user.coins} 🪙</span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-[11px] italic font-sans text-center">
                 {t.noGiftsYet || "Chưa có lượt đóng góp quà..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
