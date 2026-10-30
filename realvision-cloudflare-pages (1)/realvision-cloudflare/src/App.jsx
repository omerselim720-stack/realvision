import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Zap,
  Camera,
  Sun,
  Maximize2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Wand2,
  Trash2,
  Clock,
  Aperture,
  Layers,
  Eye,
  Upload,
  X,
  Film,
  Shield,
  Send,
  Heart,
  Info
} from 'lucide-react';

// --- KAMERA & LENS PRESETLERİ (8K RAW & 4K UHD MOTORU) ---
const CAMERA_PRESETS = [
  {
    id: 'sony-portrait',
    name: 'Sony A7R V 85mm f/1.4 Portre',
    shortBadge: 'Sony A7R V • 85mm',
    desc: 'Doğal cilt dokusu, gözenek detayları ve kremsi bokeh arka plan',
    modifiers:
      'shot on Sony A7R V, 85mm f/1.4 GM lens, ultra-detailed realistic skin texture with natural pores, subsurface scattering, sharp catchlights in eyes, shallow depth of field, creamy bokeh, 8K RAW, 4K UHD, natural atmospheric lighting, photorealistic'
  },
  {
    id: 'arri-cinematic',
    name: 'ARRI Alexa 65 Sinematik',
    shortBadge: 'ARRI Alexa 65 • 35mm',
    desc: 'Sinema filmi derinliği, dramatik atmosfer ve gerçekçi renk bilimi',
    modifiers:
      'shot on ARRI Alexa 65, Panavision Primo 35mm anamorphic lens, cinematic film still, true-to-life color grading, volumetric atmospheric depth, organic film grain, high dynamic range, 8K RAW, 4K UHD, realistic skin texture, natural atmospheric lighting'
  },
  {
    id: 'leica-street',
    name: 'Leica M11 Sokak Fotoğrafçılığı',
    shortBadge: 'Leica M11 • 28mm',
    desc: 'Anlık doğal yakalama, gerçekçi şehir dokusu ve samimi ışık',
    modifiers:
      'shot on Leica M11, Summilux 28mm f/1.4 lens, candid street photography, authentic urban textures, natural environmental reflections, documentary realism, crisp micro-contrast, 8K RAW, 4K UHD, natural atmospheric lighting'
  },
  {
    id: 'imax-wide',
    name: 'IMAX 70mm Geniş Açı',
    shortBadge: 'IMAX 70mm • 18mm',
    desc: 'Devasa ölçek, ultra keskin manzara/mimari detaylar ve sonsuz derinlik',
    modifiers:
      'shot on IMAX 70mm film camera, 18mm ultra-wide rectilinear lens, expansive scale, edge-to-edge optical sharpness, physically accurate reflections, global illumination, 8K RAW, 4K UHD, natural atmospheric lighting, hyper-realistic photography'
  }
];

// --- IŞIK & ATMOSFER PRESETLERİ ---
const LIGHTING_PRESETS = [
  {
    id: 'atmospheric',
    name: 'Atmosferik Sinematik Işık',
    modifiers:
      'natural atmospheric lighting, volumetric light rays, realistic shadows, balanced dynamic range, lifelike ambiance'
  },
  {
    id: 'golden-hour',
    name: 'Altın Saat',
    modifiers:
      'warm golden hour sunlight, low sun angle, soft rim lighting, natural lens flare, warm organic tones, natural atmospheric lighting'
  },
  {
    id: 'studio-softbox',
    name: 'Stüdyo Softbox',
    modifiers:
      'professional three-point studio lighting, Profoto octabox key light, subtle rim light, controlled reflections, realistic skin texture'
  },
  {
    id: 'neon-night',
    name: 'Neon Gece',
    modifiers:
      'nighttime city ambiance, realistic neon reflections on wet asphalt, cinematic moody street lights, high contrast, natural atmospheric lighting'
  }
];

// --- KADRAJ / EN-BOY ORANLARI ---
const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', desc: 'Kare', boxClass: 'aspect-square max-h-[520px]' },
  { id: '16:9', label: '16:9', desc: 'Sinematik', boxClass: 'aspect-video max-h-[500px]' },
  { id: '9:16', label: '9:16', desc: 'Dikey / Story', boxClass: 'aspect-[9/16] max-h-[540px]' },
  { id: '4:3', label: '4:3', desc: 'Klasik Sensör', boxClass: 'aspect-[4/3] max-h-[520px]' }
];

// --- HIZLI RÖTUŞ (LIVE RETOUCH) HAZIR AKSİYONLARI ---
const QUICK_RETOUCH_CHIPS = [
  {
    label: '✨ 8K Mikro Detay & Keskinlik',
    instruction: 'Enhance micro-surface textures, realistic skin pores, razor-sharp 8K RAW optical clarity'
  },
  {
    label: '🌅 Altın Saat Işığına Çevir',
    instruction: 'Change the lighting to warm Golden Hour sunset with soft rim light and natural lens flare'
  },
  {
    label: '🌧️ Yağmurlu & Sinematik Atmosfer',
    instruction: 'Add realistic rain droplets, wet reflective surfaces, and moody cinematic atmospheric fog'
  },
  {
    label: '📷 Arka Planı Bulanıklaştır (f/1.2 Bokeh)',
    instruction: 'Create an ultra-shallow f/1.2 depth of field with creamy optical bokeh background while keeping the subject tack-sharp'
  },
  {
    label: '🌃 Gece & Şehir Işıkları',
    instruction: 'Transform the scene into nighttime with realistic street light reflections and deep cinematic contrast'
  }
];

// --- ÖRNEK GERÇEKÇİ SAHNELER ---
const SAMPLE_PROMPTS = [
  'Yağmurlu bir akşamda İstanbul Galata Kulesi sokağında yürüyen siyah paltolu bir kişi, ıslak taş zeminde sarı sokak lambası yansımaları',
  'Karadeniz yaylasında sisli bir sabah, ahşap dağ evinin verandasında dumanı tüten çay bardağı, arkada çam ormanı ve çiğ damlaları',
  '30 yaşlarında keskin bakışlı bir portre, pencereden süzülen doğal yan ışık, gerçekçi cilt dokusu, çiller ve doğal göz yansıması',
  'Gece Boğaz köprüsü manzarasına karşı park edilmiş mat siyah spor otomobil, asfalt üzerinde yağmur damlaları ve neon yansımalar',
  'Güneş ışığı huzmeleri altında geleneksel bir atölyede kahve demleyen barista, havada uçuşan ince su buharı ve gerçekçi ahşap dokusu',
  'Kuzey ışıkları altında buzulların üzerinde duran kutup kurdu, kürkündeki kar kristalleri, kristal netliğinde gece gökyüzü'
];

// Üstel geri çekilme (Exponential Backoff) ile API çağrısı
async function fetchWithBackoff(url, options, retries = 3) {
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
      if (response.status === 429 || response.status >= 500) {
        if (i === retries - 1) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson?.error?.message || `Sunucu hatası (${response.status})`);
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `İstek hatası (${response.status})`);
      }
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    await new Promise((r) => setTimeout(r, delay));
    delay *= 2;
  }
}

export default function App() {
  // --- STATE TANIMLARI ---
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [negativePrompt, setNegativePrompt] = useState(
    'anime, çizim, karikatür, 3D render, CGI, plastik cilt, aşırı pürüzsüz, yapay görünüm, bulanık, bozuk anatomi, filigran, yazı'
  );
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_PRESETS[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [qualityMode, setQualityMode] = useState('8K RAW'); // '8K RAW' | '4K UHD'
  const [realismEngineActive, setRealismEngineActive] = useState(true);

  // Gerçek Zamanlı Mod (Canlı Mod)
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [debounceMs, setDebounceMs] = useState(1000);
  const [liveStatus, setLiveStatus] = useState('idle'); // 'idle' | 'waiting' | 'generating' | 'ready'

  // Üretim & Rötuş Durumları
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  // Hızlı Rötuş & Çok Adımlı Düzenleme
  const [retouchText, setRetouchText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [referenceImage, setReferenceImage] = useState(null);

  // Arayüz Sekme ve Modalları
  const [activeLeftTab, setActiveLeftTab] = useState('presets'); // 'presets' | 'engine' | 'gallery'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRawPrompt, setShowRawPrompt] = useState(false);

  // Referanslar
  const latestRequestId = useRef(0);
  const debounceTimer = useRef(null);
  const initialRunDone = useRef(false);
  const fileInputRef = useRef(null);

  // Kısa bildirim gösterici
  const triggerToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3000);
  }, []);

  // Yükleme adımı animasyonu
  useEffect(() => {
    if (!isGenerating) {
      setLoadingStep(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 4);
    }, 1300);
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Fotogerçekçi Prompt Derleyici (Otomatik 4K UHD, 8K RAW, realistic skin texture, natural atmospheric lighting ekler)
  const compilePhotorealisticPrompt = useCallback(
    (userText, retouchInstruction = '') => {
      const baseParameters =
        '4K UHD, 8K RAW, realistic skin texture, natural atmospheric lighting, physically accurate reflections, zero CGI artifacts, authentic DSLR photograph';

      if (retouchInstruction) {
        return `${retouchInstruction}. Keep the scene photorealistic with ${baseParameters}, ${selectedCamera.modifiers}, ${selectedLighting.modifiers}.`;
      }

      const segments = [
        `Photorealistic ${qualityMode} photograph: ${userText.trim()}.`,
        selectedCamera.modifiers,
        selectedLighting.modifiers
      ];

      if (realismEngineActive) {
        segments.push(baseParameters);
      }

      if (negativePrompt.trim()) {
        segments.push(`Strictly exclude: ${negativePrompt.trim()}.`);
      }

      return segments.join(' ');
    },
    [selectedCamera, selectedLighting, qualityMode, realismEngineActive, negativePrompt]
  );

  // --- GÖRSEL ÜRETİM FONKSİYONU ---
  const generateRealisticImage = useCallback(
    async ({ isRetouch = false, customRetouch = '', source = 'manual' } = {}) => {
      const rawText = isRetouch ? customRetouch : prompt;
      if (!rawText || !rawText.trim()) {
        if (source === 'manual') {
          triggerToast('Lütfen üretmek istediğiniz görseli yazın.');
        }
        return;
      }

      const reqId = ++latestRequestId.current;
      setIsGenerating(true);
      setLiveStatus('generating');
      setErrorMsg(null);

      const finalCompiledPrompt = compilePhotorealisticPrompt(
        prompt,
        isRetouch ? customRetouch : ''
      );
      const primaryUrl = '/api/generate';

      try {
        let payload;

        if (isRetouch && chatHistory.length > 0) {
          payload = {
            contents: [
              ...chatHistory,
              {
                role: 'user',
                parts: [{ text: finalCompiledPrompt }]
              }
            ],
            generationConfig: {
              responseModalities: ['IMAGE'],
              imageConfig: { aspectRatio }
            }
          };
        } else if (referenceImage) {
          payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  { text: finalCompiledPrompt },
                  {
                    inlineData: {
                      mimeType: referenceImage.mimeType,
                      data: referenceImage.data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE']
            }
          };
        } else {
          payload = {
            contents: [
              {
                role: 'user',
                parts: [{ text: finalCompiledPrompt }]
              }
            ],
            generationConfig: {
              responseModalities: ['IMAGE'],
              imageConfig: { aspectRatio }
            }
          };
        }

        const startMs = performance.now();
        let result;

        try {
          result = await fetchWithBackoff(primaryUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gemini-3.1-flash-image', payload })
          });
        } catch (primaryErr) {
          // Yedek hızlı görüntü modeli (gemini-3.1-flash-lite-image)
          const fallbackUrl = '/api/generate';
          result = await fetchWithBackoff(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'gemini-3.1-flash-lite-image', payload: {
              contents: [{ parts: [{ text: finalCompiledPrompt }] }],
              generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
            } })
          });
        }

        // Daha yeni bir gerçek zamanlı istek tetiklendiyse eski yanıtı yoksay
        if (reqId !== latestRequestId.current) return;

        const candidate = result?.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find((p) => p.inlineData);

        if (!imagePart?.inlineData?.data) {
          throw new Error('Görsel verisi oluşturulamadı. Lütfen tarifinizi biraz değiştirip tekrar deneyin.');
        }

        const elapsedSec = ((performance.now() - startMs) / 1000).toFixed(1);
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;

        if (candidate?.content) {
          if (isRetouch && chatHistory.length > 0) {
            setChatHistory((prev) => [
              ...prev,
              { role: 'user', parts: [{ text: finalCompiledPrompt }] },
              candidate.content
            ]);
          } else {
            setChatHistory([
              { role: 'user', parts: [{ text: finalCompiledPrompt }] },
              candidate.content
            ]);
          }
        }

        const newItem = {
          id: `rv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          url: dataUrl,
          prompt: isRetouch ? `${prompt} • [Rötuş: ${customRetouch}]` : prompt,
          compiledPrompt: finalCompiledPrompt,
          cameraName: selectedCamera.name,
          cameraBadge: selectedCamera.shortBadge,
          lightingName: selectedLighting.name,
          aspectRatio,
          qualityMode,
          duration: elapsedSec,
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          favorite: false,
          isLive: source === 'realtime'
        };

        setCurrentImage(newItem);
        setGallery((prev) => [newItem, ...prev]);
        setLiveStatus('ready');

        if (isRetouch) {
          setRetouchText('');
          triggerToast('🪄 Hızlı Rötuş başarıyla uygulandı!');
        }
      } catch (err) {
        if (reqId === latestRequestId.current) {
          setErrorMsg(err.message || 'Görsel üretilirken bir hata oluştu.');
          setLiveStatus('idle');
        }
      } finally {
        if (reqId === latestRequestId.current) {
          setIsGenerating(false);
        }
      }
    },
    [
      prompt,
      compilePhotorealisticPrompt,
      chatHistory,
      referenceImage,
      aspectRatio,
      selectedCamera,
      selectedLighting,
      qualityMode,
      triggerToast
    ]
  );

  // İlk açılışta örnek sahneyi otomatik üret
  useEffect(() => {
    if (!initialRunDone.current) {
      initialRunDone.current = true;
      generateRealisticImage({ source: 'realtime' });
    }
  }, [generateRealisticImage]);

  // --- GERÇEK ZAMANLI ÜRETİM (CANLI MOD) DEBOUNCE MOTORU ---
  useEffect(() => {
    if (!realTimeMode) {
      setLiveStatus('idle');
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      return;
    }

    if (!prompt.trim() || prompt.trim().length < 4) return;

    setLiveStatus('waiting');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      generateRealisticImage({ source: 'realtime' });
    }, debounceMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    prompt,
    selectedCamera,
    selectedLighting,
    aspectRatio,
    qualityMode,
    realismEngineActive,
    realTimeMode,
    debounceMs
  ]);

  // --- ✨ AI İLE DETAYLANDIR (GEMINI 3 FLASH PREVIEW) ---
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    const url = '/api/generate';

    const systemInstruction =
      'Sen ödüllü bir fotogerçekçi görüntü yönetmenisin. Kullanıcının kısa Türkçe görsel tarifini; gerçekçi ışık kırılması, lens derinliği, doğal cilt/yüzey dokusu ve atmosferik detaylar ekleyerek 2-3 cümlelik çok zengin ve kusursuz bir Türkçe fotoğraf promptuna dönüştür. Sadece doğrudan yeni Türkçe prompt metnini döndür, başlık veya tırnak işareti kullanma.';

    try {
      const data = await fetchWithBackoff(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gemini-3-flash-preview', payload: {
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        } })
      });

      const enhanced = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (enhanced) {
        setPrompt(enhanced);
        triggerToast('✨ Prompt fotogerçekçi detaylarla zenginleştirildi!');
      }
    } catch (e) {
      triggerToast('Prompt detaylandırılırken bir sorun oluştu.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Rastgele Sahne Getir
  const handleSurprisePrompt = () => {
    const pool = SAMPLE_PROMPTS.filter((p) => p !== prompt);
    const next = pool[Math.floor(Math.random() * pool.length)] || SAMPLE_PROMPTS[0];
    setPrompt(next);
    triggerToast('Yeni fotogerçekçi sahne yüklendi!');
  };

  // Referans Görsel Yükleme
  const handleUploadReference = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      const base64 = res.split(',')[1];
      if (base64) {
        setReferenceImage({
          data: base64,
          mimeType: file.type || 'image/png',
          preview: res,
          name: file.name
        });
        triggerToast('Referans fotoğraf eklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Tek Tıkla İndir
  const handleDownload = (target = currentImage) => {
    if (!target?.url) return;
    const a = document.createElement('a');
    a.href = target.url;
    a.download = `RealVision-AI-${target.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast('Yüksek çözünürlüklü görsel indiriliyor...');
  };

  // Prompt Kopyala
  const handleCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      triggerToast('Prompt panoya kopyalandı!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      triggerToast('Kopyalama yapılamadı.');
    }
    document.body.removeChild(el);
  };

  // Favori Değiştir
  const toggleFavorite = (id) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
    if (currentImage?.id === id) {
      setCurrentImage((prev) => (prev ? { ...prev, favorite: !prev.favorite } : prev));
    }
  };

  const activeRatioObj =
    ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[1];

  const LOADING_TEXTS = [
    '8K RAW Sensör Verisi İşleniyor...',
    'Doğal Atmosferik Işık ve Gölgeler Hesaplanıyor...',
    'Gerçekçi Cilt ve Yüzey Dokuları Oluşturuluyor...',
    'Optik Lens Netliği Tamamlanıyor...'
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* BİLDİRİM TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* ÜST HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0e17]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Sol: Marka & Başlık */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/20">
              <Aperture className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  RealVision AI Studio
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                  8K RAW • 4K UHD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sınırsız & Gerçek Zamanlı Fotogerçekçi Yapay Zeka Görsel Motoru
              </p>
            </div>
          </div>

          {/* Sağ: Gerçek Zamanlı Üretim (Canlı Mod) Anahtarı & Sınırsız Rozeti */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => {
                const nextState = !realTimeMode;
                setRealTimeMode(nextState);
                triggerToast(
                  nextState
                    ? '⚡ Gerçek Zamanlı Üretim (Canlı Mod) Açıldı!'
                    : 'Canlı Mod Kapatıldı. Manuel üretim aktif.'
                );
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                realTimeMode
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {realTimeMode && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    realTimeMode ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                />
              </span>
              <Zap className={`w-3.5 h-3.5 ${realTimeMode ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Gerçek Zamanlı Üretim / Canlı Mod</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  realTimeMode
                    ? 'bg-emerald-400/20 text-emerald-200'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {realTimeMode ? 'AKTİF' : 'KAPALI'}
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 font-semibold">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Limitsiz PRO Erişim</span>
            </div>
          </div>
        </div>
      </header>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL KONTROL PANELİ: PRESETLER, 8K MOTORU VE GALERİ (4 SÜTUN) */}
        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
          {/* Sekme Seçici */}
          <div className="grid grid-cols-3 p-1 bg-slate-900/90 border border-white/10 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveLeftTab('presets')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeLeftTab === 'presets'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Kamera & Işık</span>
            </button>
            <button
              onClick={() => setActiveLeftTab('engine')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeLeftTab === 'engine'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>8K Motoru</span>
            </button>
            <button
              onClick={() => setActiveLeftTab('gallery')}
              className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeLeftTab === 'gallery'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Galeri ({gallery.length})</span>
            </button>
          </div>

          {/* SEKME 1: KAMERA, LENS, IŞIK VE KADRAJ PRESETLERİ */}
          {activeLeftTab === 'presets' && (
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 space-y-5">
              {/* Kamera & Lens Presetleri */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    Kamera & Lens Presetleri
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {qualityMode}
                  </span>
                </div>

                <div className="space-y-2">
                  {CAMERA_PRESETS.map((cam) => {
                    const active = selectedCamera.id === cam.id;
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setSelectedCamera(cam)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          active
                            ? 'bg-emerald-500/15 border-emerald-500/60 shadow-md'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/15 hover:bg-slate-900'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            active
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Aperture className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs font-bold truncate ${
                                active ? 'text-emerald-300' : 'text-slate-200'
                              }`}
                            >
                              {cam.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {cam.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Işık Presetleri */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Işık & Atmosfer Presetleri
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {LIGHTING_PRESETS.map((lgt) => {
                    const active = selectedLighting.id === lgt.id;
                    return (
                      <button
                        key={lgt.id}
                        onClick={() => setSelectedLighting(lgt)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          active
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span>{lgt.name}</span>
                        {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* En-Boy Oranı (Aspect Ratio) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  Kadraj Oranı (Aspect Ratio)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setAspectRatio(ar.id)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                        aspectRatio === ar.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{ar.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{ar.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEKME 2: 8K & 4K GERÇEKÇİLİK MOTORU AYARLARI */}
          {activeLeftTab === 'engine' && (
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 space-y-4">
              {/* Çözünürlük Modu Seçici */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Çözünürlük & Sensör Standardı
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['8K RAW', '4K UHD'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setQualityMode(mode)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        qualityMode === mode
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode} Fotogerçekçi
                    </button>
                  ))}
                </div>
              </div>

              {/* Otomatik Gerçekçilik Parametreleri Anahtarı */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-300">
                      Otomatik RAW Doku & Işık Motoru
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Promptunuza otomatik olarak 4K UHD, 8K RAW, gerçekçi cilt dokusu ve doğal atmosferik ışık ekler.
                    </p>
                  </div>
                  <button
                    onClick={() => setRealismEngineActive(!realismEngineActive)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                      realismEngineActive ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        realismEngineActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Canlı Mod Tepki Süresi */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    Canlı Üretim Gecikmesi (Debounce)
                  </span>
                  <span className="text-emerald-400 font-mono">{(debounceMs / 1000).toFixed(1)} sn</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="2200"
                  step="100"
                  value={debounceMs}
                  onChange={(e) => setDebounceMs(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Referans Görsel (Image-to-Image) */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    Referans Fotoğraf
                  </span>
                  {referenceImage && (
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Kaldır
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadReference}
                  className="hidden"
                />

                {referenceImage ? (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-black/40 border border-cyan-500/30">
                    <img
                      src={referenceImage.preview}
                      alt="Referans"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-cyan-200 truncate">
                        {referenceImage.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Bu fotoğraf baz alınarak gerçekçi üretim yapılır
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/50 bg-slate-950/50 text-xs text-slate-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Referans Görsel Yükle</span>
                  </button>
                )}
              </div>

              {/* Negatif Prompt */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Negatif Prompt (Yapaylığı Önle)
                </label>
                <textarea
                  rows={3}
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-white/10 p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          )}

          {/* SEKME 3: GALERİ & GEÇMİŞ */}
          {activeLeftTab === 'gallery' && (
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 max-h-[640px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Oturum Galerisi ({gallery.length})
                </span>
                {gallery.length > 0 && (
                  <button
                    onClick={() => {
                      setGallery([]);
                      triggerToast('Galeri geçmişi temizlendi.');
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Temizle
                  </button>
                )}
              </div>

              {gallery.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Henüz kaydedilmiş bir görsel yok.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentImage(item);
                        setAspectRatio(item.aspectRatio);
                      }}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        currentImage?.id === item.id
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight">
                          {item.prompt}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[9px] text-emerald-400 font-mono">
                            {item.aspectRatio}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImage(item);
                                setIsFullscreen(true);
                              }}
                              className="p-1 rounded bg-white/20 hover:bg-white/30 text-white"
                              title="Tam Ekran"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                              className="p-1 rounded bg-emerald-500 text-slate-950"
                              title="İndir"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* SAĞ / ORTA STÜDYO SAHNESİ (8-9 SÜTUN) */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-5 order-1 lg:order-2">
          {/* PROMPT GİRİŞİ & ✨ AI İLE DETAYLANDIR KONSOLU */}
          <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Fotogerçekçi Sahne Tarifi (Prompt)
                </span>

                {realTimeMode && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      liveStatus === 'generating'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : liveStatus === 'waiting'
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        liveStatus === 'generating'
                          ? 'bg-amber-400 animate-ping'
                          : liveStatus === 'waiting'
                          ? 'bg-cyan-400 animate-pulse'
                          : 'bg-emerald-400'
                      }`}
                    />
                    {liveStatus === 'generating'
                      ? 'Canlı Render Alınıyor...'
                      : liveStatus === 'waiting'
                      ? 'Yazım Algılandı (Otomatik Üretiliyor)...'
                      : 'Canlı Mod Senkronize'}
                  </span>
                )}
              </div>

              {/* Sağ Üst Aksiyon Butonları */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSurprisePrompt}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" />
                  <span>Örnek Sahne</span>
                </button>

                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-emerald-500/20 hover:from-purple-500/30 hover:to-emerald-500/30 border border-emerald-400/40 text-xs text-emerald-200 font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Detaylandırılıyor...' : '✨ AI ile Detaylandır'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Textarea + Üret Butonu */}
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateRealisticImage({ source: 'manual' });
                  }
                }}
                placeholder="Üretmek istediğiniz fotoğrafı yazın (Canlı Mod açıkken siz yazarken otomatik üretilir)..."
                className="flex-1 rounded-xl bg-slate-950 border border-white/15 focus:border-emerald-500/70 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              />

              <button
                onClick={() => generateRealisticImage({ source: 'manual' })}
                disabled={isGenerating || !prompt.trim()}
                className="sm:w-44 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Üretiliyor...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Görsel Üret</span>
                  </>
                )}
              </button>
            </div>

            {/* Aktif Motor Parametreleri Özeti */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">
                  📷 {selectedCamera.shortBadge}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">
                  ☀️ {selectedLighting.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-300">
                  📐 {aspectRatio}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
                  {qualityMode} • Realistic Skin & Lighting
                </span>
              </div>

              <button
                onClick={() => setShowRawPrompt(!showRawPrompt)}
                className="text-slate-400 hover:text-emerald-300 flex items-center gap-1 underline decoration-dotted"
              >
                <Info className="w-3 h-3" />
                <span>{showRawPrompt ? 'RAW Promptu Gizle' : 'Otomatik Eklenen RAW Parametrelerini Gör'}</span>
              </button>
            </div>

            {showRawPrompt && (
              <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-300/90 leading-relaxed">
                {compilePhotorealisticPrompt(prompt)}
              </div>
            )}
          </div>

          {/* HATA BİLDİRİMİ */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-4">
              <div>
                <span className="font-bold block text-sm mb-0.5">Görsel Üretim Uyarısı</span>
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => generateRealisticImage({ source: 'manual' })}
                className="px-3.5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-400 shrink-0"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {/* ANA GÖRSEL ÖNİZLEME KANVASI */}
          <div className="relative bg-[#090c14] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[430px] sm:min-h-[520px] overflow-hidden shadow-inner">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.35) 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }}
            />

            {currentImage ? (
              <div className="relative z-10 w-full flex flex-col items-center">
                <div
                  className={`relative group rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black transition-all duration-300 ${activeRatioObj.boxClass} w-auto max-w-full`}
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.prompt}
                    className={`w-full h-full object-contain transition-all duration-500 ${
                      isGenerating ? 'scale-[1.01] brightness-75 blur-[1px]' : 'scale-100'
                    }`}
                  />

                  {/* Canlı Render Overlay */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mb-3 animate-pulse">
                        <Aperture className="w-8 h-8 text-emerald-400 animate-spin" />
                      </div>
                      <p className="text-sm font-bold text-white tracking-wide">
                        {LOADING_TEXTS[loadingStep]}
                      </p>
                      <p className="text-xs text-emerald-300 mt-1">
                        Yeni {qualityMode} fotoğraf karesi işleniyor...
                      </p>
                    </div>
                  )}

                  {/* Sağ Üst Kontroller (Favori, Tam Ekran, Tek Tıkla İndir) */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(currentImage.id)}
                      className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${
                        currentImage.favorite
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-black/65 text-slate-200 border-white/15 hover:bg-black/85'
                      }`}
                      title="Favorilere Ekle"
                    >
                      <Heart className={`w-4 h-4 ${currentImage.favorite ? 'fill-white' : ''}`} />
                    </button>
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="p-2.5 rounded-xl bg-black/65 hover:bg-black/85 text-slate-200 border border-white/15 backdrop-blur-md transition-all"
                      title="Tam Ekran Önizleme"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(currentImage)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>HD İndir</span>
                    </button>
                  </div>

                  {/* Sol Alt EXIF Bilgisi */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 flex flex-wrap items-center gap-2">
                      <span className="text-emerald-400 font-bold">{currentImage.cameraBadge}</span>
                      <span>•</span>
                      <span>{currentImage.lightingName}</span>
                      <span>•</span>
                      <span>{currentImage.aspectRatio}</span>
                      <span>•</span>
                      <span className="text-cyan-300">{currentImage.duration} sn</span>
                    </div>
                  </div>
                </div>

                {/* 🪄 HIZLI RÖTUŞ (LIVE RETOUCH BAR) */}
                <div className="w-full mt-4 pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5" />
                      🪄 Hızlı Rötuş (Mevcut Görseli Anında Düzenle)
                    </span>
                    <button
                      onClick={() => handleCopy(currentImage.prompt)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Promptu Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tek Tık Hızlı Rötuş Butonları */}
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_RETOUCH_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        disabled={isGenerating}
                        onClick={() =>
                          generateRealisticImage({
                            isRetouch: true,
                            customRetouch: chip.instruction,
                            source: 'manual'
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-emerald-200 transition-all disabled:opacity-50"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  {/* Özel Rötuş Girişi */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5">
                    <Wand2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={retouchText}
                      onChange={(e) => setRetouchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && retouchText.trim()) {
                          generateRealisticImage({
                            isRetouch: true,
                            customRetouch: retouchText,
                            source: 'manual'
                          });
                        }
                      }}
                      placeholder="Özel rötuş yazın (Örn: Arka planı karlı dağ yap, güneş gözlüğü ekle, sinematik gece ışığına çevir)..."
                      className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none py-1.5"
                    />
                    <button
                      onClick={() =>
                        generateRealisticImage({
                          isRetouch: true,
                          customRetouch: retouchText,
                          source: 'manual'
                        })
                      }
                      disabled={!retouchText.trim() || isGenerating}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 disabled:opacity-40 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Uygula</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* İlk Açılış Yükleme Ekranı */
              <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md p-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-2xl">
                  <Aperture className="w-10 h-10 text-emerald-400 animate-spin" />
                </div>
                <h2 className="text-base font-bold text-white mb-1">
                  {isGenerating ? LOADING_TEXTS[loadingStep] : 'RealVision AI Studio Hazırlanıyor'}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  8K RAW ve 4K UHD fotogerçekçi görüntü motoru ilk sahnenizi oluşturuyor...
                </p>
              </div>
            )}
          </div>

          {/* ALT GALERİ & GEÇMİŞ FİLM ŞERİDİ */}
          {gallery.length > 0 && (
            <div className="bg-[#0d111a] border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Üretim Geçmişi & Hızlı Galeri ({gallery.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Tam ekran incelemek veya indirmek için görsele tıklayın
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentImage(item);
                      setAspectRatio(item.aspectRatio);
                    }}
                    className={`group relative w-32 h-22 rounded-xl overflow-hidden shrink-0 cursor-pointer border transition-all ${
                      currentImage?.id === item.id
                        ? 'border-emerald-400 ring-2 ring-emerald-500/40'
                        : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-20 object-cover"
                    />
                    {item.isLive && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[9px] font-bold flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> Canlı
                      </span>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-slate-300 px-1.5 py-0.5 flex items-center justify-between font-mono">
                      <span>{item.timestamp}</span>
                      <span>{item.aspectRatio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* TAM EKRAN (LIGHTBOX) GÖRSEL ÖNİZLEME MODALI */}
      {isFullscreen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="absolute top-5 right-5 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(currentImage);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tek Tıkla İndir (PNG)</span>
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <img
            src={currentImage.url}
            alt={currentImage.prompt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-white/15"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 max-w-3xl text-center space-y-1"
          >
            <p className="text-sm text-slate-200 font-medium">{currentImage.prompt}</p>
            <p className="text-xs text-emerald-400 font-mono">
              {currentImage.cameraName} • {currentImage.lightingName} • {currentImage.qualityMode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}