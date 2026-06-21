import React from "react";
import { Zap, Mic, Play } from "lucide-react";

interface MemeTrack {
  name: string;
  url?: string;
  isText?: boolean;
  text?: string;
}

interface MemeSoundpadProps {
  memeList: MemeTrack[];
  handlePlayMeme: (meme: MemeTrack) => void;
  fileInputRefMeme: React.RefObject<HTMLInputElement | null>;
  handleMemeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPro: boolean;
  setShowProUpgradeModal: (val: boolean) => void;
}

export default function MemeSoundpad({
  memeList,
  handlePlayMeme,
  fileInputRefMeme,
  handleMemeUpload,
  isPro,
  setShowProUpgradeModal
}: MemeSoundpadProps) {
  return (
    <div className="animate-fade-in flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 font-sans">
        <div>
          <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-yellow-400" /> ⚡ SOUNDPAD MEME LIVE VIỆT NAM
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Bấm nhanh các nốt âm để phát hiệu ứng âm thanh độc đáo lên phòng Live!</p>
        </div>
        <div className="flex gap-2 relative">
           <input type="file" accept="audio/*" ref={fileInputRefMeme} onChange={handleMemeUpload} className="hidden" />
           <button 
             onClick={() => {
               if (!isPro) {
                 setShowProUpgradeModal(true);
                 return;
               }
               fileInputRefMeme.current?.click();
             }} 
             className="px-3.5 py-1.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 uppercase cursor-pointer"
           >
             + Thêm File MP3 {!isPro && "🔒"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
        {memeList.map((meme, i) => (
           <button 
             key={i} 
             onClick={() => handlePlayMeme(meme)} 
             className={`bg-gradient-to-b from-[#161a29] to-[#0d0f1b] border ${meme.isText ? 'border-yellow-500/30 hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'border-blue-500/30 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]'} rounded-xl p-4 text-center transition-all group flex flex-col items-center justify-center gap-2 active:scale-[0.98] relative shadow-lg min-h-[105px] font-sans`}
           >
             <div className={`w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${meme.isText ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {meme.isText ? <Mic className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
             </div>
             <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest break-all line-clamp-1">{meme.name}</span>
             {i < 9 && (
               <span className="absolute top-2 right-2 text-[8px] font-mono font-extrabold px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded uppercase tracking-wider">
                 Hotkey {i + 1}
               </span>
             )}
           </button>
        ))}
      </div>
    </div>
  );
}
