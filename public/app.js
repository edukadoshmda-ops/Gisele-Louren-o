/**
 * Front-end Interativo da Plataforma SaaS - Gisele Lourenço & Clube DaviLiz
 */

let state = {
  plans: [],
  courses: [],
  audiobooks: [],
  authorVideos: [],
  ebooks: [],
  dailyMeditations: [],
  kidsAlphabet: [],
  attitudesBoard: { items: [], totalStars: 0, childName: "" },
  bibleBookshelf: [],
  printables: [],
  shopProducts: [],
  subscribers: [],
  webhookLogs: [],
  metrics: {},
  currentUser: null,
  cart: JSON.parse(localStorage.getItem("clube_vip_cart") || "[]"),
  selectedCycle: "MONTHLY",
  selectedPaymentMethod: "PIX",
  selectedPaymentGateway: "ASAAS"
};

// Anexa automaticamente o token de sessão em todas as chamadas /api/*
(function wrapApiFetch() {
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (input, init = {}) {
    const url = typeof input === "string" ? input : input?.url || "";
    if (url.startsWith("/api/")) {
      const token = localStorage.getItem("clube_session_token");
      if (token) {
        init = {
          ...init,
          headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${token}`
          }
        };
      }
    }
    return originalFetch(input, init);
  };
})();

async function apiFetch(url, options = {}) {
  return fetch(url, options);
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadBootstrapData();
  updateCartBadge();
});

async function loadBootstrapData() {
  try {
    const res = await fetch("/api/bootstrap");
    const data = await res.json();
    state = { ...state, ...data };
    updateAuthUI();
    renderAll();
  } catch (err) {
    console.error("Erro ao carregar dados iniciais:", err);
  }
}

function renderAll() {
  renderPlans();
  renderAuthorBio();
  renderPlaybooksSection();
  renderMediaStudio();
  renderDailyMeditations();
  renderCourses();
  renderKidsSection();
  renderShop();
  renderAdminSection();
}

function renderAuthorBio() {
  const container = document.getElementById("author-bio-section");
  const author = state.authorProfile;
  if (!container || !author) return;

  const impactMetrics = author.impactMetrics || [
    { value: "+25 mil", label: "Pessoas alcançadas pelo testemunho e ministério" },
    { value: "+12 mil", label: "Crianças evangelizadas com ensino bíblico lúdico" },
    { value: "+4 mil", label: "Pais, líderes e educadores cristãos treinados" },
    { value: "5 Livros", label: "Obras publicadas (3 infantis + 2 adultos) & +1 mil mulheres aconselhadas" }
  ];

  const davilizResources = author.davilizResources || [
    "Estante Bíblica (66 Livros e 40 Escritores)",
    "Alfabeto de Versículos Musicados",
    "Árvore dos Frutos do Espírito",
    "Painel A Criação (Gênesis 1:1)",
    "Quadro Qual a sua Atitude? (Menino & Menina)"
  ];

  const evangelismHighlight =
    author.evangelismHighlight ||
    "85% das conversões acontecem entre 4 e 5 anos de idade quando é feito um trabalho intencional de evangelismo e discipulado de 0 a 3 anos.";

  const officialQuote =
    author.officialQuote ||
    "Apenas uma vida que logo passará. Apenas o que for feito para Cristo, durará.";

  const mainAuthorPhoto =
    !author.photoUrl || author.photoUrl.includes("A-Arte-de-Relacionarse")
      ? "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-com-livros-02-556x1024.png"
      : author.photoUrl;

  container.innerHTML = `
    <div class="grid lg:grid-cols-12">
      <!-- Coluna da Foto da Autora Gisele Lourenço + Destaques Preenchendo Todo o Card -->
      <div class="lg:col-span-5 bg-gradient-to-b from-emerald-950 via-emerald-900 to-rose-950 p-6 sm:p-8 text-white flex flex-col justify-between gap-5">
        <!-- Topo: Badge + Retrato Oficial da Autora + Nome e Subtítulo -->
        <div class="text-center space-y-3.5 w-full">
          <span class="inline-block bg-rose-500/30 border border-rose-300/30 text-rose-100 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
            Conheça a Autora &amp; Mentora
          </span>

          <div class="relative mx-auto w-48 h-56 sm:w-56 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-300/80 shadow-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-emerald-950/30">
            <img src="${mainAuthorPhoto}" alt="${author.name}" class="w-full h-full object-cover object-top" />
          </div>

          <div>
            <h3 class="serif-title text-2xl sm:text-3xl font-bold text-white">${author.name}</h3>
            <p class="text-xs sm:text-sm text-amber-200 font-medium mt-1 leading-snug">${author.role}</p>
          </div>
        </div>

        <!-- Meio Preenchido: Alcance Oficial, Evangelismo Infantil, Recursos DaviLiz & Lema -->
        <div class="w-full space-y-3.5">
          <!-- Números Oficiais de Alcance (Portfólio giselelourenco.com.br) -->
          <div class="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">📊 Alcance &amp; Impacto Ministerial</span>
              <span class="text-[10px] bg-emerald-500/25 text-emerald-100 px-2 py-0.5 rounded-full font-semibold">${author.location || "Fortaleza, CE"}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              ${impactMetrics
                .map(
                  (m) => `
                <div class="bg-emerald-950/55 border border-white/10 rounded-xl p-2.5">
                  <div class="font-extrabold text-sm sm:text-base text-amber-300 leading-tight">${m.value}</div>
                  <div class="text-[11px] text-emerald-100/90 leading-snug mt-0.5">${m.label}</div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Missão Infantil & Brinquedos Pedagógicos (daviliz.com.br/loja) -->
          <div class="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 space-y-2">
            <div class="text-[11px] font-extrabold uppercase tracking-wider text-rose-200">
              🧸 Missão DaviLiz • Brinquedos de Valores Eternos
            </div>
            <p class="text-xs text-emerald-50/95 leading-relaxed">
              ${evangelismHighlight}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${davilizResources
                .map(
                  (res) => `
                <span class="text-[10px] font-semibold bg-amber-400/20 text-amber-100 border border-amber-300/30 px-2 py-0.5 rounded-lg">
                  ✨ ${res}
                </span>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Lema Oficial da Autora -->
          <div class="bg-rose-950/50 border border-rose-300/25 rounded-2xl px-4 py-3 text-center">
            <p class="serif-title italic text-xs sm:text-sm text-amber-100 leading-relaxed">
              "${officialQuote}"
            </p>
          </div>
        </div>

        <!-- Rodapé do Card: Mini Galeria Oficial da Autora (Palestrante, Mentora, Escritora) -->
        <div class="grid grid-cols-3 gap-2.5 sm:gap-3 w-full pt-3 border-t border-white/15">
          <div class="bg-white/10 rounded-2xl p-2 text-center flex flex-col justify-between border border-white/10">
            <div class="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-emerald-950/60 flex items-center justify-center mb-1.5">
              <img src="${author.photoPortraitUrl}" alt="Gisele Lourenço Palestrante" class="w-full h-full object-cover object-top" />
            </div>
            <span class="text-[11px] sm:text-xs font-semibold text-emerald-100 block">Palestrante</span>
          </div>
          <div class="bg-white/10 rounded-2xl p-2 text-center flex flex-col justify-between border border-white/10">
            <div class="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-emerald-950/60 flex items-center justify-center mb-1.5">
              <img src="${author.photoCursoUrl}" alt="Curso O Poder de Se Conhecer" class="w-full h-full object-cover object-top" />
            </div>
            <span class="text-[11px] sm:text-xs font-semibold text-emerald-100 block">Mentora</span>
          </div>
          <div class="bg-white/10 rounded-2xl p-2 text-center flex flex-col justify-between border border-white/10">
            <div class="w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-emerald-950/60 flex items-center justify-center mb-1.5">
              <img src="${author.photoFlorescendoUrl}" alt="Livro Florescendo" class="w-full h-full object-cover object-top" />
            </div>
            <span class="text-[11px] sm:text-xs font-semibold text-emerald-100 block">Escritora</span>
          </div>
        </div>
      </div>

      <!-- Coluna do Texto: Biografia, Formação Acadêmica e Experiência -->
      <div class="lg:col-span-7 p-8 sm:p-10 space-y-6">
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <img src="/images/logo-gisele-daviliz.jpg" alt="Logo Gisele Lourenço & Clube DaviLiz" class="h-12 w-12 rounded-xl object-cover border border-amber-400/80 shadow-sm" />
            <img src="${author.davilizLogoUrl}" alt="Logo DaviLiz" class="h-9 w-auto object-contain" />
          </div>
          <h2 class="serif-title text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
            ${author.headline}
          </h2>
          ${author.biography
            .map((p) => `<p class="text-sm text-slate-600 leading-relaxed">${p}</p>`)
            .join("")}
        </div>

        <!-- Linha do Tempo: Formação Acadêmica e Teológica -->
        <div class="space-y-3 pt-2">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <span>🎓 Formação Acadêmica, Teológica &amp; Especializações</span>
          </h4>
          <div class="grid sm:grid-cols-2 gap-2.5">
            ${author.academicFormation
              .map(
                (item) => `
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">${item.period}</span>
                </div>
                <div class="font-bold text-xs sm:text-sm text-slate-900 mt-1.5">${item.title}</div>
                <div class="text-[11px] text-slate-500">${item.institution}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Pilares de Experiência e Atuação -->
        <div class="space-y-3 pt-2">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-rose-800">
            ✨ Experiência Ministerial, Clínica e Pedagógica
          </h4>
          <div class="grid sm:grid-cols-3 gap-3">
            ${author.experiencePillars
              .map(
                (pillar) => `
              <div class="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                <div class="font-extrabold text-xs text-emerald-950">${pillar.title}</div>
                <p class="text-[11px] text-slate-600 leading-relaxed">${pillar.description}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Alternância de Abas
function switchTab(tabName) {
  const views = ["landing", "playbooks", "midia", "meditacao", "gisele", "daviliz", "loja", "admin"];
  views.forEach((v) => {
    const section = document.getElementById(`view-${v}`);
    const btn = document.getElementById(`tab-btn-${v}`);
    if (!section || !btn) return;
    if (v === tabName) {
      section.classList.remove("hidden");
      btn.classList.add("tab-active");
      btn.classList.remove("text-slate-600");
    } else {
      section.classList.add("hidden");
      btn.classList.remove("tab-active");
      btn.classList.add("text-slate-600");
    }
  });
  if (tabName === "playbooks") {
    renderPlaybooksSection();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Alternar Ciclo Mensal / Anual
function setBillingCycle(cycle) {
  state.selectedCycle = cycle;
  const monthlyBtn = document.getElementById("cycle-monthly-btn");
  const yearlyBtn = document.getElementById("cycle-yearly-btn");
  if (cycle === "MONTHLY") {
    monthlyBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-sm transition";
    yearlyBtn.className = "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition";
  } else {
    yearlyBtn.className = "px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-sm transition";
    monthlyBtn.className = "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition";
  }
  renderPlans();
}

// 1. Renderizar Planos de Assinatura
function renderPlans() {
  const container = document.getElementById("plans-grid");
  if (!container) return;

  container.innerHTML = state.plans
    .map((plan) => {
      const isYearly = state.selectedCycle === "YEARLY";
      const price = isYearly ? plan.priceYearly : plan.priceMonthly;
      const periodLabel = isYearly ? "/ano" : "/mês";
      const borderClass = plan.highlighted
        ? "border-2 border-rose-600 shadow-xl relative bg-white scale-[1.02]"
        : "border border-slate-200 shadow-sm bg-white";

      return `
        <div class="rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${borderClass}">
          ${
            plan.highlighted
              ? `<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow">
                  ⭐ ${plan.badge}
                </div>`
              : `<div class="inline-block self-start text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 mb-2">
                  ${plan.badge}
                </div>`
          }
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-extrabold text-slate-900">${plan.name}</h3>
              <p class="text-xs text-slate-500 mt-1">${plan.subtitle}</p>
            </div>

            <div class="pt-2 border-t border-slate-100">
              <div class="flex items-baseline gap-1">
                <span class="text-sm font-bold text-slate-500">R$</span>
                <span class="text-4xl font-extrabold text-slate-900">${price.toFixed(2).replace(".", ",")}</span>
                <span class="text-xs font-semibold text-slate-500">${periodLabel}</span>
              </div>
              <div class="text-xs text-emerald-700 font-semibold mt-1">
                Inclui ${plan.discountShopPercent}% OFF em toda a loja física DaviLiz
              </div>
            </div>

            <ul class="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-2">
              ${plan.features
                .map(
                  (f) => `
                <li class="flex items-start gap-2">
                  <span class="text-emerald-600 font-bold mt-0.5">✔</span>
                  <span>${f}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>

          <button onclick="openCheckoutModal('${plan.id}')"
            class="mt-8 w-full py-3.5 rounded-2xl font-extrabold text-sm transition shadow-sm ${
              plan.highlighted
                ? "bg-gradient-to-r from-emerald-800 to-rose-700 hover:from-emerald-900 hover:to-rose-800 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }">
            Assinar ${plan.name} →
          </button>
        </div>
      `;
    })
    .join("");
}

// 2. Renderizar Cursos e Mentorias da Gisele Lourenço
function renderCourses() {
  const container = document.getElementById("courses-grid");
  if (!container) return;

  container.innerHTML = state.courses
    .map(
      (course) => `
      <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
        <div>
          <div class="bg-gradient-to-r ${course.coverGradient} p-6 text-white space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full">
                ${course.badge}
              </span>
              <span class="text-xs text-white/80 font-medium">${course.duration}</span>
            </div>
            <h3 class="serif-title text-2xl font-bold">${course.title}</h3>
            <p class="text-xs text-white/90">${course.category} • Por ${course.instructor}</p>
          </div>

          <div class="p-6 space-y-4">
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${course.description}</p>

            <!-- Barra de Progresso -->
            <div class="space-y-1">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-600">Progresso na Trilha</span>
                <span class="text-emerald-700">${course.progress}% concluído</span>
              </div>
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-600 rounded-full" style="width: ${course.progress}%"></div>
              </div>
            </div>

            <!-- Lista de Aulas/Módulos -->
            <div class="space-y-2 pt-2">
              ${course.modules
                .map(
                  (m) => `
                <div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-2 font-medium text-slate-800">
                    <span class="${m.completed ? "text-emerald-600" : "text-slate-400"}">
                      ${m.completed ? "✅" : "▶️"}
                    </span>
                    <span>${m.title}</span>
                  </div>
                  <span class="text-slate-400 font-semibold">${m.duration}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="px-6 pb-6">
          <button onclick="openCourseModal('${course.id}')"
            class="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm transition">
            ▶ Continuar Assistindo Curso
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

// 3. Renderizar Espaço Kids Davi e Liz (Quadro de Atitudes, Alfabeto Musical, Estante Bíblica, PDFs)
function renderKidsSection() {
  const starsEl = document.getElementById("kids-total-stars");
  const childEl = document.getElementById("kids-child-name");
  if (starsEl) starsEl.textContent = `⭐ ${state.attitudesBoard.totalStars}`;
  if (childEl) {
    childEl.textContent = `${state.attitudesBoard.childName} • ${state.attitudesBoard.streakDays} dias seguidos`;
  }

  // Lista de Atitudes
  const attList = document.getElementById("attitudes-list");
  if (attList) {
    attList.innerHTML = state.attitudesBoard.items
      .map(
        (item) => `
        <div onclick="toggleAttitude('${item.id}')"
          class="cursor-pointer p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
            item.completedToday
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
          }">
          <div class="flex items-center gap-3.5">
            <div class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm ${
              item.completedToday
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white border border-slate-300 text-transparent"
            }">
              ✓
            </div>
            <div>
              <div class="font-bold text-sm ${item.completedToday ? "line-through text-emerald-900" : ""}">
                ${item.title}
              </div>
              <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span class="font-semibold text-rose-700">${item.category}</span>
                <span>•</span>
                <span>📖 ${item.verse}</span>
              </div>
            </div>
          </div>
          <div class="shrink-0 bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1.5 rounded-xl">
            +${item.stars} ⭐
          </div>
        </div>
      `
      )
      .join("");
  }

  // Alfabeto de Versículos Musicados
  const alphaBtns = document.getElementById("alphabet-buttons");
  if (alphaBtns) {
    alphaBtns.innerHTML = state.kidsAlphabet
      .map(
        (item, idx) => `
        <button onclick="playAlphabetVerse(${idx})"
          class="bg-amber-100 hover:bg-amber-300 text-amber-950 font-extrabold py-3 rounded-2xl text-lg shadow-sm border border-amber-300 transition transform active:scale-95">
          ${item.letter}
        </button>
      `
      )
      .join("");
  }

  // Estante Bíblica Digital
  const shelfContainer = document.getElementById("bookshelf-container");
  if (shelfContainer) {
    shelfContainer.innerHTML = state.bibleBookshelf
      .map(
        (shelf) => `
        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-md text-white" style="background-color: ${shelf.color}">
              ${shelf.group}
            </span>
            <span class="text-[11px] text-slate-500 font-medium">${shelf.funFact}</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${shelf.books
              .map(
                (book) => `
              <span onclick="alert('Livro da Bíblia: ${book} — ${shelf.funFact}')"
                class="cursor-pointer bg-white hover:bg-amber-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm transition">
                📘 ${book}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");
  }

  // Central de Playbooks Semanais 3D no Espaço Kids
  const pdfList = document.getElementById("printables-list");
  if (pdfList) {
    pdfList.innerHTML = state.printables
      .map(
        (pdf) => `
        <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            <div class="font-bold text-xs sm:text-sm text-slate-900">${pdf.title}</div>
            <div class="text-xs text-slate-500">${pdf.pages} • Faixa: ${pdf.age}</div>
          </div>
          <button onclick="openPlaybookIn3DReader('${pdf.playbookId || "eb_3"}')"
            class="bg-gradient-to-r from-emerald-800 to-rose-700 hover:from-emerald-900 hover:to-rose-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shrink-0 transition shadow-sm">
            📖 Abrir Playbook 3D
          </button>
        </div>
      `
      )
      .join("");
  }
}

// Alternar Atitude no Servidor
async function toggleAttitude(attitudeId) {
  try {
    const res = await fetch("/api/kids/attitude-toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attitudeId })
    });
    const data = await res.json();
    if (data.attitudesBoard) {
      state.attitudesBoard = data.attitudesBoard;
      playSuccessChime();
      renderKidsSection();
    }
  } catch (err) {
    console.error(err);
  }
}

// Adicionar Nova Atitude
async function handleAddAttitude(e) {
  e.preventDefault();
  const titleInput = document.getElementById("new-att-title");
  const verseInput = document.getElementById("new-att-verse");
  const title = titleInput.value.trim();
  const verse = verseInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch("/api/kids/attitude-add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, verse, stars: 3 })
    });
    const data = await res.json();
    if (data.attitudesBoard) {
      state.attitudesBoard = data.attitudesBoard;
      titleInput.value = "";
      verseInput.value = "";
      renderKidsSection();
    }
  } catch (err) {
    console.error(err);
  }
}

// Sintetizador Web Audio API + Narração em Português do Brasil para o Alfabeto de Versículos
function playAlphabetVerse(index) {
  const item = state.kidsAlphabet[index];
  if (!item) return;

  document.getElementById("alpha-current-letter").textContent = item.letter;
  document.getElementById("alpha-current-theme").textContent = item.theme;
  document.getElementById("alpha-current-verse").textContent = `"${item.verse}"`;
  document.getElementById("alpha-current-ref").textContent = item.ref;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [item.noteFreq, item.noteFreq * 1.25, item.noteFreq * 1.5];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
    });
  } catch (_) {}

  // Narra a letra, o tema, o versículo e a referência bíblica por extenso em português do Brasil
  setTimeout(() => {
    speakPortugueseText(`Letra ${item.letter}. Tema: ${item.theme}. ${item.verse} ${item.ref}.`);
  }, 380);
}

function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } catch (_) {}
}

function playBabyLullaby() {
  speakPortugueseText(
    "Devocional O Evangelho para Bebês, por Gisele Lourenço. Leitura em Salmos 139:14 e Salmos 119:105: Lâmpada para os meus pés é a Tua palavra, e luz para o meu caminho. Desde pequenininho, Deus criou você com muito amor.",
    "female_warm"
  );
}

function downloadSimulatedPdf(title) {
  const content = `MATERIAL EXCLUSIVO ASSINANTES - CLUBE GISELE LOURENÇO & DAVILIZ\n\nTítulo: ${title}\nSites oficiais: https://giselelourenco.com.br | https://daviliz.com.br/loja/\n\nImprima esta folha em formato A4 para realizar a atividade com sua família ou Ministério Infantil!`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// 4. Renderizar Loja VIP com Desconto de Assinante
function renderShop() {
  const container = document.getElementById("shop-grid");
  const selectEl = document.getElementById("shop-discount-select");
  if (!container) return;

  const discountPct = Number(selectEl?.value || 20);

  container.innerHTML = state.shopProducts
    .map((prod) => {
      const vipPrice = prod.regularPrice * (1 - discountPct / 100);
      return `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            ${
              prod.imageUrl
                ? `<div class="w-full h-48 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                    <img src="${prod.imageUrl}" alt="${prod.name}" class="max-h-full w-auto object-contain rounded-xl" />
                  </div>`
                : ""
            }
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                ${prod.tag}
              </span>
              <span class="text-xs font-semibold text-slate-400">${prod.brand}</span>
            </div>
            <h3 class="font-extrabold text-lg text-slate-900">${prod.name}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">${prod.description}</p>
          </div>

          <div class="pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-baseline justify-between">
              <div>
                <div class="text-xs text-slate-400 line-through">De R$ ${prod.regularPrice.toFixed(2).replace(".", ",")}</div>
                <div class="text-2xl font-extrabold text-emerald-800">
                  R$ ${vipPrice.toFixed(2).replace(".", ",")}
                </div>
              </div>
              <span class="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-1 rounded-xl">
                -${discountPct}% Assinante
              </span>
            </div>
            <button onclick="addToCart('${prod.id}')"
              class="w-full bg-slate-900 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition">
              🛍️ Adicionar ao Carrinho VIP
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// 5. Renderizar Painel Admin SaaS & Asaas
function renderAdminSection() {
  const m = state.metrics || {};
  const mrrEl = document.getElementById("metric-mrr");
  const arrEl = document.getElementById("metric-arr");
  const activeEl = document.getElementById("metric-active");
  const pendingEl = document.getElementById("metric-pending");

  if (mrrEl) mrrEl.textContent = `R$ ${(m.mrr || 0).toFixed(2).replace(".", ",")}`;
  if (arrEl) arrEl.textContent = `R$ ${(m.arr || 0).toFixed(2).replace(".", ",")}`;
  if (activeEl) activeEl.textContent = m.activeSubscribers || 0;
  if (pendingEl) pendingEl.textContent = (m.pendingSubscribers || 0) + (m.overdueSubscribers || 0);

  const modeBadge = document.getElementById("asaas-mode-badge");
  const mpBadge = document.getElementById("mp-mode-badge");
  const statusPill = document.getElementById("asaas-status-pill");
  if (m.asaasConfig?.isLiveConfigured && modeBadge) {
    modeBadge.textContent = `API Asaas Conectada (${m.asaasConfig.environment})`;
    modeBadge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800";
  }
  if (m.mercadoPagoConfig?.isLiveConfigured && mpBadge) {
    mpBadge.textContent = `Mercado Pago Conectado (${m.mercadoPagoConfig.environment})`;
    mpBadge.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800";
  }
  if (statusPill) {
    const mpOn = m.mercadoPagoConfig?.isLiveConfigured;
    const asOn = m.asaasConfig?.isLiveConfigured;
    if (mpOn || asOn) {
      statusPill.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> ${mpOn ? "Mercado Pago" : "Asaas"} Live`;
    }
  }

  // Tabela de Assinantes
  const tbody = document.getElementById("subscribers-table-body");
  if (tbody) {
    tbody.innerHTML = state.subscribers
      .map((sub) => {
        const badgeStyle =
          sub.status === "ACTIVE"
            ? "bg-emerald-100 text-emerald-800"
            : sub.status === "PENDING"
            ? "bg-amber-100 text-amber-800"
            : "bg-rose-100 text-rose-800";
        return `
          <tr>
            <td class="py-3 pr-3">
              <div class="font-bold text-slate-900">${sub.name}</div>
              <div class="text-xs text-slate-400">${sub.email}</div>
            </td>
            <td class="py-3 px-3 font-semibold text-slate-700">${sub.planName}</td>
            <td class="py-3 px-3">
              <span class="font-bold text-slate-900">R$ ${Number(sub.value).toFixed(2).replace(".", ",")}</span>
              <span class="text-xs text-slate-500 block">${sub.billingType} • ${sub.cycle === "YEARLY" ? "Anual" : "Mensal"}</span>
            </td>
            <td class="py-3 px-3 font-mono text-xs text-slate-500">${sub.asaasSubscriptionId}</td>
            <td class="py-3 pl-3">
              <span class="text-xs font-extrabold px-2.5 py-1 rounded-full ${badgeStyle}">
                ${sub.status}
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // Logs de Webhook
  const logsEl = document.getElementById("webhook-logs-list");
  if (logsEl) {
    logsEl.innerHTML = state.webhookLogs
      .map(
        (log) => `
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              ${log.event}
            </span>
            <span class="text-slate-400">${log.timestamp}</span>
          </div>
          <div class="font-semibold text-slate-800">${log.customerName} • R$ ${Number(log.amount).toFixed(2).replace(".", ",")} (${log.billingType})</div>
          <div class="text-slate-500">${log.actionTaken}</div>
        </div>
      `
      )
      .join("");
  }
}

// Modal Checkout Asaas
function openCheckoutModal(planId) {
  const plan = state.plans.find((p) => p.id === planId) || state.plans[1];
  const isYearly = state.selectedCycle === "YEARLY";
  const price = isYearly ? plan.priceYearly : plan.priceMonthly;

  document.getElementById("checkout-plan-id").value = plan.id;
  document.getElementById("modal-plan-title").textContent = plan.name;
  document.getElementById("modal-plan-price").textContent = `R$ ${price.toFixed(2).replace(".", ",")} ${
    isYearly ? "/ ano" : "/ mês"
  } (${plan.discountShopPercent}% OFF na Loja DaviLiz)`;

  document.getElementById("checkout-form").classList.remove("hidden");
  document.getElementById("checkout-result").classList.add("hidden");

  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function selectPaymentMethod(method) {
  state.selectedPaymentMethod = method;
  ["PIX", "CREDIT_CARD", "BOLETO"].forEach((m) => {
    const btn = document.getElementById(`pay-btn-${m}`);
    if (m === method) {
      btn.className =
        "pay-method-btn border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-bold py-2.5 px-3 rounded-xl text-xs flex flex-col items-center gap-1";
    } else {
      btn.className =
        "pay-method-btn border border-slate-200 text-slate-600 font-bold py-2.5 px-3 rounded-xl text-xs flex flex-col items-center gap-1";
    }
  });

  const ccFields = document.getElementById("credit-card-fields");
  if (method === "CREDIT_CARD") {
    ccFields.classList.remove("hidden");
  } else {
    ccFields.classList.add("hidden");
  }
}

function selectPaymentGateway(gateway) {
  state.selectedPaymentGateway = gateway === "ASAAS" ? "ASAAS" : "MERCADOPAGO";
  const mpBtn = document.getElementById("gw-btn-MERCADOPAGO");
  const asBtn = document.getElementById("gw-btn-ASAAS");
  const subtitle = document.getElementById("checkout-gateway-subtitle");
  const submitBtn = document.getElementById("checkout-submit-btn");

  if (mpBtn && asBtn) {
    if (state.selectedPaymentGateway === "MERCADOPAGO") {
      mpBtn.className = "border-2 border-sky-600 bg-sky-50 text-sky-950 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition";
      asBtn.className = "border border-slate-200 text-slate-600 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition";
      if (subtitle) {
        subtitle.textContent = "Checkout Transparente Recorrente • Mercado Pago";
        subtitle.className = "text-xs font-bold uppercase tracking-wider text-sky-700";
      }
      if (submitBtn) {
        submitBtn.textContent = "Gerar Assinatura no Mercado Pago →";
        submitBtn.className = "w-full bg-gradient-to-r from-sky-600 to-emerald-700 hover:from-sky-700 hover:to-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition text-sm";
      }
    } else {
      asBtn.className = "border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition";
      mpBtn.className = "border border-slate-200 text-slate-600 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition";
      if (subtitle) {
        subtitle.textContent = "Checkout Transparente Recorrente • Asaas";
        subtitle.className = "text-xs font-bold uppercase tracking-wider text-emerald-700";
      }
      if (submitBtn) {
        submitBtn.textContent = "Gerar Assinatura no Asaas →";
        submitBtn.className = "w-full bg-gradient-to-r from-emerald-800 to-rose-700 hover:from-emerald-900 hover:to-rose-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition text-sm";
      }
    }
  }
}

async function handleSubmitSubscription(e) {
  e.preventDefault();
  const gateway = state.selectedPaymentGateway || "MERCADOPAGO";
  const isMP = gateway === "MERCADOPAGO";
  const gatewayLabel = isMP ? "Mercado Pago" : "Asaas";
  const endpoint = isMP ? "/api/mercadopago/subscribe" : "/api/asaas/subscribe";

  const submitBtn = document.getElementById("checkout-submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = `Conectando ao ${gatewayLabel}...`;

  const planId = document.getElementById("checkout-plan-id").value;
  const customer = {
    name: document.getElementById("cust-name").value.trim(),
    email: document.getElementById("cust-email").value.trim(),
    cpfCnpj: document.getElementById("cust-cpf").value.trim(),
    phone: document.getElementById("cust-phone")?.value.trim() || "",
    password: document.getElementById("cust-password")?.value || ""
  };

  const creditCard =
    state.selectedPaymentMethod === "CREDIT_CARD"
      ? {
          holderName: customer.name,
          number: document.getElementById("cc-number").value || "5555444433332222",
          expiryMonth: document.getElementById("cc-month").value || "12",
          expiryYear: document.getElementById("cc-year").value || "2029",
          ccv: document.getElementById("cc-ccv").value || "123",
          postalCode: document.getElementById("cc-postal")?.value.trim() || "60000000",
          addressNumber: document.getElementById("cc-address-num")?.value.trim() || "100"
        }
      : null;

  try {
    const res = await apiFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        planId,
        billingType: state.selectedPaymentMethod,
        cycle: state.selectedCycle,
        creditCard
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar assinatura");

    if (data.token && data.user) {
      localStorage.setItem("clube_session_token", data.token);
      state.currentUser = data.user;
      updateAuthUI();
    }
    if (Array.isArray(state.subscribers) && data.subscriber) {
      state.subscribers.unshift(data.subscriber);
    }
    if (data.metrics) state.metrics = data.metrics;
    if (data.webhookLogs) state.webhookLogs = data.webhookLogs;
    renderAdminSection();
    showToast("Assinatura gerada e conta criada com sucesso!", "success");

    const resultBox = document.getElementById("checkout-result");
    document.getElementById("checkout-form").classList.add("hidden");
    resultBox.classList.remove("hidden");

    const gwRes = data.gatewayResult || data.asaasResult || {};
    const subId = gwRes.mpSubscriptionId || gwRes.asaasSubscriptionId;
    const pixPayload = gwRes?.paymentDetails?.pixPayload;
    const boletoLinha = gwRes?.paymentDetails?.boletoLinhaDigitavel;
    const invoiceUrl = gwRes?.paymentDetails?.invoiceUrl;

    resultBox.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto">
        ✓
      </div>
      <h4 class="font-extrabold text-lg text-emerald-950">Assinatura Criada no ${gatewayLabel}!</h4>
      <p class="text-xs text-emerald-800">
        ID Assinatura: <span class="font-mono font-bold">${subId}</span>
      </p>
      ${
        pixPayload
          ? `<div class="bg-white p-3 rounded-xl border border-emerald-200 text-left space-y-1.5">
              <div class="text-xs font-bold text-slate-700">Código PIX Copia e Cola (${gatewayLabel}):</div>
              <input type="text" readonly value="${pixPayload}" class="w-full text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200" />
            </div>`
          : ""
      }
      ${
        boletoLinha
          ? `<div class="bg-white p-3 rounded-xl border border-emerald-200 text-left space-y-1.5">
              <div class="text-xs font-bold text-slate-700">Linha Digitável do Boleto (${gatewayLabel}):</div>
              <input type="text" readonly value="${boletoLinha}" class="w-full text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200" />
            </div>`
          : ""
      }
      ${
        invoiceUrl && isMP
          ? `<div class="text-center">
              <a href="${invoiceUrl}" target="_blank" rel="noopener noreferrer"
                class="inline-block text-xs font-extrabold text-sky-700 hover:underline">
                🔗 Abrir Link Oficial de Pagamento Mercado Pago →
              </a>
            </div>`
          : ""
      }
      <div class="pt-2 flex flex-col sm:flex-row gap-2">
        <button onclick="confirmSimulatedPayment('${subId}', '${gateway}')"
          class="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition">
          ⚡ Simular Confirmação de Pagamento (Webhook ${gatewayLabel})
        </button>
        <button onclick="closeCheckoutModal(); switchTab('admin');"
          class="bg-white border border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition">
          Ver no Painel Admin
        </button>
      </div>
    `;
  } catch (err) {
    alert(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = `Gerar Assinatura no ${gatewayLabel} →`;
  }
}

async function confirmSimulatedPayment(subscriptionId, gateway = "MERCADOPAGO") {
  await simulateWebhook("PAYMENT_CONFIRMED", subscriptionId, gateway);
  closeCheckoutModal();
  switchTab("admin");
}

async function simulateWebhook(eventType, subscriptionId = null, gateway = "ASAAS") {
  const endpoint = "/api/asaas/simulate";
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventType,
        subscriptionId
      })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Erro ao simular webhook.", "error");
      return;
    }
    if (data.subscribers) state.subscribers = data.subscribers;
    if (data.metrics) state.metrics = data.metrics;
    if (data.webhookLogs) state.webhookLogs = data.webhookLogs;
    renderAdminSection();
    playSuccessChime();
    showToast(`Webhook ${eventType} processado!`, "success");
  } catch (err) {
    console.error(err);
  }
}

async function handleSaveMercadoPagoConfig(e) {
  e.preventDefault();
  const environment = document.getElementById("cfg-mp-env").value;
  const accessToken = document.getElementById("cfg-mp-token").value;
  const publicKey = document.getElementById("cfg-mp-public-key").value;

  try {
    const res = await fetch("/api/mercadopago/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ environment, accessToken, publicKey })
    });
    const data = await res.json();
    state.metrics.mercadoPagoConfig = data.mercadoPagoConfig;
    renderAdminSection();
    alert(data.message);
  } catch (err) {
    alert("Erro ao salvar configuração do Mercado Pago: " + err.message);
  }
}

async function handleSaveAsaasConfig(e) {
  e.preventDefault();
  const environment = document.getElementById("cfg-asaas-env").value;
  const apiKey = document.getElementById("cfg-asaas-key").value;

  try {
    const res = await fetch("/api/asaas/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ environment, apiKey })
    });
    const data = await res.json();
    state.metrics.asaasConfig = data.asaasConfig;
    renderAdminSection();
    alert(data.message);
  } catch (err) {
    alert("Erro ao salvar configuração: " + err.message);
  }
}

// =========================================================================
// ESTÚDIO EDITÁVEL: AUDIOBOOKS, E-BOOKS / PLAYBOOKS & VÍDEOS DA AUTORA
// COM UPLOAD DIRETO DO COMPUTADOR OU CELULAR (MP3 E PDF)
// =========================================================================
let directUploadTarget = { category: null, itemId: null };

function populateQuickUploadTargets() {
  const abSelect = document.getElementById("quick-upload-ab-target");
  if (abSelect) {
    const currentVal = abSelect.value || "NEW";
    abSelect.innerHTML =
      `<option value="NEW">➕ Criar Novo Audiobook com o arquivo enviado (MP3 ou PDF)</option>` +
      (state.audiobooks || [])
        .map((ab) => `<option value="${ab.id}">🔄 Atualizar: ${ab.title}</option>`)
        .join("");
    if ([...abSelect.options].some((o) => o.value === currentVal)) {
      abSelect.value = currentVal;
    }
  }

  const ebSelect = document.getElementById("quick-upload-eb-target");
  if (ebSelect) {
    const currentVal = ebSelect.value || "NEW";
    ebSelect.innerHTML =
      `<option value="NEW">➕ Criar Novo Playbook / E-book com o arquivo enviado (PDF ou MP3)</option>` +
      (state.ebooks || [])
        .map((eb) => `<option value="${eb.id}">🔄 Atualizar: ${eb.title}</option>`)
        .join("");
    if ([...ebSelect.options].some((o) => o.value === currentVal)) {
      ebSelect.value = currentVal;
    }
  }
}

function triggerQuickFilePicker(category) {
  const inputId = category === "audiobook" ? "quick-file-input-audiobook" : "quick-file-input-playbook";
  const inputEl = document.getElementById(inputId);
  if (inputEl) {
    inputEl.value = "";
    inputEl.click();
  }
}

function triggerCardDirectUpload(category, itemId) {
  directUploadTarget = { category, itemId };
  const inputEl = document.getElementById("card-direct-file-input");
  if (inputEl) {
    inputEl.value = "";
    inputEl.click();
  }
}

async function uploadFileToServer(file, onProgress = null) {
  const apiBase =
    window.location.protocol === "file:" ? "http://localhost:3000" : "";
  const url = `${apiBase}/api/upload?filename=${encodeURIComponent(file.name)}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && ev.total > 0) {
          onProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch (_) {}
      if (xhr.status >= 200 && xhr.status < 300 && data.fileUrl) {
        resolve(data);
      } else {
        reject(new Error(data.error || `Falha no servidor (HTTP ${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Não foi possível conectar ao servidor local (http://localhost:3000). Verifique se o servidor Node está rodando e recarregue a página."
        )
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Tempo esgotado ao enviar o arquivo. Tente novamente."));
    };

    xhr.send(file);
  });
}

function detectAudioDurationLabel(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        const totalSec = Math.round(audio.duration || 0);
        if (!totalSec || !isFinite(totalSec)) return resolve(null);
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        if (hrs > 0) return resolve(`${hrs}h ${mins}m`);
        if (mins > 0) return resolve(`${mins}m ${secs}s`);
        return resolve(`${secs}s`);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      audio.src = url;
    } catch (_) {
      resolve(null);
    }
  });
}

async function extractPdfMetadataAndText(file) {
  if (!window.pdfjsLib) {
    return { numPages: null, fullText: "", previewText: "" };
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages || 1;
    const maxPagesToRead = Math.min(numPages, 8);
    const pageTexts = [];

    for (let i = 1; i <= maxPagesToRead; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str || "").join(" ");
      const cleaned = strings.replace(/\s+/g, " ").trim();
      if (cleaned) pageTexts.push(cleaned);
    }

    const fullText = pageTexts.join("\n\n").trim();
    const previewText = fullText.slice(0, 480).trim();
    return { numPages, fullText, previewText };
  } catch (err) {
    console.warn("Aviso ao ler páginas do PDF:", err);
    return { numPages: null, fullText: "", previewText: "" };
  }
}

function cleanFileNameToTitle(fileName) {
  return String(fileName || "Novo Conteúdo")
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function handleQuickUpload(event, category) {
  const file = event.target.files?.[0];
  if (!file) return;

  const isAudiobook = category === "audiobook";
  const statusEl = document.getElementById(isAudiobook ? "quick-upload-ab-status" : "quick-upload-eb-status");
  const targetSelect = document.getElementById(isAudiobook ? "quick-upload-ab-target" : "quick-upload-eb-target");
  const titleInput = document.getElementById(isAudiobook ? "quick-upload-ab-title" : "quick-upload-eb-title");
  const audienceInput = document.getElementById(isAudiobook ? "quick-upload-ab-audience" : "quick-upload-eb-audience");

  const targetId = targetSelect?.value || "NEW";
  const customTitle = titleInput?.value.trim() || "";
  const customAudience = audienceInput?.value.trim() || "";

  if (statusEl) {
    statusEl.classList.remove("hidden");
    statusEl.textContent = `⏳ Enviando "${file.name}" do seu dispositivo...`;
  }

  try {
    const uploaded = await uploadFileToServer(file, (pct) => {
      if (statusEl) {
        statusEl.textContent = `⏳ Enviando "${file.name}" (${pct}%)...`;
      }
    });
    const isPdf = uploaded.ext === ".pdf" || file.type === "application/pdf";
    const isAudio = [".mp3", ".wav", ".ogg", ".m4a", ".aac"].includes(uploaded.ext) || file.type.startsWith("audio/");

    let pdfInfo = { numPages: null, fullText: "", previewText: "" };
    let audioDuration = null;

    if (isPdf) {
      pdfInfo = await extractPdfMetadataAndText(file);
    } else if (isAudio) {
      audioDuration = await detectAudioDurationLabel(file);
    }

    if (isAudiobook) {
      const existing = targetId !== "NEW" ? (state.audiobooks || []).find((a) => a.id === targetId) : null;
      const derivedTitle = customTitle || existing?.title || `Audiobook: ${cleanFileNameToTitle(file.name)}`;

      const payload = existing
        ? {
            ...existing,
            title: customTitle || existing.title,
            audience: customAudience || existing.audience,
            duration: audioDuration || existing.duration,
            audioUrl: isAudio ? uploaded.fileUrl : existing.audioUrl,
            audioFileName: isAudio ? uploaded.fileName : existing.audioFileName,
            pdfUrl: isPdf ? uploaded.fileUrl : existing.pdfUrl,
            pdfFileName: isPdf ? uploaded.fileName : existing.pdfFileName,
            narrationText:
              isPdf && pdfInfo.fullText
                ? `${existing.title}. ${pdfInfo.fullText.slice(0, 2000)}`
                : existing.narrationText
          }
        : {
            title: derivedTitle,
            author: "Gisele Lourenço",
            audience: customAudience || "Família & Adultos",
            duration: audioDuration || (pdfInfo.numPages ? `${pdfInfo.numPages} págs narradas` : "Áudio Completo"),
            audioUrl: isAudio ? uploaded.fileUrl : "",
            audioFileName: isAudio ? uploaded.fileName : "",
            pdfUrl: isPdf ? uploaded.fileUrl : "",
            pdfFileName: isPdf ? uploaded.fileName : "",
            description: isPdf
              ? `Audiobook alimentado a partir do PDF "${uploaded.fileName}"${pdfInfo.numPages ? ` (${pdfInfo.numPages} páginas)` : ""}.`
              : `Audiobook em MP3 enviado do dispositivo ("${uploaded.fileName}"). Ouça no player abaixo ou baixe o arquivo.`,
            narrationText:
              isPdf && pdfInfo.fullText
                ? `${derivedTitle}. ${pdfInfo.fullText.slice(0, 2500)}`
                : `${derivedTitle}, por Gisele Lourenço. Arquivo de áudio ${uploaded.fileName} carregado com sucesso.`,
            chapters: [
              {
                title: isAudio ? `Faixa Principal: ${cleanFileNameToTitle(file.name)}` : `Leitura Integral: ${cleanFileNameToTitle(file.name)}`,
                duration: audioDuration || "Completo"
              }
            ]
          };

      const res = await fetch("/api/audiobooks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.audiobooks) state.audiobooks = data.audiobooks;
    } else {
      const existing = targetId !== "NEW" ? (state.ebooks || []).find((e) => e.id === targetId) : null;
      const derivedTitle = customTitle || existing?.title || `Playbook: ${cleanFileNameToTitle(file.name)}`;

      const payload = existing
        ? {
            ...existing,
            title: customTitle || existing.title,
            audience: customAudience || existing.audience,
            audioUrl: isAudio ? uploaded.fileUrl : existing.audioUrl,
            audioFileName: isAudio ? uploaded.fileName : existing.audioFileName,
            rawTextToPaginate: isPdf && pdfInfo.fullText ? pdfInfo.fullText : "",
            regeneratePages: Boolean(isPdf && pdfInfo.fullText),
            contentPreview:
              isPdf && pdfInfo.previewText
                ? pdfInfo.previewText
                : existing.contentPreview
          }
        : {
            title: derivedTitle,
            author: "Gisele Lourenço",
            audience: customAudience || "Família & Discipulado",
            audioUrl: isAudio ? uploaded.fileUrl : "",
            audioFileName: isAudio ? uploaded.fileName : "",
            rawTextToPaginate: isPdf && pdfInfo.fullText ? pdfInfo.fullText : "",
            regeneratePages: true,
            description: isPdf
              ? `Playbook 3D interativo gerado automaticamente com páginas virando a partir de "${uploaded.fileName}".`
              : `Playbook 3D interativo acompanhado do áudio MP3 "${uploaded.fileName}".`,
            contentPreview:
              isPdf && pdfInfo.previewText
                ? pdfInfo.previewText
                : `Conteúdo transformado em Playbook 3D interativo com páginas virando no celular, tablet e PC.`
          };

      const res = await fetch("/api/ebooks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ebooks) state.ebooks = data.ebooks;
      if (data.savedItem?.id) {
        playbookReaderState.activePlaybookId = data.savedItem.id;
        playbookReaderState.currentPage = 1;
      }
    }

    if (titleInput) titleInput.value = "";
    if (audienceInput) audienceInput.value = "";
    playSuccessChime();
    renderPlaybooksSection();
    renderMediaStudio();

    if (statusEl) {
      statusEl.textContent = `✅ Conteúdo "${uploaded.fileName}" transformado com sucesso em ${
        isAudiobook ? "Audiobook" : "Playbook 3D Interativo com Páginas Virando"
      }!`;
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = `❌ Erro no upload: ${err.message}`;
    } else {
      alert("Erro no upload: " + err.message);
    }
  }
}

async function handleCardDirectFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file || !directUploadTarget.category || !directUploadTarget.itemId) return;

  const { category, itemId } = directUploadTarget;
  try {
    const uploaded = await uploadFileToServer(file, (pct) => {
      if (statusEl) {
        statusEl.textContent = `⏳ Enviando "${file.name}" (${pct}%)...`;
      }
    });
    const isPdf = uploaded.ext === ".pdf" || file.type === "application/pdf";
    const isAudio = [".mp3", ".wav", ".ogg", ".m4a", ".aac"].includes(uploaded.ext) || file.type.startsWith("audio/");

    let pdfInfo = { numPages: null, fullText: "", previewText: "" };
    let audioDuration = null;
    if (isPdf) pdfInfo = await extractPdfMetadataAndText(file);
    if (isAudio) audioDuration = await detectAudioDurationLabel(file);

    if (category === "audiobook") {
      const existing = (state.audiobooks || []).find((a) => a.id === itemId);
      if (!existing) return;
      const payload = {
        ...existing,
        duration: audioDuration || existing.duration,
        audioUrl: isAudio ? uploaded.fileUrl : existing.audioUrl,
        audioFileName: isAudio ? uploaded.fileName : existing.audioFileName,
        narrationText:
          isPdf && pdfInfo.fullText ? `${existing.title}. ${pdfInfo.fullText.slice(0, 2000)}` : existing.narrationText
      };
      const res = await fetch("/api/audiobooks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.audiobooks) state.audiobooks = data.audiobooks;
    } else if (category === "playbook") {
      const existing = (state.ebooks || []).find((e) => e.id === itemId);
      if (!existing) return;
      const payload = {
        ...existing,
        audioUrl: isAudio ? uploaded.fileUrl : existing.audioUrl,
        audioFileName: isAudio ? uploaded.fileName : existing.audioFileName,
        rawTextToPaginate: isPdf && pdfInfo.fullText ? pdfInfo.fullText : "",
        regeneratePages: Boolean(isPdf && pdfInfo.fullText),
        contentPreview: isPdf && pdfInfo.previewText ? pdfInfo.previewText : existing.contentPreview
      };
      const res = await fetch("/api/ebooks/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ebooks) state.ebooks = data.ebooks;
    }

    playSuccessChime();
    renderPlaybooksSection();
    renderMediaStudio();
  } catch (err) {
    alert("Erro ao enviar arquivo: " + err.message);
  }
}

// =========================================================================
// MOTOR DE PLAYBOOKS INTERATIVOS 3D (PÁGINAS VIRANDO E GIRANDO)
// 100% RESPONSIVO PARA CELULAR, TABLET E PC + EDIÇÃO PROFISSIONAL
// =========================================================================
let playbookReaderState = {
  activePlaybookId: "eb_1",
  currentPage: 1,
  layoutMode: "auto", // 'auto' | 'spread' | 'single'
  animStyle: "flip", // 'flip' (virar folha 3D) | 'spin' (virar e girar 3D)
  fontScale: 0, // -1 (92%), 0 (100%), 1 (112%), 2 (124%)
  paperTheme: "ivory", // 'ivory' | 'white' | 'sepia' | 'night'
  isFullscreen: false,
  isAnimating: false
};

function getActivePlaybook() {
  const list = state.ebooks || [];
  if (list.length === 0) return null;
  const found = list.find((e) => e.id === playbookReaderState.activePlaybookId);
  if (found) return found;
  playbookReaderState.activePlaybookId = list[0].id;
  return list[0];
}

function ensurePlaybookHasPages(pb) {
  if (!pb) return [];
  if (Array.isArray(pb.bookPages) && pb.bookPages.length > 0) {
    return pb.bookPages;
  }
  pb.bookPages = [
    {
      pageNumber: 1,
      type: "cover",
      kicker: "PLAYBOOK INTERATIVO 3D",
      title: pb.title,
      subtitle: pb.subtitle || pb.description || "Edição Interativa Gisele Lourenço & DaviLiz",
      verseText: "Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho.",
      verseRef: "Salmos 119:105",
      paragraphs: [
        pb.description || "",
        pb.contentPreview || "Vire a página para iniciar sua leitura e preencher os exercícios interativos."
      ],
      calloutTitle: "✨ Leitura Multiplataforma",
      calloutText: "Páginas adaptadas para celular, tablet e computador."
    },
    {
      pageNumber: 2,
      type: "chapter",
      kicker: "CAPÍTULO 1 • APLICAÇÃO PRÁTICA",
      title: pb.title,
      subtitle: "Reflexão e Exercício do Playbook",
      verseText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
      verseRef: "Provérbios 4:23",
      paragraphs: [pb.contentPreview || pb.description || ""],
      calloutTitle: "💡 Exercício Prático",
      calloutText: "Coloque em prática este princípio hoje na sua casa.",
      checklist: [
        { text: "Meditar neste princípio bíblico", checked: true },
        { text: "Aplicar na rotina familiar hoje", checked: false }
      ],
      exercisePrompt: "Anote aqui sua reflexão pessoal sobre este Playbook:",
      userResponse: ""
    }
  ];
  return pb.bookPages;
}

function isSpreadModeEffective() {
  if (playbookReaderState.layoutMode === "single") return false;
  if (playbookReaderState.layoutMode === "spread") {
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  }
  // Modo Automático: Folha Dupla em PC/Tablets grandes (>= 1024px) e Página Inteira 100% em Celulares e Tablets Retrato
  return typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
}

function playPageFlipSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.14;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.08;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(950, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.14);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (_) {}
}

function openPlaybookIn3DReader(playbookId, targetPage = 1) {
  if (playbookId) {
    playbookReaderState.activePlaybookId = playbookId;
  }
  playbookReaderState.currentPage = targetPage || 1;
  switchTab("playbooks");
  renderPlaybooksSection();
  const readerEl = document.getElementById("playbook-reader-wrapper");
  if (readerEl) {
    readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectPlaybookFromShelf(playbookId) {
  if (playbookReaderState.activePlaybookId === playbookId) return;
  playbookReaderState.activePlaybookId = playbookId;
  playbookReaderState.currentPage = 1;
  trigger3DBookAnimation("next", true);
  renderPlaybooksSection();
}

function setPlaybookLayoutMode(mode) {
  playbookReaderState.layoutMode = mode;
  ["auto", "spread", "single"].forEach((m) => {
    const btn = document.getElementById(`pb-layout-${m}`);
    if (!btn) return;
    if (m === mode) {
      btn.className = "px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white transition";
    } else {
      btn.className = "px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition";
    }
  });
  renderPlaybook3DReader();
}

function setPlaybookAnimationStyle(style) {
  playbookReaderState.animStyle = style;
  ["flip", "spin"].forEach((s) => {
    const btn = document.getElementById(`pb-anim-${s}`);
    if (!btn) return;
    if (s === style) {
      btn.className = "px-2.5 py-1.5 rounded-lg bg-rose-700 text-white transition";
    } else {
      btn.className = "px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white transition";
    }
  });
  trigger3DBookAnimation("next", style === "spin");
}

function changePlaybookFontSize(delta) {
  const nextScale = Math.max(-1, Math.min(2, playbookReaderState.fontScale + delta));
  playbookReaderState.fontScale = nextScale;
  const labelMap = { "-1": "92%", "0": "100%", "1": "112%", "2": "125%" };
  const labelEl = document.getElementById("pb-font-label");
  if (labelEl) labelEl.textContent = labelMap[String(nextScale)] || "100%";
  renderPlaybook3DReader();
}

function setPlaybookPaperTheme(theme) {
  playbookReaderState.paperTheme = theme || "ivory";
  renderPlaybook3DReader();
}

function togglePlaybookFullscreen() {
  const wrapper = document.getElementById("playbook-reader-wrapper");
  const btn = document.getElementById("pb-fullscreen-btn");
  if (!wrapper) return;
  playbookReaderState.isFullscreen = !playbookReaderState.isFullscreen;
  if (playbookReaderState.isFullscreen) {
    wrapper.classList.add("playbook-fullscreen-active");
    if (btn) btn.textContent = "✕ Sair da Tela Cheia";
  } else {
    wrapper.classList.remove("playbook-fullscreen-active");
    if (btn) btn.textContent = "⛶ Tela Cheia";
  }
  renderPlaybook3DReader();
}

function trigger3DBookAnimation(direction = "next", forceSpin = false) {
  const bookContainer = document.getElementById("playbook-3d-book-container");
  const leaf = document.getElementById("playbook-turning-leaf");
  if (!bookContainer) return;

  playPageFlipSound();

  const useSpin = forceSpin || playbookReaderState.animStyle === "spin";
  const animClass = useSpin
    ? direction === "prev"
      ? "anim-spin-prev"
      : "anim-spin-next"
    : direction === "prev"
    ? "anim-turn-prev"
    : "anim-turn-next";

  bookContainer.classList.remove("anim-turn-next", "anim-turn-prev", "anim-spin-next", "anim-spin-prev");
  void bookContainer.offsetWidth;
  bookContainer.classList.add(animClass);

  if (leaf) {
    leaf.classList.remove("hidden", "turning-leaf-next", "turning-leaf-prev");
    void leaf.offsetWidth;
    leaf.classList.add(direction === "prev" ? "turning-leaf-prev" : "turning-leaf-next");
    setTimeout(() => {
      leaf.classList.add("hidden");
    }, 660);
  }

  setTimeout(() => {
    bookContainer.classList.remove("anim-turn-next", "anim-turn-prev", "anim-spin-next", "anim-spin-prev");
  }, 780);
}

function flipPlaybookPage(directionDelta) {
  const pb = getActivePlaybook();
  if (!pb) return;
  const pages = ensurePlaybookHasPages(pb);
  const total = pages.length;
  const step = isSpreadModeEffective() ? 2 : 1;

  let nextPage = playbookReaderState.currentPage + directionDelta * step;
  if (nextPage < 1) nextPage = 1;
  if (nextPage > total) nextPage = isSpreadModeEffective() && total % 2 === 0 ? total - 1 : total;

  if (nextPage === playbookReaderState.currentPage) return;

  const dir = directionDelta < 0 ? "prev" : "next";
  playbookReaderState.currentPage = nextPage;
  trigger3DBookAnimation(dir, false);
  renderPlaybook3DReader();
}

function jumpToPlaybookPage(pageNum) {
  const pb = getActivePlaybook();
  if (!pb) return;
  const pages = ensurePlaybookHasPages(pb);
  const target = Math.max(1, Math.min(pages.length, Number(pageNum) || 1));
  const normalizedTarget = isSpreadModeEffective() && target > 1 && target % 2 === 0 ? target - 1 : target;
  const dir = normalizedTarget < playbookReaderState.currentPage ? "prev" : "next";
  playbookReaderState.currentPage = normalizedTarget;
  trigger3DBookAnimation(dir, false);
  renderPlaybook3DReader();
}

function narrateCurrentPlaybookPage(gender = "female") {
  const pb = getActivePlaybook();
  if (!pb) return;
  const pages = ensurePlaybookHasPages(pb);
  const spread = isSpreadModeEffective();
  const p1 = pages[playbookReaderState.currentPage - 1];
  const p2 = spread ? pages[playbookReaderState.currentPage] : null;

  const buildPageSpeech = (p) => {
    if (!p) return "";
    const parts = [
      `Página ${p.pageNumber}.`,
      p.title ? `${p.title}.` : "",
      p.subtitle ? `${p.subtitle}.` : "",
      p.verseText && p.verseRef ? `Leitura bíblica em ${p.verseRef}: ${p.verseText}.` : "",
      ...(p.paragraphs || []),
      p.calloutTitle && p.calloutText ? `${p.calloutTitle}: ${p.calloutText}.` : "",
      p.exercisePrompt ? `Exercício prático: ${p.exercisePrompt}` : ""
    ];
    return parts.filter(Boolean).join(" ");
  };

  const fullText = `${pb.title}. ${buildPageSpeech(p1)} ${p2 ? buildPageSpeech(p2) : ""}`.trim();
  speakWithGender(fullText, gender);
}

function renderSingleBookPageHtml(pb, page, side, totalPages) {
  if (!page) {
    return `
      <div class="playbook-page-sheet pb-theme-${playbookReaderState.paperTheme} p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[520px]">
        <div class="space-y-3 opacity-60">
          <div class="text-4xl">🌿</div>
          <p class="serif-title italic text-lg">${pb.title}</p>
          <p class="text-xs">Gisele Lourenço &amp; Clube DaviLiz</p>
        </div>
      </div>
    `;
  }

  const isNight = playbookReaderState.paperTheme === "night";
  const fontClassMap = {
    "-1": "text-xs sm:text-[13px] leading-relaxed",
    "0": "text-sm sm:text-[15px] leading-relaxed",
    "1": "text-base sm:text-[17px] leading-relaxed",
    "2": "text-lg sm:text-[19px] leading-loose"
  };
  const bodyFontClass = fontClassMap[String(playbookReaderState.fontScale)] || fontClassMap["0"];

  const borderMuted = isNight ? "border-slate-700/80" : "border-amber-900/15";
  const subTextColor = isNight ? "text-slate-300" : "text-slate-600";
  const verseBoxBg = isNight ? "bg-slate-800/90 border-amber-400 text-amber-100" : "bg-amber-50/90 border-amber-500 text-slate-800";
  const calloutBoxBg = isNight
    ? "bg-emerald-950/80 border-emerald-700/70 text-emerald-100"
    : "bg-emerald-50/85 border-emerald-200 text-emerald-950";
  const exerciseBoxBg = isNight
    ? "bg-slate-800/80 border-slate-700 text-slate-100"
    : "bg-white/90 border-rose-200 text-slate-800";

  const allPages = ensurePlaybookHasPages(pb);

  // Renderização especial para Capa (Página 1)
  if (page.type === "cover") {
    return `
      <div class="playbook-page-sheet pb-theme-${playbookReaderState.paperTheme} p-5 sm:p-9 flex flex-col justify-between min-h-[540px] sm:min-h-[640px] relative">
        <!-- Cabeçalho da Capa -->
        <div class="flex items-center justify-between border-b ${borderMuted} pb-3 text-[11px]">
          <span class="font-extrabold uppercase tracking-widest text-rose-600">${page.kicker || "PLAYBOOK INTERATIVO 3D"}</span>
          <span class="font-bold opacity-75">Pág. ${page.pageNumber} de ${totalPages}</span>
        </div>

        <!-- Corpo Central da Capa Editorial -->
        <div class="my-auto py-5 space-y-5 text-center">
          <div class="relative mx-auto w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-amber-300/80 bg-white flex items-center justify-center p-1.5">
            <img src="${pb.coverUrl}" alt="${pb.title}" class="max-h-full w-auto object-contain rounded-xl" />
          </div>

          <div class="space-y-2 max-w-lg mx-auto">
            <span class="inline-block bg-emerald-800 text-amber-200 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
              Por ${pb.author} • ${pb.audience}
            </span>
            <h2 class="serif-title text-2xl sm:text-3xl font-bold leading-tight">${page.title}</h2>
            <p class="text-xs sm:text-sm ${subTextColor} font-medium leading-relaxed">${page.subtitle || ""}</p>
          </div>

          ${
            page.verseText
              ? `<blockquote class="p-3.5 rounded-2xl border-l-4 ${verseBoxBg} text-left max-w-md mx-auto space-y-1">
                  <p class="serif-title italic text-xs sm:text-sm">"${page.verseText}"</p>
                  <footer class="text-[11px] font-extrabold text-rose-600">— ${page.verseRef}</footer>
                </blockquote>`
              : ""
          }

          <div class="${bodyFontClass} ${subTextColor} space-y-2 text-left max-w-lg mx-auto">
            ${(page.paragraphs || []).map((p) => `<p>${p}</p>`).join("")}
          </div>

          <div class="pt-2">
            <button onclick="flipPlaybookPage(1)"
              class="bg-gradient-to-r from-emerald-800 to-rose-700 hover:from-emerald-900 hover:to-rose-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-lg transition transform hover:-translate-y-0.5">
              Folhear Playbook Agora (Virar Página 3D) ↻
            </button>
          </div>
        </div>

        <!-- Rodapé Editorial -->
        <div class="flex items-center justify-between border-t ${borderMuted} pt-3 text-[11px] opacity-75">
          <span>Ecossistema Gisele Lourenço &amp; DaviLiz</span>
          <span>Clique no canto para virar ↻</span>
        </div>

        <div onclick="flipPlaybookPage(1)" class="playbook-corner-curl-right" title="Clique para virar a página"></div>
      </div>
    `;
  }

  // Renderização para Sumário Interativo (TOC)
  if (page.type === "toc") {
    return `
      <div class="playbook-page-sheet pb-theme-${playbookReaderState.paperTheme} p-5 sm:p-9 flex flex-col justify-between min-h-[540px] sm:min-h-[640px] relative">
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b ${borderMuted} pb-3 text-[11px]">
            <span class="font-extrabold uppercase tracking-wider text-emerald-700">${page.kicker || "SUMÁRIO INTERATIVO"}</span>
            <button onclick="openPageEditorByNumber('${pb.id}', ${page.pageNumber})" class="text-rose-600 hover:underline font-bold">✏️ Editar</button>
          </div>

          <div class="space-y-1.5">
            <h3 class="serif-title text-xl sm:text-2xl font-bold">${page.title}</h3>
            <p class="text-xs ${subTextColor}">${page.subtitle || "Clique em qualquer página abaixo para girar diretamente até o capítulo"}</p>
          </div>

          ${
            page.verseText
              ? `<blockquote class="p-3 rounded-2xl border-l-4 ${verseBoxBg} space-y-1">
                  <p class="serif-title italic text-xs sm:text-sm">"${page.verseText}"</p>
                  <footer class="text-[11px] font-extrabold text-amber-700">— ${page.verseRef}</footer>
                </blockquote>`
              : ""
          }

          <!-- Índice Clicável de Todas as Páginas do Playbook -->
          <div class="space-y-2 pt-1">
            ${allPages
              .map(
                (chPage) => `
              <div onclick="jumpToPlaybookPage(${chPage.pageNumber})"
                class="cursor-pointer group p-2.5 rounded-xl border ${borderMuted} hover:border-rose-500 transition flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5 min-w-0">
                  <span class="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                    ${chPage.pageNumber}
                  </span>
                  <div class="min-w-0">
                    <div class="font-extrabold text-xs sm:text-sm group-hover:text-rose-600 truncate">${chPage.title}</div>
                    <div class="text-[11px] opacity-70 truncate">${chPage.kicker || ""}</div>
                  </div>
                </div>
                <span class="text-xs font-extrabold text-rose-600 shrink-0">Pág. ${chPage.pageNumber} →</span>
              </div>
            `
              )
              .join("")}
          </div>

          ${
            page.calloutText
              ? `<div class="p-3.5 rounded-2xl border ${calloutBoxBg} space-y-1 text-xs">
                  <div class="font-extrabold">${page.calloutTitle || "📌 Nota Editorial"}</div>
                  <p class="leading-relaxed">${page.calloutText}</p>
                </div>`
              : ""
          }
        </div>

        <div class="flex items-center justify-between border-t ${borderMuted} pt-3 mt-4 text-[11px] opacity-75">
          <span>${pb.title}</span>
          <span class="font-extrabold">Página ${page.pageNumber} de ${totalPages}</span>
        </div>

        ${
          side === "left"
            ? `<div onclick="flipPlaybookPage(-1)" class="playbook-corner-curl-left" title="Voltar página"></div>`
            : `<div onclick="flipPlaybookPage(1)" class="playbook-corner-curl-right" title="Virar página"></div>`
        }
      </div>
    `;
  }

  // Renderização de Capítulos, Exercícios Práticos e Certificado
  return `
    <div class="playbook-page-sheet pb-theme-${playbookReaderState.paperTheme} p-5 sm:p-9 flex flex-col justify-between min-h-[540px] sm:min-h-[640px] relative">
      <div class="space-y-4">
        <!-- Cabeçalho Editorial da Página -->
        <div class="flex items-center justify-between border-b ${borderMuted} pb-2.5 text-[11px]">
          <span class="font-extrabold uppercase tracking-wider text-rose-600 truncate pr-2">${page.kicker || "CAPÍTULO DO PLAYBOOK"}</span>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="speakWithGender('${(page.title + ". " + (page.verseRef ? "Leitura em " + page.verseRef + ": " + page.verseText + ". " : "") + (page.paragraphs || []).join(" ")).replace(/'/g, "\\'")}', 'female')"
              class="text-emerald-700 hover:underline font-extrabold" title="Ouvir esta página">
              🔊 Ouvir
            </button>
            <button onclick="openPageEditorByNumber('${pb.id}', ${page.pageNumber})"
              class="text-amber-700 hover:underline font-extrabold" title="Editar conteúdo desta página">
              ✏️ Editar
            </button>
          </div>
        </div>

        <!-- Título e Subtítulo do Capítulo -->
        <div class="space-y-1">
          <h3 class="serif-title text-xl sm:text-2xl font-bold leading-snug">${page.title}</h3>
          ${page.subtitle ? `<p class="text-xs sm:text-sm ${subTextColor} font-medium">${page.subtitle}</p>` : ""}
        </div>

        <!-- Versículo Bíblico em Destaque -->
        ${
          page.verseText
            ? `<blockquote class="p-3.5 rounded-2xl border-l-4 ${verseBoxBg} space-y-1">
                <p class="serif-title italic text-xs sm:text-sm leading-relaxed">"${page.verseText}"</p>
                <footer class="text-[11px] font-extrabold text-rose-600">— ${page.verseRef}</footer>
              </blockquote>`
            : ""
        }

        <!-- Parágrafos Editoriais com Letra Capitular (Drop Cap) no primeiro parágrafo -->
        <div class="${bodyFontClass} space-y-3">
          ${(page.paragraphs || [])
            .map((para, pIdx) => `<p class="${pIdx === 0 ? "pb-dropcap" : ""} whitespace-pre-line">${para}</p>`)
            .join("")}
        </div>

        <!-- Box de Destaque (Neurociência / Aconselhamento / Pedagogia) -->
        ${
          page.calloutText
            ? `<div class="p-3.5 rounded-2xl border ${calloutBoxBg} space-y-1 text-xs">
                <div class="font-extrabold">${page.calloutTitle || "💡 Destaque Prático"}</div>
                <p class="leading-relaxed">${page.calloutText}</p>
              </div>`
            : ""
        }

        <!-- Checklist Interativo Clicável na Própria Página -->
        ${
          Array.isArray(page.checklist) && page.checklist.length > 0
            ? `<div class="space-y-1.5 pt-1">
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">✅ Checklist Prático Interativo (Clique para marcar):</div>
                ${page.checklist
                  .map(
                    (chk, cIdx) => `
                  <div onclick="togglePlaybookPageChecklist('${pb.id}', ${page.pageNumber}, ${cIdx})"
                    class="cursor-pointer p-2.5 rounded-xl border ${borderMuted} flex items-center gap-2.5 text-xs transition hover:border-emerald-500">
                    <span class="w-5 h-5 rounded-md flex items-center justify-center font-extrabold text-xs shrink-0 ${
                      chk.checked ? "bg-emerald-600 text-white" : "border border-slate-400 text-transparent"
                    }">✓</span>
                    <span class="${chk.checked ? "line-through opacity-75" : "font-medium"}">${chk.text}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>`
            : ""
        }

        <!-- Laboratório / Exercício Preenchível na Página do Playbook -->
        ${
          page.exercisePrompt
            ? `<div class="p-3.5 rounded-2xl border ${exerciseBoxBg} space-y-2 text-xs">
                <label class="block font-extrabold text-rose-700">
                  ✍️ Exercício do Playbook: ${page.exercisePrompt}
                </label>
                <textarea id="pb-exercise-input-${pb.id}-${page.pageNumber}" rows="2"
                  placeholder="Escreva aqui sua resposta, oração ou plano prático diretamente na página..."
                  class="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">${
                    page.userResponse || ""
                  }</textarea>
                <div class="flex justify-end">
                  <button onclick="savePlaybookPageExercise('${pb.id}', ${page.pageNumber})"
                    class="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold px-3.5 py-1.5 rounded-xl text-[11px] transition">
                    💾 Salvar na Página
                  </button>
                </div>
              </div>`
            : ""
        }
      </div>

      <!-- Rodapé Editorial da Página -->
      <div class="flex items-center justify-between border-t ${borderMuted} pt-3 mt-5 text-[11px] opacity-75">
        <span class="truncate max-w-[65%]">${pb.title}</span>
        <span class="font-extrabold">Página ${page.pageNumber} de ${totalPages}</span>
      </div>

      ${
        side === "left"
          ? `<div onclick="flipPlaybookPage(-1)" class="playbook-corner-curl-left" title="Clique para voltar a página"></div>`
          : `<div onclick="flipPlaybookPage(1)" class="playbook-corner-curl-right" title="Clique para virar a página"></div>`
      }
    </div>
  `;
}

function renderPlaybook3DReader() {
  const pb = getActivePlaybook();
  if (!pb) return;
  const pages = ensurePlaybookHasPages(pb);
  const total = pages.length;

  if (playbookReaderState.currentPage > total) {
    playbookReaderState.currentPage = 1;
  }

  const spread = isSpreadModeEffective();
  if (spread && playbookReaderState.currentPage > 1 && playbookReaderState.currentPage % 2 === 0) {
    playbookReaderState.currentPage = Math.max(1, playbookReaderState.currentPage - 1);
  }

  const leftPage = pages[playbookReaderState.currentPage - 1];
  const rightPage = spread ? pages[playbookReaderState.currentPage] || null : null;

  // Atualizar cabeçalho do leitor
  const titleEl = document.getElementById("pb-active-book-title");
  const indEl = document.getElementById("pb-active-page-indicator");
  if (titleEl) titleEl.textContent = pb.title;
  if (indEl) {
    const pageRangeLabel =
      spread && rightPage
        ? `Páginas ${leftPage.pageNumber}–${rightPage.pageNumber} de ${total}`
        : `Página ${leftPage.pageNumber} de ${total}`;
    const modeLabel = spread ? "Livro Aberto 2 Páginas (PC/Tablet)" : "Página Inteira 100% (Celular/Foco)";
    indEl.textContent = `${pageRangeLabel} • ${modeLabel}`;
  }

  // Renderizar o Livro 3D (2 páginas lado a lado ou 1 página 100% aberta)
  const bookContainer = document.getElementById("playbook-3d-book-container");
  if (bookContainer) {
    if (spread) {
      bookContainer.className =
        "playbook-open-book rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-200/70 mx-auto w-full grid grid-cols-1 lg:grid-cols-2 relative";
      bookContainer.innerHTML = `
        <div class="playbook-spine-center hidden lg:block"></div>
        <div class="border-b lg:border-b-0 lg:border-r border-amber-900/15">
          ${renderSingleBookPageHtml(pb, leftPage, "left", total)}
        </div>
        <div>
          ${renderSingleBookPageHtml(pb, rightPage, "right", total)}
        </div>
      `;
    } else {
      bookContainer.className =
        "playbook-open-book rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-200/70 mx-auto w-full max-w-3xl relative";
      bookContainer.innerHTML = renderSingleBookPageHtml(pb, leftPage, "single", total);
    }
  }

  // Renderizar pílulas de paginação rápida
  const dotsContainer = document.getElementById("pb-page-dots");
  if (dotsContainer) {
    dotsContainer.innerHTML = pages
      .map((p) => {
        const isActive =
          p.pageNumber === leftPage.pageNumber || (spread && rightPage && p.pageNumber === rightPage.pageNumber);
        return `
          <button onclick="jumpToPlaybookPage(${p.pageNumber})"
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-extrabold transition ${
              isActive
                ? "bg-amber-400 text-slate-950 shadow scale-105"
                : "bg-slate-900 text-slate-300 hover:bg-slate-700"
            }"
            title="Ir para Página ${p.pageNumber}: ${p.title}">
            ${p.pageNumber}
          </button>
        `;
      })
      .join("");
  }
}

function renderPlaybooksSection() {
  const ebooks = state.ebooks || [];
  const countEl = document.getElementById("playbook-collection-count");
  if (countEl) countEl.textContent = `${ebooks.length} Playbooks 3D completos`;

  // 1. Estante Seletora Horizontal no Topo da Aba Playbooks
  const shelfEl = document.getElementById("playbook-shelf-selector");
  if (shelfEl) {
    shelfEl.innerHTML = ebooks
      .map((eb) => {
        const isSelected = eb.id === playbookReaderState.activePlaybookId;
        const pageCount = Array.isArray(eb.bookPages) ? eb.bookPages.length : 8;
        return `
          <div onclick="selectPlaybookFromShelf('${eb.id}')"
            class="cursor-pointer shrink-0 w-56 sm:w-64 p-3 rounded-2xl border-2 transition flex items-center gap-3 ${
              isSelected
                ? "border-rose-600 bg-rose-50/70 shadow-md scale-[1.01]"
                : "border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-400"
            }">
            <img src="${eb.coverUrl}" alt="${eb.title}" class="w-12 h-16 object-contain rounded-lg bg-white border border-slate-200 p-0.5 shrink-0" />
            <div class="min-w-0 flex-1">
              <span class="text-[10px] font-extrabold uppercase tracking-wider ${
                isSelected ? "text-rose-700" : "text-emerald-800"
              } block truncate">
                ${eb.category || eb.audience}
              </span>
              <h4 class="font-extrabold text-xs text-slate-900 line-clamp-2 leading-snug">${eb.title}</h4>
              <span class="text-[11px] text-slate-500 font-semibold">${pageCount} págs 3D</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // 2. Renderizar o Leitor 3D Ativo
  renderPlaybook3DReader();

  // 3. Renderizar Grade de Catálogo de Playbooks abaixo do Leitor
  const catalogGrid = document.getElementById("playbooks-catalog-grid");
  if (catalogGrid) {
    catalogGrid.innerHTML = ebooks.map((eb) => renderPlaybookCardHtml(eb)).join("");
  }
}

function renderPlaybookCardHtml(eb) {
  const pageCount = Array.isArray(eb.bookPages) ? eb.bookPages.length : 8;
  return `
    <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
      <div class="space-y-3">
        <div onclick="openPlaybookIn3DReader('${eb.id}', 1)"
          class="cursor-pointer group w-full h-48 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/50 border border-slate-100 flex items-center justify-center p-3 overflow-hidden relative">
          <img src="${eb.coverUrl}" alt="${eb.title}" class="max-h-full w-auto object-contain rounded-xl shadow group-hover:scale-105 transition duration-300" />
          <span class="absolute bottom-2.5 right-2.5 bg-slate-900/85 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full shadow">
            📖 Folhear ${pageCount} Págs 3D ↻
          </span>
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
            ${eb.audience}
          </span>
          <span class="text-xs text-emerald-800 font-extrabold">${pageCount} páginas interativas</span>
        </div>

        <h4 class="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">${eb.title}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">${eb.description}</p>

        <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-950 italic">
          "${eb.contentPreview}"
        </div>
      </div>

      <div class="space-y-2 pt-2">
        <!-- Botão Principal: Abrir no Leitor 3D com Páginas Virando (NUNCA em aba PDF!) -->
        <button onclick="openPlaybookIn3DReader('${eb.id}', 1)"
          class="w-full bg-gradient-to-r from-emerald-800 to-rose-700 hover:from-emerald-900 hover:to-rose-800 text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2">
          <span>📖 Abrir Playbook 3D (Virar Páginas)</span>
        </button>

        <!-- Narração Neural Feminina e Masculina -->
        <div class="grid grid-cols-2 gap-2">
          <button onclick="speakWithGender('${(eb.title + ". " + eb.description + ". " + eb.contentPreview).replace(/'/g, "\\'")}', 'female')"
            class="bg-rose-700 hover:bg-rose-800 text-white font-bold py-2 px-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1">
            <span>👩 Voz Feminina</span>
          </button>
          <button onclick="speakWithGender('${(eb.title + ". " + eb.description + ". " + eb.contentPreview).replace(/'/g, "\\'")}', 'male')"
            class="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1">
            <span>👨 Voz Masculina</span>
          </button>
        </div>

        <!-- Edição Profissional do Playbook e de Suas Páginas -->
        <div class="flex items-center gap-2">
          <button onclick="openPlaybookIn3DReader('${eb.id}', 1); setTimeout(() => openCurrentPageEditorModal(false), 250);"
            class="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold py-2 px-3 rounded-xl text-xs transition">
            ✏️ Editar Páginas
          </button>
          <button onclick="openMediaEditor('ebook', '${eb.id}')"
            class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs transition" title="Editar Capa e Dados do Playbook">
            ⚙️ Capa
          </button>
          <button onclick="deleteMediaItem('ebooks', '${eb.id}')"
            class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs transition">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `;
}

// Interações em Tempo Real nas Páginas do Playbook (Checklists e Exercícios)
async function togglePlaybookPageChecklist(playbookId, pageNumber, checklistIdx) {
  try {
    const res = await fetch("/api/ebooks/page-interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playbookId, pageNumber, checklistIdx })
    });
    const data = await res.json();
    if (data.ebooks) {
      state.ebooks = data.ebooks;
      playSuccessChime();
      renderPlaybook3DReader();
    }
  } catch (err) {
    console.error(err);
  }
}

async function savePlaybookPageExercise(playbookId, pageNumber) {
  const inputEl = document.getElementById(`pb-exercise-input-${playbookId}-${pageNumber}`);
  const userResponse = inputEl ? inputEl.value : "";
  try {
    const res = await fetch("/api/ebooks/page-interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playbookId, pageNumber, userResponse })
    });
    const data = await res.json();
    if (data.ebooks) {
      state.ebooks = data.ebooks;
      playSuccessChime();
      renderPlaybook3DReader();
    }
  } catch (err) {
    console.error(err);
  }
}

// Modal de Edição Profissional de Página Individual ou Geração de Novo Playbook 3D
function closePlaybookModal() {
  const modal = document.getElementById("playbook-page-editor-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function openPageEditorByNumber(playbookId, pageNumber) {
  playbookReaderState.activePlaybookId = playbookId;
  openCurrentPageEditorModal(false, pageNumber);
}

function openCurrentPageEditorModal(isNewPage = false, specificPageNumber = null) {
  const pb = getActivePlaybook();
  if (!pb) return;
  const pages = ensurePlaybookHasPages(pb);
  const targetPageNum = specificPageNumber || playbookReaderState.currentPage || 1;
  const existingPage = !isNewPage ? pages.find((p) => Number(p.pageNumber) === Number(targetPageNum)) || pages[0] : null;

  const pageData = existingPage || {
    pageNumber: pages.length + 1,
    type: "chapter",
    kicker: `CAPÍTULO ${pages.length} • ENSINO & PRÁTICA`,
    title: "",
    subtitle: "",
    verseText: "",
    verseRef: "",
    paragraphs: [""],
    calloutTitle: "💡 Destaque Comportamental & Bíblico",
    calloutText: "",
    checklist: [{ text: "Aplicar este princípio em casa hoje", checked: false }],
    exercisePrompt: "Como você vai colocar este ensino em prática nesta semana?"
  };

  const modal = document.getElementById("playbook-page-editor-modal");
  const titleEl = document.getElementById("pb-modal-title");
  const subEl = document.getElementById("pb-modal-subtitle");
  const bodyEl = document.getElementById("playbook-modal-body");
  if (!modal || !bodyEl) return;

  if (titleEl) {
    titleEl.textContent = isNewPage
      ? `➕ Adicionar Nova Página ao Playbook (${pb.title})`
      : `✏️ Edição Profissional — Página ${pageData.pageNumber} (${pb.title})`;
  }
  if (subEl) {
    subEl.textContent = "Edite capítulos, versículos, parágrafos, boxes e exercícios interativos desta página.";
  }

  const checklistStr = (pageData.checklist || []).map((c) => c.text).join("\n");
  const paragraphsStr = (pageData.paragraphs || []).join("\n\n");

  bodyEl.innerHTML = `
    <form onsubmit="handleSavePlaybookPageForm(event, '${pb.id}', ${Boolean(isNewPage)})" class="space-y-4">
      <div class="grid sm:grid-cols-3 gap-3">
        <div>
          <label class="font-bold text-slate-700 block mb-1">Número da Página</label>
          <input id="pb-edit-page-num" type="number" min="1" value="${pageData.pageNumber}" class="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Layout Editorial da Página</label>
          <select id="pb-edit-page-type" class="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold">
            <option value="cover" ${pageData.type === "cover" ? "selected" : ""}>📘 Capa do Playbook</option>
            <option value="toc" ${pageData.type === "toc" ? "selected" : ""}>📑 Sumário Interativo Clicável</option>
            <option value="chapter" ${pageData.type === "chapter" ? "selected" : ""}>📖 Capítulo Editorial + Exercício</option>
            <option value="exercise" ${pageData.type === "exercise" ? "selected" : ""}>✍️ Laboratório Prático Intensivo</option>
            <option value="certificate" ${pageData.type === "certificate" ? "selected" : ""}>🏆 Conclusão / Certificado</option>
          </select>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Selo Superior (Kicker)</label>
          <input id="pb-edit-page-kicker" value="${pageData.kicker || ""}" placeholder="Ex: CAPÍTULO 1 • COMUNICAÇÃO" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-slate-700 block mb-1">Título Principal da Página</label>
          <input id="pb-edit-page-title" required value="${pageData.title || ""}" placeholder="Ex: A Arte de Ouvir com o Coração" class="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Subtítulo Editorial</label>
          <input id="pb-edit-page-subtitle" value="${pageData.subtitle || ""}" placeholder="Subtítulo explicativo do capítulo" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
        <div class="sm:col-span-2">
          <label class="font-bold text-amber-950 block mb-1">Texto do Versículo Bíblico da Página</label>
          <input id="pb-edit-page-verse" value="${pageData.verseText || ""}" placeholder="Ex: A resposta branda desvia o furor..." class="w-full rounded-xl border border-amber-300 px-3 py-2 bg-white" />
        </div>
        <div>
          <label class="font-bold text-amber-950 block mb-1">Referência Bíblica</label>
          <input id="pb-edit-page-ref" value="${pageData.verseRef || ""}" placeholder="Ex: Provérbios 15:1" class="w-full rounded-xl border border-amber-300 px-3 py-2 bg-white" />
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">Conteúdo Editorial da Página (Separe os parágrafos com uma linha em branco)</label>
        <textarea id="pb-edit-page-paragraphs" rows="5" required class="w-full rounded-xl border border-slate-300 px-3 py-2 leading-relaxed">${paragraphsStr}</textarea>
      </div>

      <div class="grid sm:grid-cols-3 gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
        <div>
          <label class="font-bold text-emerald-950 block mb-1">Título do Box de Destaque</label>
          <input id="pb-edit-page-callout-title" value="${pageData.calloutTitle || ""}" placeholder="💡 Neurociência & Fé" class="w-full rounded-xl border border-emerald-300 px-3 py-2 bg-white" />
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-emerald-950 block mb-1">Texto do Box de Destaque</label>
          <input id="pb-edit-page-callout-text" value="${pageData.calloutText || ""}" placeholder="Síntese prática ou orientação comportamental..." class="w-full rounded-xl border border-emerald-300 px-3 py-2 bg-white" />
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-slate-700 block mb-1">Checklist Interativo (1 item por linha)</label>
          <textarea id="pb-edit-page-checklist" rows="3" placeholder="Ex: Praticar a escuta atenta hoje" class="w-full rounded-xl border border-slate-300 px-3 py-2">${checklistStr}</textarea>
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Pergunta do Exercício Preenchível na Página</label>
          <textarea id="pb-edit-page-exercise" rows="3" placeholder="Ex: Qual atitude prática você vai iniciar hoje?" class="w-full rounded-xl border border-slate-300 px-3 py-2">${pageData.exercisePrompt || ""}</textarea>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
        ${
          !isNewPage && pages.length > 1
            ? `<button type="button" onclick="handleDeletePlaybookPage('${pb.id}', ${pageData.pageNumber})"
                class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2.5 rounded-xl transition">
                🗑️ Excluir Esta Página
              </button>`
            : `<div></div>`
        }
        <div class="flex items-center gap-2">
          <button type="button" onclick="closePlaybookModal()" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">
            Cancelar
          </button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-rose-700 text-white font-extrabold shadow">
            💾 Salvar Página no Playbook 3D
          </button>
        </div>
      </div>
    </form>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

async function handleSavePlaybookPageForm(e, playbookId, isNewPage) {
  e.preventDefault();
  const pageData = {
    pageNumber: Number(document.getElementById("pb-edit-page-num").value) || 1,
    type: document.getElementById("pb-edit-page-type").value,
    kicker: document.getElementById("pb-edit-page-kicker").value,
    title: document.getElementById("pb-edit-page-title").value,
    subtitle: document.getElementById("pb-edit-page-subtitle").value,
    verseText: document.getElementById("pb-edit-page-verse").value,
    verseRef: document.getElementById("pb-edit-page-ref").value,
    paragraphsText: document.getElementById("pb-edit-page-paragraphs").value,
    calloutTitle: document.getElementById("pb-edit-page-callout-title").value,
    calloutText: document.getElementById("pb-edit-page-callout-text").value,
    checklistText: document.getElementById("pb-edit-page-checklist").value,
    exercisePrompt: document.getElementById("pb-edit-page-exercise").value
  };

  try {
    const res = await fetch("/api/ebooks/page-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playbookId, pageData, isNewPage })
    });
    const data = await res.json();
    if (data.ebooks) {
      state.ebooks = data.ebooks;
      playbookReaderState.currentPage = pageData.pageNumber;
      closePlaybookModal();
      playSuccessChime();
      renderPlaybooksSection();
      renderMediaStudio();
    }
  } catch (err) {
    alert("Erro ao salvar página: " + err.message);
  }
}

async function handleDeletePlaybookPage(playbookId, pageNumber) {
  try {
    const res = await fetch("/api/ebooks/page-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playbookId, pageNumber })
    });
    const data = await res.json();
    if (data.ebooks) {
      state.ebooks = data.ebooks;
      playbookReaderState.currentPage = 1;
      closePlaybookModal();
      renderPlaybooksSection();
      renderMediaStudio();
    }
  } catch (err) {
    alert("Erro ao excluir página: " + err.message);
  }
}

function openPlaybookGeneratorModal() {
  const modal = document.getElementById("playbook-page-editor-modal");
  const titleEl = document.getElementById("pb-modal-title");
  const subEl = document.getElementById("pb-modal-subtitle");
  const bodyEl = document.getElementById("playbook-modal-body");
  if (!modal || !bodyEl) return;

  if (titleEl) titleEl.textContent = "✨ Gerador Profissional de Playbook Interativo 3D";
  if (subEl) {
    subEl.textContent =
      "Cria automaticamente um Playbook completo com Capa, Sumário Interativo, Capítulos diagramados, Checklists e Exercícios (sem abrir em PDF).";
  }

  bodyEl.innerHTML = `
    <form onsubmit="handleGenerateNewPlaybook3D(event)" class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="font-bold text-slate-700 block mb-1">Título do Novo Playbook 3D</label>
          <input id="gen-pb-title" required placeholder="Ex: Playbook Sabedoria Emocional no Casamento" class="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Subtítulo Editorial</label>
          <input id="gen-pb-subtitle" placeholder="Ex: Guia prático de 7 dias para restaurar o diálogo" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Autora / Assinatura</label>
          <input id="gen-pb-author" value="Gisele Lourenço" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Público-Alvo / Categoria</label>
          <input id="gen-pb-audience" value="Casais, Mulheres & Família" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Versículo-Chave da Obra</label>
          <input id="gen-pb-verse" value="Com a sabedoria se edifica a casa, e com o entendimento ela se estabelece." class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Referência Bíblica</label>
          <input id="gen-pb-ref" value="Provérbios 24:3" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">URL da Imagem de Capa</label>
        <input id="gen-pb-cover" value="https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">Resumo / Apresentação do Playbook</label>
        <textarea id="gen-pb-desc" rows="2" required placeholder="Descreva o propósito deste Playbook..." class="w-full rounded-xl border border-slate-300 px-3 py-2"></textarea>
      </div>

      <div>
        <label class="font-bold text-slate-700 block mb-1">
          Conteúdo dos Capítulos (Opcional — separe os capítulos por uma linha em branco que o motor paginará automaticamente em páginas 3D):
        </label>
        <textarea id="gen-pb-raw" rows="5" placeholder="Capítulo 1: O início da transformação...\n\nCapítulo 2: Aplicando no dia a dia da família..." class="w-full rounded-xl border border-slate-300 px-3 py-2"></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
        <button type="button" onclick="closePlaybookModal()" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">
          Cancelar
        </button>
        <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-rose-700 text-white font-extrabold shadow-lg">
          ✨ Gerar Playbook 3D Agora →
        </button>
      </div>
    </form>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

async function handleGenerateNewPlaybook3D(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById("gen-pb-title").value.trim(),
    subtitle: document.getElementById("gen-pb-subtitle").value.trim(),
    author: document.getElementById("gen-pb-author").value.trim(),
    audience: document.getElementById("gen-pb-audience").value.trim(),
    verseText: document.getElementById("gen-pb-verse").value.trim(),
    verseRef: document.getElementById("gen-pb-ref").value.trim(),
    coverUrl: document.getElementById("gen-pb-cover").value.trim(),
    description: document.getElementById("gen-pb-desc").value.trim(),
    contentPreview: document.getElementById("gen-pb-desc").value.trim(),
    rawTextToPaginate: document.getElementById("gen-pb-raw").value.trim(),
    regeneratePages: true
  };

  try {
    const res = await fetch("/api/ebooks/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ebooks) {
      state.ebooks = data.ebooks;
      closePlaybookModal();
      playSuccessChime();
      openPlaybookIn3DReader(data.savedItem?.id || data.ebooks[0].id, 1);
      renderMediaStudio();
    }
  } catch (err) {
    alert("Erro ao gerar Playbook: " + err.message);
  }
}

// Suporte a Gestos de Toque (Swipe no Celular e Tablet), Teclado e Redimensionamento Responsivo
if (typeof window !== "undefined") {
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      const zone = document.getElementById("playbook-touch-zone");
      if (!zone || !zone.contains(e.target)) return;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const zone = document.getElementById("playbook-touch-zone");
      if (!zone || !zone.contains(e.target)) return;
      if (["INPUT", "TEXTAREA", "BUTTON", "SELECT"].includes(e.target.tagName)) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (dx < 0) {
          flipPlaybookPage(1);
        } else {
          flipPlaybookPage(-1);
        }
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    const pbSection = document.getElementById("view-playbooks");
    if (!pbSection || pbSection.classList.contains("hidden")) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    if (e.key === "ArrowRight") {
      flipPlaybookPage(1);
    } else if (e.key === "ArrowLeft") {
      flipPlaybookPage(-1);
    } else if (e.key === "Escape" && playbookReaderState.isFullscreen) {
      togglePlaybookFullscreen();
    }
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const pbSection = document.getElementById("view-playbooks");
      if (pbSection && !pbSection.classList.contains("hidden")) {
        renderPlaybook3DReader();
      }
    }, 150);
  });
}

function renderMediaStudio() {
  populateQuickUploadTargets();

  // 1. Audiobooks
  const abGrid = document.getElementById("audiobooks-grid");
  if (abGrid) {
    abGrid.innerHTML = (state.audiobooks || [])
      .map(
        (ab) => `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-5 items-start">
            <div class="w-28 h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center p-1">
              <img src="${ab.coverUrl}" alt="${ab.title}" class="w-full h-full object-contain rounded-xl" />
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  ${ab.audience}
                </span>
                <span class="text-xs font-semibold text-slate-400">⏱ ${ab.duration}</span>
              </div>
              <h4 class="font-extrabold text-lg text-slate-900">${ab.title}</h4>
              <p class="text-xs text-emerald-800 font-semibold">Por ${ab.author}</p>
              <p class="text-xs text-slate-600 leading-relaxed">${ab.description}</p>

              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                ${
                  ab.audioUrl
                    ? `<span class="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                        🎵 MP3: ${ab.audioFileName || "Áudio Anexado"}
                      </span>`
                    : ""
                }
              </div>
            </div>
          </div>

          <div class="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="text-[11px] font-extrabold uppercase text-slate-400 mb-1">Faixas &amp; Capítulos Narrados (Clique para Ouvir)</div>
            ${(ab.chapters || [])
              .map(
                (ch) => `
              <div onclick="speakPortugueseText('${(ab.title + ". " + ch.title + ". " + (ab.narrationText || ab.description)).replace(/'/g, "\\'")}')"
                class="cursor-pointer hover:bg-emerald-50 px-2 py-1.5 rounded-lg flex items-center justify-between text-xs border-b border-slate-200/60 last:border-0 transition">
                <span class="font-semibold text-slate-700">▶ ${ch.title}</span>
                <span class="text-emerald-700 font-semibold text-[11px]">Ouvir (${ch.duration})</span>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="space-y-2.5 pt-1">
            ${
              ab.audioUrl
                ? `<div class="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 space-y-2">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-extrabold text-emerald-950">🎧 Player MP3 (${ab.audioFileName || "Áudio Oficial"})</span>
                      <a href="${ab.audioUrl}" download="${ab.audioFileName || "audiobook.mp3"}"
                        class="font-extrabold text-emerald-800 hover:underline flex items-center gap-1">
                        ⬇ Baixar MP3
                      </a>
                    </div>
                    <audio controls src="${ab.audioUrl}" class="w-full h-10 rounded-xl"></audio>
                  </div>`
                : ""
            }

            <div class="flex flex-wrap items-center justify-between gap-2">
              <button onclick="speakWithGender('${(ab.narrationText || ab.description || ab.title).replace(/'/g, "\\'")}', 'female')"
                class="flex-1 bg-rose-700 hover:bg-rose-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>👩 Voz Feminina</span>
              </button>
              <button onclick="speakWithGender('${(ab.narrationText || ab.description || ab.title).replace(/'/g, "\\'")}', 'male')"
                class="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>👨 Voz Masculina</span>
              </button>
              <button onclick="stopSpeech()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-xs transition" title="Parar Narração">
                ⏹
              </button>
              <button onclick="triggerCardDirectUpload('audiobook', '${ab.id}')"
                class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-xs transition shadow-sm"
                title="Enviar MP3 do computador/celular para este Audiobook">
                📤 Upload MP3
              </button>
              <button onclick="openMediaEditor('audiobook', '${ab.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition">
                ✏️
              </button>
              <button onclick="deleteMediaItem('audiobooks', '${ab.id}')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-3 rounded-xl text-xs transition">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // 2. Vídeos da Autora (suporta YouTube, Vimeo, Google Drive e arquivos MP4/WebM/MOV)
  const vidGrid = document.getElementById("videos-grid");
  if (vidGrid) {
    vidGrid.innerHTML = (state.authorVideos || [])
      .map(
        (vid) => `
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div class="bg-slate-950 aspect-video relative flex items-center justify-center overflow-hidden">
              ${renderVideoPlayerHtml(vid)}
            </div>
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ${vid.category}
                </span>
                <span class="text-xs text-slate-400 font-semibold">${vid.duration}</span>
              </div>
              <h4 class="font-extrabold text-base text-slate-900">${vid.title}</h4>
              <p class="text-xs text-slate-600 leading-relaxed">${vid.description}</p>
            </div>
          </div>
          <div class="px-5 pb-5 flex items-center justify-end gap-2">
            <button onclick="openMediaEditor('video', '${vid.id}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-2 px-3 rounded-xl text-xs transition">
              ✏️ Editar Vídeo
            </button>
            <button onclick="deleteMediaItem('videos', '${vid.id}')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2 px-3 rounded-xl text-xs transition">
              🗑️
            </button>
          </div>
        </div>
      `
      )
      .join("");
  }

  // 3. Playbooks Interativos 3D (Nunca abre aba de PDF — abre sempre o Leitor 3D com páginas virando)
  const ebGrid = document.getElementById("ebooks-grid");
  if (ebGrid) {
    ebGrid.innerHTML = (state.ebooks || []).map((eb) => renderPlaybookCardHtml(eb)).join("");
  }
}

function renderVideoPlayerHtml(vid) {
  const rawUrl = String(vid.videoUrl || "").trim();
  if (!rawUrl) {
    return `<div class="text-xs text-slate-400 p-4 text-center">Nenhum link de vídeo informado. Clique em ✏️ Editar Vídeo para adicionar.</div>`;
  }

  // 1. Detectar YouTube (watch?v=, youtu.be/, shorts/, live/, embed/)
  const ytMatch = rawUrl.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
    return `<iframe src="${embedUrl}" title="${(vid.title || "Vídeo").replace(/"/g, "&quot;")}" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }

  // 2. Detectar Vimeo
  const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" title="${(vid.title || "Vídeo").replace(/"/g, "&quot;")}" class="w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }

  // 3. Detectar Google Drive
  const driveMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return `<iframe src="https://drive.google.com/file/d/${driveMatch[1]}/preview" title="${(vid.title || "Vídeo").replace(/"/g, "&quot;")}" class="w-full h-full border-0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }

  // 4. Arquivo de vídeo direto (MP4, WebM, MOV, M4V ou /uploads/...)
  const lower = rawUrl.toLowerCase();
  const mimeAttr = lower.includes(".webm")
    ? ' type="video/webm"'
    : lower.includes(".mov")
    ? ' type="video/quicktime"'
    : lower.includes(".mp4") || lower.includes(".m4v")
    ? ' type="video/mp4"'
    : "";

  return `
    <video controls playsinline preload="metadata" poster="${vid.thumbnailUrl || ""}" class="w-full h-full object-contain">
      <source src="${rawUrl}"${mimeAttr} />
      Seu navegador não conseguiu reproduzir este formato de vídeo.
    </video>
  `;
}

async function handleEditorFileUpload(event, targetFieldType) {
  const file = event.target.files?.[0];
  if (!file) return;

  const statusId =
    targetFieldType === "ab-audio" || targetFieldType === "ab-pdf"
      ? "editor-ab-upload-status"
      : targetFieldType === "vid-file"
      ? "editor-vid-upload-status"
      : "editor-eb-upload-status";
  const statusEl = document.getElementById(statusId);
  if (statusEl) {
    statusEl.classList.remove("hidden");
    statusEl.textContent = `⏳ Fazendo upload de "${file.name}"...`;
  }

  try {
    const uploaded = await uploadFileToServer(file, (pct) => {
      if (statusEl) {
        statusEl.textContent = `⏳ Enviando "${file.name}" (${pct}%)...`;
      }
    });
    if (targetFieldType === "ab-audio") {
      const audioInput = document.getElementById("edit-ab-audio");
      const audioNameInput = document.getElementById("edit-ab-audio-filename");
      if (audioInput) audioInput.value = uploaded.fileUrl;
      if (audioNameInput) audioNameInput.value = uploaded.fileName;

      const dur = await detectAudioDurationLabel(file);
      const durInput = document.getElementById("edit-ab-duration");
      if (dur && durInput) durInput.value = dur;

      const titleInput = document.getElementById("edit-ab-title");
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = `Audiobook: ${cleanFileNameToTitle(file.name)}`;
      }
    } else if (targetFieldType === "ab-pdf") {
      const pdfInput = document.getElementById("edit-ab-pdf");
      const pdfNameInput = document.getElementById("edit-ab-pdf-filename");
      if (pdfInput) pdfInput.value = uploaded.fileUrl;
      if (pdfNameInput) pdfNameInput.value = uploaded.fileName;

      const pdfInfo = await extractPdfMetadataAndText(file);
      const narrInput = document.getElementById("edit-ab-narration");
      if (pdfInfo.fullText && narrInput) {
        narrInput.value = pdfInfo.fullText.slice(0, 3000);
      }
      const titleInput = document.getElementById("edit-ab-title");
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = `Audiobook: ${cleanFileNameToTitle(file.name)}`;
      }
    } else if (targetFieldType === "eb-pdf") {
      const pdfInput = document.getElementById("edit-eb-pdf");
      const pdfNameInput = document.getElementById("edit-eb-pdf-filename");
      if (pdfInput) pdfInput.value = uploaded.fileUrl;
      if (pdfNameInput) pdfNameInput.value = uploaded.fileName;

      const pdfInfo = await extractPdfMetadataAndText(file);
      const pagesInput = document.getElementById("edit-eb-pages");
      if (pdfInfo.numPages && pagesInput) {
        pagesInput.value = `${pdfInfo.numPages} páginas`;
      }
      const previewInput = document.getElementById("edit-eb-preview");
      if (pdfInfo.previewText && previewInput && !previewInput.value.trim()) {
        previewInput.value = pdfInfo.previewText;
      }
      const titleInput = document.getElementById("edit-eb-title");
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = `Playbook: ${cleanFileNameToTitle(file.name)}`;
      }
    } else if (targetFieldType === "eb-audio") {
      const audioInput = document.getElementById("edit-eb-audio");
      const audioNameInput = document.getElementById("edit-eb-audio-filename");
      if (audioInput) audioInput.value = uploaded.fileUrl;
      if (audioNameInput) audioNameInput.value = uploaded.fileName;
    } else if (targetFieldType === "vid-file") {
      const vidInput = document.getElementById("edit-vid-url");
      if (vidInput) vidInput.value = uploaded.fileUrl;

      const titleInput = document.getElementById("edit-vid-title");
      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = cleanFileNameToTitle(file.name);
      }
    }

    playSuccessChime();
    if (statusEl) {
      statusEl.textContent = `✅ Upload concluído: "${uploaded.fileName}" pronto! Clique em Salvar abaixo para confirmar.`;
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = `❌ Erro: ${err.message}`;
    }
  }
}

// Editor Dinâmico de Audiobook, Vídeo ou E-book
function openMediaEditor(type, itemId = null) {
  const box = document.getElementById("media-editor-box");
  if (!box) return;
  box.classList.remove("hidden");

  if (type === "audiobook") {
    const item = (state.audiobooks || []).find((a) => a.id === itemId) || {
      id: "",
      title: "",
      author: "Gisele Lourenço",
      audience: "Adultos & Família",
      duration: "2h 15m",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
      audioUrl: "",
      audioFileName: "",
      pdfUrl: "",
      pdfFileName: "",
      description: "",
      narrationText: "",
      chapters: [{ title: "Capítulo 1: Introdução", duration: "12:00" }]
    };
    const chaptersStr = (item.chapters || []).map((c) => `${c.title}|${c.duration}`).join("\n");

    box.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 class="font-extrabold text-lg text-emerald-950">${item.id ? "✏️ Editar Audiobook" : "🎧 Novo Audiobook (Com Upload MP3 / PDF)"}</h4>
        <button onclick="closeMediaEditor()" class="text-slate-400 hover:text-slate-700 font-bold">✕ Fechar</button>
      </div>
      <form onsubmit="saveAudiobookForm(event)" class="grid sm:grid-cols-2 gap-4 text-xs">
        <input type="hidden" id="edit-ab-id" value="${item.id}" />
        <input type="hidden" id="edit-ab-audio-filename" value="${item.audioFileName || ""}" />
        <input type="hidden" id="edit-ab-pdf-filename" value="${item.pdfFileName || ""}" />

        <div class="sm:col-span-2 bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div class="font-extrabold text-amber-950 text-xs sm:text-sm">
            📱💻 Upload Direto do Computador ou Celular para este Audiobook:
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <label class="cursor-pointer bg-white hover:bg-amber-100/60 border-2 border-dashed border-amber-400 rounded-xl p-3 flex items-center gap-3 transition">
              <span class="text-xl">🎵</span>
              <div>
                <div class="font-extrabold text-slate-900">Enviar Arquivo MP3 / Áudio</div>
                <div class="text-[11px] text-slate-500">Carrega o áudio MP3 do computador ou celular</div>
              </div>
              <input type="file" accept=".mp3,audio/*" class="hidden" onchange="handleEditorFileUpload(event, 'ab-audio')" />
            </label>

            <label class="cursor-pointer bg-white hover:bg-amber-100/60 border-2 border-dashed border-emerald-400 rounded-xl p-3 flex items-center gap-3 transition">
              <span class="text-xl">📄</span>
              <div>
                <div class="font-extrabold text-slate-900">Enviar PDF para Narração / Anexo</div>
                <div class="text-[11px] text-slate-500">Extrai o texto do PDF para narrar e anexa o PDF</div>
              </div>
              <input type="file" accept=".pdf,application/pdf" class="hidden" onchange="handleEditorFileUpload(event, 'ab-pdf')" />
            </label>
          </div>
          <div id="editor-ab-upload-status" class="hidden text-xs font-bold text-emerald-800 bg-white border border-emerald-200 rounded-xl p-2.5"></div>
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">Título do Audiobook</label>
          <input id="edit-ab-title" required value="${item.title}" placeholder="Ex: Audiobook O Poder de Se Conhecer" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Autora / Narradora</label>
          <input id="edit-ab-author" value="${item.author}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Público-Alvo</label>
          <input id="edit-ab-audience" value="${item.audience}" placeholder="Adultos, Casais ou Crianças (DaviLiz)" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Duração Total</label>
          <input id="edit-ab-duration" value="${item.duration}" placeholder="Ex: 2h 30m" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">URL da Imagem de Capa</label>
          <input id="edit-ab-cover" value="${item.coverUrl}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Arquivo de Áudio MP3 (preenchido pelo Upload ou URL)</label>
          <input id="edit-ab-audio" value="${item.audioUrl || ""}" placeholder="/uploads/... ou https://..." class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Arquivo PDF Associado (preenchido pelo Upload ou URL opcional)</label>
          <input id="edit-ab-pdf" value="${item.pdfUrl || ""}" placeholder="/uploads/... (opcional)" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Resumo / Descrição do Audiobook</label>
          <textarea id="edit-ab-desc" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.description}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Texto para Narração em Voz / Trecho Falado</label>
          <textarea id="edit-ab-narration" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.narrationText || ""}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Capítulos (1 por linha no formato: Nome do Capítulo|Duração)</label>
          <textarea id="edit-ab-chapters" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono">${chaptersStr}</textarea>
        </div>
        <div class="sm:col-span-2 flex justify-end gap-2">
          <button type="button" onclick="closeMediaEditor()" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">Cancelar</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold">💾 Salvar Audiobook</button>
        </div>
      </form>
    `;
  } else if (type === "video") {
    const item = (state.authorVideos || []).find((v) => v.id === itemId) || {
      id: "",
      title: "",
      category: "Mentoria & Família",
      duration: "15:00",
      videoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
      thumbnailUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/A-Arte-de-Relacionarse-Gisele-01.png",
      description: ""
    };

    box.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 class="font-extrabold text-lg text-emerald-950">${item.id ? "✏️ Editar Vídeo da Autora" : "🎬 Novo Vídeo da Autora"}</h4>
        <button onclick="closeMediaEditor()" class="text-slate-400 hover:text-slate-700 font-bold">✕ Fechar</button>
      </div>
      <form onsubmit="saveVideoForm(event)" class="grid sm:grid-cols-2 gap-4 text-xs">
        <input type="hidden" id="edit-vid-id" value="${item.id}" />
        <div>
          <label class="font-bold text-slate-700 block mb-1">Título do Vídeo</label>
          <input id="edit-vid-title" required value="${item.title}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Categoria / Série</label>
          <input id="edit-vid-cat" value="${item.category}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Duração</label>
          <input id="edit-vid-dur" value="${item.duration}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Link do Vídeo (YouTube, Vimeo, Google Drive ou MP4)</label>
          <input id="edit-vid-url" value="${item.videoUrl}" placeholder="https://www.youtube.com/watch?v=... ou /uploads/video.mp4" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div class="sm:col-span-2 bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-bold text-slate-700">📤 Ou envie um arquivo de vídeo do seu Computador/Celular (MP4, WebM, MOV):</span>
            <label class="cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-1.5 rounded-xl transition">
              Selecionar Vídeo
              <input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v" class="hidden" onchange="handleEditorFileUpload(event, 'vid-file')" />
            </label>
          </div>
          <div id="editor-vid-upload-status" class="hidden text-[11px] font-bold text-emerald-800"></div>
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">URL da Miniatura (Poster)</label>
          <input id="edit-vid-thumb" value="${item.thumbnailUrl}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Descrição</label>
          <textarea id="edit-vid-desc" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.description}</textarea>
        </div>
        <div class="sm:col-span-2 flex justify-end gap-2">
          <button type="button" onclick="closeMediaEditor()" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">Cancelar</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold">💾 Salvar Vídeo</button>
        </div>
      </form>
    `;
  } else if (type === "ebook") {
    const item = (state.ebooks || []).find((e) => e.id === itemId) || {
      id: "",
      title: "",
      author: "Gisele Lourenço",
      pages: "50 páginas",
      audience: "Família & Adultos",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
      pdfUrl: "",
      pdfFileName: "",
      audioUrl: "",
      audioFileName: "",
      description: "",
      contentPreview: ""
    };

    box.innerHTML = `
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 class="font-extrabold text-lg text-emerald-950">${item.id ? "✏️ Editar Playbook / E-book" : "📖 Novo Playbook / E-book (Com Upload PDF / MP3)"}</h4>
        <button onclick="closeMediaEditor()" class="text-slate-400 hover:text-slate-700 font-bold">✕ Fechar</button>
      </div>
      <form onsubmit="saveEbookForm(event)" class="grid sm:grid-cols-2 gap-4 text-xs">
        <input type="hidden" id="edit-eb-id" value="${item.id}" />
        <input type="hidden" id="edit-eb-pdf-filename" value="${item.pdfFileName || ""}" />
        <input type="hidden" id="edit-eb-audio-filename" value="${item.audioFileName || ""}" />

        <div class="sm:col-span-2 bg-rose-50/80 border border-rose-200 rounded-2xl p-4 space-y-3">
          <div class="font-extrabold text-rose-950 text-xs sm:text-sm">
            📱💻 Upload Direto do Computador ou Celular para este Playbook / E-book:
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <label class="cursor-pointer bg-white hover:bg-rose-100/60 border-2 border-dashed border-rose-400 rounded-xl p-3 flex items-center gap-3 transition">
              <span class="text-xl">📄</span>
              <div>
                <div class="font-extrabold text-slate-900">Enviar Arquivo PDF do Playbook</div>
                <div class="text-[11px] text-slate-500">Carrega o PDF e extrai páginas e prévia</div>
              </div>
              <input type="file" accept=".pdf,application/pdf" class="hidden" onchange="handleEditorFileUpload(event, 'eb-pdf')" />
            </label>

            <label class="cursor-pointer bg-white hover:bg-rose-100/60 border-2 border-dashed border-amber-400 rounded-xl p-3 flex items-center gap-3 transition">
              <span class="text-xl">🎵</span>
              <div>
                <div class="font-extrabold text-slate-900">Enviar Áudio MP3 Complementar</div>
                <div class="text-[11px] text-slate-500">Anexa um guia em MP3 ao Playbook</div>
              </div>
              <input type="file" accept=".mp3,audio/*" class="hidden" onchange="handleEditorFileUpload(event, 'eb-audio')" />
            </label>
          </div>
          <div id="editor-eb-upload-status" class="hidden text-xs font-bold text-emerald-800 bg-white border border-emerald-200 rounded-xl p-2.5"></div>
        </div>

        <div>
          <label class="font-bold text-slate-700 block mb-1">Título do E-book / Playbook</label>
          <input id="edit-eb-title" required value="${item.title}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Público-Alvo</label>
          <input id="edit-eb-audience" value="${item.audience}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Quantidade de Páginas</label>
          <input id="edit-eb-pages" value="${item.pages}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">URL da Capa</label>
          <input id="edit-eb-cover" value="${item.coverUrl}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Arquivo PDF (preenchido pelo Upload ou URL)</label>
          <input id="edit-eb-pdf" value="${item.pdfUrl || ""}" placeholder="/uploads/...pdf" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label class="font-bold text-slate-700 block mb-1">Arquivo MP3 do Playbook (Opcional)</label>
          <input id="edit-eb-audio" value="${item.audioUrl || ""}" placeholder="/uploads/...mp3" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Descrição</label>
          <textarea id="edit-eb-desc" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.description}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="font-bold text-slate-700 block mb-1">Trecho em Destaque / Exercício do Playbook</label>
          <textarea id="edit-eb-preview" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.contentPreview}</textarea>
        </div>
        <div class="sm:col-span-2 flex justify-end gap-2">
          <button type="button" onclick="closeMediaEditor()" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">Cancelar</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold">💾 Salvar Playbook / E-book</button>
        </div>
      </form>
    `;
  }

  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeMediaEditor() {
  const box = document.getElementById("media-editor-box");
  if (box) box.classList.add("hidden");
}

async function saveAudiobookForm(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById("edit-ab-id").value,
    title: document.getElementById("edit-ab-title").value,
    author: document.getElementById("edit-ab-author").value,
    audience: document.getElementById("edit-ab-audience").value,
    duration: document.getElementById("edit-ab-duration").value,
    coverUrl: document.getElementById("edit-ab-cover").value,
    audioUrl: document.getElementById("edit-ab-audio").value,
    audioFileName: document.getElementById("edit-ab-audio-filename")?.value || "",
    pdfUrl: document.getElementById("edit-ab-pdf")?.value || "",
    pdfFileName: document.getElementById("edit-ab-pdf-filename")?.value || "",
    description: document.getElementById("edit-ab-desc").value,
    narrationText: document.getElementById("edit-ab-narration").value,
    chaptersText: document.getElementById("edit-ab-chapters").value
  };
  const res = await fetch("/api/audiobooks/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.audiobooks) {
    state.audiobooks = data.audiobooks;
    closeMediaEditor();
    renderMediaStudio();
  }
}

async function saveVideoForm(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById("edit-vid-id").value,
    title: document.getElementById("edit-vid-title").value,
    category: document.getElementById("edit-vid-cat").value,
    duration: document.getElementById("edit-vid-dur").value,
    videoUrl: document.getElementById("edit-vid-url").value,
    thumbnailUrl: document.getElementById("edit-vid-thumb").value,
    description: document.getElementById("edit-vid-desc").value
  };
  const res = await fetch("/api/videos/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.authorVideos) {
    state.authorVideos = data.authorVideos;
    closeMediaEditor();
    renderMediaStudio();
  }
}

async function saveEbookForm(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById("edit-eb-id").value,
    title: document.getElementById("edit-eb-title").value,
    audience: document.getElementById("edit-eb-audience").value,
    pages: document.getElementById("edit-eb-pages").value,
    coverUrl: document.getElementById("edit-eb-cover").value,
    pdfUrl: document.getElementById("edit-eb-pdf")?.value || "",
    pdfFileName: document.getElementById("edit-eb-pdf-filename")?.value || "",
    audioUrl: document.getElementById("edit-eb-audio")?.value || "",
    audioFileName: document.getElementById("edit-eb-audio-filename")?.value || "",
    description: document.getElementById("edit-eb-desc").value,
    contentPreview: document.getElementById("edit-eb-preview").value
  };
  const res = await fetch("/api/ebooks/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.ebooks) {
    state.ebooks = data.ebooks;
    closeMediaEditor();
    renderPlaybooksSection();
    renderMediaStudio();
  }
}

async function deleteMediaItem(endpointGroup, id) {
  const res = await fetch(`/api/${endpointGroup}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  if (data.audiobooks) state.audiobooks = data.audiobooks;
  if (data.authorVideos) state.authorVideos = data.authorVideos;
  if (data.ebooks) state.ebooks = data.ebooks;
  renderPlaybooksSection();
  renderMediaStudio();
}

// =========================================================================
// MOTOR DE NARRAÇÃO PROFISSIONAL EM PORTUGUÊS DO BRASIL (ESTÚDIO NEURAL MP3)
// VOZES FEMININAS (ANA CLARA, CAMILA, BEATRIZ) E VOZ MASCULINA (GABRIEL)
// =========================================================================
let narratorState = {
  gender: "female", // 'female' | 'male'
  voiceProfile: "female_warm", // 'female_warm' | 'female_classic' | 'female_kids' | 'male_studio'
  speed: 1.0,
  currentAudio: null
};

function setNarratorVoiceProfile(profileKey) {
  narratorState.voiceProfile = profileKey;
  const isMale = profileKey === "male_studio";
  narratorState.gender = isMale ? "male" : "female";
  updateGenderButtonsUI();
}

function setNarratorGender(gender) {
  narratorState.gender = gender;
  narratorState.voiceProfile = gender === "male" ? "male_studio" : "female_warm";
  const selectEl = document.getElementById("neural-voice-select");
  if (selectEl) selectEl.value = narratorState.voiceProfile;
  updateGenderButtonsUI();
}

function updateGenderButtonsUI() {
  const femBtn = document.getElementById("voice-gender-female");
  const maleBtn = document.getElementById("voice-gender-male");
  if (!femBtn || !maleBtn) return;
  if (narratorState.gender === "female") {
    femBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold bg-rose-700 text-white shadow-sm transition";
    maleBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
  } else {
    maleBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-800 text-white shadow-sm transition";
    femBtn.className = "px-3.5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-700 hover:bg-slate-200 transition";
  }
}

function setNarratorSpeed(val) {
  narratorState.speed = Number(val) || 1.0;
  const audioEl = document.getElementById("global-neural-audio-el");
  if (audioEl) audioEl.playbackRate = narratorState.speed;
}

function speakWithGender(rawText, gender) {
  setNarratorGender(gender);
  speakPortugueseText(rawText, gender === "male" ? "male_studio" : narratorState.voiceProfile);
}

async function speakPortugueseText(rawText, forcedVoiceProfile = null) {
  if (!rawText) return;
  stopSpeech();

  const voiceToUse =
    forcedVoiceProfile === "male"
      ? "male_studio"
      : forcedVoiceProfile === "female"
      ? narratorState.voiceProfile.startsWith("female")
        ? narratorState.voiceProfile
        : "female_warm"
      : forcedVoiceProfile || narratorState.voiceProfile || "female_warm";

  // Mostrar indicador imediato no Player Flutuante e no Visor Fonético
  const globalPlayer = document.getElementById("global-neural-player");
  const globalVoiceName = document.getElementById("global-player-voice-name");
  const globalText = document.getElementById("global-player-text");
  const audioEl = document.getElementById("global-neural-audio-el");

  const previewBox = document.getElementById("tts-live-preview");
  const voiceLabel = document.getElementById("tts-active-voice-label");
  const textDisplay = document.getElementById("tts-normalized-text-display");

  if (globalPlayer) {
    globalPlayer.classList.remove("hidden");
    if (globalVoiceName) globalVoiceName.textContent = "⏳ Gerando Áudio Neural de Estúdio em Português do Brasil...";
    if (globalText) globalText.textContent = rawText;
  }
  if (previewBox) {
    previewBox.classList.remove("hidden");
    if (voiceLabel) voiceLabel.textContent = "⏳ Preparando Narração Neural PT-BR (Dicção Bíblica)...";
  }

  try {
    const res = await fetch("/api/tts/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: rawText,
        voice: voiceToUse
      })
    });

    const data = await res.json();
    if (!res.ok || !data.audioBase64) {
      throw new Error(data.error || "Falha ao sintetizar voz neural");
    }

    const labelStr = `🎙️ ${data.voiceInfo?.label || "Voz Neural PT-BR"}`;
    if (globalVoiceName) globalVoiceName.textContent = labelStr;
    if (globalText) globalText.textContent = `"${data.normalizedText}"`;
    if (voiceLabel) voiceLabel.textContent = labelStr;
    if (textDisplay) textDisplay.textContent = `"${data.normalizedText}"`;

    if (audioEl) {
      audioEl.src = data.audioBase64;
      audioEl.playbackRate = narratorState.speed;
      narratorState.currentAudio = audioEl;
      await audioEl.play();
    }
  } catch (err) {
    console.error("Erro na síntese neural:", err);
  }
}

function stopSpeech() {
  try {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const audioEl = document.getElementById("global-neural-audio-el");
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    const globalPlayer = document.getElementById("global-neural-player");
    if (globalPlayer) globalPlayer.classList.add("hidden");
    const previewBox = document.getElementById("tts-live-preview");
    if (previewBox) previewBox.classList.add("hidden");
  } catch (_) {}
}

// =========================================================================
// AMBIENTE DE ESTUDOS & MEDITAÇÃO DIÁRIA (DEVOCIONAL + CADERNO EDITÁVEL)
// =========================================================================
function renderDailyMeditations() {
  const container = document.getElementById("meditations-list");
  if (!container) return;

  container.innerHTML = (state.dailyMeditations || [])
    .map(
      (med) => `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="bg-amber-400 text-slate-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full">
              ${med.dateLabel}
            </span>
            <span class="text-xs text-emerald-200 font-semibold">${med.theme} • Por ${med.author}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="speakWithGender('${(med.title + ". Leitura bíblica em " + med.verseRef + ": " + med.verseText + ". Meditação: " + med.reflection + ". Oração: " + med.prayer).replace(/'/g, "\\'")}', 'female')"
              class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-400/40 transition shadow-sm">
              👩 Ouvir (Voz Feminina pt-BR)
            </button>
            <button onclick="speakWithGender('${(med.title + ". Leitura bíblica em " + med.verseRef + ": " + med.verseText + ". Meditação: " + med.reflection + ". Oração: " + med.prayer).replace(/'/g, "\\'")}', 'male')"
              class="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 transition">
              👨 Ouvir (Voz Masculina pt-BR)
            </button>
            <button onclick="stopSpeech()"
              class="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition" title="Parar Áudio">
              ⏹
            </button>
            <button onclick="openMeditationEditor('${med.id}')"
              class="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300/30 transition">
              ✏️ Editar Estudo
            </button>
            <button onclick="deleteMeditation('${med.id}')"
              class="bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 text-xs font-bold px-2.5 py-1.5 rounded-xl transition">
              🗑️
            </button>
          </div>
        </div>

        <div class="p-6 sm:p-8 grid lg:grid-cols-12 gap-8">
          <!-- Leitura Bíblica, Reflexão e Oração -->
          <div class="lg:col-span-7 space-y-4">
            <h3 class="serif-title text-2xl font-bold text-slate-900">${med.title}</h3>

            <blockquote class="p-4 rounded-2xl bg-amber-50/80 border-l-4 border-amber-400 space-y-1">
              <p class="serif-title text-base italic text-slate-800">"${med.verseText}"</p>
              <footer class="text-xs font-extrabold text-amber-900">— ${med.verseRef}</footer>
            </blockquote>

            <div class="space-y-2">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-800">📖 Meditação &amp; Ensino</h4>
              <p class="text-sm text-slate-700 leading-relaxed">${med.reflection}</p>
            </div>

            <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 space-y-1">
              <div class="text-xs font-extrabold uppercase tracking-wider text-rose-800">🙏 Oração Diária Guiada</div>
              <p class="text-xs sm:text-sm text-slate-700 italic leading-relaxed">"${med.prayer}"</p>
            </div>
          </div>

          <!-- Guia de Estudo Pessoal & Caderno de Anotações -->
          <div class="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                ✍️ Perguntas para Estudo &amp; Aplicação no Lar
              </h4>
              <ul class="space-y-2 text-xs text-slate-700">
                ${(med.studyQuestions || [])
                  .map(
                    (q, idx) => `
                  <li class="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <span class="font-extrabold text-emerald-700">${idx + 1}.</span>
                    <span>${q}</span>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-200">
              <label class="block text-xs font-extrabold text-emerald-950">
                📓 Meu Caderno de Meditação &amp; Respostas:
              </label>
              <textarea id="notes-${med.id}" rows="3" placeholder="Escreva aqui suas reflexões, respostas do estudo e motivos de oração..."
                class="w-full rounded-xl border border-slate-300 p-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600">${med.userNotes || ""}</textarea>
              <button onclick="saveMeditationNotes('${med.id}')"
                class="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition">
                💾 Salvar Anotações no Caderno
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function openMeditationEditor(medId = null) {
  const box = document.getElementById("meditation-editor-box");
  if (!box) return;
  box.classList.remove("hidden");

  const item = (state.dailyMeditations || []).find((m) => m.id === medId) || {
    id: "",
    dateLabel: "Meditação Diária",
    title: "",
    theme: "Família & Espiritualidade",
    verseText: "",
    verseRef: "",
    reflection: "",
    studyQuestions: ["Como aplicar este princípio hoje em casa?"],
    prayer: ""
  };

  box.innerHTML = `
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <h4 class="font-extrabold text-lg text-emerald-950">${item.id ? "✏️ Editar Estudo & Meditação" : "🙏 Criar Nova Meditação Diária"}</h4>
      <button onclick="document.getElementById('meditation-editor-box').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 font-bold">✕ Fechar</button>
    </div>
    <form onsubmit="saveMeditationForm(event)" class="grid sm:grid-cols-2 gap-4 text-xs">
      <input type="hidden" id="edit-med-id" value="${item.id}" />
      <div>
        <label class="font-bold text-slate-700 block mb-1">Título da Meditação / Estudo</label>
        <input id="edit-med-title" required value="${item.title}" placeholder="Ex: A Sabedoria que Edifica o Lar" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">Etiqueta de Data / Série</label>
        <input id="edit-med-date" value="${item.dateLabel}" placeholder="Ex: Devocional de Hoje" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">Referência Bíblica</label>
        <input id="edit-med-ref" value="${item.verseRef}" placeholder="Ex: Provérbios 14:1" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label class="font-bold text-slate-700 block mb-1">Tema</label>
        <input id="edit-med-theme" value="${item.theme}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>
      <div class="sm:col-span-2">
        <label class="font-bold text-slate-700 block mb-1">Texto do Versículo Chave</label>
        <input id="edit-med-verse" value="${item.verseText}" class="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </div>
      <div class="sm:col-span-2">
        <label class="font-bold text-slate-700 block mb-1">Texto da Meditação &amp; Reflexão</label>
        <textarea id="edit-med-reflection" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.reflection}</textarea>
      </div>
      <div class="sm:col-span-2">
        <label class="font-bold text-slate-700 block mb-1">Perguntas de Estudo (1 por linha)</label>
        <textarea id="edit-med-questions" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2">${(item.studyQuestions || []).join("\n")}</textarea>
      </div>
      <div class="sm:col-span-2">
        <label class="font-bold text-slate-700 block mb-1">Oração Guiada</label>
        <textarea id="edit-med-prayer" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2">${item.prayer}</textarea>
      </div>
      <div class="sm:col-span-2 flex justify-end gap-2">
        <button type="button" onclick="document.getElementById('meditation-editor-box').classList.add('hidden')" class="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600">Cancelar</button>
        <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold">💾 Salvar Meditação Diária</button>
      </div>
    </form>
  `;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function saveMeditationForm(e) {
  e.preventDefault();
  const payload = {
    id: document.getElementById("edit-med-id").value,
    title: document.getElementById("edit-med-title").value,
    dateLabel: document.getElementById("edit-med-date").value,
    verseRef: document.getElementById("edit-med-ref").value,
    theme: document.getElementById("edit-med-theme").value,
    verseText: document.getElementById("edit-med-verse").value,
    reflection: document.getElementById("edit-med-reflection").value,
    questionsText: document.getElementById("edit-med-questions").value,
    prayer: document.getElementById("edit-med-prayer").value
  };
  const res = await fetch("/api/meditations/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.dailyMeditations) {
    state.dailyMeditations = data.dailyMeditations;
    document.getElementById("meditation-editor-box").classList.add("hidden");
    renderDailyMeditations();
  }
}

async function saveMeditationNotes(id) {
  const userNotes = document.getElementById(`notes-${id}`)?.value || "";
  const res = await fetch("/api/meditations/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, userNotes })
  });
  const data = await res.json();
  if (data.dailyMeditations) {
    state.dailyMeditations = data.dailyMeditations;
    playSuccessChime();
  }
}

async function deleteMeditation(id) {
  const res = await fetch("/api/meditations/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  if (data.dailyMeditations) {
    state.dailyMeditations = data.dailyMeditations;
    renderDailyMeditations();
  }
}

// ============================================================================
// TOASTS, AUTENTICAÇÃO, PLAYER REAL DE CURSOS, CARRINHO VIP & PÁGINAS LEGAIS
// ============================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const colors = {
    success: "bg-emerald-900 text-white border-emerald-500",
    error: "bg-rose-800 text-white border-rose-400",
    info: "bg-slate-900 text-white border-amber-400"
  };
  const el = document.createElement("div");
  el.className = `pointer-events-auto border-l-4 rounded-2xl px-4 py-3 shadow-xl text-xs font-semibold flex items-center justify-between gap-3 transition-all ${colors[type] || colors.info}`;
  el.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" class="text-white/70 hover:text-white font-bold">✕</button>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

function updateAuthUI() {
  const user = state.currentUser;
  const authBtn = document.getElementById("auth-header-btn");
  const adminTab = document.getElementById("tab-btn-admin");
  const shopSelect = document.getElementById("shop-discount-select");

  if (authBtn) {
    if (user) {
      const shortName = (user.name || "Conta").split(" ")[0];
      authBtn.textContent = user.role === "admin" ? `🔑 ${shortName}` : `👋 ${shortName}`;
    } else {
      authBtn.textContent = "👤 Entrar";
    }
  }

  if (adminTab) {
    if (user?.role === "admin") {
      adminTab.classList.remove("hidden");
    } else {
      adminTab.classList.add("hidden");
    }
  }

  if (shopSelect && user?.discountShopPercent) {
    shopSelect.value = String(user.discountShopPercent);
    renderShop();
  }
}

function openLoginModal() {
  const modal = document.getElementById("login-modal");
  const form = document.getElementById("login-form");
  const accPanel = document.getElementById("login-account-panel");
  const titleEl = document.getElementById("login-modal-title");
  if (!modal) return;

  if (state.currentUser) {
    const u = state.currentUser;
    titleEl.textContent = "Minha Conta";
    form.classList.add("hidden");
    accPanel.classList.remove("hidden");
    accPanel.innerHTML = `
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1.5 text-xs">
        <div class="font-extrabold text-sm text-emerald-950">${u.name}</div>
        <div class="text-slate-600">${u.email}</div>
        <div class="pt-1 flex flex-wrap gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold">${u.planName}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">${u.discountShopPercent || 10}% OFF na Loja</span>
        </div>
      </div>
      <button onclick="handleLogout()" class="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold py-2.5 rounded-2xl text-xs transition">
        Sair da Conta
      </button>
    `;
  } else {
    titleEl.textContent = "Entrar no Clube";
    form.classList.remove("hidden");
    accPanel.classList.add("hidden");
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeLoginModal() {
  const modal = document.getElementById("login-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function fillDemoLogin(role) {
  const emailEl = document.getElementById("login-email");
  const passEl = document.getElementById("login-password");
  if (role === "admin") {
    emailEl.value = "edukadoshmda@gmal.com";
    passEl.value = "123456";
  } else {
    emailEl.value = "anapaula.familia@email.com";
    passEl.value = "clube2026";
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao entrar");

    localStorage.setItem("clube_session_token", data.token);
    closeLoginModal();
    await loadBootstrapData();
    showToast(`Bem-vindo(a), ${data.user.name}!`, "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function handleLogout() {
  localStorage.removeItem("clube_session_token");
  await fetch("/api/auth/logout", { method: "POST" });
  state.currentUser = null;
  closeLoginModal();
  await loadBootstrapData();
  switchTab("landing");
  showToast("Você saiu da sua conta.", "info");
}

function openCourseModal(courseId) {
  const course = (state.courses || []).find((c) => c.id === courseId);
  if (!course) return;

  document.getElementById("course-modal-badge").textContent = `${course.category} • ${course.duration}`;
  document.getElementById("course-modal-title").textContent = course.title;

  const videoUrl =
    state.authorVideos?.[0]?.videoUrl ||
    "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4";

  document.getElementById("course-modal-body").innerHTML = `
    <div class="bg-slate-950 aspect-video rounded-2xl overflow-hidden shadow-lg">
      ${renderVideoPlayerHtml({ title: course.title, videoUrl })}
    </div>
    <div class="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
      <div>
        <div class="text-xs font-bold text-emerald-900">Progresso do Curso: ${course.progress}%</div>
        <div class="text-[11px] text-emerald-700">${course.description}</div>
      </div>
    </div>
    <div class="space-y-2">
      <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Aulas &amp; Módulos (clique para concluir)</div>
      ${(course.modules || [])
        .map(
          (m, idx) => `
        <button onclick="toggleCourseModule('${course.id}', ${idx})"
          class="w-full text-left flex items-center justify-between p-3 rounded-2xl border transition ${
            m.completed ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
          }">
          <span class="text-xs sm:text-sm font-semibold">${m.completed ? "✅" : "▶️"} ${m.title}</span>
          <span class="text-xs font-bold text-slate-500 shrink-0 ml-2">${m.duration}</span>
        </button>
      `
        )
        .join("")}
    </div>
  `;

  const modal = document.getElementById("course-player-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCourseModal() {
  const modal = document.getElementById("course-player-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function toggleCourseModule(courseId, moduleIndex) {
  try {
    const res = await fetch("/api/courses/toggle-module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, moduleIndex })
    });
    const data = await res.json();
    if (data.courses) {
      state.courses = data.courses;
      renderCourses();
      openCourseModal(courseId);
      showToast("Progresso da aula atualizado!", "success");
    }
  } catch {
    showToast("Não foi possível atualizar a aula.", "error");
  }
}

function saveCart() {
  localStorage.setItem("clube_vip_cart", JSON.stringify(state.cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge-count");
  if (!badge) return;
  const totalQty = (state.cart || []).reduce((acc, item) => acc + item.qty, 0);
  if (totalQty > 0) {
    badge.textContent = String(totalQty);
    badge.classList.remove("hidden");
    badge.classList.add("flex");
  } else {
    badge.classList.add("hidden");
    badge.classList.remove("flex");
  }
}

function addToCart(prodId) {
  const prod = (state.shopProducts || []).find((p) => p.id === prodId);
  if (!prod) return;
  const existing = state.cart.find((c) => c.id === prodId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: prod.id, name: prod.name, regularPrice: prod.regularPrice, qty: 1 });
  }
  saveCart();
  showToast(`"${prod.name}" adicionado ao Carrinho VIP!`, "success");
}

function removeFromCart(idx) {
  state.cart.splice(idx, 1);
  saveCart();
  openCartModal();
}

function openCartModal() {
  const modal = document.getElementById("cart-modal");
  const body = document.getElementById("cart-items-body");
  const footer = document.getElementById("cart-footer");
  if (!modal || !body || !footer) return;

  const discountPct = Number(document.getElementById("shop-discount-select")?.value || 20);

  if (!state.cart.length) {
    body.innerHTML = `<div class="text-center py-8 text-slate-500">Seu carrinho VIP está vazio. Escolha livros ou brinquedos na aba 🛍️ Loja VIP!</div>`;
    footer.innerHTML = "";
  } else {
    let totalVip = 0;
    body.innerHTML = state.cart
      .map((item, idx) => {
        const vipUnit = item.regularPrice * (1 - discountPct / 100);
        const subTotal = vipUnit * item.qty;
        totalVip += subTotal;
        return `
          <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div class="font-bold text-slate-900">${item.name}</div>
              <div class="text-slate-500">${item.qty}x R$ ${vipUnit.toFixed(2).replace(".", ",")} (-${discountPct}% VIP)</div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="font-extrabold text-emerald-800">R$ ${subTotal.toFixed(2).replace(".", ",")}</span>
              <button onclick="removeFromCart(${idx})" class="text-rose-600 hover:text-rose-800 font-bold px-1.5">🗑️</button>
            </div>
          </div>
        `;
      })
      .join("");

    footer.innerHTML = `
      <div class="flex items-center justify-between text-sm font-extrabold text-slate-900">
        <span>Total VIP (${discountPct}% OFF):</span>
        <span class="text-emerald-800 text-lg">R$ ${totalVip.toFixed(2).replace(".", ",")}</span>
      </div>
      <div class="grid sm:grid-cols-2 gap-2">
        <button onclick="checkoutCartWhatsApp(${discountPct})" class="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 rounded-2xl text-xs transition">
          💬 Finalizar no WhatsApp DaviLiz
        </button>
        <a href="https://daviliz.com.br/loja/" target="_blank" rel="noopener" class="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-2xl text-xs text-center transition">
          🌐 Ir para Loja Oficial
        </a>
      </div>
    `;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

function checkoutCartWhatsApp(discountPct) {
  const lines = state.cart.map((item) => {
    const vipUnit = item.regularPrice * (1 - discountPct / 100);
    return `• ${item.qty}x ${item.name} (R$ ${vipUnit.toFixed(2).replace(".", ",")})`;
  });
  const msg = encodeURIComponent(
    `Olá equipe DaviLiz & Gisele Lourenço! Quero finalizar meu pedido VIP de Assinante (${discountPct}% OFF):\n\n${lines.join("\n")}`
  );
  window.open(`https://wa.me/5584998185357?text=${msg}`, "_blank", "noopener");
}

function openLegalModal(type) {
  const modal = document.getElementById("legal-modal");
  const title = document.getElementById("legal-modal-title");
  const body = document.getElementById("legal-modal-body");
  if (!modal || !title || !body) return;

  if (type === "privacy") {
    title.textContent = "Política de Privacidade (LGPD)";
    body.innerHTML = `
      <p>O <strong>Clube Gisele Lourenço &amp; DaviLiz Brinquedos</strong> coleta apenas os dados necessários (nome, e-mail, CPF/CNPJ e telefone) para liberação do acesso à área de membros e processamento seguro de assinaturas via <strong>Asaas</strong>.</p>
      <p>Seus dados de cartão são tokenizados diretamente no gateway de pagamento e nunca são armazenados em texto simples. Você pode solicitar atualização ou exclusão dos seus dados pelo e-mail <strong>contato@giselelourenco.com.br</strong>.</p>
    `;
  } else {
    title.textContent = "Termos de Uso da Plataforma";
    body.innerHTML = `
      <p>A assinatura do <strong>Clube Gisele Lourenço &amp; DaviLiz</strong> concede acesso pessoal e intransferível aos cursos, audiobooks, playbooks 3D, meditações e ao Espaço Infantil conforme o plano contratado.</p>
      <p>O cancelamento pode ser solicitado a qualquer momento antes da próxima renovação mensal ou anual sem multa contratual.</p>
    `;
  }
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}



// =========================================================================
// PWA: SERVICE WORKER & INSTALAÇÃO COMO APLICATIVO (CELULAR E COMPUTADOR)
// =========================================================================
let deferredPwaPrompt = null;

if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Aviso Service Worker PWA:", err);
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const btn = document.getElementById("pwa-install-btn");
    if (btn) btn.classList.remove("hidden");
  });

  window.addEventListener("appinstalled", () => {
    deferredPwaPrompt = null;
    const btn = document.getElementById("pwa-install-btn");
    if (btn) btn.classList.add("hidden");
    if (typeof showToast === "function") {
      showToast("Aplicativo instalado com sucesso!", "success");
    }
  });
}

async function installPwaApp() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    deferredPwaPrompt = null;
    if (outcome === "accepted" && typeof showToast === "function") {
      showToast("Instalando o Clube Gisele & DaviLiz...", "success");
    }
    return;
  }

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const msg = isIos
    ? "No iPhone/iPad (Safari): toque no ícone de Compartilhar (⬆️) e escolha 'Adicionar à Tela de Início'."
    : "No navegador (Chrome/Edge): clique no ícone de Instalar (⊕) na barra de endereço ou no menu 'Instalar Clube Gisele & DaviLiz'.";
  if (typeof showToast === "function") {
    showToast(msg, "info");
  } else {
    alert(msg);
  }
}

// =========================================================================
// MOTOR DE ÍCONES MODERNOS FUTURISTAS (LUCIDE VECTOR ICONS)
// =========================================================================
const EMOJI_TO_LUCIDE = {
  "🌟": "sparkles",
  "✨": "sparkles",
  "📖": "book-open-check",
  "📚": "library",
  "📘": "book-marked",
  "🎧": "headphones",
  "🎙️": "mic",
  "🎬": "film",
  "🙏": "flame",
  "👩‍🏫": "graduation-cap",
  "🎓": "graduation-cap",
  "🧸": "gamepad-2",
  "🛍️": "shopping-bag",
  "💳": "credit-card",
  "📲": "smartphone",
  "📱": "smartphone",
  "💻": "monitor",
  "📟": "tablet",
  "👤": "user-round",
  "👑": "crown",
  "🔑": "key-round",
  "⚡": "zap",
  "💙": "shield-check",
  "💚": "shield-check",
  "🌱": "sprout",
  "🎁": "gift",
  "⭐": "star",
  "🎵": "music",
  "🔊": "volume-2",
  "👩": "user-round",
  "👨": "user-round-check",
  "👧": "smile",
  "👶": "baby",
  "⏹": "square",
  "▶️": "play",
  "▶": "play",
  "✏️": "pen-line",
  "🗑️": "trash-2",
  "💾": "save",
  "📤": "upload-cloud",
  "⬇": "download",
  "👁️": "eye",
  "⚙️": "settings",
  "➕": "plus-circle",
  "🔄": "refresh-cw",
  "⏳": "loader",
  "✅": "check-circle-2",
  "✔": "check",
  "❌": "x-circle",
  "⚠️": "alert-triangle",
  "📅": "calendar",
  "⏱": "clock",
  "📄": "file-text",
  "📑": "list-tree",
  "✍️": "pen-tool",
  "📓": "notebook-pen",
  "💡": "lightbulb",
  "🧠": "brain-circuit",
  "🎯": "target",
  "🏆": "trophy",
  "📌": "pin",
  "🔗": "link-2",
  "📡": "radio",
  "🚀": "rocket",
  "🖨️": "printer",
  "🌀": "orbit",
  "⛶": "maximize-2",
  "☀️": "sun",
  "🌙": "moon",
  "🍂": "feather",
  "📜": "scroll-text",
  "🌿": "leaf",
  "🔒": "lock",
  "🔓": "unlock"
};

const EMOJI_KEYS_SORTED = Object.keys(EMOJI_TO_LUCIDE).sort((a, b) => b.length - a.length);
const EMOJI_REGEX = new RegExp(
  EMOJI_KEYS_SORTED.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "g"
);

let iconUpgradeScheduled = false;

function upgradeEmojisToFuturisticIcons(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION", "SELECT", "CODE", "PRE"].includes(tag)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue || !EMOJI_REGEX.test(node.nodeValue)) {
        EMOJI_REGEX.lastIndex = 0;
        return NodeFilter.FILTER_REJECT;
      }
      EMOJI_REGEX.lastIndex = 0;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToReplace = [];
  let current;
  while ((current = walker.nextNode())) {
    nodesToReplace.push(current);
  }

  nodesToReplace.forEach((textNode) => {
    const text = textNode.nodeValue;
    const frag = document.createDocumentFragment();
    let lastIdx = 0;
    EMOJI_REGEX.lastIndex = 0;
    let match;
    while ((match = EMOJI_REGEX.exec(text)) !== null) {
      if (match.index > lastIdx) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      }
      const iconName = EMOJI_TO_LUCIDE[match[0]] || "sparkles";
      const iEl = document.createElement("i");
      iEl.setAttribute("data-lucide", iconName);
      iEl.className = "w-[1.05em] h-[1.05em] inline-block align-[-0.18em]";
      frag.appendChild(iEl);
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIdx)));
    }
    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(frag, textNode);
    }
  });

  if (typeof window.renderFuturisticIcons === "function") {
    window.renderFuturisticIcons(root);
  }
}

function scheduleFuturisticIconRefresh() {
  if (iconUpgradeScheduled) return;
  iconUpgradeScheduled = true;
  requestAnimationFrame(() => {
    iconUpgradeScheduled = false;
    upgradeEmojisToFuturisticIcons(document.body);
  });
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    upgradeEmojisToFuturisticIcons(document.body);
    const observer = new MutationObserver(() => {
      scheduleFuturisticIconRefresh();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  window.addEventListener("load", () => {
    upgradeEmojisToFuturisticIcons(document.body);
  });
}
