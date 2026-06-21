import React from "react";
import { Mic } from "lucide-react";

interface TtsConfigurationProps {
  config: any;
  updateConfigValue: (val: any) => void;
  t: any;
}

export default function TtsConfiguration({
  config,
  updateConfigValue,
  t
}: TtsConfigurationProps) {
  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch h-full">
      <div className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-fuchsia-500/30 transition-all flex flex-col bg-[#030308]/40 h-full">
        <h3 className="mb-4 text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400 flex items-center justify-between border-b border-white/5 pb-2.5">
          <span className="flex items-center gap-2 font-sans"><Mic className="w-4 h-4 text-fuchsia-400" /> {t.ttsTitle || "CẤU HÌNH ENGINE ĐỌC TTS"}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={config?.ttsActive} onChange={(e) => updateConfigValue({ ttsActive: e.target.checked })} className="sr-only peer" />
            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fuchsia-500"></div>
          </label>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-400 font-bold mb-1.5 block font-sans">TIỆN ÍCH TTS LỰA CHỌN (TTS ENGINE):</label>
            <select 
              value={config?.ttsEngine} 
              onChange={(e) => updateConfigValue({ ttsEngine: e.target.value })} 
              className="w-full bg-[#030308] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-bold outline-none cursor-pointer focus:border-fuchsia-500 transition-colors font-sans"
            >
              <option value="browser">🗣️ Trình duyệt Web (Mặc định)</option>
              <option value="google">🌐 Google Translate TTS (Free)</option>
              <option value="fpt">🔮 FPT.AI (Premium API Key)</option>
              <option value="zalo">🎵 Zalo AI Cloud (Premium API Key)</option>
              <option value="azure">☁️ Microsoft Azure Speech (Premium API Key)</option>
            </select>
          </div>

          {config?.ttsEngine === "fpt" && (
            <div className="space-y-1.5 animate-fade-in animate-duration-150">
              <label className="text-[9px] text-fuchsia-400 font-bold uppercase block font-sans">API Key FPT.AI:</label>
              <input type="password" value={config?.ttsApiKey || ""} onChange={(e) => updateConfigValue({ ttsApiKey: e.target.value })} className="w-full bg-[#030308]/80 text-xs text-white border border-white/10 rounded-lg p-2.5 outline-none font-mono focus:border-fuchsia-500" placeholder="Nhập FPT.AI Token..." />
            </div>
          )}
          {config?.ttsEngine === "zalo" && (
            <div className="space-y-1.5 animate-fade-in animate-duration-150">
              <label className="text-[9px] text-fuchsia-400 font-bold uppercase block font-sans">Zalo API Key:</label>
              <input type="password" value={config?.ttsZaloKey || ""} onChange={(e) => updateConfigValue({ ttsZaloKey: e.target.value })} className="w-full bg-[#030308]/80 text-xs text-white border border-white/10 rounded-lg p-2.5 outline-none font-mono focus:border-fuchsia-500" placeholder="Nhập Zalo Token..." />
            </div>
          )}
          {config?.ttsEngine === "azure" && (
            <div className="space-y-1.5 animate-fade-in animate-duration-150">
              <label className="text-[9px] text-fuchsia-400 font-bold uppercase block font-sans">Azure Key / Endpoint:</label>
              <input type="password" value={config?.ttsMicrosoftKey || ""} onChange={(e) => updateConfigValue({ ttsMicrosoftKey: e.target.value })} className="w-full bg-[#030308]/80 text-xs text-white border border-white/10 rounded-lg p-2.5 outline-none font-mono focus:border-fuchsia-500" placeholder="Nhập Azure Key..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold mb-1.5 block font-sans">NGÔN NGỮ ĐỌC BAN ĐẦU:</label>
              <select value={config?.ttsLanguage} onChange={(e) => updateConfigValue({ ttsLanguage: e.target.value })} className="w-full bg-[#030308] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500 cursor-pointer font-sans">
                <option value="vi">Tiếng Việt 🇻🇳</option>
                <option value="en">English 🇺🇸</option>
                <option value="zh">Chinese 🇨🇳</option>
                <option value="th">Tiếng Thái 🇹🇭</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold mb-1.5 block font-sans">DỊCH SANG TIẾNG:</label>
              <select value={config?.translateTarget} onChange={(e) => updateConfigValue({ translateTarget: e.target.value })} className="w-full bg-[#030308] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-fuchsia-500 cursor-pointer font-sans">
                <option value="vi">Tiếng Việt 🇻🇳</option>
                <option value="en">English 🇺🇸</option>
                <option value="zh">Chinese 🇨🇳</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col bg-[#030308]/40 gap-4 justify-center">
        <h3 className="text-[13px] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 border-b border-white/5 pb-2.5 tracking-wider font-sans">
           LỌC & BỎ QUA KHI ĐỌC TTS
        </h3>
        <div className="space-y-4 flex-1 justify-center flex flex-col">
          <label className="flex items-center justify-between p-3 bg-[#030308]/60 border border-white/5 rounded-xl cursor-pointer hover:border-pink-500/30 transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 uppercase font-sans">CHỈ ĐỌC KHI NỘI DUNG DỊCH</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans font-medium">Không đọc bình luận gốc, chỉ đọc phần đã dịch thuật.</span>
            </div>
            <input type="checkbox" checked={config?.ttsOnlyTranslated} onChange={(e) => updateConfigValue({ ttsOnlyTranslated: e.target.checked })} className="w-4 h-4 accent-pink-500 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#030308]/60 border border-white/5 rounded-xl cursor-pointer hover:border-pink-500/30 transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 uppercase font-sans">CHẶN HOẶC BỎ QUA EMOJI</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans font-medium">Tự động dịch/bỏ qua icon mặt cười, sticker dán nhãn...</span>
            </div>
            <input type="checkbox" checked={config?.ttsSkipEmoji} onChange={(e) => updateConfigValue({ ttsSkipEmoji: e.target.checked })} className="w-4 h-4 accent-pink-500 rounded" />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#030308]/60 border border-white/5 rounded-xl cursor-pointer hover:border-pink-500/30 transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 uppercase font-sans">KÍCH HOẠT DỊCH TỰ ĐỘNG</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-sans font-medium">Đồng dịch bình luận người nước ngoài sang tiếng đích.</span>
            </div>
            <input type="checkbox" checked={config?.translateActive} onChange={(e) => updateConfigValue({ translateActive: e.target.checked })} className="w-4 h-4 accent-pink-500 rounded" />
          </label>
        </div>
      </div>
    </div>
  );
}
