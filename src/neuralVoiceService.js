/**
 * Motor de Síntese de Voz Neural Profissional em Português do Brasil (pt-BR)
 * Gera áudio MP3 neural real de estúdio (sem usar o sintetizador robótico local do Windows),
 * suportando:
 *  - Vozes Femininas Neurais PT-BR:
 *      • "br_004" (Ana Clara Neural - Suave, Acolhedora & Devocional)
 *      • "br_001" (Camila Neural - Locutora Clássica de Audiobooks)
 *      • "br_003" (Beatriz Neural - Expressiva & Infantil DaviLiz)
 *  - Voz Masculina Neural PT-BR:
 *      • "br_005" (Gabriel Neural - Locutor Masculino Profundo para Bíblia e Estudos)
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  normalizeForPortugueseSpeech,
  splitIntoSpeechChunks
} = require("./ttsNormalizer");

const CACHE_DIR = path.join(__dirname, "..", "public", "audio-cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const VOICE_CATALOG = {
  female_warm: {
    id: "br_004",
    label: "Narradora Ana Clara (Voz Feminina Neural Suave • pt-BR)",
    gender: "female"
  },
  female_classic: {
    id: "br_001",
    label: "Narradora Camila (Voz Feminina Neural Clássica • pt-BR)",
    gender: "female"
  },
  female_kids: {
    id: "br_003",
    label: "Narradora Beatriz (Voz Feminina Expressiva Kids • pt-BR)",
    gender: "female"
  },
  male_studio: {
    id: "br_005",
    label: "Narrador Gabriel (Voz Masculina Neural Profunda • pt-BR)",
    gender: "male"
  }
};

class NeuralVoiceService {
  constructor() {
    this.audioCache = new Map();
  }

  resolveVoiceCode(voiceOrGender = "female") {
    if (VOICE_CATALOG[voiceOrGender]) {
      return VOICE_CATALOG[voiceOrGender];
    }
    if (voiceOrGender === "male" || voiceOrGender === "br_005") {
      return VOICE_CATALOG.male_studio;
    }
    if (voiceOrGender === "br_001") return VOICE_CATALOG.female_classic;
    if (voiceOrGender === "br_003") return VOICE_CATALOG.female_kids;
    return VOICE_CATALOG.female_warm;
  }

  getAvailableVoices() {
    return Object.entries(VOICE_CATALOG).map(([key, val]) => ({
      key,
      ...val
    }));
  }

  async synthesizeChunkTikTokNeural(chunkText, voiceId) {
    const response = await fetch(
      "https://tiktok-tts.weilnet.workers.dev/api/generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "ClubeGiseleDaviLizStudio/2.0"
        },
        body: JSON.stringify({
          text: chunkText,
          voice: voiceId
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status} no provedor neural`);
    }

    const data = await response.json();
    if (!data || !data.success || !data.data) {
      throw new Error(data?.error || "Resposta vazia do motor neural");
    }

    return Buffer.from(data.data, "base64");
  }

  async synthesizeChunkGoogleFallback(chunkText) {
    const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      chunkText
    )}&tl=pt-BR&client=tw-ob`;
    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) throw new Error(`Fallback Google TTS HTTP ${res.status}`);
    const arr = await res.arrayBuffer();
    return Buffer.from(arr);
  }

  /**
   * Converte qualquer texto (com referências bíblicas, pontuações, capítulos, etc.)
   * em um único buffer de áudio MP3 neural contínuo em Português do Brasil.
   */
  async synthesizeSpeechMp3(rawText, voiceKey = "female") {
    const voiceInfo = this.resolveVoiceCode(voiceKey);
    const normalizedText = normalizeForPortugueseSpeech(rawText);
    if (!normalizedText) {
      throw new Error("Texto vazio para narração");
    }

    const cacheKey = crypto
      .createHash("sha1")
      .update(`${voiceInfo.id}::${normalizedText}`)
      .digest("hex");

    if (this.audioCache.has(cacheKey)) {
      return {
        mp3Buffer: this.audioCache.get(cacheKey),
        normalizedText,
        voiceInfo,
        cached: true
      };
    }

    const diskFile = path.join(CACHE_DIR, `${cacheKey}.mp3`);
    if (fs.existsSync(diskFile)) {
      const diskBuf = fs.readFileSync(diskFile);
      this.audioCache.set(diskKey(cacheKey), diskBuf);
      return {
        mp3Buffer: diskBuf,
        normalizedText,
        voiceInfo,
        cached: true
      };
    }

    const chunks = splitIntoSpeechChunks(normalizedText, 185);
    const buffers = [];

    for (const chunk of chunks) {
      try {
        const buf = await this.synthesizeChunkTikTokNeural(chunk, voiceInfo.id);
        buffers.push(buf);
      } catch (_) {
        const fallbackBuf = await this.synthesizeChunkGoogleFallback(chunk);
        buffers.push(fallbackBuf);
      }
    }

    const fullMp3 = Buffer.concat(buffers);
    try {
      fs.writeFileSync(diskFile, fullMp3);
    } catch (_) {}
    if (this.audioCache.size > 200) {
      const firstKey = this.audioCache.keys().next().value;
      this.audioCache.delete(firstKey);
    }
    this.audioCache.set(cacheKey, fullMp3);

    return {
      mp3Buffer: fullMp3,
      normalizedText,
      voiceInfo,
      cached: false
    };
  }
}

function diskKey(k) {
  return k;
}

module.exports = { NeuralVoiceService, VOICE_CATALOG };
