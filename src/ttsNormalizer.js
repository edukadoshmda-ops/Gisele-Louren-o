/**
 * Normalizador Fonoaudiológico, Gramatical e Bíblico para Português do Brasil (pt-BR)
 * Converte capítulos, versículos, números por extenso, siglas bíblicas, pontuações e termos
 * para leitura 100% humana, natural e sem erros de fonética nas vozes neurais masculinas e femininas.
 */

const UNIDADES = [
  "zero", "um", "dois", "três", "quatro", "cinco",
  "seis", "sete", "oito", "nove", "dez",
  "onze", "doze", "treze", "quatorze", "quinze",
  "dezesseis", "dezessete", "dezoito", "dezenove"
];

const DEZENAS = [
  "", "", "vinte", "trinta", "quarenta", "cinquenta",
  "sessenta", "setenta", "oitenta", "noventa"
];

const CENTENAS = [
  "", "cento", "duzentos", "trezentos", "quatrocentos",
  "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"
];

/**
 * Converte números de 0 a 999 para extenso em português do Brasil
 * Ex: 4 -> "quatro", 23 -> "vinte e três", 119 -> "cento e dezenove"
 */
function numeroPorExtenso(num) {
  const n = parseInt(num, 10);
  if (isNaN(n) || n < 0 || n > 999) return String(num);
  if (n < 20) return UNIDADES[n];
  if (n === 100) return "cem";

  const c = Math.floor(n / 100);
  const resto = n % 100;
  const d = Math.floor(resto / 10);
  const u = resto % 10;

  const partes = [];
  if (c > 0) partes.push(CENTENAS[c]);
  if (resto > 0) {
    if (resto < 20) {
      partes.push(UNIDADES[resto]);
    } else {
      partes.push(DEZENAS[d]);
      if (u > 0) partes.push(UNIDADES[u]);
    }
  }
  return partes.join(" e ");
}

const BIBLE_BOOK_ABBREVIATIONS = {
  "Gn": "Gênesis",
  "Ex": "Êzodo",
  "Êx": "Êzodo",
  "Lv": "Levítico",
  "Nm": "Números",
  "Dt": "Deuteronômio",
  "Js": "Josué",
  "Jz": "Juízes",
  "Rt": "Rute",
  "1Sm": "Primeiro Samuel",
  "2Sm": "Segundo Samuel",
  "1Rs": "Primeiro Reis",
  "2Rs": "Segundo Reis",
  "1Cr": "Primeiro Crônicas",
  "2Cr": "Segundo Crônicas",
  "Ed": "Esdras",
  "Ne": "Neemias",
  "Et": "Ester",
  "Sl": "Salmos",
  "Pv": "Provérbios",
  "Ec": "Eclesiastes",
  "Ct": "Cantares",
  "Is": "Isaías",
  "Jr": "Jeremias",
  "Lm": "Lamentações",
  "Ez": "Ezequiel",
  "Dn": "Daniel",
  "Os": "Oséias",
  "Jl": "Joel",
  "Am": "Amós",
  "Ob": "Obadias",
  "Jn": "Jonas",
  "Mq": "Miquéias",
  "Na": "Naum",
  "Hc": "Habacuque",
  "Sf": "Sofonias",
  "Ag": "Ageu",
  "Zc": "Zacarias",
  "Ml": "Malaquias",
  "Mt": "Mateus",
  "Mc": "Marcos",
  "Lc": "Lucas",
  "Jo": "João",
  "At": "Atos dos Apóstolos",
  "Rm": "Romanos",
  "1Co": "Primeira Coríntios",
  "2Co": "Segunda Coríntios",
  "Gl": "Gálatas",
  "Ef": "Efézios",
  "Fp": "Filipenses",
  "Cl": "Colossenses",
  "1Ts": "Primeira Tessalonicenses",
  "2Ts": "Segunda Tessalonicenses",
  "1Tm": "Primeira Timóteo",
  "2Tm": "Segunda Timóteo",
  "Tt": "Tito",
  "Fm": "Filemom",
  "Hb": "Hebreus",
  "Tg": "Tiago",
  "1Pe": "Primeira Pedro",
  "2Pe": "Segunda Pedro",
  "1Jo": "Primeira João",
  "2Jo": "Segunda João",
  "3Jo": "Terceira João",
  "Jd": "Judas",
  "Ap": "Apocalipse"
};

const NUMBERED_BIBLE_BOOKS = [
  { pattern: /\b1\s*Samuel\b/gi, spoken: "Primeiro Samuel" },
  { pattern: /\b2\s*Samuel\b/gi, spoken: "Segundo Samuel" },
  { pattern: /\b1\s*Reis\b/gi, spoken: "Primeiro Reis" },
  { pattern: /\b2\s*Reis\b/gi, spoken: "Segundo Reis" },
  { pattern: /\b1\s*Crônicas\b/gi, spoken: "Primeiro Crônicas" },
  { pattern: /\b2\s*Crônicas\b/gi, spoken: "Segundo Crônicas" },
  { pattern: /\b1\s*Coríntios\b/gi, spoken: "Primeira Coríntios" },
  { pattern: /\b2\s*Coríntios\b/gi, spoken: "Segunda Coríntios" },
  { pattern: /\b1\s*Tessalonicenses\b/gi, spoken: "Primeira Tessalonicenses" },
  { pattern: /\b2\s*Tessalonicenses\b/gi, spoken: "Segunda Tessalonicenses" },
  { pattern: /\b1\s*Timóteo\b/gi, spoken: "Primeira Timóteo" },
  { pattern: /\b2\s*Timóteo\b/gi, spoken: "Segunda Timóteo" },
  { pattern: /\b1\s*Pedro\b/gi, spoken: "Primeira Pedro" },
  { pattern: /\b2\s*Pedro\b/gi, spoken: "Segunda Pedro" },
  { pattern: /\b1\s*João\b/gi, spoken: "Primeira João" },
  { pattern: /\b2\s*João\b/gi, spoken: "Segunda João" },
  { pattern: /\b3\s*João\b/gi, spoken: "Terceira João" }
];

function normalizeForPortugueseSpeech(rawText) {
  if (!rawText) return "";
  let text = String(rawText);

  // 1. Remover todos os emojis e ícones visuais
  text = text.replace(
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}⭐✨🎧📖🙏🎬✍️📓🔊▶⏹✏️🗑️✔✅👩👨🎙️]/gu,
    " "
  );

  // 2. Ajustes fonéticos de nomes próprios e estrangeirismos para Português do Brasil
  text = text.replace(/\bDaviLiz\b/gi, "Davi e Lís");
  text = text.replace(/\bDavi\s+e\s+Liz\b/gi, "Davi e Lís");
  text = text.replace(/\bLiz\b/g, "Lís");
  text = text.replace(/\bGisele\s+Lourenço\b/gi, "Giséle Lourenço");
  text = text.replace(/\bGisele\b/gi, "Giséle");
  text = text.replace(/\bÊxodo\b/gi, "Êzodo");
  text = text.replace(/\bEfésios\b/gi, "Efézios");
  text = text.replace(/\bAsaas\b/gi, "Asas");
  text = text.replace(/\bSaaS\b/g, "Sás");
  text = text.replace(/\bE-books\b/gi, "ê-buques");
  text = text.replace(/\bE-book\b/gi, "ê-buque");
  text = text.replace(/\bPlaybooks\b/gi, "plei-buques");
  text = text.replace(/\bPlaybook\b/gi, "plei-buque");
  text = text.replace(/\bAudiobooks\b/gi, "áudio-buques");
  text = text.replace(/\bAudiobook\b/gi, "áudio-buque");
  text = text.replace(/\bPDFs\b/gi, "pê dê éfes");
  text = text.replace(/\bPDF\b/gi, "pê dê éfe");

  // 3. Expandir siglas bíblicas seguidas de números
  Object.entries(BIBLE_BOOK_ABBREVIATIONS).forEach(([abbr, fullName]) => {
    const regex = new RegExp(`\\b${abbr}\\.?\\s+(?=\\d+)`, "g");
    text = text.replace(regex, `${fullName} `);
  });

  // 4. Livros bíblicos numerados ("1 Coríntios" -> "Primeira Coríntios")
  NUMBERED_BIBLE_BOOKS.forEach(({ pattern, spoken }) => {
    text = text.replace(pattern, spoken);
  });

  // 5. Converter "Capítulo X", "História X", "Dia X", "Exercício X" com número por extenso
  text = text.replace(/\bCap(?:ítulo|\.)?\s*(\d{1,3})\b/gi, (_, c) => `capítulo ${numeroPorExtenso(c)}`);
  text = text.replace(/\bHistória\s+(\d{1,3})\b/gi, (_, n) => `história ${numeroPorExtenso(n)}`);
  text = text.replace(/\bDia\s+(\d{1,3})\b/gi, (_, n) => `dia ${numeroPorExtenso(n)}`);
  text = text.replace(/\bvv\.\s*(\d{1,3})\s*[-–a]\s*(\d{1,3})\b/gi, (_, v1, v2) => `versículos ${numeroPorExtenso(v1)} ao ${numeroPorExtenso(v2)}`);
  text = text.replace(/\bv\.\s*(\d{1,3})\b/gi, (_, v1) => `versículo ${numeroPorExtenso(v1)}`);

  // 6. Converter referências bíblicas com números por extenso:
  // Ex: "Coríntios 13:4-7" -> "Coríntios, capítulo treze, versículos quatro ao sete."
  text = text.replace(
    /([A-Za-zÀ-ÿ]+)\s+(\d{1,3})\s*[:.]\s*(\d{1,3})\s*[-–a]\s*(\d{1,3})\b/g,
    (_, book, cap, v1, v2) =>
      `${book}, capítulo ${numeroPorExtenso(cap)}, versículos ${numeroPorExtenso(v1)} ao ${numeroPorExtenso(v2)}`
  );

  // Ex: "Salmos 23:1,4" -> "Salmos, capítulo vinte e três, versículos um e quatro."
  text = text.replace(
    /([A-Za-zÀ-ÿ]+)\s+(\d{1,3})\s*[:.]\s*(\d{1,3})\s*,\s*(\d{1,3})\b/g,
    (_, book, cap, v1, v2) =>
      `${book}, capítulo ${numeroPorPorExtensoSafe(cap)}, versículos ${numeroPorExtenso(v1)} e ${numeroPorExtenso(v2)}`
  );

  // Ex: "Provérbios 4:23" -> "Provérbios, capítulo quatro, versículo vinte e três."
  text = text.replace(
    /([A-Za-zÀ-ÿ]+)\s+(\d{1,3})\s*[:]\s*(\d{1,3})\b/g,
    (_, book, cap, v1) =>
      `${book}, capítulo ${numeroPorExtenso(cap)}, versículo ${numeroPorExtenso(v1)}`
  );

  // Qualquer padrão residual "4:23" -> "capítulo quatro, versículo vinte e três"
  text = text.replace(
    /\b(\d{1,3})\s*:\s*(\d{1,3})\b/g,
    (_, cap, v1) => `capítulo ${numeroPorExtenso(cap)}, versículo ${numeroPorExtenso(v1)}`
  );

  // 7. Converter números isolados restantes (ex: "3 atitudes" -> "três atitudes")
  text = text.replace(/\b(\d{1,3})\b/g, (_, n) => numeroPorExtenso(n));

  // 8. Limpar símbolos e calibrar pontuações para pausas respiratórias naturais
  text = text.replace(/\s*[•|]\s*/g, ". ");
  text = text.replace(/\s*[—–]\s*/g, ", ");
  text = text.replace(/\s*:\s*/g, ", ");
  text = text.replace(/\s*;\s*/g, ". ");
  text = text.replace(/\s*&\s*/g, " e ");
  text = text.replace(/\s*\/\s*/g, " ou ");
  text = text.replace(/["“”«»']/g, " ");
  text = text.replace(/[()[\]]/g, ", ");
  text = text.replace(/\.{2,}/g, ".");
  text = text.replace(/\s+([,.!?])/g, "$1");
  text = text.replace(/,\s*,+/g, ",");
  text = text.replace(/,\s*\./g, ".");
  text = text.replace(/\.\s*,/g, ".");
  text = text.replace(/\.\s*\./g, ".");
  text = text.replace(/([,.!?])([^\s])/g, "$1 $2");
  text = text.replace(/\s{2,}/g, " ");

  if (!/[.!?]$/.test(text.trim())) {
    text = text.trim() + ".";
  }

  return text.trim();
}

function numeroPorPorExtensoSafe(n) {
  return numeroPorExtenso(n);
}

/**
 * Divide o texto normalizado em blocos curtos respeitando vírgulas e pontos finais
 * para síntese neural contínua sem cortes de palavras.
 */
function splitIntoSpeechChunks(normalizedText, maxBytes = 190) {
  const sentences =
    normalizedText
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) || [normalizedText];

  const chunks = [];
  for (const sentence of sentences) {
    if (Buffer.byteLength(sentence, "utf8") <= maxBytes) {
      chunks.push(sentence);
    } else {
      // Subdividir em vírgulas se a frase for muito longa
      const clauses = sentence.split(/,\s*/);
      let current = "";
      for (const clause of clauses) {
        const candidate = current ? `${current}, ${clause}` : clause;
        if (Buffer.byteLength(candidate, "utf8") <= maxBytes) {
          current = candidate;
        } else {
          if (current) chunks.push(current.endsWith(".") ? current : `${current}.`);
          current = clause;
        }
      }
      if (current) chunks.push(current.endsWith(".") ? current : `${current}.`);
    }
  }
  return chunks.filter(Boolean);
}

module.exports = {
  normalizeForPortugueseSpeech,
  splitIntoSpeechChunks,
  numeroPorExtenso
};
