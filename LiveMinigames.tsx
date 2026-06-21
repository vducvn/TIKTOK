import React from "react";
import { Gamepad2, ExternalLink, Link2, Eye, Bot } from "lucide-react";

interface LiveMinigamesProps {
  t: any;
  playgroundUser: string;
  setPlaygroundUser: (val: string) => void;
  playgroundVibe: string;
  setPlaygroundVibe: (val: string) => void;
  generateAiMusic: () => void;
  composedLyrics: string;
}

export default function LiveMinigames({
  t,
  playgroundUser,
  setPlaygroundUser,
  playgroundVibe,
  setPlaygroundVibe,
  generateAiMusic,
  composedLyrics
}: LiveMinigamesProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-4 w-full">
      <div className="glass-panel rounded-2xl p-4 shadow-xl space-y-4 border border-white/10 bg-[#030308]/40 w-full">
        <div className="border-b border-white/[0.05] pb-3 flex justify-between items-center font-sans">
          <div>
            <h2 className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center gap-2 uppercase tracking-wide">
              <Gamepad2 className="w-4 h-4 text-amber-500" />
              {t.minigamesHeader || "QUẢN LÝ MINIGAMES & LINK TRONG OBS"}
            </h2>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-mono">
              Để thêm đồ họa Game lên màn hình OBS, bạn sao chép đường dẫn Browser Source bên dưới.
            </p>
          </div>
          <div className="flex bg-[#030308]/60 p-1 rounded-lg border border-white/10 gap-1 shrink-0 font-mono">
            <a href="https://game.thuisoft.com" target="_blank" rel="noopener noreferrer" className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 uppercase">
              <ExternalLink className="w-3.5 h-3.5" /> Link Game Thui
            </a>
          </div>
        </div>

        <div className="bg-[#030308]/60 p-3.5 rounded-xl border border-white/5 space-y-2 font-sans">
           <h3 className="text-xs font-bold text-slate-200 uppercase flex items-center gap-2 tracking-widest">
             <Link2 className="w-4 h-4 text-emerald-400 animate-pulse" /> LINK OBS BROWSER SOURCE CHƠI GAME:
           </h3>
           <div className="flex items-center gap-2">
             <input
               type="text"
               readOnly
               value={typeof window !== "undefined" ? window.location.origin + "/game" : ""}
               className="flex-1 bg-[#0f172a] text-emerald-400 font-mono text-[11px] p-2.5 rounded-xl border border-white/10 select-all outline-none"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch pt-2">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/10 hover:border-amber-500/30 transition-all flex flex-col bg-[#030308]/40 relative overflow-hidden font-sans">
          <h3 className="text-xs font-bold text-amber-400 border-b border-white/10 pb-2.5 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Bot className="w-4 h-4 text-amber-400 animate-bounce" /> {t.lyriaComposerTitle || "NHÀ BẠN VĂN CHƯƠNG RHYME CHẾ CA"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Trình AI gieo vần thơ phú hóm hỉnh. Robot sẽ tự dệt những câu thơ chúc mừng, trêu ghẹo hoặc nói lái cực kỳ dí dỏm dựa trên tên của fan hâm mộ.
          </p>

          <div className="space-y-4 flex-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div>
                 <label className="block text-[10px] text-slate-400 font-bold mb-1.5 uppercase">Tên Người Chơi Làm Thơ:</label>
                 <input type="text" value={playgroundUser} onChange={e => setPlaygroundUser(e.target.value)} className="w-full bg-[#030308] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-sans" />
               </div>
               <div>
                 <label className="block text-[10px] text-slate-400 font-bold mb-1.5 uppercase">Chọn Vibe:</label>
                 <select value={playgroundVibe} onChange={e => setPlaygroundVibe(e.target.value)} className="w-full bg-[#030308] border border-white/10 rounded-xl px-2 py-2 text-xs text-slate-200 outline-none cursor-pointer">
                   <option value="funny">🎭 Hài hước</option>
                   <option value="flirt">🍭 Thả thính</option>
                   <option value="epic">⚔️ Hùng vĩ</option>
                 </select>
               </div>
             </div>

             <button onClick={generateAiMusic} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs py-2.5 rounded-xl uppercase transition hover:opacity-90 tracking-wider cursor-pointer">Làm Thơ AI</button>

             {composedLyrics && (
               <div className="bg-[#030308] border border-amber-500/10 rounded-xl p-3 text-xs text-slate-350 font-mono whitespace-pre-line leading-relaxed max-h-[140px] overflow-y-auto custom-scrollbar">
                  {composedLyrics}
               </div>
             )}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col bg-[#030308]/40 font-sans">
          <h3 className="text-xs font-bold text-slate-200 border-b border-white/10 pb-2.5 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Eye className="w-4 h-4 text-sky-400 animate-pulse" /> OBS GRAPHICS CANVAS PREVIEW
          </h3>
          <div className="w-full aspect-video rounded-xl border border-white/10 overflow-hidden relative bg-[#010103]">
            <iframe src="/obs.html" className="w-[100.1%] h-full border-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
