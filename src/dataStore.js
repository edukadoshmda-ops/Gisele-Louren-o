/**
 * Dados iniciais do Ecossistema Gisele Lourenço & DaviLiz Brinquedos
 * Baseado nos produtos, livros e cursos reais de giselelourenco.com.br e daviliz.com.br/loja/
 */

const initialData = {
  authorProfile: {
    name: "Gisele Lourenço",
    role: "Escritora, Evangelista, Conselheira Bíblica, Educadora Infantil & Idealizadora da DaviLiz",
    location: "Fortaleza, CE",
    photoAvatarUrl: "/images/gisele-portrait.jpg",
    photoPortraitUrl: "/images/gisele-portrait.jpg",
    photoUrl: "/images/gisele-portrait.jpg",
    photoSpeakingUrl: "/images/gisele-curso1.jpg",
    photoFlorescendoUrl: "/images/gisele-florescendo.png",
    photoCursoUrl: "/images/gisele-curso1.jpg",
    logoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/cropped-Logo-Verde-Rosa-1000x-CURVA-Gisele-Louranco-24fev26.png",
    davilizLogoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Logo-300x279-DaviLiz-19set24-.png",
    videoIntroUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
    officialQuote: "Apenas uma vida que logo passará. Apenas o que for feito para Cristo, durará.",
    evangelismHighlight: "85% das conversões acontecem entre 4 e 5 anos de idade quando é feito um trabalho intencional de evangelismo e discipulado de 0 a 3 anos.",
    impactMetrics: [
      { value: "+25 mil", label: "Pessoas alcançadas pelo testemunho e ministério" },
      { value: "+12 mil", label: "Crianças evangelizadas com ensino bíblico lúdico" },
      { value: "+4 mil", label: "Pais, líderes e educadores cristãos treinados" },
      { value: "5 Livros", label: "Obras publicadas (3 infantis + 2 adultos) & +1 mil mulheres aconselhadas" }
    ],
    davilizResources: [
      "Estante Bíblica (66 Livros e 40 Escritores)",
      "Alfabeto de Versículos Musicados",
      "Árvore dos Frutos do Espírito",
      "Painel A Criação (Gênesis 1:1)",
      "Quadro Qual a sua Atitude? (Menino & Menina)"
    ],
    headline: "Uma trajetória dedicada a unir Verdades Eternas, Ciência do Comportamento e Educação Cristã para transformar lares.",
    biography: [
      "Gisele Lourenço é escritora, evangelista, conferencista, educadora infantil e conselheira voltada para famílias, casais, mulheres, jovens e crianças. Atua também como analista de comportamento e motivações humanas, capacitando pais, líderes e educadores cristãos em todo o Brasil.",
      "Idealizadora da DaviLiz Brinquedos, desenvolveu um ecossistema único que une literatura, cursos profundos de autoconhecimento e recursos pedagógicos lúdicos — com a missão de formar o caráter cristão desde a primeira infância e restaurar relacionamentos dentro do lar."
    ],
    academicFormation: [
      { period: "Atual", title: "Doutorado em Personalidade", institution: "Pesquisa e Aprofundamento em Personalidade e Motivações Humanas" },
      { period: "2024 – 2025", title: "Pós-Graduação em Análise de Comportamento Humano", institution: "Especialização Comportamental" },
      { period: "2023", title: "Pós-Graduação em Neurociência", institution: "Desenvolvimento Cognitivo, Emocional e Aprendizagem" },
      { period: "2018 – 2022", title: "Mestrado em Aconselhamento Bíblico", institution: "Cuidado Pastoral, Familiar e Cura Interior" },
      { period: "2017", title: "Especialização no Ministério Infantil", institution: "APEC (Associação Pró-Evangelização das Crianças)" },
      { period: "2014 – 2016", title: "Bacharelado em Missões", institution: "Formação Missionária e Evangelística" },
      { period: "2010 – 2014", title: "Bacharelado em Educação Cristã", institution: "Pedagogia da Fé e Formação de Discipuladores" }
    ],
    experiencePillars: [
      {
        title: "Aconselhamento, Neurociência & Autoconhecimento",
        description: "Integra sua formação em Aconselhamento Bíblico, Neurociência e Personalidade para conduzir mulheres, casais e famílias à maturidade emocional nos cursos 'O Poder de Se Conhecer' e 'A Arte de Relacionar-se'."
      },
      {
        title: "Literatura Adulta, Feminina & Infantojuvenil",
        description: "Autora de obras transformadoras como 'A Arte de Relacionar-se', 'Florescendo em Meio aos Espinhos da Dor', 'O Evangelho para Bebês' e a coleção 'Mudando as Atitudes com Davi e Liz'."
      },
      {
        title: "Evangelismo Infantil & Idealizadora da DaviLiz",
        description: "Mais de 15 anos dedicados ao discipulado de crianças e treinamento de professores, criando brinquedos educativos e materiais visuais que ensinam princípios bíblicos brincando."
      }
    ]
  },

  plans: [
    {
      id: "plan_essencial",
      name: "Clube DaviLiz Essencial",
      subtitle: "Ideal para pais iniciarem o discipulado lúdico em casa",
      priceMonthly: 39.90,
      priceYearly: 397.00,
      discountShopPercent: 10,
      badge: "Iniciante",
      color: "emerald",
      features: [
        "Espaço Kids completo (Alfabeto de Versículos Musicados + Áudios)",
        "Quadro Digital 'Mudando as Atitudes com Davi e Liz' (1 perfil infantil)",
        "Estante Bíblica Digital Interativa",
        "Playbooks Interativos 3D com páginas virando para celular, tablet e PC",
        "Pílulas Semanais para Pais com Gisele Lourenço",
        "10% OFF em toda a loja física DaviLiz Brinquedos"
      ]
    },
    {
      id: "plan_familia",
      name: "Família Plena (Gisele + DaviLiz)",
      subtitle: "O ecossistema completo para transformar os pais e educar os filhos",
      priceMonthly: 69.90,
      priceYearly: 697.00,
      discountShopPercent: 20,
      badge: "Mais Assinado",
      highlighted: true,
      color: "rose",
      features: [
        "Tudo do plano Clube DaviLiz Essencial",
        "Acesso liberado aos Cursos e Playbooks da Gisele Lourenço (ex: O Poder de Se Conhecer)",
        "Playbook Interativo completo do livro 'A Arte de Relacionar-se'",
        "Quadro Digital 'Mudando as Atitudes' para até 4 filhos",
        "Encontro Mensal Ao Vivo de Mentoria Familiar com Gisele Lourenço",
        "20% OFF + Frete Prioritário na loja física DaviLiz e livros"
      ]
    },
    {
      id: "plan_educador",
      name: "Ministério Infantil & Educadores",
      subtitle: "Para igrejas, escolas bíblicas, líderes e conselheiros",
      priceMonthly: 119.90,
      priceYearly: 1190.00,
      discountShopPercent: 30,
      badge: "Igrejas & Líderes",
      color: "amber",
      features: [
        "Tudo do plano Família Plena",
        "Formação de Professores e Discipuladores de Crianças com Certificado",
        "Licença de uso dos Playbooks Interativos e Visuais para salas de aula / EBD",
        "Roteiros de Culto Infantil e Dinâmicas com a Estante Bíblica",
        "30% OFF em combos e compras para Ministério na loja DaviLiz"
      ]
    }
  ],

  courses: [
    {
      id: "curso_poder_conhecer",
      title: "O Poder de Se Conhecer",
      instructor: "Gisele Lourenço",
      category: "Autoconhecimento & Espiritualidade",
      duration: "18 aulas • 6h 40m",
      level: "Curso Completo",
      progress: 65,
      planRequired: "plan_familia",
      coverGradient: "from-emerald-800 via-teal-700 to-emerald-900",
      badge: "Destaque Gisele",
      description: "Treinamento profundo de autoconhecimento, cura emocional e transformação espiritual à luz de princípios eternos.",
      modules: [
        { title: "Módulo 1: Quem sou eu em Deus?", duration: "45 min", completed: true },
        { title: "Módulo 2: Identificando raízes emocionais e feridas", duration: "55 min", completed: true },
        { title: "Módulo 3: Temperamentos e reações no lar", duration: "50 min", completed: false },
        { title: "Módulo 4: Construindo uma rotina emocional saudável", duration: "60 min", completed: false }
      ]
    },
    {
      id: "curso_arte_relacionar",
      title: "A Arte de Relacionar-se",
      instructor: "Gisele Lourenço",
      category: "Casamento, Família & Relacionamentos",
      duration: "14 aulas • 5h 15m",
      level: "Lançamento 2026",
      progress: 30,
      planRequired: "plan_familia",
      coverGradient: "from-rose-700 via-pink-700 to-rose-900",
      badge: "Baseado no Livro",
      description: "Aprenda a amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado — no casamento, nos filhos e nas amizades.",
      modules: [
        { title: "Aula 1: O mito de amar apenas do nosso jeito", duration: "38 min", completed: true },
        { title: "Aula 2: As linguagens afetivas dentro de casa", duration: "42 min", completed: false },
        { title: "Aula 3: Comunicação que edifica e desarma conflitos", duration: "47 min", completed: false },
        { title: "Aula 4: Restaurando pontes na família", duration: "52 min", completed: false }
      ]
    },
    {
      id: "curso_florescendo_espinhos",
      title: "Florescendo em Meio aos Espinhos da Dor",
      instructor: "Gisele Lourenço",
      category: "Cura Interior & Mulheres",
      duration: "10 aulas • 4h 00m",
      level: "Mentoria Temática",
      progress: 100,
      planRequired: "plan_familia",
      coverGradient: "from-purple-800 via-fuchsia-800 to-slate-900",
      badge: "Série Especial",
      description: "Como transformar estações difíceis e dores profundas em maturidade, propósito e testemunho de vida.",
      modules: [
        { title: "Encontro 1: Quando os espinhos fazem parte do jardim", duration: "40 min", completed: true },
        { title: "Encontro 2: O processo da poda e do florescer", duration: "45 min", completed: true },
        { title: "Encontro 3: Curadas para curar outras mulheres", duration: "50 min", completed: true }
      ]
    },
    {
      id: "curso_discipulado_infantil",
      title: "Ensinando Verdades Eternas Brincando",
      instructor: "Gisele Lourenço",
      category: "Educação Cristã Infantil",
      duration: "12 aulas • 4h 30m",
      level: "Pais & Educadores",
      progress: 45,
      planRequired: "plan_essencial",
      coverGradient: "from-amber-600 via-orange-600 to-rose-700",
      badge: "Método DaviLiz",
      description: "Guia prático para pais e professores de Ministério Infantil usarem a ludicidade na formação do caráter cristão.",
      modules: [
        { title: "Aula 1: Como o cérebro da criança absorve princípios", duration: "30 min", completed: true },
        { title: "Aula 2: Usando o livro Mudando as Atitudes no dia a dia", duration: "35 min", completed: true },
        { title: "Aula 3: Devocional para Bebês e Primeira Infância", duration: "28 min", completed: false },
        { title: "Aula 4: Dinâmicas com a Estante Bíblica", duration: "40 min", completed: false }
      ]
    }
  ],

  kidsAlphabet: [
    { letter: "A", verse: "Amarás o Senhor teu Deus de todo o teu coração.", ref: "Mateus 22:37", noteFreq: 261.63, theme: "Amor a Deus" },
    { letter: "B", verse: "Bom é render graças ao Senhor e cantar louvores.", ref: "Salmos 92:1", noteFreq: 293.66, theme: "Gratidão" },
    { letter: "C", verse: "Confia no Senhor de todo o teu coração.", ref: "Provérbios 3:5", noteFreq: 329.63, theme: "Confiança" },
    { letter: "D", verse: "Deus é o nosso refúgio e fortaleza, socorro bem presente.", ref: "Salmos 46:1", noteFreq: 349.23, theme: "Proteção" },
    { letter: "E", verse: "Ensina a criança no caminho em que deve andar.", ref: "Provérbios 22:6", noteFreq: 392.00, theme: "Sabedoria" },
    { letter: "F", verse: "Filhos, obedecei a vossos pais no Senhor, pois isto é justo.", ref: "Efésios 6:1", noteFreq: 440.00, theme: "Obediência" },
    { letter: "G", verse: "Guarda o teu coração, porque dele procedem as fontes da vida.", ref: "Provérbios 4:23", noteFreq: 493.88, theme: "Pureza" },
    { letter: "L", verse: "Lâmpada para os meus pés é a Tua palavra e luz para o meu caminho.", ref: "Salmos 119:105", noteFreq: 523.25, theme: "Palavra de Deus" }
  ],

  attitudesBoard: {
    childName: "Pedro (6 anos)",
    streakDays: 5,
    totalStars: 42,
    items: [
      { id: "att_1", title: "Obedecer aos pais de primeira (sem reclamar)", category: "Obediência", verse: "Efésios 6:1", stars: 3, completedToday: true },
      { id: "att_2", title: "Agradecer pelo alimento e pelo dia em oração", category: "Gratidão", verse: "1 Tessalonicenses 5:18", stars: 2, completedToday: true },
      { id: "att_3", title: "Guardar os brinquedos após brincar", category: "Ordem & Zelo", verse: "1 Coríntios 14:40", stars: 2, completedToday: false },
      { id: "att_4", title: "Falar sempre a verdade com amor", category: "Sinceridade", verse: "Efésios 4:25", stars: 3, completedToday: true },
      { id: "att_5", title: "Compartilhar e tratar bem os irmãos/amigos", category: "Generosidade", verse: "Hebreus 13:16", stars: 3, completedToday: false },
      { id: "att_6", title: "Momento Devocional com Davi e Liz", category: "Devoção", verse: "Salmos 119:105", stars: 4, completedToday: false }
    ]
  },

  bibleBookshelf: [
    { group: "Pentateuco (Lei)", color: "#10b981", books: ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio"], funFact: "Conta a criação do mundo, a história de Abraão e Moisés!" },
    { group: "Históricos", color: "#f59e0b", books: ["Josué", "Juízes", "Rute", "1 e 2 Samuel", "1 e 2 Reis", "Ester"], funFact: "Histórias de coragem como Davi, Rute e a rainha Ester!" },
    { group: "Poéticos & Sabedoria", color: "#ec4899", books: ["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares"], funFact: "Cheio de músicas, orações e conselhos sábios para crianças!" },
    { group: "Evangelhos", color: "#3b82f6", books: ["Mateus", "Marcos", "Lucas", "João"], funFact: "Mostram a vida, os milagres e o grande amor de Jesus!" },
    { group: "Atos & Cartas", color: "#8b5cf6", books: ["Atos", "Romanos", "Coríntios", "Efésios", "Filipenses", "Apocalipse"], funFact: "Ensinam como viver como uma família de fé até Jesus voltar!" }
  ],

  audiobooks: [
    {
      id: "ab_1",
      title: "Audiobook: A Arte de Relacionar-se",
      author: "Gisele Lourenço",
      audience: "Adultos & Casais",
      duration: "3h 45m",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
      audioUrl: "",
      description: "Narração completa sobre como amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado.",
      narrationText: "Audiobook: A Arte de Relacionar-se, escrito por Gisele Lourenço. Capítulo 1: O desafio de amar além do próprio jeito. Leitura bíblica em 1 Coríntios 13:4-7 e Efésios 4:2-3. Se você deseja amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado, este livro é para você. Muitas vezes amamos com sinceridade, mas usamos a linguagem errada. Quando compreendemos a necessidade emocional e espiritual de quem caminha ao nosso lado, construímos pontes de graça, escuta e acolhimento verdadeiro dentro do nosso lar.",
      chapters: [
        { title: "Capítulo 1: O desafio de amar além do próprio jeito (1 Coríntios 13:4-7)", duration: "18:20" },
        { title: "Capítulo 2: Curando feridas na comunicação familiar (Provérbios 15:1)", duration: "24:15" },
        { title: "Capítulo 3: Princípios eternos para relacionamentos duradouros (Efésios 4:2-3)", duration: "21:40" }
      ]
    },
    {
      id: "ab_2",
      title: "Audiobook Infantil: Mudando as Atitudes com Davi e Liz",
      author: "Gisele Lourenço (DaviLiz)",
      audience: "Crianças (2 a 12 anos)",
      duration: "1h 20m",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-4a12-anos-01-600x600.jpg",
      audioUrl: "",
      description: "Histórias narradas com expressão e carinho ensinando obediência, gratidão, verdade e generosidade brincando.",
      narrationText: "Audiobook Infantil: Mudando as Atitudes com Davi e Liz. Capítulo 1: O valor da obediência. Versículo de hoje em Efésios 6:1: Filhos, obedecei a vossos pais no Senhor, pois isto é justo. Olá crianças! Hoje o Davi e a Liz aprenderam que obedecer ao papai e à mamãe de primeira, sem reclamar, deixa o coração cheio de alegria e agrada muito a Deus!",
      chapters: [
        { title: "Capítulo 1: Davi aprende o valor da Obediência (Efésios 6:1)", duration: "12:10" },
        { title: "Capítulo 2: Liz e o segredo do Coração Grato (1 Tessalonicenses 5:18)", duration: "14:05" },
        { title: "Capítulo 3: Falando sempre a Verdade com Amor (Efésios 4:25)", duration: "11:45" }
      ]
    },
    {
      id: "ab_3",
      title: "Audiobook Devocional: O Evangelho para Bebês",
      author: "Gisele Lourenço (DaviLiz)",
      audience: "Primeira Infância (0 a 3 anos)",
      duration: "55m",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Devocional-Evangelho-para-Bebes-08-Gisele-11fev26-300x300.jpg",
      audioUrl: "",
      description: "Devocionais suaves narrados para ouvir junto com o bebê na hora do sono ou no carro.",
      narrationText: "Devocional O Evangelho para Bebês, por Gisele Lourenço. Capítulo 1: Deus criou você com amor. Leitura em Salmos 139:14 e Salmos 119:105: Lâmpada para os meus pés é a Tua palavra, e luz para o meu caminho. Desde pequenininho, o Senhor planejou cada detalhe da sua vida com amor eterno.",
      chapters: [
        { title: "Capítulo 1: Deus Criou Você com Amor (Salmos 139:14)", duration: "06:30" },
        { title: "Capítulo 2: Jesus, o Amigo das Crianças (Marcos 10:14)", duration: "07:15" }
      ]
    },
    {
      id: "ab_4",
      title: "Audiobook: Florescendo em Meio aos Espinhos da Dor",
      author: "Gisele Lourenço",
      audience: "Mulheres & Cura Interior",
      duration: "2h 50m",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Florescendo-em-Meio-aos-Espinhos-2-300x300.jpeg",
      audioUrl: "",
      description: "Como superar dores profundas como traição, injustiça e perdas, florescendo em maturidade e fé.",
      narrationText: "Audiobook: Florescendo em Meio aos Espinhos da Dor, por Gisele Lourenço. Capítulo 1: Compreendendo o propósito no vale. Leitura bíblica em Salmos 46:1 e Romanos 8:28. Mesmo quando atravessamos estações marcadas por espinhos e dores profundas, o Senhor é especialista em curar nossas raízes e fazer brotar um novo tempo de vida, sabedoria e testemunho.",
      chapters: [
        { title: "Capítulo 1: Compreendendo o propósito no vale (Salmos 46:1)", duration: "22:00" },
        { title: "Capítulo 2: Raízes curadas geram frutos saudáveis (Provérbios 4:23)", duration: "25:30" }
      ]
    }
  ],

  authorVideos: [
    {
      id: "vid_1",
      title: "Quem Sou e o Que Faço — Missão & Ministério",
      category: "Apresentação Oficial",
      duration: "04:15",
      videoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
      thumbnailUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Portfolio-03-600x628.jpg",
      description: "Gisele Lourenço apresenta sua jornada como escritora, evangelista, conselheira bíblica e idealizadora da DaviLiz."
    },
    {
      id: "vid_2",
      title: "Aula Especial: O Poder de Se Conhecer à Luz da Palavra",
      category: "Autoconhecimento & Neurociência",
      duration: "18:40",
      videoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
      thumbnailUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Curso-Pode-Se-Conhecer-02-Gisele-1024x857.jpg",
      description: "Como identificar raízes emocionais, temperamentos e motivações do coração para viver relacionamentos curados."
    },
    {
      id: "vid_3",
      title: "Como Usar o Livro 'Mudando as Atitudes com Davi e Liz' em Casa",
      category: "Discipulado Infantil",
      duration: "12:20",
      videoUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Materiais-1-Quem-sou-e-faco-YouTube.mp4",
      thumbnailUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-4a12-anos-01-600x600.jpg",
      description: "Orientações práticas para pais e educadores aplicarem o método lúdico na rotina das crianças."
    }
  ],

  ebooks: [
    {
      id: "eb_1",
      title: "Playbook: A Arte de Relacionar-se",
      subtitle: "Guia Prático de Comunicação Afetiva, Casamento & Restauração de Vínculos no Lar",
      author: "Gisele Lourenço",
      category: "Casamento & Família",
      accentColor: "rose",
      pages: "8 páginas interativas",
      readingTime: "Leitura & Prática: 25 min",
      audience: "Casais, Mulheres & Família",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
      description: "Playbook interativo completo com páginas virando em 3D, unindo Aconselhamento Bíblico e Neurociência do Comportamento para ensinar a amar como o outro precisa ser amado.",
      contentPreview: "Amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado: a chave para desarmar conflitos e edificar pontes duradouras dentro de casa.",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK OFICIAL • EDIÇÃO INTERATIVA",
          title: "A Arte de Relacionar-se",
          subtitle: "Aprendendo a amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado",
          verseText: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta.",
          verseRef: "1 Coríntios 13:4-7",
          paragraphs: [
            "Bem-vindo(a) ao Playbook Oficial da obra 'A Arte de Relacionar-se', escrito por Gisele Lourenço. Este livro interativo foi desenhado para leitura fluida em celulares, tablets e computadores.",
            "Vire as páginas para mergulhar nos princípios eternos, compreender as motivações humanas e preencher seus exercícios de transformação familiar diretamente na página."
          ],
          calloutTitle: "✨ Como usar este Playbook Interativo",
          calloutText: "Folheie as páginas clicando nas bordas, usando os botões de giro 3D ou deslizando o dedo na tela. Em cada capítulo você encontrará checklists clicáveis e espaços de reflexão."
        },
        {
          pageNumber: 2,
          type: "toc",
          kicker: "SUMÁRIO INTERATIVO • MAPA DE LEITURA",
          title: "Jornada de Transformação nos Relacionamentos",
          subtitle: "Clique em qualquer capítulo abaixo para girar diretamente até a página",
          verseText: "Com toda a humildade e mansidão, com longanimidade, suportando-vos uns aos outros em amor.",
          verseRef: "Efésios 4:2",
          paragraphs: [
            "Relacionar-se não é um talento automático com o qual nascemos prontos; é uma arte espiritual, emocional e comportamental que precisa ser cultivada todos os dias.",
            "Neste Playbook prático, unimos a sabedoria das Escrituras com a análise de perfil e neurociência afetiva para curar ruídos de comunicação no casamento, entre pais e filhos e na vida comunitária."
          ],
          calloutTitle: "📌 Estrutura Editorial deste Playbook",
          calloutText: "Cap. 1: O Mito de Amar Apenas do Nosso Jeito • Cap. 2: As Linguagens Afetivas e Temperamentos • Cap. 3: Comunicação que Edifica e Desarma Conflitos • Cap. 4: A Graça do Perdão e Reconstrução de Pontes • Cap. 5: Plano Prático de 7 Dias no Lar."
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "CAPÍTULO 1 • COMPREENSÃO AFETIVA",
          title: "O Mito de Amar Apenas do Nosso Próprio Jeito",
          subtitle: "Por que pessoas que se amam sinceramente ainda se machucam na rotina?",
          verseText: "Nada façais por contenda ou por vanglória, mas por humildade; cada um considere os outros superiores a si mesmo.",
          verseRef: "Filipenses 2:3",
          paragraphs: [
            "Um dos maiores equívocos dentro do casamento e da maternidade é acreditar que basta amar com boas intenções. Muitas vezes entregamos afeto na nossa própria moeda emocional, enquanto quem está ao nosso lado está faminto por outra forma de cuidado.",
            "Para uma pessoa de perfil mais prático, amar pode significar trabalhar duro e manter a casa em ordem. Mas, para um cônjuge ou filho de perfil relacional, a ausência de olho no olho, escuta mansa e tempo de qualidade soa como frieza ou rejeição.",
            "Amar biblicamente exige sair do piloto automático do ego e perguntar com humildade: 'Como o coração de quem Deus confiou a mim realmente se sente seguro, acolhido e valorizado?'"
          ],
          calloutTitle: "🧠 Neurociência & Comportamento Humano",
          calloutText: "O cérebro humano interpreta a falta de conexão emocional como um alerta de ameaça. Quando validamos o sentimento do outro antes de corrigir ou argumentar, o sistema límbico desacelera e o diálogo volta a ser seguro.",
          checklist: [
            { text: "Observar hoje qual atitude ilumina o rosto do meu cônjuge ou filho", checked: true },
            { text: "Perguntar sem defesa: 'Como posso amar melhor você nesta semana?'", checked: false },
            { text: "Substituir suposições apressadas por perguntas gentis", checked: false }
          ],
          exercisePrompt: "Qual é o 'seu jeito' habitual de demonstrar amor e qual é o jeito que seu cônjuge ou filho mais precisa receber hoje?",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "CAPÍTULO 2 • TEMPERAMENTOS & PERFIS",
          title: "Decifrando Temperamentos Dentro de Casa",
          subtitle: "Transformando diferenças de personalidade em complementaridade divina",
          verseText: "Porque, assim como em um corpo temos muitos membros, e nem todos os membros têm a mesma operação, assim nós somos um só corpo em Cristo.",
          verseRef: "Romanos 12:4-5",
          paragraphs: [
            "Deus não projetou a família para ser uma linha de montagem de cópias idênticas. O cônjuge mais acelerado e decidido precisa da sensibilidade e da ponderação do cônjuge mais calmo e detalhista — e vice-versa.",
            "Quando não conhecemos a nossa própria estrutura de personalidade (Curso O Poder de Se Conhecer), enxergamos o temperamento diferente do outro como um defeito a ser combatido, em vez de uma riqueza a ser compreendida.",
            "Com os filhos acontece o mesmo: uma criança comunicativa precisa de espaço para expressar ideias com sabedoria, enquanto uma criança mais introspectiva precisa de previsibilidade, doçura e tempo para processar emoções."
          ],
          calloutTitle: "💡 Chave de Aconselhamento por Gisele Lourenço",
          calloutText: "Aquilo que mais irrita você no temperamento do outro geralmente aponta para uma área onde você mesmo precisa desenvolver flexibilidade, paciência e domínio próprio.",
          checklist: [
            { text: "Identificar o ponto forte do temperamento de cada pessoa da casa", checked: false },
            { text: "Parar de exigir que o outro reaja na mesma velocidade ou formato que eu", checked: false },
            { text: "Agradecer a Deus pelas diferenças que equilibram a nossa família", checked: false }
          ],
          exercisePrompt: "Descreva uma diferença de temperamento na sua casa que você decide enxergar hoje com graça e maturidade:",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "chapter",
          kicker: "CAPÍTULO 3 • DIÁLOGO QUE CURA",
          title: "Comunicação que Edifica e Desarma Conflitos",
          subtitle: "A anatomia da resposta branda no calor das tensões diárias",
          verseText: "A resposta branda desvia o furor, mas a palavra dura suscita a ira.",
          verseRef: "Provérbios 15:1",
          paragraphs: [
            "A maioria das crises familiares não começa pelo tamanho do problema em si, mas pelo tom de voz com que o problema é abordado. O tom comunica a disposição do coração antes mesmo que as palavras terminem de ser pronunciadas.",
            "A comunicação redentiva, baseada em Efésios 4:29, passa por três filtros essenciais antes de sair dos lábios: É verdadeiro? É dito em amor? É oportuno para edificar quem está ouvindo agora?",
            "Quando substituímos acusações generalizadas ('Você nunca me ajuda', 'Você sempre faz isso') por expressões vulneráveis e claras ('Eu me sinto sobrecarregada quando isso acontece e preciso do seu apoio'), desarmamos a muralha de defesa."
          ],
          calloutTitle: "🗣️ Regra de Ouro dos 10 Segundos",
          calloutText: "Diante de uma fala atravessada, respire profundamente, ore em silêncio por 10 segundos e escolha responder à necessidade oculta por trás da reação, e não ao ataque superficial.",
          checklist: [
            { text: "Reduzir o volume da voz quando o ambiente ficar tenso", checked: false },
            { text: "Evitar as palavras 'nunca' e 'sempre' durante ajustes familiares", checked: false },
            { text: "Ouvir até o fim sem interromper ou preparar contra-ataque mental", checked: false }
          ],
          exercisePrompt: "Qual frase reativa você costuma usar no cansaço e por qual palavra edificante você vai trocá-la a partir de hoje?",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "chapter",
          kicker: "CAPÍTULO 4 • CURA DE VÍNCULOS",
          title: "Restaurando Pontes: O Poder do Perdão Diário",
          subtitle: "Como limpar o acúmulo de pequenas mágoas antes que virem muralhas",
          verseText: "Antes, sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.",
          verseRef: "Efésios 4:32",
          paragraphs: [
            "Relacionamentos saudáveis não são feitos por pessoas perfeitas que nunca erram, mas por corações humildes que sabem pedir perdão depressa e perdoar com generosidade.",
            "Quando guardamos pequenos ressentimentos na 'conta bancária emocional' de casa, qualquer detalhe cotidiano vira motivo de explosão ou distanciamento silencioso.",
            "Perdoar não é fingir que não doeu nem anular limites saudáveis; perdoar é cancelar a dívida no tribunal da amargura, entregando a justiça a Deus e abrindo espaço para a reconciliação verdadeira."
          ],
          calloutTitle: "🌿 Prática Restauradora no Lar",
          calloutText: "Não permita que o sol se ponha sobre a vossa ira (Efésios 4:26). Um pedido sincero de perdão aos filhos ou ao cônjuge ensina mais sobre o Evangelho do que mil discursos.",
          checklist: [
            { text: "Liberar perdão por falhas passadas que não podem ser alteradas", checked: false },
            { text: "Pedir perdão com humildade se hoje falei sem paciência", checked: false }
          ],
          exercisePrompt: "Existe alguma ponte na sua família que precisa de um gesto de humildade, conversa ou perdão hoje?",
          userResponse: ""
        },
        {
          pageNumber: 7,
          type: "exercise",
          kicker: "LABORATÓRIO PRÁTICO • PLANO DE 7 DIAS",
          title: "Roteiro Semanal: Amar na Prática",
          subtitle: "Pequenas ações intencionais que transformam a atmosfera da casa",
          verseText: "Meus filhinhos, não amemos de palavra, nem de língua, mas por obra e em verdade.",
          verseRef: "1 João 3:18",
          paragraphs: [
            "A leitura sem prática gera apenas admiração intelectual; a leitura aplicada gera transformação de vida. Escolha cumprir um micro-desafio por dia ao longo desta semana:",
            "• Segunda-feira (Elogio Intencional): Expresse verbalmente duas qualidades que você admira em quem mora com você.\n• Terça-feira (Escuta Plena): Dedique 15 minutos com o celular longe para ouvir seu cônjuge ou filho.\n• Quarta-feira (Serviço Silencioso): Faça uma tarefa que alivie o fardo do outro sem cobrar reconhecimento.\n• Quinta-feira (Toque e Afeto): Cultive abraços demorados de pelo menos 20 segundos ao chegar e ao sair."
          ],
          calloutTitle: "🎯 Meta de Constância Familiar",
          calloutText: "Ao final dos 7 dias, reúna a família à mesa para celebrar os avanços e compartilhar como cada um se sentiu amado.",
          checklist: [
            { text: "Dia 1 & 2: Palavra de afirmação + Escuta sem celular concluídos", checked: false },
            { text: "Dia 3 & 4: Gesto de serviço + Abraço acolhedor praticados", checked: false },
            { text: "Dia 5 a 7: Momento de oração conjunta e gratidão em família", checked: false }
          ],
          exercisePrompt: "Escreva aqui suas 3 metas prioritárias de relacionamento para os próximos 7 dias:",
          userResponse: ""
        },
        {
          pageNumber: 8,
          type: "certificate",
          kicker: "ALIANÇA & ORAÇÃO FINAL",
          title: "Consagração do Nosso Lar e Relacionamentos",
          subtitle: "Conclusão do Playbook 'A Arte de Relacionar-se' — Gisele Lourenço",
          verseText: "Com a sabedoria se edifica a casa, e com o entendimento ela se estabelece; e pelo conhecimento se encherão as câmaras com todos os bens preciosos e agradáveis.",
          verseRef: "Provérbios 24:3-4",
          paragraphs: [
            "Oração de Consagração: 'Senhor, entrego em Tuas mãos a minha forma de amar, falar e ouvir. Cura as minhas raízes emocionais, dá-me olhos para enxergar a necessidade de quem caminha ao meu lado e faz da nossa casa um refúgio de graça, respeito e alegria na Tua presença. Amém.'",
            "Parabéns por concluir a leitura e os exercícios deste Playbook! Você pode revisitar estas páginas, atualizar suas respostas ou ouvir a narração em português quando desejar."
          ],
          calloutTitle: "🏆 Próximo Passo no Ecossistema",
          calloutText: "Assista às videoaulas do curso 'A Arte de Relacionar-se' na aba Cursos Gisele e adquira o livro físico com desconto VIP na Loja do Clube!",
          exercisePrompt: "Registre sua oração ou declaração final sobre o seu casamento e família:",
          userResponse: ""
        }
      ]
    },
    {
      id: "eb_2",
      title: "Playbook: O Poder de Se Conhecer",
      subtitle: "Caderno Interativo de Autoconhecimento, Raízes Emocionais, Neurociência & Identidade em Deus",
      author: "Gisele Lourenço",
      category: "Autoconhecimento & Neurociência",
      accentColor: "emerald",
      pages: "8 páginas interativas",
      readingTime: "Leitura & Prática: 30 min",
      audience: "Pais, Mulheres & Líderes",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/03/Combo-Livro-e-Crso-Img01-Gisele-05mar26-300x300.png",
      description: "Playbook profundo de mapeamento emocional e espiritual: identifique gatilhos, compreenda sua história e alinhe sua mente à verdade de Deus.",
      contentPreview: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida (Provérbios 4:23).",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK DE MAPEAMENTO EMOCIONAL",
          title: "O Poder de Se Conhecer",
          subtitle: "Identidade, Neurociência Comportamental e Cura das Raízes à Luz da Palavra",
          verseText: "Sonda-me, ó Deus, e conhece o meu coração; prova-me, e conhece os meus pensamentos.",
          verseRef: "Salmos 139:23",
          paragraphs: [
            "Você não pode governar nem entregar a Deus aquilo que finge que não existe dentro de si. O verdadeiro autoconhecimento cristão acontece quando olhamos para o espelho da Palavra sem máscaras.",
            "Neste Playbook interativo, Gisele Lourenço conduz você por um diagnóstico claro das suas emoções, motivações e padrões de reação."
          ],
          calloutTitle: "🎓 Base Científica & Teológica",
          calloutText: "Desenvolvido com base nas especializações de Gisele Lourenço em Aconselhamento Bíblico, Neurociência, Análise de Comportamento Humano e Doutorado em Personalidade."
        },
        {
          pageNumber: 2,
          type: "toc",
          kicker: "SUMÁRIO • JORNADA INTERIOR",
          title: "Trilha do Autoconhecimento e Maturidade",
          subtitle: "Navegue pelos capítulos clicando nos tópicos ou virando as páginas",
          verseText: "E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento.",
          verseRef: "Romanos 12:2",
          paragraphs: [
            "1. Quem Sou Eu em Deus vs. Rótulos do Passado\n2. A Árvore Comportamental: Frutos, Galhos e Raízes\n3. Gatilhos Emocionais e Renovação Neural\n4. Dominando a Ansiedade e o Perfeccionismo\n5. Mapa Pessoal de Renovação da Mente."
          ],
          calloutTitle: "🧭 Objetivo Prático",
          calloutText: "Sair da reatividade automática e construir uma rotina emocional saudável, pacífica e alinhada ao propósito eterno."
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "CAPÍTULO 1 • IDENTIDADE VERDADEIRA",
          title: "Quem Sou Eu em Deus? Desconstruindo Rótulos",
          subtitle: "Separando a sua essência em Cristo das feridas da sua caminhada",
          verseText: "Eu te louvarei, porque de um modo terrível e tão maravilhoso fui formado; maravilhosas são as tuas obras.",
          verseRef: "Salmos 139:14",
          paragraphs: [
            "Muitos adultos caminham pela vida carregando sentenças que ouviram na infância ou em momentos de dor: 'você é difícil demais', 'você nunca dá conta', 'você precisa agradar a todos para ser aceito'.",
            "Essas mensagens criam trilhas neurais de insegurança, necessidade excessiva de aprovação ou rigidez extrema. Mas a Palavra de Deus nos chama a substituir toda mentira identitária pela verdade do Criador.",
            "Conhecer-se começa por reconhecer que o seu valor não está na sua performance impecável, mas na graça redentora daquele que formou você com propósito."
          ],
          calloutTitle: "💡 Exercício de Filtro Mental",
          calloutText: "Toda vez que surgir um pensamento de acusação interna, pergunte: 'Essa voz vem do caráter de Deus ou de uma ferida antiga não curada?'",
          checklist: [
            { text: "Identificar um rótulo negativo que carreguei por anos e rejeitá-lo", checked: true },
            { text: "Declarar minha identidade em Cristo ao iniciar o dia", checked: false }
          ],
          exercisePrompt: "Qual rótulo ou cobrança interna você decide entregar hoje diante de Deus?",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "CAPÍTULO 2 • A ÁRVORE DO CORAÇÃO",
          title: "Raízes Emocionais e Frutos Visíveis",
          subtitle: "Por que mudar apenas o comportamento externo não sustenta a transformação?",
          verseText: "Porque a boca fala do que está cheio o coração.",
          verseRef: "Mateus 12:34",
          paragraphs: [
            "Imagine uma árvore: os frutos visíveis são as nossas falas, reações, gritos, silêncios ou impaciência. Muitas vezes tentamos podar apenas o fruto à força, prometendo 'amanhã não vou perder a calma'.",
            "Porém, se a raiz continuar alimentada por sobrecarga, medo de rejeição, falta de descanso ou mágoas guardadas, o mesmo fruto voltará a nascer na primeira pressão.",
            "No Aconselhamento Bíblico aliado à análise comportamental, investigamos a raiz do coração: o que eu estava temendo, desejando ou protegendo no exato momento em que reagi mal?"
          ],
          calloutTitle: "🌱 Pergunta Diagnóstica das Raízes",
          calloutText: "Por trás da raiva quase sempre existe uma dor, um cansaço extremo ou uma sensação de injustiça que precisa ser tratada na fonte.",
          checklist: [
            { text: "Mapear em quais horários do dia fico mais vulnerável ao estresse", checked: false },
            { text: "Cuidar das raízes: sono, tempo com Deus e limites saudáveis", checked: false }
          ],
          exercisePrompt: "Quando você perde a paz no dia a dia, qual costuma ser a raiz oculta (cansaço, medo, sensação de não ser ouvida, sobrecarga)?",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "chapter",
          kicker: "CAPÍTULO 3 • NEUROCIÊNCIA E FÉ",
          title: "Reprogramando Pensamentos e Cativeiros Mentais",
          subtitle: "Como a neuroplasticidade confirma o princípio de Romanos 12:2",
          verseText: "Levando cativo todo entendimento à obediência de Cristo.",
          verseRef: "2 Coríntios 10:5",
          paragraphs: [
            "A neurociência moderna comprova que o nosso cérebro é plástico: pensamentos repetidos fortalecem sinapses, criando verdadeiras avenidas automáticas de ansiedade ou de paz.",
            "Séculos antes da ciência descobrir a neuroplasticidade, o apóstolo Paulo já ensinava em Filipenses 4:8 a direcionar intencionalmente o foco mental para tudo o que é verdadeiro, justo, puro e amável.",
            "Você não pode impedir que um pensamento ansioso bata à porta da sua mente, mas você tem autoridade espiritual e cognitiva para não oferecer uma cadeira a ele."
          ],
          calloutTitle: "🧠 Ciclo de Renovação em 3 Passos",
          calloutText: "1. Capturar o pensamento tóxico • 2. Confrontar com a promessa bíblica • 3. Substituir por uma ação pacífica e consciente.",
          checklist: [
            { text: "Praticar a pausa consciente antes de alimentar cenários catastróficos", checked: false },
            { text: "Substituir 10 minutos de rolagem ansiosa no celular por meditação bíblica", checked: false }
          ],
          exercisePrompt: "Escreva um pensamento recorrente de ansiedade e a verdade bíblica que você usará para substituí-lo:",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "exercise",
          kicker: "CAPÍTULO 4 • AUTOAVALIAÇÃO COMPORTAMENTAL",
          title: "Termômetro do Equilíbrio Pessoal e Familiar",
          subtitle: "Avalie com sinceridade como estão as 4 dimensões da sua vida hoje",
          verseText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
          verseRef: "Provérbios 4:23",
          paragraphs: [
            "Para crescer com constância, precisamos de clareza sobre onde estamos hoje:\n• Dimensão Espiritual: Tenho buscado a Deus por intimidade ou apenas no desespero?\n• Dimensão Emocional: Consigo nomear o que sinto sem descontar nas pessoas que amo?\n• Dimensão Física: Tenho respeitado os limites do meu corpo e do meu descanso?\n• Dimensão Relacional: Tenho pedido ajuda com clareza em vez de acumular peso sozinha?"
          ],
          calloutTitle: "📋 Checklist de Maturidade Emocional",
          calloutText: "Marque os hábitos que você se compromete a iniciar nesta semana:",
          checklist: [
            { text: "Reservar 15 minutos diários de silêncio, leitura e oração", checked: false },
            { text: "Comunicar minhas necessidades com clareza e sem culpa", checked: false },
            { text: "Celebrar pequenas vitórias em vez de focar apenas no que falta", checked: false }
          ],
          exercisePrompt: "Qual das 4 dimensões (Espiritual, Emocional, Física ou Relacional) precisa de atenção imediata nesta semana?",
          userResponse: ""
        },
        {
          pageNumber: 7,
          type: "exercise",
          kicker: "DIÁRIO DE TRANSFORMAÇÃO",
          title: "Plano Pessoal: Minha Nova Rotina do Coração",
          subtitle: "Estabelecendo limites saudáveis e prioridades reais",
          verseText: "Ensina-nos a contar os nossos dias, de tal maneira que alcancemos corações sábios.",
          verseRef: "Salmos 90:12",
          paragraphs: [
            "Dizer 'sim' para tudo o que é urgente faz você dizer 'não' para o que é eterno. Um coração sábio sabe discernir a estação em que está vivendo.",
            "Use o espaço interativo desta página para desenhar o seu compromisso prático de autocuidado espiritual e emocional."
          ],
          calloutTitle: "✨ Lembrete da Mentoria",
          calloutText: "Cuidar da saúde do seu coração não é egoísmo; é responsabilidade com a família que se alimenta da sua paz.",
          exercisePrompt: "O que você precisa parar de carregar hoje e qual hábito saudável vai plantar no lugar?",
          userResponse: ""
        },
        {
          pageNumber: 8,
          type: "certificate",
          kicker: "DECLARAÇÕES DE IDENTIDADE",
          title: "Confissão Diária de Cura e Sabedoria",
          subtitle: "Encerramento do Playbook 'O Poder de Se Conhecer'",
          verseText: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.",
          verseRef: "2 Timóteo 1:7",
          paragraphs: [
            "Declare em voz alta: 'Em Cristo, sou amada, perdoada e capacitada. Minhas dores passadas não definem o meu futuro. Deus me deu espírito de fortaleza, amor e domínio próprio para governar minhas emoções e edificar minha casa em paz.'",
            "Continue aprofundando este conteúdo nas aulas completas do curso 'O Poder de Se Conhecer' na aba Cursos Gisele!"
          ],
          calloutTitle: "🎙️ Dica de Áudio",
          calloutText: "Clique no botão de Narração acima para ouvir esta declaração com voz feminina ou masculina em Português do Brasil!",
          exercisePrompt: "Deixe registrada sua palavra-chave de vitória ao concluir este Playbook:",
          userResponse: ""
        }
      ]
    },
    {
      id: "eb_3",
      title: "Playbook Infantil: Mudando as Atitudes com Davi e Liz",
      subtitle: "Livro Digital Ilustrado & Interativo de Formação do Caráter Cristão para Crianças e Família",
      author: "Gisele Lourenço (DaviLiz Brinquedos)",
      category: "Educação Cristã Infantil",
      accentColor: "amber",
      pages: "8 páginas ilustradas",
      readingTime: "Leitura em Família: 15 min",
      audience: "Crianças (2 a 12 anos) & Pais",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-4a12-anos-01-600x600.jpg",
      description: "Playbook infantil interativo com páginas virando: histórias do Davi e da Liz, versículos para memorizar, missões práticas de obediência, gratidão e verdade!",
      contentPreview: "Atitude do Dia com Davi e Liz: Obedecer ao papai e à mamãe de primeira deixa o coração cheio de alegria e agrada a Deus! (Efésios 6:1).",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK INFANTIL INTERATIVO • CLUBE DAVILIZ",
          title: "Mudando as Atitudes com Davi e Liz",
          subtitle: "Ensinando Verdades Eternas Brincando: Obediência, Gratidão, Verdade e Amor!",
          verseText: "Ensina a criança no caminho em que deve andar, e, ainda quando for velho, não se desviará dele.",
          verseRef: "Provérbios 22:6",
          paragraphs: [
            "Olá, família! Este é o Playbook Interativo oficial do Davi e da Liz! Aqui as crianças aprendem princípios bíblicos de forma visual, alegre e participativa.",
            "Vire a página junto com seu filho(a) no celular, tablet ou computador, ouça a narração em português e marque as estrelinhas de cada missão!"
          ],
          calloutTitle: "🧸 Dica para os Pais e Educadores",
          calloutText: "Leia uma página por dia com a criança e depois marque as conquistas no Quadro Digital da aba 'Mundo Davi e Liz'!"
        },
        {
          pageNumber: 2,
          type: "toc",
          kicker: "MAPA DE AVENTURAS DO DAVI E DA LIZ",
          title: "Nossas Missões de Caráter Cristão",
          subtitle: "Clique em uma missão para girar as páginas até a história!",
          verseText: "Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho.",
          verseRef: "Salmos 119:105",
          paragraphs: [
            "🌟 Missão 1: Davi Aprende a Obediência de Primeira (Efésios 6:1)\n💛 Missão 2: Liz e o Segredo do Coração Grato (1 Tessalonicenses 5:18)\n🛡️ Missão 3: O Escudo da Verdade com Amor (Efésios 4:25)\n🤝 Missão 4: Guardando os Brinquedos e Compartilhando (Hebreus 13:16)\n🏆 Certificado Oficial de Coração Sábio!"
          ],
          calloutTitle: "🎵 Combine com a Música!",
          calloutText: "Cada missão se conecta com o nosso Alfabeto de Versículos Musicados para fixar a Palavra no coraçãozinho."
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "MISSÃO 1 • OBEDIÊNCIA QUE TRAZ BÊNÇÃO",
          title: "Davi e o Segredo de Obedecer de Primeira!",
          subtitle: "Obedecer sem reclamar e com sorriso no rosto agrada ao Senhor",
          verseText: "Filhos, obedecei a vossos pais no Senhor, pois isto é justo.",
          verseRef: "Efésios 6:1",
          paragraphs: [
            "Davi estava montando uma torre bem alta de blocos quando a mamãe chamou: 'Davi, hora de guardar e lavar as mãos para o jantar!'. No começo, Davi pensou em dizer 'Só mais um pouquinho...'.",
            "Mas então ele lembrou do que aprendeu na Palavra de Deus: obedecer de primeira, sem bater o pé e sem resmungar, é como colocar uma coroa de sabedoria no coração!",
            "Davi respondeu 'Já vou, mamãe!', guardou as peças rapidinho e ganhou um abraço apertado. Que paz gostosa ficou na sala!"
          ],
          calloutTitle: "⭐ Desafio do Davi para Hoje (+3 Estrelas)",
          calloutText: "Quando o papai ou a mamãe chamar hoje, responda na mesma hora com alegria: 'Sim, mamãe! Sim, papai!'",
          checklist: [
            { text: "Atender ao chamado dos pais de primeira", checked: true },
            { text: "Falar com voz doce e respeitosa", checked: false },
            { text: "Repetir o versículo Efésios 6:1 em voz alta", checked: false }
          ],
          exercisePrompt: "Escreva com a criança: Em qual momento de hoje você vai praticar a obediência de primeira?",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "MISSÃO 2 • GRATIDÃO E ALEGRIA",
          title: "Liz e o Óculos do Coração Grato",
          subtitle: "Descobrindo quantas bênçãos o Papai do Céu nos dá todos os dias",
          verseText: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
          verseRef: "1 Tessalonicenses 5:18",
          paragraphs: [
            "Naquela tarde chuvosa, Liz não pôde brincar no parquinho. Ela quase ficou emburrada olhando pela janela, até que a mamãe entregou a ela o 'Óculos Invisível da Gratidão'!",
            "Com os olhos da gratidão, Liz percebeu o cheirinho do bolo quentinho na cozinha, o carinho do seu cachorrinho, a cama macia e o amor da sua família.",
            "Ela juntou as mãozinhas e orou: 'Obrigada, Papai do Céu, pela chuva que molha as flores e pelo nosso lar quentinho!'"
          ],
          calloutTitle: "💛 Desafio da Liz para Hoje (+2 Estrelas)",
          calloutText: "Antes de comer e antes de dormir, agradeça a Deus por 3 coisas boas que aconteceram no seu dia!",
          checklist: [
            { text: "Agradecer pelo alimento à mesa em oração", checked: true },
            { text: "Dizer 'muito obrigado(a)' para quem cuidar de mim hoje", checked: false },
            { text: "Trocar uma reclamação por um louvor a Deus", checked: false }
          ],
          exercisePrompt: "Quais são as 3 coisas pelas quais a criança é mais grata ao Papai do Céu hoje?",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "chapter",
          kicker: "MISSÃO 3 • SINCERIDADE E CORAGEM",
          title: "O Escudo Brilhante da Verdade com Amor",
          subtitle: "Contar sempre a verdade deixa o coração leve e protegido",
          verseText: "Por isso, deixando a mentira, fale cada um a verdade com o seu próximo.",
          verseRef: "Efésios 4:25",
          paragraphs: [
            "Sem querer, enquanto corria pela sala, Davi esbarrou num copo de suco que derramou no tapete. O coraçãozinho dele bateu forte de medo de levar bronca.",
            "Liz lembrou o irmãozinho: 'Davi, quando falamos a verdade e pedimos desculpas, o nosso coração fica limpinho diante de Deus!'.",
            "Davi chamou a mamãe, contou a verdade e ajudou a secar o tapete. A mamãe ficou muito feliz pela sinceridade dele e explicou que a verdade sempre constrói confiança!"
          ],
          calloutTitle: "🛡️ Segredo dos Heróis da Fé",
          calloutText: "Erros podem ser limpos e consertados, e falar a verdade mostra um coração corajoso que teme a Deus!",
          checklist: [
            { text: "Falar sempre a verdade para o papai e para a mamãe", checked: false },
            { text: "Pedir perdão quando errar ou machucar alguém", checked: false }
          ],
          exercisePrompt: "Como a criança se sente quando fala a verdade e deixa o coração limpinho?",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "chapter",
          kicker: "MISSÃO 4 • ORDEM E GENEROSIDADE",
          title: "Cuidando do Nosso Lar e Compartilhando com Amor",
          subtitle: "Quem cuida do que tem e reparte com alegria parece com Jesus!",
          verseText: "E não vos esqueçais da beneficência e comunicação, porque com tais sacrifícios Deus se agrada.",
          verseRef: "Hebreus 13:16",
          paragraphs: [
            "Depois de uma tarde inteira brincando com a Estante Bíblica e os jogos da DaviLiz, o quarto estava cheio de peças espalhadas.",
            "Davi e Liz fizeram uma competição divertida com música: quem guardasse os brinquedos na caixa com mais capricho ganhava o selo de Guardião da Ordem!",
            "Além disso, eles separaram um brinquedo muito especial em bom estado para abençoar outra criança. Repartir multiplica a alegria!"
          ],
          calloutTitle: "🧸 Missão Ordem & Generosidade",
          calloutText: "Tudo o que temos foi dado por Deus. Quando cuidamos dos nossos brinquedos e compartilhamos com os irmãos e amigos, mostramos o amor de Jesus!",
          checklist: [
            { text: "Guardar todos os brinquedos após terminar de brincar", checked: false },
            { text: "Dividir brinquedos e lanches com os irmãos ou amigos sem brigar", checked: false }
          ],
          exercisePrompt: "Qual atitude de generosidade ou organização a criança realizou hoje?",
          userResponse: ""
        },
        {
          pageNumber: 7,
          type: "exercise",
          kicker: "QUADRO DO PLAYBOOK • SEMANA DE ESTRELAS",
          title: "Nosso Mural de Atitudes da Semana",
          subtitle: "Marque com a criança cada vitória conquistada em família!",
          verseText: "E crescia Jesus em sabedoria, e em estatura, e em graça para com Deus e os homens.",
          verseRef: "Lucas 2:52",
          paragraphs: [
            "Assim como o menino Jesus crescia em sabedoria e graça, cada boa escolha planta uma semente eterna no coração das nossas crianças.",
            "Marque os itens abaixo junto com seu filho(a) e comemore cada avanço com palavras de bênção!"
          ],
          calloutTitle: "🌟 Checklist da Família Campeã",
          calloutText: "Clique nas caixinhas abaixo conforme a criança completar os desafios:",
          checklist: [
            { text: "⭐ Obedeceu aos pais com alegria (Efésios 6:1)", checked: true },
            { text: "⭐ Agradeceu a Deus pelo dia e pelo alimento (1 Tessalonicenses 5:18)", checked: true },
            { text: "⭐ Falou a verdade com amor (Efésios 4:25)", checked: false },
            { text: "⭐ Guardou os brinquedos e ajudou em casa (1 Coríntios 14:40)", checked: false },
            { text: "⭐ Fez o momento devocional cantando um versículo", checked: false }
          ],
          exercisePrompt: "Nome da Criança e a maior vitória de atitude desta semana:",
          userResponse: ""
        },
        {
          pageNumber: 8,
          type: "certificate",
          kicker: "CERTIFICADO OFICIAL • CLUBE DAVILIZ",
          title: "Certificado de Coração Sábio e Obediente",
          subtitle: "Concedido com amor por Gisele Lourenço & Clube DaviLiz",
          verseText: "Guarda o teu coração, porque dele procedem as fontes da vida.",
          verseRef: "Provérbios 4:23",
          paragraphs: [
            "Declaramos que esta criança especial está aprendendo a andar nos caminhos do Senhor com alegria, obediência, gratidão, verdade e generosidade, ao lado do Davi e da Liz!",
            "Oração dos Pais sobre o Filho(a): 'Senhor Jesus, abençoamos a vida, a mente e o futuro do nosso filho(a). Que a Tua Palavra seja sempre lâmpada para os seus pés e luz para o seu caminho. Amém!'"
          ],
          calloutTitle: "🎉 Parabéns por Completar o Playbook!",
          calloutText: "Vá até a aba 'Mundo Davi e Liz' para somar mais estrelas e tocar as músicas do Alfabeto Bíblico!",
          exercisePrompt: "Escreva aqui uma bênção especial dos pais para ficar gravada no Playbook da criança:",
          userResponse: ""
        }
      ]
    },
    {
      id: "eb_4",
      title: "Playbook: Florescendo em Meio aos Espinhos da Dor",
      subtitle: "Jornada Guiada de Cura Interior, Superação de Feridas e Propósito para Mulheres",
      author: "Gisele Lourenço",
      category: "Cura Interior & Mulheres",
      accentColor: "purple",
      pages: "6 páginas interativas",
      readingTime: "Leitura & Oração: 20 min",
      audience: "Mulheres & Aconselhamento",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Giseli-Livro-Florescendo.png",
      description: "Playbook de acolhimento e cura emocional para atravessar vales de perda, injustiça ou decepção e florescer em maturidade e fé.",
      contentPreview: "Os espinhos não têm o poder de impedir o propósito que Deus plantou em você. Raízes curadas no secreto geram frutos de consolo e sabedoria.",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK DE CURA INTERIOR • SÉRIE ESPECIAL",
          title: "Florescendo em Meio aos Espinhos da Dor",
          subtitle: "Como transformar estações difíceis em raízes profundas, fé inabalável e testemunho",
          verseText: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
          verseRef: "Salmos 46:1",
          paragraphs: [
            "Existem dores que ninguém vê, lágrimas choradas em silêncio e espinhos que parecem sufocar a esperança. Mas na economia de Deus, nenhuma lágrima é desperdiçada.",
            "Neste Playbook, Gisele Lourenço compartilha chaves bíblicas e terapêuticas para que você não pare no espinho, mas floresça no propósito."
          ],
          calloutTitle: "🌸 Uma Palavra ao Seu Coração",
          calloutText: "O espinho pode ferir a superfície, mas não tem autoridade para secar a fonte da vida de Deus dentro de você."
        },
        {
          pageNumber: 2,
          type: "chapter",
          kicker: "CAPÍTULO 1 • O PROPÓSITO NO VALE",
          title: "Quando os Espinhos Fazem Parte do Jardim",
          subtitle: "Compreendendo o agir de Deus nas estações que não escolhemos",
          verseText: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
          verseRef: "Romanos 8:28",
          paragraphs: [
            "Nem tudo o que enfrentamos na caminhada é bom em si mesmo — traições, perdas, injustiças e rejeições doem profundamente. Porém, Romanos 8:28 nos garante que o Jardineiro Fiel tem poder para fazer até mesmo as estações mais áridas cooperarem para o nosso amadurecimento.",
            "Quando entregamos a nossa dor no altar, em vez de nos fecharmos no cinismo ou na amargura, o vale de lágrimas se transforma em lugar de fontes (Salmos 84:6)."
          ],
          calloutTitle: "💜 Verdade Restauradora",
          calloutText: "Deus não pede que você finja que não está doendo; Ele convida você a chorar nos braços dEle enquanto Ele restaura a sua estrutura.",
          checklist: [
            { text: "Apresentar minha dor a Deus com total honestidade em oração", checked: true },
            { text: "Recusar o isolamento e permitir que a Palavra console minha alma", checked: false }
          ],
          exercisePrompt: "Qual estação difícil você decide entregar hoje aos cuidados do Jardineiro Fiel?",
          userResponse: ""
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "CAPÍTULO 2 • O PROCESSO DA PODA",
          title: "A Diferença Entre Ferida que Destrói e Poda que Fortalece",
          subtitle: "Deixando ir o que já cumpriu seu tempo para abrir espaço ao novo de Deus",
          verseText: "Toda a vara em mim, que não dá fruto, a tira; e limpa toda aquela que dá fruto, para que dê mais fruto.",
          verseRef: "João 15:2",
          paragraphs: [
            "Na agricultura, a poda parece severa aos olhos de quem observa de fora. Galhos verdes são cortados e a árvore parece menor por um tempo.",
            "Contudo, o agricultor poda justamente os ramos que estavam roubando a seiva principal, para que na próxima primavera a árvore floresça com muito mais vigor e doçura.",
            "Confie no caráter de Deus quando Ele retirar apoios falsos ou encerrar ciclos: Ele está concentrando a seiva da graça nas suas raízes eternas."
          ],
          calloutTitle: "🌿 Exercício de Desapego em Fé",
          calloutText: "Não tente colar de volta galhos que o próprio Deus já podou para proteger o seu futuro.",
          checklist: [
            { text: "Confiar no tempo e na soberania de Deus sobre os ciclos da minha vida", checked: false },
            { text: "Olhar para frente com esperança, sabendo que a primavera chegará", checked: false }
          ],
          exercisePrompt: "O que Deus tem ensinado ao seu coração através das podas desta estação?",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "CAPÍTULO 3 • LIBERTAÇÃO DA AMARGURA",
          title: "Arrancando a Raiz de Amargura Antes que Ela Contamine",
          subtitle: "Como proteger o jardim da alma contra o ressentimento",
          verseText: "Tendo cuidado de que ninguém se prive da graça de Deus, e de que nenhuma raiz de amargura, brotando, vos perturbe.",
          verseRef: "Hebreus 12:15",
          paragraphs: [
            "A dor é inevitável em um mundo caído, mas a amargura é uma escolha de permanência. Quando ruminamos continuamente uma injustiça sofrida, entregamos as chaves da nossa paz emocional a quem nos feriu.",
            "O perdão bíblico não absolve o erro alheio; ele liberta a sua própria alma do cárcere e transfere a causa para o Justo Juiz."
          ],
          calloutTitle: "🕊️ Chave de Cura Interior",
          calloutText: "Você sabe que uma ferida virou cicatriz curada quando consegue lembrar do episódio sem que o seu coração volte a sangrar.",
          checklist: [
            { text: "Entregar toda causa injusta nas mãos do Justo Juiz", checked: false },
            { text: "Abençoar o meu futuro e proteger a pureza do meu coração", checked: false }
          ],
          exercisePrompt: "Escreva uma oração de entrega liberando qualquer peso de mágoa ou decepção:",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "exercise",
          kicker: "CAPÍTULO 4 • CURADAS PARA CURAR",
          title: "Do Vale ao Testemunho que Consola Outras Vidas",
          subtitle: "O Deus de toda consolação transforma sua cicatriz em ministério",
          verseText: "Que nos consola em toda a nossa tribulação, para que também possamos consolar os que estiverem em alguma tribulação.",
          verseRef: "2 Coríntios 1:4",
          paragraphs: [
            "As mulheres mais sábias, acolhedoras e cheias de graça que conhecemos não são aquelas que tiveram uma vida isenta de lutas, mas aquelas que permitiram que Jesus transformasse suas dores em compaixão.",
            "Aquilo que hoje parece um espinho será, amanhã, a autoridade espiritual com a qual você estenderá a mão para levantar seus filhos, amigas e outras mulheres."
          ],
          calloutTitle: "🌸 Mapa do Florescer",
          calloutText: "Marque os frutos que você deseja ver brotando na sua vida neste novo tempo:",
          checklist: [
            { text: "Sabedoria e mansidão para aconselhar dentro de casa", checked: true },
            { text: "Fé inabalável diante de notícias difíceis", checked: false },
            { text: "Alegria restaurada na presença do Senhor", checked: false }
          ],
          exercisePrompt: "De que maneira a vitória que Deus está construindo em você poderá abençoar sua família e outras pessoas?",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "certificate",
          kicker: "ORAÇÃO DE FLORESCIMENTO",
          title: "Declaração de um Novo Tempo",
          subtitle: "Conclusão do Playbook 'Florescendo em Meio aos Espinhos da Dor'",
          verseText: "Os que semeiam em lágrimas segarão com alegria.",
          verseRef: "Salmos 126:5",
          paragraphs: [
            "'Senhor, eu creio que os espinhos desta estação não são o ponto final da minha história. Recebo o Teu bálsamo sobre as minhas memórias, entrego toda dor aos Teus pés e declaro que florescerei em graça, sabedoria, saúde emocional e propósito. Em nome de Jesus, amém!'"
          ],
          calloutTitle: "✨ Continue Sua Jornada",
          calloutText: "Ouça também o Audiobook completo de 'Florescendo em Meio aos Espinhos da Dor' com narração em Português do Brasil!",
          exercisePrompt: "Registre sua frase de fé e gratidão ao concluir este Playbook:",
          userResponse: ""
        }
      ]
    },
    {
      id: "eb_5",
      title: "Playbook: O Evangelho para Bebês & Primeira Infância",
      subtitle: "Guia Devocional Sensorial, Afetivo e Musical para Pais com Filhos de 0 a 4 Anos",
      author: "Gisele Lourenço (DaviLiz Brinquedos)",
      category: "Primeira Infância (0 a 4 anos)",
      accentColor: "sky",
      pages: "6 páginas interativas",
      readingTime: "Devocional Afetivo: 10 min",
      audience: "Bebês, Gestantes & Primeira Infância",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Devocional-Evangelho-para-Bebes-08-Gisele-11fev26-300x300.jpg",
      description: "Playbook interativo terno e acolhedor para plantar a semente da Palavra de Deus desde o ventre e nos primeiros anos de vida com afeto, música e oração.",
      contentPreview: "Desde pequenininho, o Senhor planejou cada detalhe da sua vida com amor eterno (Salmos 139:14).",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK PRIMEIRA INFÂNCIA • 0 A 4 ANOS",
          title: "O Evangelho para Bebês",
          subtitle: "Plantando Verdades Eternas com Ternura, Toque, Voz e Oração nos Primeiros Anos",
          verseText: "Deixai vir os pequeninos a mim e não os impeçais, porque dos tais é o Reino de Deus.",
          verseRef: "Marcos 10:14",
          paragraphs: [
            "Muitos pais se perguntam: 'Quando devo começar a falar de Jesus para o meu bebê?'. A neurociência do desenvolvimento infantil mostra que, desde o ventre e nos primeiros meses de vida, o bebê absorve a melodia da voz, a paz do ambiente e a segurança do vínculo afetivo.",
            "Este Playbook guia você a transformar o banho, a amamentação e a hora do sono em santuários de bênção!"
          ],
          calloutTitle: "👶 Neurociência & Fé na Primeira Infância",
          calloutText: "Nos primeiros 1.000 dias de vida, o cérebro infantil forma milhões de conexões por segundo. Associar o nome de Jesus ao colo quente e seguro dos pais cria uma memória afetiva para toda a vida."
        },
        {
          pageNumber: 2,
          type: "chapter",
          kicker: "DIA 1 • IDENTIDADE E CRIAÇÃO",
          title: "Deus Criou Você com Amor Perfeito",
          subtitle: "Declarando propósito sobre cada detalhe do seu bebê",
          verseText: "Eu te louvarei, porque de um modo terrível e tão maravilhoso fui formado.",
          verseRef: "Salmos 139:14",
          paragraphs: [
            "Enquanto segura seu bebê no colo ou acaricia suas mãozinhas, olhe nos olhos dele e diga com voz suave e pausada: 'O Papai do Céu desenhou seus olhinhos, seu sorriso e a sua vida com um amor que nunca acaba!'.",
            "Crianças pequenas compreendem a linguagem do toque, do sorriso e da cadência calma muito antes de dominarem conceitos abstratos."
          ],
          calloutTitle: "🤱 Gesto Sensorial do Dia",
          calloutText: "Toque suavemente a cabecinha, as mãozinhas e os pezinhos do bebê abençoando cada parte para andar nos caminhos do Senhor.",
          checklist: [
            { text: "Falar o Salmo 139:14 olhando nos olhos do bebê", checked: true },
            { text: "Abençoar as mãozinhas e os pezinhos na troca ou no banho", checked: false }
          ],
          exercisePrompt: "Registre aqui o nome do seu bebê e uma lembrança especial deste momento devocional:",
          userResponse: ""
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "DIA 2 • JESUS, NOSSO AMIGO FIEL",
          title: "Jesus Ama e Abraça as Crianças",
          subtitle: "Apresentando o Salvador como a presença mais doce e segura do lar",
          verseText: "E, tomando-as nos seus braços, e impondo-lhes as mãos, as abençoava.",
          verseRef: "Marcos 10:16",
          paragraphs: [
            "Quando os discípulos acharam que as crianças pequenas eram novas demais para estar perto de Jesus, o Mestre os corrigiu imediatamente, tomou os pequeninos no colo e os abençoou.",
            "Conte ao seu bebê hoje: 'Jesus é o melhor amigo da nossa família. Ele cuida do seu soninho, guarda os seus passos e ama ouvir a sua voz!'"
          ],
          calloutTitle: "🎵 Momento de Canção Suave",
          calloutText: "Cante um louvor curtinho ou use o player de narração deste Playbook para que o bebê associe a Palavra à tranquilidade.",
          checklist: [
            { text: "Cantar um louvor suave com o bebê no colo", checked: false },
            { text: "Orar impondo as mãos com ternura sobre a criança", checked: false }
          ],
          exercisePrompt: "Qual louvor ou versículo mais acalma o coração do seu pequenino(a)?",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "DIA 3 • PROTEÇÃO NA HORA DO SONO",
          title: "Dormindo em Paz Debaixo das Asas do Senhor",
          subtitle: "Criando um ritual noturno de paz espiritual no quarto do bebê",
          verseText: "Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes habitar em segurança.",
          verseRef: "Salmos 4:8",
          paragraphs: [
            "A hora de dormir é o momento em que o cérebro infantil consolida memórias e emoções do dia. Reduza as luzes, desligue telas e faça do quarto um ambiente de paz.",
            "Declare Salmos 4:8 e Salmos 91 sobre o berço ou a caminha, expulsando todo medo ou agitação e convidando a paz do Espírito Santo."
          ],
          calloutTitle: "🌙 Ritual de 3 Minutos antes de Dormir",
          calloutText: "1. Abraço aconchegante • 2. Agradecimento por 2 bênçãos do dia • 3. Versículo Salmos 4:8 sussurrado com amor.",
          checklist: [
            { text: "Realizar a oração da noite no quarto com luz suave", checked: false },
            { text: "Declarar Salmos 4:8 sobre o sono da criança", checked: false }
          ],
          exercisePrompt: "Escreva a oração noturna que sua família costuma fazer na hora do sono:",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "exercise",
          kicker: "GUIA PRÁTICO • ROTINA SENSORIAL BÍBLICA",
          title: "4 Momentos do Dia para Semear a Palavra",
          subtitle: "Intencionalidade sem peso: discipulado natural na rotina com o bebê",
          verseText: "E as intimarás a teus filhos e delas falarás assentado em tua casa, e andando pelo caminho, e deitando-te, e levantando-te.",
          verseRef: "Deuteronômio 6:7",
          paragraphs: [
            "• Ao Acordar: 'Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele!' (Salmos 118:24).\n• Na Hora da Papinha/Amamentação: 'Bom é render graças ao Senhor!' (Salmos 92:1).\n• Na Hora de Brincar no Tapete: Mostrar figuras bíblicas e letras do Alfabeto Musicado.\n• Ao Deitar: 'O Senhor te abençoe e te guarde' (Números 6:24)."
          ],
          calloutTitle: "💛 Constância com Leveza",
          calloutText: "Não se cobre perfeição; 2 minutos de afeto intencional com a Palavra todos os dias constroem alicerces eternos!",
          checklist: [
            { text: "Versículo da manhã ao abrir a janela com o bebê", checked: false },
            { text: "Oração curtinha de gratidão antes das refeições", checked: false },
            { text: "Bênção sacerdotal (Números 6:24-26) ao dormir", checked: false }
          ],
          exercisePrompt: "Qual desses 4 momentos da rotina você vai tornar sagrado a partir de hoje?",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "certificate",
          kicker: "BÊNÇÃO SACERDOTAL DOS PAIS",
          title: "Aliança de Discipulado desde o Berço",
          subtitle: "Encerramento do Playbook 'O Evangelho para Bebês'",
          verseText: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te dê a paz.",
          verseRef: "Números 6:24-26",
          paragraphs: [
            "Que cada página folheada neste Playbook lembre a sua família de que nenhuma semente plantada com oração nos primeiros anos de vida volta vazia!"
          ],
          calloutTitle: "🧸 Conheça o Livro Físico na Loja VIP",
          calloutText: "O livro físico 'O Evangelho para Bebês' e o 'Mudando as Atitudes Maternal (2 a 4 anos)' estão disponíveis na Loja VIP com desconto de assinante!",
          exercisePrompt: "Dedique aqui uma carta ou oração para o seu filho(a) ler quando crescer:",
          userResponse: ""
        }
      ]
    },
    {
      id: "eb_6",
      title: "Playbook do Educador: Ensinando Verdades Eternas Brincando",
      subtitle: "Manual Pedagógico, Roteiros de Aula, Estante Bíblica & Dinâmicas para Pais, Células e Ministério Infantil",
      author: "Gisele Lourenço (DaviLiz Brinquedos)",
      category: "Ministério Infantil & Educadores",
      accentColor: "emerald",
      pages: "6 páginas interativas",
      readingTime: "Planejamento Pedagógico: 20 min",
      audience: "Professores EBD, Líderes & Pais",
      coverUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-Maternal-2a4-anos-01-600x600.jpg",
      description: "Playbook completo para educadores cristãos e pais: como aplicar a ludicidade, a Estante Bíblica e o método DaviLiz para gravar a Palavra no coração das crianças.",
      contentPreview: "Quando a criança brinca com propósito bíblico, a verdade deixa de ser apenas informação na mente e se torna afeto e prática no coração.",
      bookPages: [
        {
          pageNumber: 1,
          type: "cover",
          kicker: "PLAYBOOK PEDAGÓGICO • MÉTODO DAVILIZ",
          title: "Ensinando Verdades Eternas Brincando",
          subtitle: "Guia Prático de Neurociência da Aprendizagem Infantil, Dinâmicas Visuais e Roteiros de Aula",
          verseText: "Examinai tudo. Retende o bem.",
          verseRef: "1 Tessalonicenses 5:21",
          paragraphs: [
            "Educar cristãmente uma criança não é apenas mantê-la quieta durante o culto, mas acender em seu coração o encantamento pela pessoa de Deus e pela Sua Palavra.",
            "Neste Playbook profissional, Gisele Lourenço reúne mais de 15 anos de experiência no Ministério Infantil e na criação da DaviLiz Brinquedos."
          ],
          calloutTitle: "👩‍🏫 Para Pais, Professores de EBD e Células Kids",
          calloutText: "Use este Playbook diretamente no seu celular, tablet ou PC durante o preparo da aula ou no momento do ensino!"
        },
        {
          pageNumber: 2,
          type: "chapter",
          kicker: "FUNDAMENTO 1 • NEUROCIÊNCIA E LUDICIDADE",
          title: "Como o Cérebro da Criança Absorve Princípios Eternos",
          subtitle: "Por que o brincar intencional multiplica a retenção bíblica em até 5 vezes",
          verseText: "Guardo no coração as tuas palavras, para não pecar contra ti.",
          verseRef: "Salmos 119:11",
          paragraphs: [
            "O cérebro infantil aprende através da emoção, da curiosidade sensorial e do movimento. Quando uma aula bíblica usa apenas fala abstrata, a atenção da criança se dispersa em poucos minutos.",
            "Porém, quando integramos elementos visuais (como os personagens Davi e Liz), música (Alfabeto de Versículos) e manuseio concreto (Estante Bíblica), ativamos simultaneamente a memória auditiva, visual e cinestésica!"
          ],
          calloutTitle: "📊 Regra da Atenção por Faixa Etária",
          calloutText: "2 a 4 anos: blocos de 5 a 7 minutos alternando história e música • 5 a 8 anos: blocos de 10 a 12 minutos com desafios práticos • 9 a 12 anos: perguntas investigativas e aplicação real.",
          checklist: [
            { text: "Incluir pelo menos 1 recurso visual/concreto em cada ensino", checked: true },
            { text: "Conectar o versículo a uma atitude prática do dia a dia da criança", checked: false }
          ],
          exercisePrompt: "Qual faixa etária você ensina atualmente e qual é o seu maior desafio pedagógico?",
          userResponse: ""
        },
        {
          pageNumber: 3,
          type: "chapter",
          kicker: "DINÂMICA 1 • ESTANTE BÍBLICA INTERATIVA",
          title: "Explorando as Divisões da Bíblia com as Crianças",
          subtitle: "Transformando a estrutura dos 66 livros em uma jornada de descoberta",
          verseText: "Toda a Escritura é divinamente inspirada, e proveitosa para ensinar, para redarguir, para corrigir, para instruir em justiça.",
          verseRef: "2 Timóteo 3:16",
          paragraphs: [
            "Muitas crianças chegam à adolescência achando que a Bíblia é um livro difícil de localizar. Com o método de cores da Estante Bíblica DaviLiz, até crianças pequenas compreendem a grande história da Redenção!",
            "• Verde (Pentateuco / Lei): Os 5 livros do começo — Criação, Abraão e Moisés!\n• Amarelo (Históricos): A coragem de Josué, Davi, Rute e Ester!\n• Rosa (Poéticos e Sabedoria): Louvores de Salmos e conselhos sábios de Provérbios!\n• Azul (Evangelhos): A vida, os milagres, a cruz e a ressurreição de Jesus!\n• Roxo (Atos, Cartas e Apocalipse): A Igreja crescendo até Jesus voltar!"
          ],
          calloutTitle: "🎲 Jogo Rápido de Sala ou Sala de Estar",
          calloutText: "Diga o nome de um personagem (ex: Moisés, Davi, Jesus ou Paulo) e peça para a criança apontar qual cor da Estante Bíblica conta essa história!",
          checklist: [
            { text: "Apresentar os 5 grupos de cores da Estante Bíblica", checked: false },
            { text: "Fazer o desafio de encontrar um livro de Sabedoria e um Evangelho", checked: false }
          ],
          exercisePrompt: "Anote ideias de como aplicar a dinâmica das cores da Bíblia no seu próximo encontro:",
          userResponse: ""
        },
        {
          pageNumber: 4,
          type: "chapter",
          kicker: "DINÂMICA 2 • ALFABETO DE VERSÍCULOS",
          title: "Memorização Bíblica através da Música e do Ritmo",
          subtitle: "De A a Z guardando a Palavra de Deus para toda a vida",
          verseText: "A palavra de Cristo habite em vós abundantemente, em toda a sabedoria, ensinando-vos e admoestando-vos uns aos outros, com salmos, hinos e cânticos espirituais.",
          verseRef: "Colossenses 3:16",
          paragraphs: [
            "Você se lembra de músicas que aprendeu aos 5 anos de idade? Isso acontece porque a melodia funciona como uma 'cola neural' de longa duração.",
            "Ao ensinar um versículo associado à letra inicial (ex: Letra A — 'Amarás o Senhor teu Deus de todo o teu coração', Mateus 22:37; Letra C — 'Confia no Senhor de todo o teu coração', Provérbios 3:5), a criança constrói um repertório espiritual ao qual o Espírito Santo recorrerá durante toda a vida dela."
          ],
          calloutTitle: "🎵 Dinâmica da Letra Sorteada",
          calloutText: "Sorteie uma letra na roda com as crianças, toque a melodia no aplicativo Clube DaviLiz e criem juntos um gesto corporal para cada palavra do versículo!",
          checklist: [
            { text: "Trabalhar 1 letra do Alfabeto Bíblico por semana", checked: false },
            { text: "Criar gestos simples que representem a ação do versículo", checked: false }
          ],
          exercisePrompt: "Quais letras e versículos você vai trabalhar neste mês com as crianças?",
          userResponse: ""
        },
        {
          pageNumber: 5,
          type: "exercise",
          kicker: "ROTEIRO PRONTO • 40 MINUTOS DE AULA / CULTO INFANTIL",
          title: "Estrutura Completa de Encontro Infantil Transformador",
          subtitle: "Passo a passo testado para manter 100% de engajamento e fruto espiritual",
          verseText: "Portanto, meus amados irmãos, sede firmes e constantes, sempre abundantes na obra do Senhor.",
          verseRef: "1 Coríntios 15:58",
          paragraphs: [
            "1. Acolhimento Afetivo (5 min): Receba cada criança pelo nome olhando na altura dos olhos.\n2. Louvor & Alfabeto Musicado (8 min): Cante o versículo-chave da letra da semana com gestos.\n3. História Bíblica Visual (12 min): Conte a passagem bíblica conectando com uma situação real do Davi e da Liz.\n4. Laboratório da Atitude (10 min): Simulem na prática como agir (ex: como responder obedecendo de primeira ou compartilhando).\n5. Oração de Aplicação e Missão para Casa (5 min): Entregue o desafio semanal do Playbook!"
          ],
          calloutTitle: "✅ Checklist de Preparo do Educador",
          calloutText: "Marque os passos concluídos para a sua próxima aula ou devocional:",
          checklist: [
            { text: "Orei pela vida de cada criança pelo nome antes do encontro", checked: true },
            { text: "Separei o versículo-chave e a história do Davi e da Liz", checked: false },
            { text: "Preparei a pergunta de aplicação prática para a família", checked: false }
          ],
          exercisePrompt: "Escreva aqui o tema, o versículo e o objetivo principal da sua próxima aula ou devocional:",
          userResponse: ""
        },
        {
          pageNumber: 6,
          type: "certificate",
          kicker: "COMISSÃO DO EDUCADOR CRISTÃO",
          title: "Formando a Próxima Geração com Excelência e Amor",
          subtitle: "Conclusão do Playbook Pedagógico — Gisele Lourenço & DaviLiz",
          verseText: "E os que forem sábios resplandecerão como o fulgor do firmamento; e os que a muitos ensinam a justiça, como as estrelas sempre e eternamente.",
          verseRef: "Daniel 12:3",
          paragraphs: [
            "Que o Senhor renove a sua alegria, criatividade e unção ao ensinar os pequeninos! Cada história contada e cada versículo cantado ecoa na eternidade."
          ],
          calloutTitle: "🛍️ Benefício Plano Educador (30% OFF)",
          calloutText: "Líderes e igrejas assinantes do Plano Ministério Infantil contam com 30% OFF nos kits pedagógicos da loja DaviLiz!",
          exercisePrompt: "Seu registro pessoal de missão como educador(a) ou discipulador(a):",
          userResponse: ""
        }
      ]
    }
  ],

  dailyMeditations: [
    {
      id: "med_1",
      dateLabel: "Meditação de Hoje",
      title: "Guardando o Coração em Meio às Pressões do Dia",
      verseText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
      verseRef: "Provérbios 4:23",
      theme: "Cura Emocional & Sabedoria",
      author: "Gisele Lourenço",
      reflection: "Muitas vezes tentamos controlar as circunstâncias ao nosso redor, mas esquecemos de vigiar o território onde a vida realmente acontece: o nosso coração. Guardar o coração à luz da Palavra e da neurociência bíblica significa filtrar pensamentos de amargura, alinhar nossas emoções à verdade de Deus e escolher responder com graça dentro do nosso lar.",
      studyQuestions: [
        "Quais pensamentos ou sentimentos têm roubado a sua paz familiar nesta semana?",
        "De que forma prática você pode demonstrar amor como o outro precisa receber hoje?",
        "Qual verdade bíblica você vai declarar sobre sua casa e seus filhos hoje?"
      ],
      prayer: "Senhor, ajuda-me a guardar o meu coração com sabedoria. Cura minhas reações, renova a minha mente e faz de mim um instrumento de paz e edificação na minha família. Amém.",
      userNotes: "Anotação pessoal: Praticar a escuta atenta com meus filhos hoje à noite antes de dormir."
    },
    {
      id: "med_2",
      dateLabel: "Estudo Devocional • Família",
      title: "Ensinando no Caminho: A Constância no Lar",
      verseText: "Ensina a criança no caminho em que deve andar, e, ainda quando for velho, não se desviará dele.",
      verseRef: "Provérbios 22:6",
      theme: "Discipulado Infantil (DaviLiz)",
      author: "Gisele Lourenço",
      reflection: "O discipulado dos filhos não acontece apenas em momentos formais, mas enquanto brincamos, conversamos à mesa e corrigimos atitudes com amor. A criança aprende verdades eternas quando vê coerência, afeto e intencionalidade nos pais.",
      studyQuestions: [
        "Qual atitude do seu filho precisa ser acolhida e direcionada com princípios bíblicos hoje?",
        "Como transformar 10 minutos do dia de hoje em um momento intencional com seu filho?"
      ],
      prayer: "Pai Celestial, dá-nos sabedoria, paciência e criatividade para ensinar Tua Palavra aos nossos filhos com alegria e constância. Amém.",
      userNotes: ""
    }
  ],

  printables: [
    { id: "pdf_1", playbookId: "eb_3", title: "Playbook Ilustrado: Mudando as Atitudes com Davi e Liz", pages: "8 páginas 3D interativas", age: "2 a 12 anos", downloads: 1240 },
    { id: "pdf_2", playbookId: "eb_5", title: "Playbook Primeira Infância: O Evangelho para Bebês", pages: "6 páginas 3D interativas", age: "0 a 4 anos", downloads: 1390 },
    { id: "pdf_3", playbookId: "eb_6", title: "Playbook Pedagógico: Ensinando Verdades Eternas Brincando", pages: "6 páginas 3D interativas", age: "Pais & Educadores", downloads: 980 },
    { id: "pdf_4", playbookId: "eb_1", title: "Playbook Familiar: A Arte de Relacionar-se (Guia Prático)", pages: "8 páginas 3D interativas", age: "Casais & Família", downloads: 1865 },
    { id: "pdf_5", playbookId: "eb_2", title: "Playbook de Exercícios: O Poder de Se Conhecer", pages: "8 páginas 3D interativas", age: "Pais & Mulheres", downloads: 2150 }
  ],

  shopProducts: [
    {
      id: "prod_1",
      name: "Livro: A Arte de Relacionar-se (Gisele Lourenço)",
      brand: "Gisele Lourenço",
      category: "Livros Adultos",
      regularPrice: 69.90,
      tag: "Pré-Lançamento",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/01/Livro-Arte-de-Relacionarse-02-e1770301847871-600x600.jpg",
      description: "Se você deseja amar não apenas do seu jeito, mas do jeito que o outro precisa ser amado, este livro é para você."
    },
    {
      id: "prod_2",
      name: "Kit Mudando as Atitudes com Davi e Liz (4 a 12 anos)",
      brand: "DaviLiz Brinquedos",
      category: "Brinquedos & Livros Infantis",
      regularPrice: 129.90,
      tag: "Campeão de Vendas",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-4a12-anos-01-600x600.jpg",
      description: "Recurso pedagógico e lúdico completo para trabalhar formação de caráter e princípios bíblicos com as crianças."
    },
    {
      id: "prod_3",
      name: "Livro Mudando as Atitudes com Davi e Liz (Maternal 2 a 4 anos)",
      brand: "DaviLiz Brinquedos",
      category: "Primeira Infância",
      regularPrice: 119.90,
      tag: "Maternal 2 a 4 anos",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Mudando-Atitudes-Davi-Liz-Maternal-2a4-anos-01-600x600.jpg",
      description: "Para ensinar princípios eternos e moldar atitudes desde os primeiros anos de forma visual e interativa."
    },
    {
      id: "prod_4",
      name: "Combo: Livro + Curso O Poder de Se Conhecer",
      brand: "Gisele Lourenço",
      category: "Autoconhecimento",
      regularPrice: 149.90,
      tag: "Combo Especial",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/03/Combo-Livro-e-Crso-Img01-Gisele-05mar26-300x300.png",
      description: "Treinamento profundo e leitura transformadora sobre identidade, temperamentos e cura emocional."
    },
    {
      id: "prod_5",
      name: "Devocional Infantil: O Evangelho para Bebês",
      brand: "DaviLiz Brinquedos",
      category: "Primeira Infância",
      regularPrice: 54.90,
      tag: "0 a 3 anos",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Devocional-Evangelho-para-Bebes-08-Gisele-11fev26-300x300.jpg",
      description: "Verdades eternas adaptadas com ternura para os primeiros anos de vida do seu bebê."
    },
    {
      id: "prod_6",
      name: "Livro: Florescendo em Meio aos Espinhos da Dor",
      brand: "Gisele Lourenço",
      category: "Livros Adultos & Infantil",
      regularPrice: 59.90,
      tag: "Leitura Inspiradora",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Livro-Florescendo-em-Meio-aos-Espinhos-2-300x300.jpeg",
      description: "Superação, fé e consolo para transformar desafios em crescimento emocional e espiritual."
    },
    {
      id: "prod_7",
      name: "Brinquedo Pedagógico: Estante Bíblica (66 Livros & 40 Escritores)",
      brand: "DaviLiz Brinquedos",
      category: "Brinquedos de Valores Eternos",
      regularPrice: 139.90,
      tag: "Loja Oficial DaviLiz",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Brinquedos-01-600x399.jpeg",
      description: "Para a criança aprender brincando os 66 livros da Bíblia, suas divisões e escritores desde a infância."
    },
    {
      id: "prod_8",
      name: "Kit Lúdico: Alfabeto de Versículos Musicados + Árvore dos Frutos do Espírito",
      brand: "DaviLiz Brinquedos",
      category: "Brinquedos de Valores Eternos",
      regularPrice: 159.90,
      tag: "Educação Cristã",
      imageUrl: "https://giselelourenco.com.br/wp-content/uploads/2026/02/Gisele-Lourenco-Brinquedos-02-600x399.jpeg",
      description: "Materiais interativos para memorização bíblica cantada e prática dos frutos do Espírito em família."
    }
  ],

  subscribers: [
    {
      id: "sub_101",
      name: "Ana Paula Mendes",
      email: "anapaula.familia@email.com",
      cpfCnpj: "123.456.789-00",
      planId: "plan_familia",
      planName: "Família Plena (Gisele + DaviLiz)",
      billingType: "PIX",
      value: 69.90,
      cycle: "MONTHLY",
      status: "ACTIVE",
      asaasCustomerId: "cus_000005891234",
      asaasSubscriptionId: "sub_9823419283",
      nextDueDate: "2026-12-16",
      createdAt: "2026-10-16"
    },
    {
      id: "sub_102",
      name: "Pr. Marcos & Juliana Silva (Igreja Batista)",
      email: "ministerioinfantil@igrejabatista.org.br",
      cpfCnpj: "12.345.678/0001-90",
      planId: "plan_educador",
      planName: "Ministério Infantil & Educadores",
      billingType: "CREDIT_CARD",
      value: 119.90,
      cycle: "MONTHLY",
      status: "ACTIVE",
      asaasCustomerId: "cus_000005891235",
      asaasSubscriptionId: "sub_9823419284",
      nextDueDate: "2026-12-05",
      createdAt: "2026-09-05"
    },
    {
      id: "sub_103",
      name: "Camila Rocha Ferreira",
      email: "camila.rocha@email.com",
      cpfCnpj: "987.654.321-11",
      planId: "plan_essencial",
      planName: "Clube DaviLiz Essencial",
      billingType: "BOLETO",
      value: 39.90,
      cycle: "MONTHLY",
      status: "PENDING",
      asaasCustomerId: "cus_000005891236",
      asaasSubscriptionId: "sub_9823419285",
      nextDueDate: "2026-11-20",
      createdAt: "2026-11-15"
    }
  ],

  webhookLogs: [
    {
      id: "evt_01",
      timestamp: "2026-11-16 21:14:02",
      event: "PAYMENT_CONFIRMED",
      subscriptionId: "sub_9823419283",
      customerName: "Ana Paula Mendes",
      billingType: "PIX",
      amount: 69.90,
      actionTaken: "Acesso Família Plena liberado + Cupom VIP 20% ativado"
    },
    {
      id: "evt_02",
      timestamp: "2026-11-15 16:40:19",
      event: "SUBSCRIPTION_CREATED",
      subscriptionId: "sub_9823419285",
      customerName: "Camila Rocha Ferreira",
      billingType: "BOLETO",
      amount: 39.90,
      actionTaken: "Aguardando compensação do boleto / PIX"
    }
  ]
};

module.exports = { initialData };
