import React, { useState } from "react";
import { RefreshCw, Play, Terminal } from "lucide-react";

interface ConnectionSettingsProps {
  tempUsername: string;
  setTempUsername: (val: string) => void;
  tempCookie: string;
  setTempCookie: (val: string) => void;
  tempIdc: string;
  setTempIdc: (val: string) => void;
  showCookie: boolean;
  setShowCookie: (val: boolean) => void;
  showIdc: boolean;
  setShowIdc: (val: boolean) => void;
  streamConnected: boolean;
  toggleStreamConnection: () => void;
  streamBadgeText: string;
  config: any;
  updateConfigValue: (val: any) => void;
  simType: "chat" | "like" | "follow" | "gift" | "join";
  setSimType: (val: "chat" | "like" | "follow" | "gift" | "join") => void;
  simName: string;
  setSimName: (val: string) => void;
  simGift: string;
  setSimGift: (val: string) => void;
  simCount: number;
  setSimCount: (val: number) => void;
  simComment: string;
  setSimComment: (val: string) => void;
  simLoading: boolean;
  triggerSimulateEvent: () => void;
  t: any;
}

export default function ConnectionSettings({
  tempUsername,
  setTempUsername,
  tempCookie,
  setTempCookie,
  tempIdc,
  setTempIdc,
  showCookie,
  setShowCookie,
  showIdc,
  setShowIdc,
  streamConnected,
  toggleStreamConnection,
  streamBadgeText,
  config,
  updateConfigValue,
  simType,
  setSimType,
  simName,
  setSimName,
  simGift,
  setSimGift,
  simCount,
  setSimCount,
  simComment,
  setSimComment,
  simLoading,
  triggerSimulateEvent,
  t
}: ConnectionSettingsProps) {
  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-5 items-stretch h-full">
      <div className="flex-[1.2] flex flex-col gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col shrink-0 bg-gradient-to-tr from-cyan-900/10 to-transparent">
          <h3 className="mb-4 text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-2 border-b border-white/5 pb-2.5">
             <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin-slow" /> {t.connectTitle || "ĐỒNG BỘ CHI TIẾT KÊNH"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-cyan-400 font-bold tracking-widest font-mono uppercase mb-1.5">{t.tiktokIdLabel || "ID KÊNH TIKTOK THỂ HIỆN:"}</label>
              <input 
                type="text" 
                value={tempUsername}
                onChange={(e) => {
                  setTempUsername(e.target.value);
                  updateConfigValue({ lastConnectedUsername: e.target.value });
                }}
                placeholder="@id_kenh..." 
                className="w-full rounded-xl border border-white/10 px-3 py-2.5 text-xs bg-[#030308]/70 text-white outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-purple-400 font-bold tracking-widest font-mono uppercase mb-1.5">COOKIE SESSIONID:</label>
              <div className="flex gap-2">
                <input 
                  type={showCookie ? "text" : "password"}
                  value={tempCookie}
                  onChange={(e) => {
                    setTempCookie(e.target.value);
                    updateConfigValue({ cookieSessionId: e.target.value });
                  }}
                  placeholder="sessionid=••••••••" 
                  className="flex-1 rounded-xl border border-white/10 px-3 py-2.5 text-xs bg-[#030308]/70 text-white outline-none focus:border-purple-500 font-mono"
                />
                <button onClick={() => setShowCookie(!showCookie)} className="px-3 bg-[#030308]/60 hover:bg-slate-850 border border-white/10 rounded-xl text-slate-400 hover:text-white text-xs transition-colors font-sans">
                  {showCookie ? "Ẩn" : "Xem"}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                * Tránh bị lỗi rớt / giới hạn mạng từ phía TikTok. Vào TikTok.com, bấm F12, sao chép value cookie có tên <b>sessionid</b>.
              </p>
            </div>
            <div>
              <label className="block text-[10px] text-emerald-400 font-bold tracking-widest font-mono uppercase mb-1.5">{t.ttTargetIdcLabel || "ttTargetIdc (MDC):"}</label>
              <div className="flex gap-2">
                <input 
                  type={showIdc ? "text" : "password"}
                  value={tempIdc}
                  onChange={(e) => {
                    setTempIdc(e.target.value);
                    updateConfigValue({ ttTargetIdc: e.target.value });
                  }}
                  placeholder="Ví dụ: hg, alisg..." 
                  className="flex-1 rounded-xl border border-white/10 px-3 py-2.5 text-xs bg-[#030308]/70 text-white outline-none focus:border-emerald-500 font-mono"
                />
                <button onClick={() => setShowIdc(!showIdc)} className="px-3 bg-[#030308]/60 hover:bg-slate-850 border border-white/10 rounded-xl text-slate-400 hover:text-white text-xs transition-colors font-sans">
                  {showIdc ? "Ẩn" : "Xem"}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={toggleStreamConnection}
                disabled={config?.licenseStatus !== 'valid'}
                className={`w-full rounded-xl py-3 text-xs font-black text-white transition-all shadow-md uppercase tracking-wider active:scale-[0.98] ${
                  config?.licenseStatus !== 'valid' ? "bg-slate-800 text-slate-500 cursor-not-allowed" :
                  streamConnected ? "bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]" : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                }`}
              >
                {streamConnected ? (t.disconnectStreamBtn || "Ngắt Kết Nối") : (t.connectStreamBtn || "Bật Kết Nối Luồng Live")}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center font-sans">
               {t.statusLive || "Status:"} <span className={`font-semibold ml-1 font-mono ${streamConnected ? "text-emerald-400 animate-pulse" : "text-amber-400"}`}>
                 {
                   streamBadgeText === "Chờ kết nối" ? (t.waitingConnection || "Chờ kết nối") :
                   streamBadgeText.startsWith("Streaming:") ? 
                     `${t.streamingLabel || "Đang kết nối: "}${streamBadgeText.replace("Streaming:", "").replace("🟢", "").trim()} 🟢` : 
                     streamBadgeText
                 }
               </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-[1.8] flex flex-col gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-full bg-[#030308]/40">
          <h3 className="mb-4 text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-rose-400 flex items-center gap-2 border-b border-white/5 pb-2.5">
             <Terminal className="w-4 h-4 text-fuchsia-400 animate-pulse" /> BỘ MÔ PHỎNG & GIẢ LẬP SỰ KIỆN LIVE
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed font-sans">
             Tính năng này gửi các phản hồi, bình luận giả để kiểm tra bộ lọc bảo mật, âm thanh đọc TTS, hoặc các kịch bản tương tác khác mà không cần phát trực tiếp trên TikTok.
          </p>
          
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { key: "chat", label: "Live Comment" },
                { key: "like", label: "Thả Tim" },
                { key: "follow", label: "Theo Dõi" },
                { key: "gift", label: "Gửi Quà" },
                { key: "join", label: "Vào Phòng" }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSimType(opt.key as any)}
                  className={`py-2 px-1 text-[10px] rounded-lg font-bold uppercase transition-all tracking-wider font-mono ${simType === opt.key ? "bg-gradient-to-r from-fuchsia-600 to-rose-500 text-white shadow-md border border-fuchsia-400/20" : "bg-[#030308] text-slate-400 hover:text-white border border-white/5"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5 font-sans">Tên Người Gửi </label>
                <input 
                  type="text" 
                  value={simName} 
                  onChange={e => setSimName(e.target.value)} 
                  className="w-full rounded-lg border border-white/10 p-2.5 text-xs bg-[#030308]/80 text-white font-sans outline-none focus:border-fuchsia-500"
                  placeholder="VD: Tuấn PC"
                />
              </div>
              {simType === "gift" ? (
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5 font-sans">Tên Quà Tặng (Xu)</label>
                  <div className="flex gap-2 font-sans">
                    <select 
                      value={simGift} 
                      onChange={e => setSimGift(e.target.value)} 
                      className="bg-[#030308]/80 text-xs text-amber-300 border border-white/10 rounded-lg p-2.5 focus:border-amber-500 flex-1 outline-none"
                    >
                      <option value="Bông Hoa">🌹 Bông Hoa (1 xu)</option>
                      <option value="TikTok">📱 TikTok (1 xu)</option>
                      <option value="Trái Tim">❤️ Trái Tim (10 xu)</option>
                      <option value="Nước Hoa">🧴 Nước Hoa (20 xu)</option>
                      <option value="Kim Cương">💎 Kim Cương (100 xu)</option>
                      <option value="Sư Tử">🦁 Sư Tử (2999 xu)</option>
                      <option value="Vũ Trụ">🌌 Vũ Trụ (39999 xu)</option>
                    </select>
                    <input 
                      type="number" 
                      value={simCount} 
                      onChange={e => setSimCount(parseInt(e.target.value) || 1)} 
                      className="bg-[#030308]/80 border border-white/10 text-center rounded-lg w-16 text-xs text-white font-mono" 
                      min="1"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1.5 font-sans">{simType === "chat" ? "Nội Dung Bình Luận" : simType === "like" ? "Số Thả Tim Gửi Đợt" : "Điều khoản sự kiện"}</label>
                  {simType === "chat" ? (
                    <input 
                      type="text" 
                      value={simComment} 
                      onChange={e => setSimComment(e.target.value)} 
                      className="w-full rounded-lg border border-white/10 p-2.5 text-xs bg-[#030308]/80 text-white outline-none focus:border-fuchsia-500"
                      placeholder="Lời thoại..."
                    />
                  ) : simType === "like" ? (
                    <input 
                      type="number" 
                      value={simCount} 
                      onChange={e => setSimCount(parseInt(e.target.value) || 100)} 
                      className="w-full rounded-lg border border-white/10 p-2.5 text-xs bg-[#030308]/80 text-white outline-none focus:border-fuchsia-500 font-mono"
                      min="1"
                    />
                  ) : (
                    <input 
                      type="text" 
                      readOnly 
                      value={simType === "follow" ? "Đã theo dõi kênh" : "Đã vào phòng xem livestream"} 
                      className="w-full rounded-lg border border-white/10 p-2.5 text-xs bg-slate-900/50 text-slate-500 outline-none cursor-not-allowed font-medium font-sans"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={triggerSimulateEvent}
                disabled={simLoading}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-rose-500 hover:from-fuchsia-500 hover:to-rose-400 text-white font-extrabold text-xs py-3 rounded-xl transition duration-155 uppercase tracking-widest active:scale-95 shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                {simLoading ? "ĐANG INJECT..." : "BẮN GIẢ LẬP LÊN TERMINAL"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
