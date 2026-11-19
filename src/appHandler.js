const fs = require("fs");
const path = require("path");
const { initialData } = require("./dataStore");
const { AsaasService } = require("./asaasService");
const { normalizeForPortugueseSpeech } = require("./ttsNormalizer");
const { NeuralVoiceService } = require("./neuralVoiceService");
const {
  isSupabaseConfigured,
  loadDatabase,
  saveDatabase,
  uploadToSupabaseStorage
} = require("./dbRepository");
const {
  ADMIN_EMAIL,
  hashPassword,
  verifyPassword,
  signToken,
  getSessionUser,
  verifyAdminCredentials
} = require("./authService");

const asaas = new AsaasService();
const neuralVoice = new NeuralVoiceService();

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

let db = null;
let dbInitPromise = null;

async function getDb() {
  if (db) return db;
  if (!dbInitPromise) {
    dbInitPromise = loadDatabase(initialData).then((loaded) => {
      db = loaded;
      return db;
    });
  }
  return dbInitPromise;
}

function sendJson(res, statusCode, data, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, asaas-access-token, x-file-name",
    ...extraHeaders
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) req.destroy();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON inválido no corpo da requisição"));
      }
    });
    req.on("error", reject);
  });
}

function parseRawBuffer(req, maxBytes = 150 * 1024 * 1024) {
  if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
    return Promise.resolve(req.rawBody);
  }
  if (req.body && Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        req.destroy();
        return reject(new Error("Arquivo excede o limite máximo permitido."));
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function computeMetrics(currentDb) {
  const activeSubs = currentDb.subscribers.filter((s) => s.status === "ACTIVE");
  const pendingSubs = currentDb.subscribers.filter((s) => s.status === "PENDING");
  const overdueSubs = currentDb.subscribers.filter((s) => s.status === "OVERDUE");

  const mrr = activeSubs.reduce((acc, s) => {
    const monthlyVal = s.cycle === "YEARLY" ? s.value / 12 : s.value;
    return acc + monthlyVal;
  }, 0);

  return {
    mrr: Number(mrr.toFixed(2)),
    arr: Number((mrr * 12).toFixed(2)),
    totalSubscribers: currentDb.subscribers.length,
    activeSubscribers: activeSubs.length,
    pendingSubscribers: pendingSubs.length,
    overdueSubscribers: overdueSubs.length,
    persistenceMode: isSupabaseConfigured() ? "Supabase Cloud (PostgreSQL + Storage)" : "Local JSON (data/db.json)",
    asaasConfig: asaas.getConfigSummary()
  };
}

function sanitizeSubscriber(sub) {
  if (!sub) return null;
  const { passwordHash, ...safe } = sub;
  return safe;
}

function resolveCurrentUser(req, currentDb) {
  const session = getSessionUser(req);
  if (!session) return null;

  if (session.role === "admin") {
    return {
      role: "admin",
      name: "Super Admin (Gisele & DaviLiz)",
      email: session.email,
      planId: "plan_educador",
      planName: "Acesso Super Admin Total",
      status: "ACTIVE",
      discountShopPercent: 30
    };
  }

  const sub = currentDb.subscribers.find(
    (s) => s.email.toLowerCase() === String(session.email || "").toLowerCase()
  );
  if (!sub) return null;
  const plan = currentDb.plans.find((p) => p.id === sub.planId);
  return {
    role: "subscriber",
    id: sub.id,
    name: sub.name,
    email: sub.email,
    planId: sub.planId,
    planName: sub.planName,
    status: sub.status,
    discountShopPercent: plan?.discountShopPercent || 10
  };
}

function requireAdmin(req, res, currentDb) {
  const user = resolveCurrentUser(req, currentDb);
  if (!user || user.role !== "admin") {
    sendJson(res, 403, { error: "Acesso restrito ao administrador. Faça login como Admin para continuar." });
    return null;
  }
  return user;
}

function buildCookieHeader(token, maxAgeSeconds = 7 * 24 * 60 * 60) {
  const secureFlag = process.env.VERCEL || process.env.NETLIFY ? "; Secure" : "";
  return `clube_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

async function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  const currentDb = await getDb();
  const host = req.headers.host || "localhost:3000";
  const proto = req.headers["x-forwarded-proto"] || "http";
  const parsedUrl = new URL(req.url, `${proto}://${host}`);
  let pathname = parsedUrl.pathname;

  // Normaliza prefixo de Netlify Functions se vier com /.netlify/functions/api
  if (pathname.startsWith("/.netlify/functions/api")) {
    pathname = "/api" + pathname.slice("/.netlify/functions/api".length);
  }

  try {
    // =========================================================================
    // 0. AUTENTICAÇÃO (LOGIN, LOGOUT, SESSÃO ATUAL)
    // =========================================================================
    if (pathname === "/api/auth/login" && req.method === "POST") {
      const { email, password } = await parseBody(req);
      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPass = String(password || "");

      if (!cleanEmail || !cleanPass) {
        return sendJson(res, 400, { error: "Informe e-mail e senha." });
      }

      if (verifyAdminCredentials(cleanEmail, cleanPass)) {
        const token = signToken({ role: "admin", email: cleanEmail });
        const user = {
          role: "admin",
          name: "Super Admin (Gisele & DaviLiz)",
          email: cleanEmail,
          planId: "plan_educador",
          planName: "Acesso Super Admin Total",
          status: "ACTIVE",
          discountShopPercent: 30
        };
        return sendJson(
          res,
          200,
          { token, user },
          { "Set-Cookie": buildCookieHeader(token) }
        );
      }

      const sub = currentDb.subscribers.find(
        (s) => s.email.toLowerCase() === cleanEmail
      );
      if (!sub) {
        return sendJson(res, 401, { error: "E-mail ou senha inválidos." });
      }

      const isDemoSub = cleanEmail === "anapaula.familia@email.com" && cleanPass === "clube2026";
      const isValidHash = sub.passwordHash && verifyPassword(cleanPass, sub.passwordHash);
      if (!isDemoSub && !isValidHash) {
        return sendJson(res, 401, { error: "E-mail ou senha inválidos." });
      }

      const token = signToken({ role: "subscriber", email: sub.email, id: sub.id });
      const plan = currentDb.plans.find((p) => p.id === sub.planId);
      const user = {
        role: "subscriber",
        id: sub.id,
        name: sub.name,
        email: sub.email,
        planId: sub.planId,
        planName: sub.planName,
        status: sub.status,
        discountShopPercent: plan?.discountShopPercent || 10
      };
      return sendJson(
        res,
        200,
        { token, user },
        { "Set-Cookie": buildCookieHeader(token) }
      );
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      return sendJson(
        res,
        200,
        { ok: true },
        { "Set-Cookie": buildCookieHeader("", 0) }
      );
    }

    if (pathname === "/api/auth/me" && req.method === "GET") {
      return sendJson(res, 200, { user: resolveCurrentUser(req, currentDb) });
    }

    // =========================================================================
    // 1. BOOTSTRAP DA PLATAFORMA (SEPARA DADOS PÚBLICOS DE DADOS ADMIN)
    // =========================================================================
    if (pathname === "/api/bootstrap" && req.method === "GET") {
      const currentUser = resolveCurrentUser(req, currentDb);
      const isAdmin = currentUser?.role === "admin";

      return sendJson(res, 200, {
        currentUser,
        authorProfile: currentDb.authorProfile,
        plans: currentDb.plans,
        courses: currentDb.courses,
        audiobooks: currentDb.audiobooks,
        authorVideos: currentDb.authorVideos,
        ebooks: currentDb.ebooks,
        dailyMeditations: currentDb.dailyMeditations,
        kidsAlphabet: currentDb.kidsAlphabet,
        attitudesBoard: currentDb.attitudesBoard,
        bibleBookshelf: currentDb.bibleBookshelf,
        printables: currentDb.printables,
        shopProducts: currentDb.shopProducts,
        subscribers: isAdmin ? currentDb.subscribers.map(sanitizeSubscriber) : [],
        webhookLogs: isAdmin ? currentDb.webhookLogs : [],
        metrics: isAdmin
          ? computeMetrics(currentDb)
          : {
              persistenceMode: isSupabaseConfigured() ? "Supabase Cloud" : "Local JSON",
              asaasConfig: {
                environment: asaas.environment,
                isLiveConfigured: asaas.isLiveConfigured()
              }
            }
      });
    }

    // =========================================================================
    // 2. QUADRO DIGITAL INFANTIL DAVI E LIZ
    // =========================================================================
    if (pathname === "/api/kids/attitude-toggle" && req.method === "POST") {
      const { attitudeId } = await parseBody(req);
      const item = currentDb.attitudesBoard.items.find((i) => i.id === attitudeId);
      if (!item) return sendJson(res, 404, { error: "Atitude não encontrada" });

      item.completedToday = !item.completedToday;
      currentDb.attitudesBoard.totalStars += item.completedToday ? item.stars : -item.stars;
      await saveDatabase(currentDb);

      return sendJson(res, 200, { attitudesBoard: currentDb.attitudesBoard });
    }

    if (pathname === "/api/kids/attitude-add" && req.method === "POST") {
      const { title, category, verse, stars } = await parseBody(req);
      if (!title) return sendJson(res, 400, { error: "Informe o título da atitude" });

      const newAtt = {
        id: `att_${Date.now()}`,
        title,
        category: category || "Caráter Cristão",
        verse: verse || "Provérbios 22:6",
        stars: Number(stars) || 3,
        completedToday: false
      };
      currentDb.attitudesBoard.items.push(newAtt);
      await saveDatabase(currentDb);
      return sendJson(res, 201, { attitudesBoard: currentDb.attitudesBoard });
    }

    // 2.5 Progresso Real de Aulas nos Cursos Gisele Lourenço
    if (pathname === "/api/courses/toggle-module" && req.method === "POST") {
      const { courseId, moduleIndex } = await parseBody(req);
      const course = currentDb.courses.find((c) => c.id === courseId);
      if (!course || !Array.isArray(course.modules) || !course.modules[moduleIndex]) {
        return sendJson(res, 404, { error: "Aula não encontrada." });
      }
      course.modules[moduleIndex].completed = !course.modules[moduleIndex].completed;
      const doneCount = course.modules.filter((m) => m.completed).length;
      course.progress = Math.round((doneCount / course.modules.length) * 100);
      await saveDatabase(currentDb);
      return sendJson(res, 200, { courses: currentDb.courses, course });
    }

    // =========================================================================
    // 4. ASSINATURA RECORRENTE ASAAS (CHECKOUT TRANSPARENTE + CRIAÇÃO DE CONTA)
    // =========================================================================
    if (pathname === "/api/asaas/subscribe" && req.method === "POST") {
      const body = await parseBody(req);
      const { customer, planId, billingType, cycle, creditCard } = body;

      if (!customer?.name || !customer?.email || !customer?.cpfCnpj) {
        return sendJson(res, 400, {
          error: "Preencha nome, e-mail e CPF/CNPJ para criar a assinatura no Asaas."
        });
      }

      const plan = currentDb.plans.find((p) => p.id === planId) || currentDb.plans[1];
      const result = await asaas.createSubscription({
        customer,
        plan,
        billingType: billingType || "PIX",
        cycle: cycle || "MONTHLY",
        creditCard
      });

      const rawPassword = customer.password && String(customer.password).trim().length >= 4
        ? String(customer.password).trim()
        : "clube2026";

      const newSubscriber = {
        id: `sub_${Date.now()}`,
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        cpfCnpj: customer.cpfCnpj.trim(),
        phone: customer.phone || "",
        passwordHash: hashPassword(rawPassword),
        planId: plan.id,
        planName: plan.name,
        billingType: result.billingType,
        value: result.amount,
        cycle: result.cycle,
        status: result.status,
        asaasCustomerId: result.asaasCustomerId,
        asaasSubscriptionId: result.asaasSubscriptionId,
        nextDueDate: result.nextDueDate,
        createdAt: new Date().toISOString().split("T")[0]
      };

      currentDb.subscribers.unshift(newSubscriber);

      currentDb.webhookLogs.unshift({
        id: `evt_${Date.now()}`,
        timestamp: new Date().toLocaleString("pt-BR"),
        event: result.status === "ACTIVE" ? "PAYMENT_CONFIRMED" : "SUBSCRIPTION_CREATED",
        subscriptionId: result.asaasSubscriptionId,
        customerName: newSubscriber.name,
        billingType: result.billingType,
        amount: result.amount,
        actionTaken:
          result.status === "ACTIVE"
            ? `Assinatura ${plan.name} ativa via Cartão!`
            : `Cobrança ${result.billingType} gerada no Asaas. Aguardando pagamento.`
      });

      await saveDatabase(currentDb);

      const token = signToken({
        role: "subscriber",
        email: newSubscriber.email,
        id: newSubscriber.id
      });
      const user = {
        role: "subscriber",
        id: newSubscriber.id,
        name: newSubscriber.name,
        email: newSubscriber.email,
        planId: newSubscriber.planId,
        planName: newSubscriber.planName,
        status: newSubscriber.status,
        discountShopPercent: plan.discountShopPercent || 10
      };

      return sendJson(
        res,
        201,
        {
          subscriber: sanitizeSubscriber(newSubscriber),
          asaasResult: result,
          token,
          user
        },
        { "Set-Cookie": buildCookieHeader(token) }
      );
    }

    // =========================================================================
    // 5. WEBHOOK OFICIAL DO ASAAS (/api/asaas/webhook) COM VALIDAÇÃO DE TOKEN
    // =========================================================================
    if (pathname === "/api/asaas/webhook" && req.method === "POST") {
      const incomingToken = req.headers["asaas-access-token"];
      const expectedToken = asaas.webhookToken;
      if (expectedToken && incomingToken !== expectedToken) {
        return sendJson(res, 401, { error: "Token de Webhook Asaas inválido." });
      }

      const payload = await parseBody(req);
      return await processWebhookEvent(payload, currentDb, res);
    }

    // Simulação de Webhook protegida apenas para Admin
    if (pathname === "/api/asaas/simulate" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const payload = await parseBody(req);
      return await processWebhookEvent(payload, currentDb, res);
    }

    // 6. Configurar Chave de API Asaas (Apenas Admin)
    if (pathname === "/api/asaas/config" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const body = await parseBody(req);
      asaas.setConfig(body);
      return sendJson(res, 200, {
        message: "Configuração do Asaas atualizada com sucesso!",
        asaasConfig: asaas.getConfigSummary()
      });
    }

    // =========================================================================
    // 6.0 UPLOAD DE MÍDIA (SUPABASE STORAGE NA NUVEM OU /public/uploads LOCAL)
    // =========================================================================
    if (pathname === "/api/upload" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;

      const rawHeaderName =
        req.headers["x-file-name"] || parsedUrl.searchParams.get("filename") || `arquivo_${Date.now()}`;
      let rawFileName = String(rawHeaderName);
      try {
        rawFileName = decodeURIComponent(rawFileName);
      } catch (_) {}

      const ext = path.extname(rawFileName).toLowerCase() || ".bin";
      const allowedExts = [
        ".mp3", ".wav", ".ogg", ".m4a", ".aac",
        ".mp4", ".webm", ".mov", ".m4v",
        ".pdf", ".png", ".jpg", ".jpeg", ".webp"
      ];
      if (!allowedExts.includes(ext)) {
        return sendJson(res, 400, {
          error: `Formato ${ext} não suportado. Envie áudio (MP3, WAV, M4A), vídeo (MP4, WebM, MOV), PDF ou imagem.`
        });
      }

      const buffer = await parseRawBuffer(req);
      if (!buffer || buffer.length === 0) {
        return sendJson(res, 400, { error: "Nenhum conteúdo recebido no upload." });
      }

      const baseSafe =
        path
          .basename(rawFileName, ext)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "conteudo";

      const savedFileName = `${Date.now()}-${baseSafe}${ext}`;

      let fileUrl = null;
      if (isSupabaseConfigured()) {
        const mimeMap = {
          ".mp3": "audio/mpeg",
          ".wav": "audio/wav",
          ".ogg": "audio/ogg",
          ".m4a": "audio/mp4",
          ".mp4": "video/mp4",
          ".webm": "video/webm",
          ".mov": "video/quicktime",
          ".m4v": "video/x-m4v",
          ".pdf": "application/pdf",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp"
        };
        fileUrl = await uploadToSupabaseStorage(buffer, savedFileName, mimeMap[ext]);
      } else {
        if (!fs.existsSync(UPLOADS_DIR)) {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        const savedFullPath = path.join(UPLOADS_DIR, savedFileName);
        fs.writeFileSync(savedFullPath, buffer);
        fileUrl = `/uploads/${savedFileName}`;
      }

      return sendJson(res, 201, {
        ok: true,
        fileUrl,
        fileName: rawFileName,
        savedFileName,
        sizeBytes: buffer.length,
        ext
      });
    }

    // =========================================================================
    // 6.1 CRUD DE AUDIOBOOKS (ADMIN)
    // =========================================================================
    if (pathname === "/api/audiobooks/save" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const body = await parseBody(req);
      if (!body.title) {
        return sendJson(res, 400, { error: "O título do audiobook é obrigatório." });
      }

      const chapters = Array.isArray(body.chapters)
        ? body.chapters
        : String(body.chaptersText || "Capítulo 1: Introdução|10:00")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [t, d] = line.split("|");
              return { title: (t || "Capítulo").trim(), duration: (d || "10:00").trim() };
            });

      if (body.id) {
        const idx = currentDb.audiobooks.findIndex((a) => a.id === body.id);
        if (idx !== -1) {
          currentDb.audiobooks[idx] = {
            ...currentDb.audiobooks[idx],
            title: body.title,
            author: body.author || "Gisele Lourenço",
            audience: body.audience || "Família & Adultos",
            duration: body.duration || currentDb.audiobooks[idx].duration || "1h 30m",
            coverUrl: body.coverUrl || currentDb.audiobooks[idx].coverUrl,
            audioUrl: body.audioUrl !== undefined ? body.audioUrl : (currentDb.audiobooks[idx].audioUrl || ""),
            audioFileName: body.audioFileName !== undefined ? body.audioFileName : (currentDb.audiobooks[idx].audioFileName || ""),
            pdfUrl: body.pdfUrl !== undefined ? body.pdfUrl : (currentDb.audiobooks[idx].pdfUrl || ""),
            pdfFileName: body.pdfFileName !== undefined ? body.pdfFileName : (currentDb.audiobooks[idx].pdfFileName || ""),
            description: body.description !== undefined ? body.description : (currentDb.audiobooks[idx].description || ""),
            narrationText: body.narrationText || body.description || currentDb.audiobooks[idx].narrationText || body.title,
            chapters
          };
          await saveDatabase(currentDb);
          return sendJson(res, 200, { audiobooks: currentDb.audiobooks, savedItem: currentDb.audiobooks[idx] });
        }
      }

      const newAudiobook = {
        id: `ab_${Date.now()}`,
        title: body.title,
        author: body.author || "Gisele Lourenço",
        audience: body.audience || "Família & Adultos",
        duration: body.duration || "1h 30m",
        coverUrl:
          body.coverUrl ||
          "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
        audioUrl: body.audioUrl || "",
        audioFileName: body.audioFileName || "",
        pdfUrl: body.pdfUrl || "",
        pdfFileName: body.pdfFileName || "",
        description: body.description || "",
        narrationText: body.narrationText || body.description || body.title,
        chapters
      };
      currentDb.audiobooks.unshift(newAudiobook);
      await saveDatabase(currentDb);
      return sendJson(res, 201, { audiobooks: currentDb.audiobooks, savedItem: newAudiobook });
    }

    if (pathname === "/api/audiobooks/delete" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { id } = await parseBody(req);
      currentDb.audiobooks = currentDb.audiobooks.filter((a) => a.id !== id);
      await saveDatabase(currentDb);
      return sendJson(res, 200, { audiobooks: currentDb.audiobooks });
    }

    // =========================================================================
    // 6.2 CRUD DE VÍDEOS DA AUTORA (ADMIN)
    // =========================================================================
    if (pathname === "/api/videos/save" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const body = await parseBody(req);
      if (!body.title) return sendJson(res, 400, { error: "Informe o título do vídeo." });

      if (body.id) {
        const idx = currentDb.authorVideos.findIndex((v) => v.id === body.id);
        if (idx !== -1) {
          currentDb.authorVideos[idx] = { ...currentDb.authorVideos[idx], ...body };
          await saveDatabase(currentDb);
          return sendJson(res, 200, { authorVideos: currentDb.authorVideos });
        }
      }
      currentDb.authorVideos.unshift({
        id: `vid_${Date.now()}`,
        title: body.title,
        category: body.category || "Mentoria Gisele Lourenço",
        duration: body.duration || "10:00",
        videoUrl:
          body.videoUrl ||
          "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
        thumbnailUrl:
          body.thumbnailUrl ||
          "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Portfolio-03-600x628.jpg",
        description: body.description || ""
      });
      await saveDatabase(currentDb);
      return sendJson(res, 201, { authorVideos: currentDb.authorVideos });
    }

    if (pathname === "/api/videos/delete" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { id } = await parseBody(req);
      currentDb.authorVideos = currentDb.authorVideos.filter((v) => v.id !== id);
      await saveDatabase(currentDb);
      return sendJson(res, 200, { authorVideos: currentDb.authorVideos });
    }

    // =========================================================================
    // 6.3 CRUD DE PLAYBOOKS INTERATIVOS 3D
    // =========================================================================
    if (pathname === "/api/ebooks/save" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const body = await parseBody(req);
      if (!body.title) return sendJson(res, 400, { error: "Informe o título do Playbook." });

      const pages = buildGeneratedBookPages(body, body.id ? (currentDb.ebooks.find((e) => e.id === body.id)?.bookPages || []) : []);

      if (body.id) {
        const idx = currentDb.ebooks.findIndex((e) => e.id === body.id);
        if (idx !== -1) {
          currentDb.ebooks[idx] = {
            ...currentDb.ebooks[idx],
            ...body,
            subtitle: body.subtitle !== undefined ? body.subtitle : (currentDb.ebooks[idx].subtitle || ""),
            category: body.category !== undefined ? body.category : (currentDb.ebooks[idx].category || "Playbook Interativo"),
            accentColor: body.accentColor !== undefined ? body.accentColor : (currentDb.ebooks[idx].accentColor || "emerald"),
            readingTime: body.readingTime !== undefined ? body.readingTime : (currentDb.ebooks[idx].readingTime || "Leitura & Prática: 20 min"),
            pages: `${pages.length} páginas interativas`,
            bookPages: pages,
            audioUrl: body.audioUrl !== undefined ? body.audioUrl : (currentDb.ebooks[idx].audioUrl || ""),
            audioFileName: body.audioFileName !== undefined ? body.audioFileName : (currentDb.ebooks[idx].audioFileName || "")
          };
          await saveDatabase(currentDb);
          return sendJson(res, 200, { ebooks: currentDb.ebooks, savedItem: currentDb.ebooks[idx] });
        }
      }

      const newEbook = {
        id: `eb_${Date.now()}`,
        title: body.title,
        subtitle: body.subtitle || "Playbook Digital Interativo com Páginas 3D e Exercícios Práticos",
        author: body.author || "Gisele Lourenço",
        category: body.category || "Playbook Interativo",
        accentColor: body.accentColor || "rose",
        readingTime: body.readingTime || "Leitura & Prática: 20 min",
        pages: `${pages.length} páginas interativas`,
        audience: body.audience || "Família & Adultos",
        coverUrl:
          body.coverUrl ||
          "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
        audioUrl: body.audioUrl || "",
        audioFileName: body.audioFileName || "",
        description: body.description || "Playbook interativo com páginas virando em 3D para celular, tablet e PC.",
        contentPreview: body.contentPreview || body.description || body.title,
        bookPages: pages
      };
      currentDb.ebooks.unshift(newEbook);
      await saveDatabase(currentDb);
      return sendJson(res, 201, { ebooks: currentDb.ebooks, savedItem: newEbook });
    }

    if (pathname === "/api/ebooks/page-interaction" && req.method === "POST") {
      const { playbookId, pageNumber, checklistIdx, userResponse } = await parseBody(req);
      const pb = currentDb.ebooks.find((e) => e.id === playbookId);
      if (!pb || !Array.isArray(pb.bookPages)) {
        return sendJson(res, 404, { error: "Playbook não encontrado." });
      }
      const page = pb.bookPages.find((p) => Number(p.pageNumber) === Number(pageNumber));
      if (!page) return sendJson(res, 404, { error: "Página não encontrada." });

      if (checklistIdx !== undefined && Array.isArray(page.checklist) && page.checklist[checklistIdx]) {
        page.checklist[checklistIdx].checked = !page.checklist[checklistIdx].checked;
      }
      if (userResponse !== undefined) page.userResponse = userResponse;
      await saveDatabase(currentDb);
      return sendJson(res, 200, { ebooks: currentDb.ebooks, savedPlaybook: pb });
    }

    if (pathname === "/api/ebooks/page-save" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { playbookId, pageData, isNewPage } = await parseBody(req);
      const pb = currentDb.ebooks.find((e) => e.id === playbookId);
      if (!pb) return sendJson(res, 404, { error: "Playbook não encontrado." });
      if (!Array.isArray(pb.bookPages)) pb.bookPages = [];

      const formattedPage = {
        pageNumber: Number(pageData.pageNumber) || pb.bookPages.length + 1,
        type: pageData.type || "chapter",
        kicker: pageData.kicker || "CAPÍTULO DO PLAYBOOK",
        title: pageData.title || "Nova Página do Playbook",
        subtitle: pageData.subtitle || "",
        verseText: pageData.verseText || "",
        verseRef: pageData.verseRef || "",
        paragraphs: Array.isArray(pageData.paragraphs)
          ? pageData.paragraphs
          : String(pageData.paragraphsText || "").split(/\n+/).map((p) => p.trim()).filter(Boolean),
        calloutTitle: pageData.calloutTitle || "",
        calloutText: pageData.calloutText || "",
        checklist: Array.isArray(pageData.checklist)
          ? pageData.checklist
          : String(pageData.checklistText || "")
              .split(/\n+/)
              .map((t) => t.trim())
              .filter(Boolean)
              .map((text) => ({ text, checked: false })),
        exercisePrompt: pageData.exercisePrompt || "",
        userResponse: pageData.userResponse || ""
      };

      if (isNewPage) {
        pb.bookPages.push(formattedPage);
      } else {
        const pIdx = pb.bookPages.findIndex((p) => Number(p.pageNumber) === Number(formattedPage.pageNumber));
        if (pIdx !== -1) {
          formattedPage.userResponse = pb.bookPages[pIdx].userResponse || formattedPage.userResponse;
          pb.bookPages[pIdx] = formattedPage;
        } else {
          pb.bookPages.push(formattedPage);
        }
      }

      pb.bookPages = pb.bookPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      pb.pages = `${pb.bookPages.length} páginas interativas`;
      await saveDatabase(currentDb);
      return sendJson(res, 200, { ebooks: currentDb.ebooks, savedPlaybook: pb });
    }

    if (pathname === "/api/ebooks/page-delete" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { playbookId, pageNumber } = await parseBody(req);
      const pb = currentDb.ebooks.find((e) => e.id === playbookId);
      if (!pb || !Array.isArray(pb.bookPages)) return sendJson(res, 404, { error: "Playbook não encontrado." });
      if (pb.bookPages.length <= 1) {
        return sendJson(res, 400, { error: "O Playbook precisa ter pelo menos 1 página." });
      }
      pb.bookPages = pb.bookPages
        .filter((p) => Number(p.pageNumber) !== Number(pageNumber))
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      pb.pages = `${pb.bookPages.length} páginas interativas`;
      await saveDatabase(currentDb);
      return sendJson(res, 200, { ebooks: currentDb.ebooks, savedPlaybook: pb });
    }

    if (pathname === "/api/ebooks/delete" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { id } = await parseBody(req);
      currentDb.ebooks = currentDb.ebooks.filter((e) => e.id !== id);
      await saveDatabase(currentDb);
      return sendJson(res, 200, { ebooks: currentDb.ebooks });
    }

    // =========================================================================
    // 6.4 CRUD DE ESTUDOS & MEDITAÇÃO DIÁRIA
    // =========================================================================
    if (pathname === "/api/meditations/save" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const body = await parseBody(req);
      if (!body.title) return sendJson(res, 400, { error: "Informe o título da meditação/estudo." });

      const questions = Array.isArray(body.studyQuestions)
        ? body.studyQuestions
        : String(body.questionsText || "").split("\n").map((q) => q.trim()).filter(Boolean);

      if (body.id) {
        const idx = currentDb.dailyMeditations.findIndex((m) => m.id === body.id);
        if (idx !== -1) {
          currentDb.dailyMeditations[idx] = {
            ...currentDb.dailyMeditations[idx],
            ...body,
            studyQuestions: questions.length ? questions : currentDb.dailyMeditations[idx].studyQuestions
          };
          await saveDatabase(currentDb);
          return sendJson(res, 200, { dailyMeditations: currentDb.dailyMeditations });
        }
      }

      currentDb.dailyMeditations.unshift({
        id: `med_${Date.now()}`,
        dateLabel: body.dateLabel || "Nova Meditação Diária",
        title: body.title,
        verseText: body.verseText || "",
        verseRef: body.verseRef || "",
        theme: body.theme || "Edificação Diária",
        author: body.author || "Gisele Lourenço",
        reflection: body.reflection || "",
        studyQuestions: questions.length ? questions : ["Como aplicar esta palavra em sua vida e família hoje?"],
        prayer: body.prayer || "",
        userNotes: body.userNotes || ""
      });
      await saveDatabase(currentDb);
      return sendJson(res, 201, { dailyMeditations: currentDb.dailyMeditations });
    }

    if (pathname === "/api/meditations/notes" && req.method === "POST") {
      const { id, userNotes } = await parseBody(req);
      const med = currentDb.dailyMeditations.find((m) => m.id === id);
      if (med) {
        med.userNotes = userNotes || "";
        await saveDatabase(currentDb);
      }
      return sendJson(res, 200, { dailyMeditations: currentDb.dailyMeditations });
    }

    if (pathname === "/api/meditations/delete" && req.method === "POST") {
      if (!requireAdmin(req, res, currentDb)) return;
      const { id } = await parseBody(req);
      currentDb.dailyMeditations = currentDb.dailyMeditations.filter((m) => m.id !== id);
      await saveDatabase(currentDb);
      return sendJson(res, 200, { dailyMeditations: currentDb.dailyMeditations });
    }

    // =========================================================================
    // 6.5 - 6.7 TTS PT-BR
    // =========================================================================
    if (pathname === "/api/tts/normalize" && req.method === "POST") {
      const { text } = await parseBody(req);
      return sendJson(res, 200, { normalized: normalizeForPortugueseSpeech(text || "") });
    }

    if (pathname === "/api/tts/synthesize" && req.method === "POST") {
      const { text, voice } = await parseBody(req);
      if (!text) return sendJson(res, 400, { error: "Texto obrigatório para narração." });
      const result = await neuralVoice.synthesizeSpeechMp3(text, voice || "female_warm");
      return sendJson(res, 200, {
        audioBase64: `data:audio/mpeg;base64,${result.mp3Buffer.toString("base64")}`,
        normalizedText: result.normalizedText,
        voiceInfo: result.voiceInfo,
        cached: result.cached
      });
    }

    if (pathname === "/api/tts/stream" && req.method === "GET") {
      const rawText = parsedUrl.searchParams.get("text") || "";
      const voiceParam = parsedUrl.searchParams.get("voice") || "female_warm";
      try {
        const result = await neuralVoice.synthesizeSpeechMp3(rawText, voiceParam);
        res.writeHead(200, {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=3600"
        });
        return res.end(result.mp3Buffer);
      } catch (e) {
        return sendJson(res, 502, { error: e.message });
      }
    }

    // =========================================================================
    // 7. ARQUIVOS ESTÁTICOS (/public)
    // =========================================================================
    let filePath = pathname === "/" ? "/index.html" : pathname;
    const fullPath = path.join(PUBLIC_DIR, filePath);

    if (!fullPath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const stat = fs.statSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const mimeTypes = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".m4a": "audio/mp4",
        ".aac": "audio/aac",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".mov": "video/quicktime",
        ".m4v": "video/x-m4v",
        ".pdf": "application/pdf"
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      const range = req.headers.range;
      if (range && [".mp3", ".wav", ".ogg", ".m4a", ".mp4", ".webm", ".mov", ".m4v"].includes(ext)) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = end - start + 1;
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": contentType
        });
        return fs.createReadStream(fullPath, { start, end }).pipe(res);
      }

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes"
      });
      return fs.createReadStream(fullPath).pipe(res);
    }

    // Nunca retornar HTML para rotas /api/* não encontradas
    if (pathname.startsWith("/api/")) {
      return sendJson(res, 404, { error: `Rota de API não encontrada: ${pathname}` });
    }

    const indexHtml = path.join(PUBLIC_DIR, "index.html");
    if (fs.existsSync(indexHtml)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(indexHtml).pipe(res);
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (err) {
    return sendJson(res, 500, { error: err.message || "Erro interno no servidor" });
  }
}

async function processWebhookEvent(payload, currentDb, res) {
  const eventType = payload.event || "PAYMENT_RECEIVED";
  const subId =
    payload.payment?.subscription ||
    payload.subscription?.id ||
    payload.subscriptionId;

  const targetSub =
    currentDb.subscribers.find((s) => s.asaasSubscriptionId === subId) ||
    currentDb.subscribers[0];

  let actionTaken = "Evento registrado";
  if (targetSub) {
    if (eventType === "PAYMENT_CONFIRMED" || eventType === "PAYMENT_RECEIVED") {
      targetSub.status = "ACTIVE";
      actionTaken = `Acesso liberado automaticamente para ${targetSub.name} (${targetSub.planName})`;
    } else if (eventType === "PAYMENT_OVERDUE") {
      targetSub.status = "OVERDUE";
      actionTaken = `Assinatura marcada como vencida. Lembrete enviado para ${targetSub.email}`;
    } else if (eventType === "SUBSCRIPTION_INACTIVATED") {
      targetSub.status = "INACTIVE";
      actionTaken = "Assinatura cancelada/inativada";
    }
  }

  const logEntry = {
    id: `evt_${Date.now()}`,
    timestamp: new Date().toLocaleString("pt-BR"),
    event: eventType,
    subscriptionId: targetSub ? targetSub.asaasSubscriptionId : subId || "sub_desconhecido",
    customerName: targetSub ? targetSub.name : "Assinante Asaas",
    billingType: payload.payment?.billingType || targetSub?.billingType || "PIX",
    amount: payload.payment?.value || targetSub?.value || 69.9,
    actionTaken
  };

  currentDb.webhookLogs.unshift(logEntry);
  await saveDatabase(currentDb);

  return sendJson(res, 200, {
    received: true,
    logEntry,
    subscribers: currentDb.subscribers.map(sanitizeSubscriber),
    metrics: computeMetrics(currentDb),
    webhookLogs: currentDb.webhookLogs
  });
}

function buildGeneratedBookPages(itemData, currentPages = []) {
  if (Array.isArray(itemData.bookPages) && itemData.bookPages.length > 0 && !itemData.regeneratePages) {
    return itemData.bookPages.map((p, i) => ({ ...p, pageNumber: i + 1 }));
  }
  if (Array.isArray(currentPages) && currentPages.length > 0 && !itemData.regeneratePages && !itemData.rawTextToPaginate) {
    return currentPages;
  }

  const rawSource = String(itemData.rawTextToPaginate || itemData.contentPreview || itemData.description || "").trim();
  const rawBlocks = rawSource
    ? rawSource.split(/\n{2,}|(?=(?:Capítulo|Cap\.|Missão|Parte|Lição|Dia)\s+\d+)/i).map((s) => s.trim()).filter(Boolean)
    : [];

  const pages = [
    {
      pageNumber: 1,
      type: "cover",
      kicker: "PLAYBOOK INTERATIVO • EDIÇÃO PROFISSIONAL",
      title: itemData.title,
      subtitle: itemData.subtitle || itemData.description || "Guia Prático de Aplicação, Leitura e Transformação",
      verseText: itemData.verseText || "Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho.",
      verseRef: itemData.verseRef || "Salmos 119:105",
      paragraphs: [
        itemData.description || `Bem-vindo(a) ao Playbook interativo '${itemData.title}', por ${itemData.author || "Gisele Lourenço"}.`,
        "Folheie as páginas virando e girando em 3D no seu celular, tablet ou PC. Preencha os exercícios interativos e ouça a narração em Português do Brasil."
      ],
      calloutTitle: "✨ Leitura Responsiva Multiplataforma",
      calloutText: "Adaptação automática para Celular (Página Inteira), Tablet e PC (Livro Aberto em Folha Dupla)."
    },
    {
      pageNumber: 2,
      type: "toc",
      kicker: "SUMÁRIO INTERATIVO • ESTRUTURA DO PLAYBOOK",
      title: "Mapa de Capítulos & Aplicação Prática",
      subtitle: "Clique em qualquer capítulo para virar as páginas automaticamente até lá",
      verseText: "Com a sabedoria se edifica a casa, e com o entendimento ela se estabelece.",
      verseRef: "Provérbios 24:3",
      paragraphs: [
        `Este Playbook foi estruturado para proporcionar leitura agradável, reflexão bíblica e prática imediata para ${itemData.audience || "toda a família"}.`
      ],
      calloutTitle: "📌 Como aproveitar ao máximo",
      calloutText: "Use os controles no topo do leitor para ajustar o tamanho da letra, o tom do papel (Marfim, Claro, Sépia ou Noturno) e ativar a narração em voz neural."
    }
  ];

  if (rawBlocks.length > 0) {
    rawBlocks.slice(0, 8).forEach((block, idx) => {
      const sentences = block.split(/(?<=[.!?])\s+/).filter(Boolean);
      const p1 = sentences.slice(0, Math.ceil(sentences.length / 2)).join(" ") || block;
      const p2 = sentences.slice(Math.ceil(sentences.length / 2)).join(" ");
      pages.push({
        pageNumber: pages.length + 1,
        type: "chapter",
        kicker: `CAPÍTULO ${idx + 1} • ENSINO & PRÁTICA`,
        title: `${itemData.title} — Parte ${idx + 1}`,
        subtitle: "Reflexão aprofundada e alinhamento de atitudes no lar",
        verseText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
        verseRef: "Provérbios 4:23",
        paragraphs: p2 ? [p1, p2] : [p1],
        calloutTitle: "💡 Ponto-Chave para Aplicação",
        calloutText: "Transforme este princípio em uma atitude visível de amor, sabedoria e constância hoje.",
        checklist: [
          { text: "Ler e meditar no princípio central deste capítulo", checked: false },
          { text: "Praticar este ensino em casa nesta semana", checked: false }
        ],
        exercisePrompt: "Como você pode aplicar o ensino desta página na sua rotina hoje?",
        userResponse: ""
      });
    });
  } else {
    pages.push({
      pageNumber: 3,
      type: "chapter",
      kicker: "CAPÍTULO 1 • FUNDAMENTO BÍBLICO E EMOCIONAL",
      title: "Alinhando o Coração às Verdades Eternas",
      subtitle: itemData.subtitle || "Compreendendo raízes, motivações e atitudes",
      verseText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
      verseRef: "Provérbios 4:23",
      paragraphs: [
        itemData.contentPreview || itemData.description || "A verdadeira transformação começa no território do coração quando unimos a Palavra de Deus com escolhas conscientes no dia a dia.",
        "Quando compreendemos como nossas emoções funcionam e como o outro precisa ser acolhido, construímos uma atmosfera de paz e maturidade."
      ],
      calloutTitle: "🧠 Visão Comportamental & Bíblica",
      calloutText: "Pequenas mudanças intencionais repetidas diariamente criam novas trilhas de sabedoria, afeto e domínio próprio.",
      checklist: [
        { text: "Observar minhas reações e escolher a resposta branda (Provérbios 15:1)", checked: true },
        { text: "Dedicar tempo de qualidade e escuta atenta em casa", checked: false }
      ],
      exercisePrompt: "Qual é o principal aprendizado deste capítulo para a sua vida hoje?",
      userResponse: ""
    });
  }

  pages.push({
    pageNumber: pages.length + 1,
    type: "certificate",
    kicker: "CONCLUSÃO & CONSAGRAÇÃO",
    title: "Compromisso de Vida e Sabedoria",
    subtitle: `Encerramento do ${itemData.title}`,
    verseText: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te dê a paz.",
    verseRef: "Números 6:24-26",
    paragraphs: [
      "Parabéns por concluir este Playbook Interativo! Você pode folhear novamente qualquer página, editar o conteúdo ou ouvir a narração completa em Português do Brasil."
    ],
    calloutTitle: "🏆 Playbook Concluído",
    calloutText: "Continue explorando os cursos, audiobooks e atividades do Ecossistema Gisele Lourenço & Clube DaviLiz!",
    exercisePrompt: "Registre sua oração ou declaração final:",
    userResponse: ""
  });

  return pages;
}

module.exports = { handleRequest };
