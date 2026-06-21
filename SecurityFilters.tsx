import React from "react";
import { ShieldAlert, Ban } from "lucide-react";

interface SecurityFiltersProps {
  config: any;
  updateConfigValue: (val: any) => void;
  showBannedKeywords: boolean;
  setShowBannedKeywords: (val: boolean) => void;
  t: any;
}

export default function SecurityFilters({
  config,
  updateConfigValue,
  showBannedKeywords,
  setShowBannedKeywords,
  t
}: SecurityFiltersProps) {
  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch h-full">
      <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-rose-500/30 transition-all flex flex-col bg-[#030308]/40">
        <h3 className="mb-4 text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 flex items-center gap-2 border-b border-white/5 pb-2.5 font-sans">
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> {t.spamFilterTitle || "BỘ CHẶN TỪ KHÓA BẨN (SPAM FILTER)"}
        </h3>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed font-sans">
           {t.spamFilterDesc || "Nhập các từ rác, thô tục, xúc phạm hoặc từ nhạy cảm TikTok cấm để hệ thống tự động lọc bỏ, ngăn đọc ra luồng livestream. Phân cách nhau bằng dấu phẩy (,)."}
        </p>
        
        <div className="flex-1 flex flex-col space-y-1.5">
          <div className="flex justify-between items-center font-sans">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">{t.spamFilterList || "DANH SÁCH TỪ (,) :"}</label>
            <button onClick={() => setShowBannedKeywords(!showBannedKeywords)} className="text-[9px] text-orange-400 font-mono font-bold hover:underline">
              {showBannedKeywords ? "ẨN TỪ KHÓA BẨN" : "HIỂN THỊ TỪ KHÓA"}
            </button>
          </div>
          <textarea 
            type={showBannedKeywords ? "text" : "password"}
            value={config?.bannedKeywords || ""} 
            onChange={(e) => updateConfigValue({ bannedKeywords: e.target.value })} 
            placeholder="lừa đảo, ăn cắp, ngu, dốt..." 
            className="w-full flex-1 min-h-[140px] bg-[#030308]/70 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-350 outline-none resize-none focus:border-orange-500 transition-all custom-scrollbar leading-relaxed"
          />
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col bg-[#030308]/40">
        <h3 className="mb-4 text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center gap-2 border-b border-white/5 pb-2.5 font-sans">
          <Ban className="w-4 h-4 text-amber-500" /> {t.blacklistTitle || "CHẶN USERNAME NGƯỜI DÙNG (SPAMMER BLACKLIST)"}
        </h3>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed font-sans">
          {t.blacklistDesc || "Khi những tài khoản quấy phá này bình luận hoặc tương tác trên luồng Live, Robot AI và hệ thống đọc phát âm TTS sẽ tự động phớt lờ, lờ đi. Nhập ID/Username TikTok của họ, ngăn cách nhau bằng dấu phẩy (,)."}
        </p>
        
        <div className="flex-1 flex flex-col space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">{t.blacklistList || "DANH SÁCH TÀI KHOẢN CHẶN (,) :"}</label>
          <textarea 
            value={config?.bannedUsernames || ""} 
            onChange={(e) => updateConfigValue({ bannedUsernames: e.target.value })} 
            placeholder="antifan1, trollgames23..." 
            className="w-full flex-1 min-h-[140px] bg-[#030308]/70 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-350 outline-none resize-none focus:border-amber-500 transition-all custom-scrollbar leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
