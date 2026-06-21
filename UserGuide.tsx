import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Keyboard, 
  Volume2, 
  ShieldAlert, 
  Gamepad2, 
  BookOpen, 
  Zap, 
  Sparkles, 
  Cpu, 
  Mic, 
  ArrowRight,
  Info
} from "lucide-react";

interface UserGuideProps {
  webLang: string;
}

export default function UserGuide({ webLang }: UserGuideProps) {
  const [activeTab, setActiveTab] = useState<"hotkeys" | "audio" | "antisan" | "commands" | "autoreply">("hotkeys");

  // Multilingual dictionary
  const dict = {
    vi: {
      title: "HƯỚNG DẪN SỬ DỤNG & CẨM NANG LIVESTREAM STUDIO",
      desc: "Trang bị đầy đủ kiến thức làm chủ luồng Live - Phím tắt, tự động trả lời, định tuyến Âm Thanh và AI.",
      tabHotkeys: "💥 Phím Tắt",
      tabAudio: "🎙️ Tách Luồng Âm Thanh",
      tabAntisan: "🤖 Lách Luật TikTok & AI (PRO)",
      tabCommands: "🎮 Lệnh Minigames",
      tabAutoreply: "💬 Trả Lời Tự Động",
      kbdAction: "HÀNH ĐỘNG",
      kbdKey: "NÚT BẤM",
      kbdDesc: "TÁC DỤNG & CHI TIẾT",
      instantToggleMic: "Bật / Tắt nhanh Microphone",
      instantToggleMicDesc: "Thao tác tắt nhanh tiếng thu âm mà không cần bấm chuột để ho khan, uống nước hoặc nói chuyện riêng tư.",
      instantStopAll: "Dừng Toàn Bộ Nhạc & Beats",
      instantStopAllDesc: "Tắt khẩn cấp Nhạc nền BGM app và Nhạc hát thô trong VocalProcessor tức thì khi bắt đầu tương tác sâu.",
      playMemeSound: "Phát nhanh Soundpad Meme 1 đến 9",
      playMemeSoundDesc: "Gieo tiếng cười tự động thông qua phím tắt nhanh 1-9 cho các track meme đầu tiên trong danh sách.",
      howToRouteTitle: "SƠ ĐỒ ĐỊNH TUYẾN ÂM THANH CHUYÊN NGHIỆP (VB-CABLE)",
      howToRouteDesc: "Để livestream không bị dính tạp âm, tiếng phản hồi Echo lặp từ giọng nói hoặc nhạc đè lên Bot AI, hãy áp dụng thiết kế 3 Luồng Tách Biệt sau:",
      stream1: "LUỒNG GIỌNG HÁT (MIC & SOUNDCARD K10)",
      stream1Desc: "Xử lý trực tiếp giọng thật qua Vocal Processor (Compressor, Hall Reverb, Echo). Ra thẳng cổng kiểm âm tai nghe của bạn sạch bong.",
      stream2: "LUỒNG NHẠC NỀN & MEMES (VB-AUDIO CABLE)",
      stream2Desc: "Hướng BGM App và Tiếng Meme về ngõ ra CABLE Input ảo. Trên OBS, add nguồn là CABLE Output để lọc âm lượng hoặc stream riêng lẻ.",
      stream3: "LUỒNG ĐỌC BÌNH LUẬN (BOT AI TTS)",
      stream3Desc: "Phát trực tiếp ra Loa chính PC hoặc cổng phát riêng lẻ để người nghe trên livestream không bị dính vang vọng méo tiếng từ soundcard hát.",
      obsTrick: "💡 Mẹo thiết lập OBS Studio hoàn hảo:",
      obsTrickDesc: "Thêm nguồn âm thanh vào OBS riêng rẽ: Một là Mic/Aux (Soundcard K10) chỉ chứa giọng nói; Hai là Desktop Audio (CABLE Output VB-Audio) chỉ chứa nhạc. Khi đó, AI Streamer đọc bình luận sẽ hoàn toàn tách riêng biệt, mang lại trải nghiệm chuyên nghiệp cực đỉnh!",
      antiScanTitle: "BỘ CÔNG CỤ LÁCH LUẬT TIKTOK & LÕI TRÍ TUỆ GEMINI",
      antiScanDesc: "AI Streamer tự động phát hiện và chuyển đổi các từ khóa nhạy cảm dễ bị AI Quét quét tương tác hoặc giảm đề xuất luồng live.",
      avoidWord: "Từ gốc nhạy cảm",
      safeWord: "Từ sau khi lách luật",
      safeAction: "Phương thức bảo vệ",
      avoidTiktokExplain: "Thuật toán AI TikTok liên tục quét giọng nói TTS và văn bản. Việc tự động chuyển tự giúp tài khoản tránh bị bóp reach hoặc ăn khóa gậy gộc vô cớ.",
      botIdeaTitle: "LÕI TRÍ TUỆ GIỮA SÂN KHẤU (GEMINI ENGINE)",
      botIdeaDesc: "Tự động kích hoạt khi phòng chat im ắng quá 30 giây. Trợ lý Gemini sẽ tự soạn nội đặt vấn đề, chủ động đặt câu hỏi hoặc thả thính cực lầy lội để kéo giữ chân người xem ở lại lâu hơn.",
      gameGuideTitle: "BẢNG CÚ PHÁP TƯƠNG TÁC MINIGAMES LÀM CHỦ PHÒNG CHAT",
      gameGuideDesc: "Hướng dẫn người xem tương tác trực tiếp với Livestream của bạn bằng cách gõ các lệnh đơn giản sau vào ô chat:",
      cmdCmd: "LỆNH CHAT",
      cmdTarget: "MINIGAME ÁP DỤNG",
      cmdEffect: "HIỆU QUẢ HOẠT ĐỘNG"
    },
    en: {
      title: "USER GUIDE & LIVESTREAM STUDIO HANDBOOK",
      desc: "Fully equip yourself with knowledge to master your livestream - Hotkeys, auto-replies, and professional AI tools.",
      tabHotkeys: "💥 Hotkeys Shortcut",
      tabAudio: "🎙️ Audio Routing Setup",
      tabAntisan: "🤖 TikTok Antiban & AI (PRO)",
      tabCommands: "🎮 Game Commands",
      tabAutoreply: "💬 Auto-Reply Scripts",
      kbdAction: "ACTION",
      kbdKey: "SHORTCUT KEY",
      kbdDesc: "EFFECT & DESCRIPTION",
      instantToggleMic: "Instant Mic Mute / Unmute",
      instantToggleMicDesc: "Quickly toggle your microphone without clicking the mouse during private talks, drink breaks or coughs.",
      instantStopAll: "Force Stop All BG & Beats",
      instantStopAllDesc: "Stop both app background music and vocal processor karaoke tracks instantly when starting highly focused chats.",
      playMemeSound: "Play Soundpad Memes 1-9",
      playMemeSoundDesc: "Trigger classic funny reactions using keys 1 to 9 corresponding to your soundpad tracks list without mouse hover.",
      howToRouteTitle: "PROFESSIONAL AUDIO ROUTING TOPOLOGY (VB-CABLE)",
      howToRouteDesc: "To prevent echo loops, low microphone feedback, or audio overlay with AI Bot TTS, please apply the 3-Way independent routing logic below:",
      stream1: "VOCAL WATERWAY (MIC & SOUNDCARD K10)",
      stream1Desc: "Process real voice directly via Vocal Processor (Compressor, Hall Reverb, Echo) to hear clean real-time feedback with zero lags.",
      stream2: "MUSIC & SOUND EFFECTS WATERWAY (VB-CABLE)",
      stream2Desc: "Redirect your BGM and Soundpad output to high accuracy CABLE Input. On OBS, create a source pointing to CABLE Output.",
      stream3: "SPEECH READER WATERWAY (AI BOT TTS)",
      stream3Desc: "Output speech synthesis straight to your main computer speakers so it doesn't get echo-warped by the singing card effects.",
      obsTrick: "💡 Perfect OBS Studio Integration Guide:",
      obsTrickDesc: "Add input audio captures in OBS: One for Mic/Aux (K10 Soundcard) for your dry/wet voice; and one for Desktop Audio (CABLE output) for background melodies. This keeps AI stream narrations crystal clear and highly professional!",
      antiScanTitle: "TIKTOK POLICY EVASION & GEMINI BRAIN",
      antiScanDesc: "The AI platform auto-scans and instantly parses unsafe marketing words into stream-friendly equivalent metaphors.",
      avoidWord: "Original Keyword",
      safeWord: "Safe Translation",
      safeAction: "Protection Pattern",
      avoidTiktokExplain: "TikTok crawlers actively flag words spoken aloud or in chat. Our engine replaces sensitive slang with organic gaming terms.",
      botIdeaTitle: "THE POWER OF GEMINI (CREATIVE INTELLIGENCE)",
      botIdeaDesc: "If the stream is silent for over 30 seconds, Gemini activates. It generates fascinating questions and pick-up lines to trigger massive engagement.",
      gameGuideTitle: "INTERACTIVE MINIGAMES CHATSHEET",
      gameGuideDesc: "Let your viewers actively control gameplay on your canvas by typing these simple commands into the live chat feed:",
      cmdCmd: "CHAT COMMAND",
      cmdTarget: "TARGET GAME",
      cmdEffect: "FUNCTIONAL OUTCOME"
    },
    zh: {
      title: "直播管理助手及快捷键说明手册",
      desc: "配齐专业直播控场所需的全部硬核技能——按键绑定、自动回复、音轨分离及AI防封方案。",
      tabHotkeys: "💥 键盘快捷键",
      tabAudio: "🎙️ 虚拟声卡分流",
      tabAntisan: "🤖 避开检测与 AI (PRO)",
      tabCommands: "🎮 小游戏观众指令",
      tabAutoreply: "💬 自动回复脚本",
      kbdAction: "操作名称",
      kbdKey: "快捷按键",
      kbdDesc: "作用描述",
      instantToggleMic: "快速开启 / 关闭麦克风",
      instantToggleMicDesc: "无需移动鼠标，一键快速静音麦克风，适合喝水、咳嗽或私密交谈场景。",
      instantStopAll: "一键暂停背景音乐与伴奏",
      instantStopAllDesc: "紧急停止应用内的背景音乐(BGM)及人声处理器内的K歌伴奏，便于进行深入交互。",
      playMemeSound: "快速触发 Soundpad 搞怪音效 1-9",
      playMemeSoundDesc: "对应 Soundpad 播放列表中的前 9 个音效。按键盘数字键 1 到 9 即可无延迟播放。",
      howToRouteTitle: "VB-AUDIO 虚拟导轨广播级分流架构",
      howToRouteDesc: "为彻底避免混响回路、声反馈哮叫以及AI朗读声被效果器二次污染，请参考以下黄金三通道架构：",
      stream1: "人声捕获声道 (麦克风与 K10 声卡驱动)",
      stream1Desc: "人声原音进入 Vocal Processor 处理。无延迟通过耳机接口进行监听，声音纯净无回音。",
      stream2: "背景乐与特效声道 (VB-CABLE 虚拟线路)",
      stream2Desc: "将伴奏音乐与搞笑音效的输出通道定向至 CABLE Input，OBS添加对应 CABLE Output 进行统一控音。",
      stream3: "AI 主播朗读声道 (BOT 播报话筒)",
      stream3Desc: "朗读音轨直接输出至电脑物理扬声器或独立音响，确保观众听到的语音播报清晰有力、不沾混响！",
      obsTrick: "💡 OBS Studio 旗舰级设置技巧：",
      obsTrickDesc: "在 OBS 中创建两个独立的输入采集：一是 Mic/Aux（K10声卡）专收人声；二是桌面音频（CABLE虚拟源）专收背景伴奏。这样，AI 的语音播报就能保持独立、无杂音、更专业！",
      antiScanTitle: "敏感词自动防封规避系统与 GEMINI 核心",
      antiScanDesc: "AI 交互引擎会自动检测有封号风险的营销性、敏感类词汇，并自动翻译为诙谐的替代词。",
      avoidWord: "潜在违规词",
      safeWord: "谐音安全替代词",
      safeAction: "防封规避逻辑",
      avoidTiktokExplain: "抖音/TikTok 的风控系统会对语音和弹幕进行实时语义审查。自动混淆技术可大幅减少直播间被恶意限流或封禁的风险。",
      botIdeaTitle: "GEMINI 互动智慧大脑",
      botIdeaDesc: "当直播间冷场（无任何弹幕弹起）超过30秒时，Gemini 智能引擎自主研判。自动发起话题讨论，甚至说出土味情话来活跃粉圈气氛！",
      gameGuideTitle: "弹幕互动游戏观众命令行大全",
      gameGuideDesc: "观众只需在您的直播间弹幕窗口中输入以下指令，即可即时参与到画面中的互動游戏：",
      cmdCmd: "弹幕指令",
      cmdTarget: "适用游戏",
      cmdEffect: "游戏反馈效果"
    }
  };

  const t = dict[webLang as "vi" | "en" | "zh"] || dict.vi;

  return (
    <div className="glass-panel rounded-xl p-5 shadow-2xl border border-cyan-500/20 bg-[#070412]/90 mt-4 relative overflow-hidden" id="user-guide-container">
      {/* Background radial effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 mb-5 gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 flex items-center gap-2 tracking-wide text-left">
            <BookOpen className="w-4 h-4 text-cyan-400 animate-pulse" />
            {t.title}
          </h2>
          <p className="text-[10px] text-slate-400 text-left">
            {t.desc}
          </p>
        </div>
        <span className="text-[9px] font-mono font-bold bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full text-cyan-300 uppercase tracking-widest shrink-0">
          PRO HANDBOOK V5
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveTab("hotkeys")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeTab === "hotkeys" 
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-md shadow-cyan-500/10" 
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
          id="btn-guide-tab-hotkeys"
        >
          <Keyboard className="w-3.5 h-3.5" />
          {t.tabHotkeys}
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeTab === "audio" 
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-500/10" 
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
          id="btn-guide-tab-audio"
        >
          <Volume2 className="w-3.5 h-3.5" />
          {t.tabAudio}
        </button>

        <button
          onClick={() => setActiveTab("antisan")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeTab === "antisan" 
              ? "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-md shadow-pink-500/10" 
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
          id="btn-guide-tab-antisan"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {t.tabAntisan}
        </button>

        <button
          onClick={() => setActiveTab("commands")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeTab === "commands" 
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10" 
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
          id="btn-guide-tab-commands"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          {t.tabCommands}
        </button>

        <button
          onClick={() => setActiveTab("autoreply")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
            activeTab === "autoreply" 
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/10" 
              : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
          }`}
          id="btn-guide-tab-autoreply"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {t.tabAutoreply}
        </button>
      </div>

      {/* Active Tab Panels with transition anim */}
      <div className="bg-[#030206]/40 rounded-xl p-4 border border-white/5 min-h-[300px]">
        {activeTab === "hotkeys" && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Table layout of Hotkeys */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-extrabold pb-2">
                    <th className="py-2.5 px-3 uppercase text-[10px] tracking-wider text-cyan-400">{t.kbdAction}</th>
                    <th className="py-2.5 px-3 uppercase text-[10px] tracking-wider text-purple-400 text-center">{t.kbdKey}</th>
                    <th className="py-2.5 px-3 uppercase text-[10px] tracking-wider text-slate-400">{t.kbdDesc}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-cyan-400" />
                      {t.instantToggleMic}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <kbd className="bg-gradient-to-b from-slate-800 to-slate-930 text-white border border-slate-700 font-extrabold rounded px-2 py-0.5 text-xs shadow-md">M</kbd>
                    </td>
                    <td className="py-3 px-3 text-slate-400 leading-relaxed text-left">
                      {t.instantToggleMicDesc}
                    </td>
                  </tr>

                  <tr className="hover:bg-rose-500/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-rose-400" />
                      {t.instantStopAll}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <kbd className="bg-gradient-to-b from-slate-800 to-slate-930 text-white border border-slate-700 font-extrabold rounded px-2 py-0.5 text-xs shadow-md">S</kbd>
                    </td>
                    <td className="py-3 px-3 text-slate-400 leading-relaxed text-left">
                      {t.instantStopAllDesc}
                    </td>
                  </tr>

                  <tr className="hover:bg-indigo-500/5 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      {t.playMemeSound}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <kbd className="bg-gradient-to-b from-slate-800 to-slate-930 text-white border border-slate-700 font-extrabold rounded px-2 py-0.5 text-xs shadow-md">1</kbd> - <kbd className="bg-gradient-to-b from-slate-800 to-slate-930 text-white border border-slate-700 font-extrabold rounded px-2 py-0.5 text-xs shadow-md">9</kbd>
                    </td>
                    <td className="py-3 px-3 text-slate-400 leading-relaxed text-left">
                      {t.playMemeSoundDesc}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#100927]/90 p-3 rounded-lg border border-indigo-500/20 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5 text-left">
              <span className="text-lg">💡</span>
              <p>
                <strong>Stream Deck Ảo chuyên nghiệp:</strong> Nhấn tổ hợp phím này ở bất cứ đâu trong màn hình Livestream (khi không trong ô nhập văn bản) để phản hồi người xem nhanh hơn tốc độ ánh sáng!
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "audio" && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">{t.howToRouteTitle}</h3>
              <p className="text-[10px] text-slate-400">{t.howToRouteDesc}</p>
            </div>

            {/* Visual routing flow diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#0c0a1f] p-3 rounded-xl border border-white/5 space-y-2 relative">
                <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-mono font-black bg-emerald-500/10 text-emerald-400 rounded">CH-1</div>
                <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-tight flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> {t.stream1}
                </h4>
                <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                  {t.stream1Desc}
                </p>
              </div>

              <div className="bg-[#090b22] p-3 rounded-xl border border-white/5 space-y-2 relative">
                <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-mono font-black bg-cyan-500/10 text-cyan-400 rounded">CH-2</div>
                <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-tight flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> {t.stream2}
                </h4>
                <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                  {t.stream2Desc}
                </p>
              </div>

              <div className="bg-[#140b28] p-3 rounded-xl border border-white/5 space-y-2 relative">
                <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[8px] font-mono font-black bg-pink-500/10 text-pink-400 rounded">CH-3</div>
                <h4 className="text-[11px] font-bold text-pink-400 uppercase tracking-tight flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> {t.stream3}
                </h4>
                <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                  {t.stream3Desc}
                </p>
              </div>
            </div>

            {/* Signal Flow Visual block */}
            <div className="bg-[#050308]/60 p-3 rounded-lg border border-white/10 font-mono text-[10px] space-y-2 text-slate-400">
              <div className="text-center font-bold text-indigo-400 border-b border-indigo-500/20 pb-1.5 uppercase text-[9px] tracking-widest">
                ⚙️ HỆ THỐNG PHÂN PHỐI TÍN HIỆU AUDIO SIG-FLOW:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 text-center text-[10px]">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded p-1.5 text-emerald-300">
                  🎙️ MIC DÒNG HÁT
                </div>
                <div className="text-slate-600 hidden md:block">➔</div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-1.5 text-cyan-300">
                  🎛️ LOW-CUT / COMPRESSOR
                </div>
                <div className="text-slate-600 hidden md:block">➔</div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded p-1.5 text-purple-300">
                  🎧 LÕI MIXER TAI NGHE / OBS
                </div>
              </div>
            </div>

            {/* OBS Guide box */}
            <div className="bg-cyan-500/5 border border-cyan-500/20 p-3.5 rounded-lg space-y-1.5">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                {t.obsTrick}
              </h4>
              <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                {t.obsTrickDesc}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "antisan" && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-pink-400" />
                {t.antiScanTitle}
              </h3>
              <p className="text-[10px] text-slate-400">{t.antiScanDesc}</p>
            </div>

            {/* Word mappings overview */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300 font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-extrabold text-left">
                    <th className="py-2 px-3 text-red-400 uppercase text-[9px] tracking-wider">{t.avoidWord}</th>
                    <th className="py-2 px-3 text-slate-400"></th>
                    <th className="py-2 px-3 text-emerald-400 uppercase text-[9px] tracking-wider">{t.safeWord}</th>
                    <th className="py-2 px-3 text-cyan-400 uppercase text-[9px] tracking-wider">{t.safeAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-red-300 line-through">tiền / nạp tiền</td>
                    <td className="py-2.5 px-3"><ArrowRight className="w-3.5 h-3.5 text-slate-600" /></td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">lúa / làm ấm tài khoản</td>
                    <td className="py-2.5 px-3 text-slate-400">Giảm tỷ lệ quét vi phạm thương nghiệp.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-red-300 line-through">xu (món quà ảo)</td>
                    <td className="py-2.5 px-3"><ArrowRight className="w-3.5 h-3.5 text-slate-600" /></td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">hạt dẻ</td>
                    <td className="py-2.5 px-3 text-slate-400">Tránh cảnh báo kêu gọi rút ví người xem.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-red-300 line-through">chia sẻ / share</td>
                    <td className="py-2.5 px-3"><ArrowRight className="w-3.5 h-3.5 text-slate-600" /></td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">gieo hạt yêu thương</td>
                    <td className="py-2.5 px-3 text-slate-400">Làm mượt giọng BOT khi tương tác TikTok.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-red-300 line-through">mắt xem / follow</td>
                    <td className="py-2.5 px-3"><ArrowRight className="w-3.5 h-3.5 text-slate-600" /></td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">móc treo / người quan tâm</td>
                    <td className="py-2.5 px-3 text-slate-400">E ngại thuật toán quét hành vi bất thường.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-red-300 line-through">đô la / đô</td>
                    <td className="py-2.5 px-3"><ArrowRight className="w-3.5 h-3.5 text-slate-600" /></td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">đá ngọt</td>
                    <td className="py-2.5 px-3 text-slate-400">Nói giảm nói tránh dính kiểm duyệt tài sản.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#100318]/90 p-3 rounded-lg border border-pink-500/10 text-[11px] leading-relaxed italic text-slate-400">
              ℹ️ {t.avoidTiktokExplain}
            </div>

            {/* Smart Gemini info */}
            <div className="bg-gradient-to-r from-cyan-500/5 to-purple-500/5 p-4 rounded-xl border border-cyan-500/20 space-y-1.5">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-bounce" /> {t.botIdeaTitle}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {t.botIdeaDesc}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "commands" && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-amber-500" />
                {t.gameGuideTitle}
              </h3>
              <p className="text-[10px] text-slate-400">{t.gameGuideDesc}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300 font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-extrabold text-left">
                    <th className="py-2.5 px-3 text-amber-400 uppercase text-[9px] tracking-wider">{t.cmdCmd}</th>
                    <th className="py-2.5 px-3 text-slate-300 uppercase text-[9px] tracking-wider">{t.cmdTarget}</th>
                    <th className="py-2.5 px-3 text-slate-400">{t.cmdEffect}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-3 px-3"><code className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded text-[11px]">!battle</code></td>
                    <td className="py-3 px-3 font-semibold text-slate-100">Đấu Trường Sinh Tử</td>
                    <td className="py-3 px-3 text-slate-400">Khán giả gõ tham gia hàng chờ tự bốc ngẫu nhiên chiến đấu sinh tồn nhân phẩm.</td>
                  </tr>

                  <tr className="hover:bg-pink-500/5 transition-colors">
                    <td className="py-3 px-3">
                      <code className="text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded text-[11px]">!cauhoi</code>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-100">Đố Vui Trí Tuệ</td>
                    <td className="py-3 px-3 text-slate-400 font-sans">Triệu hồi ngân hàng câu hỏi IQ. Khán giả trả lời bằng cú pháp: <code>A / B / C / D</code>. Người nhanh nhất được ghi điểm.</td>
                  </tr>

                  <tr className="hover:bg-cyan-500/5 transition-colors">
                    <td className="py-3 px-3"><code className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded text-[11px]">!noitu [từ]</code></td>
                    <td className="py-3 px-3 font-semibold text-slate-100">Nối Từ Tiếng Việt</td>
                    <td className="py-3 px-3 text-slate-400">Bắt đầu chuỗi từ khóa. Người chơi tiếp theo phải nối từ có nghĩa bắt đầu bằng từ cuối của người trước.</td>
                  </tr>

                  <tr className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-3 px-3">
                      <code className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">!chem</code> / <code className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">!ban</code>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-100">Săn Boss Co-op</td>
                    <td className="py-3 px-3 text-slate-400 text-left">Gây sát thương tích lũy tiêu diệt Boss. Phần thưởng lúa/bạc được phân chia tỷ lệ vàng dựa trên % sát thương mỗi người gây ra.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-lg">
              <p className="text-[10px] text-slate-300 leading-relaxed">
                💡 <strong>Mẹo giữ chân khán giả:</strong> Hãy thường xuyên nhắc nhở người xem gõ <code>!battle</code> hoặc <code>!cauhoi</code> để hâm nóng bầu không khí. Lõi thuyết minh của AI sẽ tự động đọc diễn biến, chọc ghẹo và làm người xem vừa chơi vừa cười nghiêng ngả!
              </p>
            </div>
          </motion.div>
        )}
        {activeTab === "autoreply" && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                {webLang === 'en' ? 'AUTO-REPLY SYSTEM (FREE BASIC O.S)' : webLang === 'zh' ? '自动回复系统 (基础功能)' : 'HỆ THỐNG TRẢ LỜI TỰ ĐỘNG (MIỄN PHÍ TRÊN BẢN BASIC)'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {webLang === 'en' ? 'Quickly define auto-responses triggered by specific viewer command phrases. E.g., !shop = check out the link!' : webLang === 'zh' ? '快速指定被观众特定命令触发的自动回复。例如，!shop = 点击连接！' : 'Chỉ định nhanh các câu trả lời tự động được kích hoạt khi khán giả gõ một từ khóa mệnh lệnh nhất định.'}
              </p>
            </div>

            <div className="bg-[#030308]/60 p-4 rounded-xl border border-emerald-500/10 space-y-3">
              <h4 className="text-[11px] font-bold text-emerald-300 uppercase">
                {webLang === 'en' ? 'Syntax Configuration' : webLang === 'zh' ? '语法配置' : 'Cú Pháp Cấu Hình (Ở mục Thiết Lập)'}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                [TỪ KHOÁ] : [NỘI DUNG CẦN TRẢ LỜI]
              </p>
              <div className="space-y-1 text-[11px] font-mono text-slate-400 bg-emerald-500/5 p-3 rounded border border-emerald-500/10">
                Lưu ý: Bạn nhập mỗi lệnh gốc trên một dòng riêng biệt.<br />Ví dụ:<br />
                <span className="text-emerald-300">!gia : Dạ bảng giá nằm ở giỏ hàng góc trái bạn nha!</span><br />
                <span className="text-emerald-300">!lienhe : Bạn inbox góc phải page để đội ngũ hỗ trợ nhé.</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-lg">
              <p className="text-[10px] text-slate-300 leading-relaxed">
                💡 <strong>{webLang === 'en' ? 'PRO VIP DIFFERENTIATION:' : webLang === 'zh' ? 'VIP PRO 的区别:' : 'PHÂN BIỆT VỚI BẢN PRO:'}</strong> {webLang === 'en' ? 'This feature is a basic dictionary auto-reply limit and ignores context. To unlock full Contextual Understanding, Emotion Simulation, and the genuine Gemini Bot Ecosystem experience, please unlock the PRO subscription (Requires OpenAI/Gemini API configurations).' : webLang === 'zh' ? '这是一个基于字典和关键字的基本回复限制，它忽略了上下文。要解锁完整语境理解，情绪模拟以及真正的 Gemini Bot 系统体验，请解锁 PRO 订阅。' : 'Tính năng Kịch Bản Tự Động này chỉ hoạt động theo Dòng lệnh cơ bản (Dictionary-based) và MIỄN PHÍ. Để sử dụng Hệ sinh thái AI Độc Quyền (Gemini/OpenAI) đọc & hiểu ngữ cảnh linh hoạt như con người thay vì trả lời như máy móc, bạn vui lòng Đăng ký gói VIP PRO.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
