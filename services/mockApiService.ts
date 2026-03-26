

import { Artist, Post, PostType, MerchItem, Event, Plan, PlanType, FanProfile, Comment, AuctionItem, ExclusiveReward, RewardType, MediaItem, MediaType, MediaPlatform, Section, StoreSection, FanAreaSection, PaymentRecord, EventStatus, MuralPost, FanArtPost, VaquinhaCampaign, TransactionType, FanGroup, ExperienceItem } from '../types';
import { getFanLevel } from './gamificationService';

const artists: Artist[] = [
  {
    id: 'lia',
    name: 'Charles',
    genre: 'Brazilian Pop',
    bio: 'Charles é um cantor e compositor brasileiro de música pop, que mescla batidas eletrônicas com violão clássico, variando desde sons que lembram os MPBs modernos, até acústicos que animam as festas pelo Brasil afora. Suas letras são poesias de amor e de felicidade, sempre com a melhor vibe.',
    profileImageUrl: 'https://i.ibb.co/kVrBxB3N/charles-foto-whisk-perfil-icon-final.png',
    coverImageUrl: 'https://i.ibb.co/LXffDkNN/foto-2.png',
    plans: [
        { type: PlanType.BASIC, price: 19.90, benefits: ['Acesso ao feed exclusivo', 'Mural de fãs', 'Acesso à loja oficial'], includesPPV: false, level: 1 },
        { type: PlanType.FULL_ACCESS, price: 39.90, benefits: ['Tudo do Básico', '+ Acesso a Lives (conteúdo ao vivo)', '+ Participações em sorteios especiais'], includesPPV: false, level: 2 },
    ],
    fanPoints: 12500,
  },
  {
    id: 'kai',
    name: 'KAI',
    genre: 'Lo-fi & Soul',
    bio: 'KAI é um multi-instrumentista conhecido por suas paisagens sonoras relaxantes e batidas lo-fi com alma. Sua música é a trilha sonora perfeita para momentos de introspecção.',
    profileImageUrl: 'https://picsum.photos/seed/kai-profile/200/200',
    coverImageUrl: 'https://picsum.photos/seed/kai-cover/1200/600',
    plans: [
        { type: PlanType.BASIC, price: 24.90, benefits: ['Acesso ao feed exclusivo', 'Mural de fãs', 'Descontos em Merch'], includesPPV: false, level: 1 },
        { type: PlanType.FULL_ACCESS, price: 49.90, benefits: ['Tudo do Básico', 'Acesso a Lives (PPV)', 'Sessões de Q&A exclusivas'], includesPPV: true, level: 2 },
    ],
    fanPoints: 8750,
  },
  {
    id: 'aurora',
    name: 'AURORA',
    genre: 'Art Pop, Electropop',
    bio: 'AURORA é uma artista norueguesa conhecida por sua música etérea e performances cativantes. Suas canções exploram temas da natureza, espiritualidade e emoções humanas.',
    profileImageUrl: 'https://i.ibb.co/PZ2zxLkZ/aurora.png',
    coverImageUrl: 'https://i.ibb.co/PZ2zxLkZ/aurora.png',
    plans: [
        { type: PlanType.BASIC, price: 22.90, benefits: ['Acesso ao feed exclusivo', 'Mural de fãs', 'Acesso antecipado a clipes'], includesPPV: false, level: 1 },
        { type: PlanType.FULL_ACCESS, price: 44.90, benefits: ['Tudo do Básico', 'Acesso a Lives (PPV)', 'Documentários de bastidores'], includesPPV: true, level: 2 },
    ],
    fanPoints: 7200,
  },
];

const posts: Post[] = [
    { 
        id: 'p9', 
        artistId: 'lia', 
        type: PostType.TEXT, 
        text: 'Tem sorteio novo, galera! Participe e concorra a uma viagem comigo para Brasília, para assistir do palco o meu próximo show. Acesse a Área do Fã para participar!', 
        likes: 5300, 
        comments: 0, 
        timestamp: 'Há 5 minutos',
        link: {
            text: 'Participar do Sorteio',
            targetSection: Section.FAN_AREA,
            targetSubSection: FanAreaSection.REWARDS,
            targetItemId: 'sw3',
        }
    },
     {
        id: 'p16',
        artistId: 'lia',
        type: PostType.IMAGE,
        text: 'Alô, galera de São Paulo! Notícia quentíssima: tem show novo na área! Os ingressos já estão disponíveis. Não vai ficar de fora, né? Garanta já o seu!',
        mediaUrl: 'https://i.ibb.co/5XCRnpPk/Captura-de-Tela-2025-09-17-s-23-00-09.png',
        likes: 4200,
        comments: 0,
        timestamp: 'Há 1 hora',
        link: {
            text: 'Ver Ingressos',
            targetSection: Section.STORE,
            targetSubSection: StoreSection.TICKETS,
            targetItemId: 'e1',
        }
    },
    { 
        id: 'p17', 
        artistId: 'lia', 
        type: PostType.POLL, 
        text: "Alô, Goiânia! Tô montando o setlist pro nosso próximo encontro e quero a ajuda de vocês. Qual combinação não pode faltar?", 
        pollOptions: ['Sonho Real + Estelar', 'Noite Estrelada + Acústico', 'Caminhos + Surpresas', 'Medley das Antigas'], 
        pollVotes: [410, 250, 180, 320],
        userVotedOptionIndex: null, 
        likes: 2200, 
        comments: 0, 
        timestamp: 'Há 45 minutos',
        link: {
            text: 'Votar no setlist',
            targetSection: Section.FAN_AREA,
            targetSubSection: FanAreaSection.POLLS,
            targetItemId: 'p17',
        }
    },
    { id: 'p1', artistId: 'lia', type: PostType.IMAGE, text: 'Bastidores da gravação do novo clipe! Ansiosos?', mediaUrl: 'https://i.ibb.co/4nrRx6wC/foto-1.png', likes: 1200, comments: 2, timestamp: 'Há 2 horas' },
    { id: 'p2', artistId: 'lia', type: PostType.VIDEO, text: 'Uma palhinha da nova música pra vocês ❤️', mediaUrl: 'https://picsum.photos/seed/lia-post2/600/400', likes: 2500, comments: 1, timestamp: 'Há 1 dia' },
    { 
        id: 'p3', 
        artistId: 'lia', 
        type: PostType.POLL, 
        text: 'Qual música não pode faltar no próximo show?', 
        pollOptions: ['Sonho Real', 'Noite Estrelada', 'Caminhos', 'Outra (comente!)'], 
        pollVotes: [150, 300, 250, 100], 
        userVotedOptionIndex: null, 
        likes: 800, 
        comments: 0, 
        timestamp: 'Há 2 dias',
        link: {
            text: 'Ver e votar na enquete',
            targetSection: Section.FAN_AREA,
            targetSubSection: FanAreaSection.POLLS,
            targetItemId: 'p3',
        }
    },
    { id: 'p10', artistId: 'lia', type: PostType.IMAGE, text: 'Pausa pro sorvete pra recarregar as energias! Qual o sabor preferido de vocês? 🍦☀️', mediaUrl: 'https://i.ibb.co/fY9Y9DGq/charles-foto-whisk-sorvete.jpg', likes: 3200, comments: 0, timestamp: 'Há 3 dias'},
    { id: 'p11', artistId: 'lia', type: PostType.IMAGE, text: 'Nada como um dia no campo pra clarear as ideias e compor umas moda nova. A inspiração vem da simplicidade!', mediaUrl: 'https://i.ibb.co/Dfz9J6Rn/charles-foto-whisk-timeline-passeio-no-campo.jpg', likes: 2800, comments: 0, timestamp: 'Há 4 dias'},
    { id: 'p12', artistId: 'lia', type: PostType.IMAGE, text: 'Tbt de uma roda de viola boa demais com os amigos. A música conecta a gente!', mediaUrl: 'https://i.ibb.co/Tx3FY7wc/charles-foto-whisk-timeline-roda-de-viola.jpg', likes: 4100, comments: 0, timestamp: 'Há 5 dias'},
    { id: 'p13', artistId: 'lia', type: PostType.IMAGE, text: 'Momentos antes de subir no palco... a adrenalina e a gratidão por ter vocês do outro lado. 💙 #bastidores', mediaUrl: 'https://i.ibb.co/WpD8Fj4v/charles-foto-whisk-timeline-show-azul-bastidores.jpg', likes: 5500, comments: 0, timestamp: 'Há 6 dias'},
    { id: 'p14', artistId: 'lia', type: PostType.IMAGE, text: 'Essa energia de vocês é o que me move! Obrigado por mais uma noite inesquecível. Quem tava lá?', mediaUrl: 'https://i.ibb.co/VWwJtn8R/charles-foto-whisk-timeline-show-azul-bracos-levantados.jpg', likes: 6200, comments: 0, timestamp: 'Há 1 semana'},
    { id: 'p15', artistId: 'lia', type: PostType.IMAGE, text: 'Saudade de um showzinho mais intimista, voz e violão. Qual música vocês pediriam num formato acústico?', mediaUrl: 'https://i.ibb.co/Z6GkD5Zq/charles-foto-whisk-timeline-show-barzinho-02.jpg', likes: 4800, comments: 0, timestamp: 'Há 1 semana'},
    { id: 'p4', artistId: 'kai', type: PostType.TEXT, text: 'Escrevendo novas letras hoje. O que inspira vocês?', likes: 950, comments: 0, timestamp: 'Há 5 horas' },
    { id: 'p5', artistId: 'kai', type: PostType.IMAGE, text: 'Meu setup de produção. Aqui a mágica acontece.', mediaUrl: 'https://picsum.photos/seed/kai-post1/600/600', likes: 1800, comments: 1, timestamp: 'Há 3 dias' },
    { id: 'p6', artistId: 'aurora', type: PostType.IMAGE, text: 'Encontrei essa pequena criatura na floresta hoje. Um lembrete da magia que nos rodeia ✨', mediaUrl: 'https://i.ibb.co/yQG8d8J/aurora-post1.jpg', likes: 3100, comments: 2, timestamp: 'Há 4 horas' },
    { id: 'p7', artistId: 'aurora', type: PostType.TEXT, text: 'Sentindo a energia das árvores enquanto escrevo novas melodias. A natureza é a minha maior inspiração.', likes: 2500, comments: 0, timestamp: 'Há 1 dia' },
    { id: 'p8', artistId: 'aurora', type: PostType.VIDEO, text: 'Um trecho acústico de "Running with the Wolves" para aquecer a alma de vocês.', mediaUrl: 'https://i.ibb.co/yQG8d8J/aurora-post1.jpg', likes: 4200, comments: 0, timestamp: 'Há 3 dias' },
];

const merch: MerchItem[] = [
    {
        id: 'm-lia-1',
        artistId: 'lia',
        name: 'Boné Turnê Charles Preto',
        description: 'Boné Turnê Charles Preto em tecido 100% algodão com elástico nas bordas e fechamento moderno na parte de trás. Ajustável e com bordado na frente e na lateral.',
        price: 79.90,
        originalPrice: 129.90,
        isOnSale: true,
        tag: 'EDIÇÃO LIMITADA',
        imageUrls: [
            'https://i.ibb.co/JjXYCDHZ/charles-bone-01-hero.png',
            'https://i.ibb.co/rGDgmckm/charles-bone-02-detalhe.png',
            'https://i.ibb.co/Y4v58Rwg/charles-bone-03-pessoa.png'
        ],
        sizes: ['Único'],
    },
    {
        id: 'm-lia-2',
        artistId: 'lia',
        name: 'Camiseta Feminina Charles',
        description: 'Mostre seu amor pelo Charles com esta camiseta exclusiva. Modelagem feminina acinturada, feita com malha 100% algodão para máximo conforto e durabilidade.',
        price: 99.90,
        imageUrls: [
            'https://i.ibb.co/1J9QpFpf/charles-camiseta-01-hero.png',
            'https://i.ibb.co/3yPwhCRV/charles-camiseta-02-mulher.png',
            'https://i.ibb.co/G4Xys6qX/charles-camiseta-03-geral.png',
            'https://i.ibb.co/whY9SrND/charles-camiseta-04-mulher.png'
        ],
        sizes: ['P', 'M', 'G', 'GG'],
    },
    {
        id: 'm-lia-3',
        artistId: 'lia',
        name: 'Camiseta Masculina Charles Legacy',
        description: 'A camiseta Legacy celebra a jornada do Charles. Com corte clássico e estampa de alta qualidade, é a peça perfeita para qualquer fã. Tecido premium 100% algodão.',
        price: 109.90,
        imageUrls: ['https://i.ibb.co/HDfb9fWW/charles-camiseta-legacy-01-hero.png'],
        sizes: ['P', 'M', 'G', 'GG', 'XG'],
    },
    {
        id: 'm-lia-4',
        artistId: 'lia',
        name: 'CD Físico "Sinta a Vibe"',
        description: 'Leve a música do Charles para onde for com a versão física do álbum "Sinta a Vibe". Inclui encarte com letras e fotos exclusivas.',
        price: 39.90,
        imageUrls: [
            'https://i.ibb.co/QvZsw0qB/charles-cd-01-capa.png',
            'https://i.ibb.co/bM8LWL06/charles-cd-02-fundo.png'
        ],
        sizes: [],
    },
    {
        id: 'm-lia-5',
        artistId: 'lia',
        name: 'Moletom Turnê Charles - Sinta a Vibe',
        description: 'Conforto e estilo para os dias mais frios. Este moletom unissex com capuz é perfeito para mostrar seu apoio, com estampa exclusiva da turnê nas costas.',
        price: 249.90,
        imageUrls: ['https://i.ibb.co/gbKVZDtn/charles-moleton-cinza-01-hero.png'], // Default image
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
            {
                name: 'Cinza',
                hex: '#808080',
                imageUrls: [
                    'https://i.ibb.co/gbKVZDtn/charles-moleton-cinza-01-hero.png',
                    'https://i.ibb.co/G48020hm/charles-moleton-cinza-02-costas.png'
                ]
            },
            {
                name: 'Preto',
                hex: '#000000',
                imageUrls: [
                    'https://i.ibb.co/WpGcpd1J/charles-moleton-preto-01-hero.png',
                    'https://i.ibb.co/1tPksXj7/charles-moleton-preto-02-costas-com-imagem.png'
                ]
            }
        ]
    },
    {
        id: 'm-lia-6',
        artistId: 'lia',
        name: 'Protetor de Tela "Sinta a Vibe"',
        description: "Protetor de tela com imagens exclusivas em alta definição da Turne Sinta a Vibe, do Charles. Disponível para iPhone e Android. Fácil instalação, contém manual, para facilitar. Tenha imagens incríveis e boas vibrações toda vez que mexer no seu celular.",
        price: 19.90,
        isDigital: true,
        tag: 'PRODUTO DIGITAL',
        imageUrls: [
            'https://i.ibb.co/qYfQYYCS/charles-protetor-de-tela-01.png',
            'https://i.ibb.co/0Rvc68x8/charles-protetor-de-tela-02-explicacao.png'
        ],
        sizes: [],
    },
    { id: 'm3', artistId: 'kai', name: 'Boné KAI Logo', description: 'Proteja-se do sol com a vibe relaxante de KAI. Ajuste perfeito e logo em relevo.', price: 69.90, imageUrls: ['https://picsum.photos/seed/kai-merch1/400/400'], sizes: ['Único'] },
    { id: 'm4', artistId: 'kai', name: 'Poster Autografado "Vibes"', description: 'Decore seu espaço com a arte do álbum "Vibes". Assinado à mão pelo próprio KAI.', price: 49.90, imageUrls: ['https://picsum.photos/seed/kai-merch2/400/600'], sizes: [] },
];

const events: Event[] = [
    { 
        id: 'e6', 
        artistId: 'lia', 
        name: 'Pocket Show Secreto', 
        date: '05 MAR 2025', 
        time: '22:00',
        location: 'Rio de Janeiro, RJ', 
        fullAddress: 'Blue Note Rio - Av. Atlântica, 1910 - Copacabana, Rio de Janeiro - RJ',
        imageUrl: 'https://i.ibb.co/N1W7XkS/charles-show-rio.png', 
        startingPrice: 500, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/hKz228j/mapa-show-rio.png',
        status: EventStatus.AVAILABLE,
        ticketTiers: [
            { name: 'Ingresso Único', price: 500 },
        ]
    },
    { 
        id: 'e1', 
        artistId: 'lia', 
        name: 'Show de Lançamento "Estelar"', 
        date: '25 ABR 2025', 
        time: '21:00',
        location: 'São Paulo, SP', 
        fullAddress: 'Allianz Parque - Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP',
        imageUrl: 'https://i.ibb.co/5XCRnpPk/Captura-de-Tela-2025-09-17-s-23-00-09.png', 
        startingPrice: 150, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/wJMyzSg/mapa-show-sao-paulo.png',
        status: EventStatus.AVAILABLE,
        ticketTiers: [
            { name: 'Pista', price: 150 },
            { name: 'Pista Premium', price: 300 },
            { name: 'Cadeira Inferior', price: 250 },
            { name: 'Cadeira Superior', price: 200 },
        ]
    },
     { 
        id: 'e5', 
        artistId: 'lia', 
        name: 'Acústico "Entre Amigos"', 
        date: '22 MAI 2025', 
        time: '19:00',
        location: 'Belo Horizonte, MG', 
        fullAddress: 'Palácio das Artes - Av. Afonso Pena, 1537 - Centro, Belo Horizonte - MG',
        imageUrl: 'https://i.ibb.co/7YyWbVf/charles-show-bh.png', 
        startingPrice: 120, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/B6cgyLg/mapa-show-bh.png',
        status: EventStatus.AVAILABLE,
        ticketTiers: [
            { name: 'Plateia B', price: 120 },
            { name: 'Plateia A', price: 200 },
            { name: 'Balcão', price: 150 },
        ]
    },
    { 
        id: 'e4', 
        artistId: 'lia', 
        name: 'Turnê "Sinta a Vibe"', 
        date: '10 JUN 2025', 
        time: '20:30',
        location: 'Brasília, DF', 
        fullAddress: 'Arena BRB Mané Garrincha - SRPN - Asa Norte, Brasília - DF',
        imageUrl: 'https://i.ibb.co/zXn2D9g/charles-show-brasilia.png', 
        startingPrice: 180, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/4M4DkC9/mapa-show-brasilia.png',
        status: EventStatus.AVAILABLE,
        ticketTiers: [
            { name: 'Pista', price: 180 },
            { name: 'Pista Premium', price: 350 },
            { name: 'Cadeira Inferior', price: 280 },
            { name: 'Camarote Open Bar', price: 600 },
        ]
    },
    { 
        id: 'e2', 
        artistId: 'lia', 
        name: 'Meet & Greet Exclusivo', 
        date: '26 JUL 2025', 
        time: '18:00',
        location: 'São Paulo, SP', 
        fullAddress: 'Hotel Hilton Morumbi, Sala de Conferências - Av. das Nações Unidas, 12901 - Brooklin, São Paulo - SP',
        imageUrl: 'https://i.ibb.co/5XCRnpPk/Captura-de-Tela-2025-09-17-s-23-00-09.png', 
        startingPrice: 400, 
        isExclusive: true,
        status: EventStatus.SOLD_OUT,
        ticketTiers: [
            { name: 'Ingresso Individual', price: 400 },
            { name: 'Pacote Duplo', price: 700 },
        ]
    },
    { 
        id: 'e3', 
        artistId: 'kai', 
        name: 'Sessão Acústica "Vibes"', 
        date: '15 AGO 2025', 
        time: '20:00',
        location: 'Rio de Janeiro, RJ', 
        fullAddress: 'Circo Voador - R. dos Arcos, s/n - Lapa, Rio de Janeiro - RJ',
        imageUrl: 'https://picsum.photos/seed/kai-event1/800/400', 
        startingPrice: 120, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/wJMyzSg/mapa-show-sao-paulo.png',
        status: EventStatus.AVAILABLE,
        ticketTiers: [
            { name: 'Pista', price: 120 },
            { name: 'Mezanino', price: 180 },
        ]
    },
     { 
        id: 'e7-past', 
        artistId: 'lia', 
        name: 'Show de Encerramento', 
        date: '15 DEZ 2024', 
        time: '20:00',
        location: 'Salvador, BA', 
        fullAddress: 'Concha Acústica do TCA - Praça Dois de Julho - Campo Grande, Salvador - BA',
        imageUrl: 'https://i.ibb.co/nMSJkXB/charles-show-salvador.png', 
        startingPrice: 160, 
        isExclusive: true,
        mapImageUrl: 'https://i.ibb.co/wJMyzSg/mapa-show-sao-paulo.png',
        status: EventStatus.PAST,
        ticketTiers: [
            { name: 'Pista', price: 160 },
            { name: 'Camarote', price: 320 },
        ]
    },
];

const twoDaysFromNow = new Date();
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

const tenMinutesFromNow = new Date();
tenMinutesFromNow.setMinutes(tenMinutesFromNow.getMinutes() + 10);

const auctions: AuctionItem[] = [
    {
        id: 'auc1',
        artistId: 'lia',
        name: 'Guitarra Autografada do Clipe "Estelar"',
        description: 'A guitarra usada por Charles na gravação do clipe oficial de "Estelar". Uma peça única de colecionador, autografada na parte de trás.',
        imageUrl: 'https://i.ibb.co/d3R4865/charles-guitarra-autografada.png',
        startingPrice: 1500,
        currentBid: 2750,
        bidIncrement: 50,
        endTime: twoDaysFromNow.toISOString(),
        highestBidderName: 'StarGazer',
        bids: [
            { bidderName: 'SuperFan99', amount: 2600, timestamp: 'Há 3 horas' },
            { bidderName: 'StarGazer', amount: 2750, timestamp: 'Há 1 hora' },
        ],
    },
    {
        id: 'auc2',
        artistId: 'lia',
        name: 'Letra Manuscrita de "Noite Estrelada"',
        description: 'A letra original da música "Noite Estrelada", escrita à mão por Charles durante o processo criativo do álbum. Inclui anotações e rascunhos.',
        imageUrl: 'https://picsum.photos/seed/lia-auction2/600/600',
        startingPrice: 500,
        currentBid: 800,
        bidIncrement: 25,
        endTime: tenMinutesFromNow.toISOString(),
        highestBidderName: 'MusicLover22',
        bids: [
             { bidderName: 'LyricLover', amount: 750, timestamp: 'Há 45 minutos' },
             { bidderName: 'MusicLover22', amount: 800, timestamp: 'Há 12 minutos' },
        ],
    }
];

const experiences: ExperienceItem[] = [
    {
        id: 'exp1',
        artistId: 'lia',
        name: 'Encontro Virtual com Charles',
        description: 'Converse ao vivo com o Charles em uma chamada de vídeo exclusiva dentro do app.',
        longDescription: 'Uma oportunidade única de conversar ao vivo com o Charles, tirar suas dúvidas e interagir com ele e outros fãs em uma chamada de vídeo exclusiva. A experiência acontece diretamente pelo app, garantindo um ambiente seguro e intimista.',
        imageUrl: 'https://i.ibb.co/DPMZYcBg/live-com-charles.png',
        price: 2000,
        participantLimit: 6,
        participantsJoined: 2,
        format: 'Online (via App)',
        duration: '20 minutos',
        rules: [ "A sala virtual será aberta 5 minutos antes do horário.", "Mantenha seu microfone mutado quando não estiver falando.", "Seja respeitoso com o artista e os outros participantes.", "A gravação da chamada não é permitida.", "O link de acesso será disponibilizado na área de 'Minhas Compras' 1 hora antes." ],
        eventDate: '15 AGO 2025',
        eventTime: '19:00',
        location: 'Online'
    },
    {
        id: 'exp2',
        artistId: 'lia',
        name: 'Show em SP: Palco + Camarote',
        description: 'Assista ao show de São Paulo do palco e tenha acesso exclusivo ao camarim.',
        longDescription: 'Viva a emoção de assistir ao show de São Paulo diretamente do palco, ao lado do Charles e sua banda. Sinta a energia do público de uma perspectiva única! A experiência também inclui acesso exclusivo ao camarim antes do show para fotos e um bate-papo com o artista.',
        imageUrl: 'https://i.ibb.co/5XCRnpPk/Captura-de-Tela-2025-09-17-s-23-00-09.png',
        price: 20000,
        participantLimit: 5,
        participantsJoined: 1,
        format: 'Presencial',
        duration: 'Show completo + 30 min no camarim',
        rules: [ "Válido para o show do dia 25 de Abril de 2025 em São Paulo (Allianz Parque).", "O encontro no camarim acontecerá 1 hora antes do início do show.", "Transporte e hospedagem não inclusos.", "Proibido o uso de celulares com flash durante a apresentação no palco.", "Sujeito a verificação de identidade e idade (+18)." ],
        eventDate: '25 ABR 2025',
        eventTime: '21:00',
        location: 'São Paulo, SP'
    }
];

const fanGroups: FanGroup[] = [
    {
        id: 'fg1',
        artistId: 'lia',
        eventId: 'e1',
        eventName: 'Show de Lançamento "Estelar"',
        name: 'Galera de SP pro show "Estelar"!',
        description: 'Grupo pra galera de São Paulo e região que vai no show de lançamento do álbum "Estelar"! Bora combinar carona, comprar uma van, ou marcar de se encontrar na porta!',
        memberCount: 42,
        coverImageUrl: 'https://i.ibb.co/5XCRnpPk/Captura-de-Tela-2025-09-17-s-23-00-09.png',
        messages: [
            { id: 'm1', authorName: 'Carla S.', authorImageUrl: 'https://picsum.photos/seed/fan-carla/100/100', text: 'E aí, pessoal! Alguém saindo da Zona Sul pra rachar um Uber?', timestamp: 'Há 2 horas' },
            { id: 'm2', authorName: 'Marcos V.', authorImageUrl: 'https://picsum.photos/seed/fan-marcos/100/100', text: 'Opa, eu sou da ZS! Me add aí, Carla!', timestamp: 'Há 1 hora' },
            { id: 'm3', authorName: 'Juliana P.', authorImageUrl: 'https://picsum.photos/seed/fan-juliana/100/100', text: 'Gente, e se a gente fechasse uma van? Se juntar uns 10 já compensa!', timestamp: 'Há 30 minutos' },
        ]
    }
];

const vaquinhaCampaigns: VaquinhaCampaign[] = [
    {
        id: 'vq1',
        artistId: 'lia',
        title: 'Ajude Bogonga do Sul - RS',
        description: 'Nossa cidade irmã, Bogonga do Sul, no Rio Grande do Sul, foi devastada por uma terrível enchente após dias de chuva incessante. Famílias perderam tudo, e a cidade precisa se reerguer. Toda doação, de qualquer valor, faz uma enorme diferença para levar esperança e ajuda para quem mais precisa. Vamos juntos mostrar a força da nossa comunidade!',
        imageUrl: 'https://i.ibb.co/sJV03Csh/chuva-no-sul.png',
        goalAmount: 50000,
        currentAmount: 22540,
        supporterCount: 482,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    }
];

const comments: Comment[] = [
    { id: 'c1', postId: 'p1', authorName: 'MusicLover22', authorImageUrl: 'https://picsum.photos/seed/fan2/100/100', text: 'Não vejo a hora de ouvir o álbum completo!', timestamp: 'Há 1h' },
    { id: 'c2', postId: 'p1', authorName: 'StarGazer', authorImageUrl: 'https://picsum.photos/seed/fan3/100/100', text: 'Essa vibe tá incrível! ✨', timestamp: 'Há 45min' },
    { id: 'c3', postId: 'p2', authorName: 'BeatMaster', authorImageUrl: 'https://picsum.photos/seed/fan4/100/100', text: 'Que melodia viciante!', timestamp: 'Há 20h' },
    { id: 'c4', postId: 'p5', authorName: 'LyricLover', authorImageUrl: 'https://picsum.photos/seed/fan5/100/100', text: 'Amo ver o processo criativo!', timestamp: 'Há 2 dias' },
    { id: 'c5', postId: 'p6', authorName: 'RhythmRider', authorImageUrl: 'https://picsum.photos/seed/fan6/100/100', text: 'Que foto linda! A natureza sempre inspira.', timestamp: 'Há 3h' },
    { id: 'c6', postId: 'p6', authorName: 'SuperFan99', authorImageUrl: 'https://picsum.photos/seed/fan1/100/100', text: 'AURORA, você é mágica!', timestamp: 'Há 1h' },
];

const exclusiveRewards: ExclusiveReward[] = [
    {
        id: 'sw3',
        artistId: 'lia',
        type: RewardType.SWEEPSTAKE,
        title: 'Viagem para Brasília + Acesso ao Palco',
        description: 'Concorra a uma viagem com tudo pago para Brasília e assista ao show do Charles de um lugar privilegiado: o palco!',
        imageUrl: 'https://i.ibb.co/yBXvSRrN/brasilia.png',
        eligibility: { rank: 500 }, // Top 500 fans
    },
    {
        id: 'sw1',
        artistId: 'lia',
        type: RewardType.SWEEPSTAKE,
        title: 'Sorteio: Meet & Greet Virtual',
        description: 'Converse com o Charles em uma chamada de vídeo exclusiva! Apenas para os fãs mais engajados.',
        imageUrl: 'https://picsum.photos/seed/lia-sweep1/600/400',
        eligibility: { rank: 10 }, // Top 10 fans
    },
    {
        id: 'sw2',
        artistId: 'lia',
        type: RewardType.SWEEPSTAKE,
        title: 'Sorteio: Kit Merch Autografado',
        description: 'Ganhe um kit completo com camiseta, moletom e poster, tudo assinado pelo Charles.',
        imageUrl: 'https://picsum.photos/seed/lia-sweep2/600/400',
        eligibility: { rank: 100 }, // Top 100 fans
    },
    {
        id: 'pr1',
        artistId: 'lia',
        type: RewardType.PRIZE,
        title: 'Prêmio: Disco de Vinil Autografado',
        description: 'O fã nº 1 no ranking ao final do mês ganhará uma cópia em vinil do álbum "Estelar", autografada com uma dedicatória especial.',
        imageUrl: 'https://picsum.photos/seed/lia-prize1/600/400',
        eligibility: { rank: 1 }, // Top 1 fan
    },
    {
        id: 'of1',
        artistId: 'lia',
        type: RewardType.OFFER,
        title: 'Oferta: 25% de Desconto na Loja',
        description: 'Como agradecimento por seu apoio, todos os fãs com mais de 15.000 pontos ganham um cupom de 25% de desconto para usar em qualquer item da loja.',
        imageUrl: 'https://picsum.photos/seed/lia-offer1/600/400',
        eligibility: { points: 15000 }, // 15000+ points
    }
];

const mediaItems: MediaItem[] = [
    { id: 'yt1', artistId: 'lia', platform: MediaPlatform.YOUTUBE, type: MediaType.VIDEO, title: 'Clipe Oficial - "Estelar"', source: 'CharlesVEVO', imageUrl: 'https://picsum.photos/seed/lia-yt1/800/450', externalUrl: '#', duration: '3:45' },
    { id: 'yt2', artistId: 'lia', platform: MediaPlatform.YOUTUBE, type: MediaType.VIDEO, title: 'Acústico no Estúdio - "Noite Estrelada"', source: 'CharlesVEVO', imageUrl: 'https://picsum.photos/seed/lia-yt2/800/450', externalUrl: '#', duration: '4:12' },
    { id: 'yt3', artistId: 'lia', platform: MediaPlatform.YOUTUBE, type: MediaType.VIDEO, title: 'Bastidores da Turnê (Episódio 1)', source: 'Canal do Charles', imageUrl: 'https://picsum.photos/seed/lia-yt3/800/450', externalUrl: '#', duration: '12:30' },
    { id: 'sp1', artistId: 'lia', platform: MediaPlatform.SPOTIFY, type: MediaType.AUDIO, title: 'Sonho Real', source: 'Charles', imageUrl: 'https://picsum.photos/seed/lia-sp1/600/600', externalUrl: '#', duration: '3:20' },
    { id: 'sp2', artistId: 'lia', platform: MediaPlatform.SPOTIFY, type: MediaType.AUDIO, title: 'Noite Estrelada', source: 'Charles', imageUrl: 'https://picsum.photos/seed/lia-sp2/600/600', externalUrl: '#', duration: '4:05' },
    { id: 'sp3', artistId: 'lia', platform: MediaPlatform.SPOTIFY, type: MediaType.AUDIO, title: 'Caminhos', source: 'Charles', imageUrl: 'https://picsum.photos/seed/lia-sp3/600/600', externalUrl: '#', duration: '2:58' },
    { id: 'sp4', artistId: 'lia', platform: MediaPlatform.SPOTIFY, type: MediaType.AUDIO, title: 'Amanhecer', source: 'Charles', imageUrl: 'https://picsum.photos/seed/lia-sp4/600/600', externalUrl: '#', duration: '3:41' },
];

const paymentHistory: PaymentRecord[] = [
  {
    id: 'INV-2024-03',
    date: '01/03/2024',
    type: TransactionType.SUBSCRIPTION,
    title: 'Assinatura Fã Clube Charles',
    planName: PlanType.FULL_ACCESS,
    amount: 39.90,
    status: 'Pago',
    invoiceUrl: '#',
    paymentMethod: 'Mastercard **** 1234',
    items: [
      { description: 'Plano Acesso Amplo (Mar/2024)', amount: 39.90 }
    ]
  },
  {
    id: 'INV-2024-02',
    date: '01/02/2024',
    type: TransactionType.SUBSCRIPTION,
    title: 'Assinatura Fã Clube Charles',
    planName: PlanType.FULL_ACCESS,
    amount: 39.90,
    status: 'Pago',
    invoiceUrl: '#',
    paymentMethod: 'Mastercard **** 1234',
    items: [
      { description: 'Plano Acesso Amplo (Fev/2024)', amount: 39.90 }
    ]
  },
  {
    id: 'INV-2024-01',
    date: '01/01/2024',
    type: TransactionType.SUBSCRIPTION,
    title: 'Assinatura Fã Clube Charles',
    planName: PlanType.FULL_ACCESS,
    amount: 39.90,
    status: 'Pago',
    invoiceUrl: '#',
    paymentMethod: 'Mastercard **** 1234',
    items: [
      { description: 'Plano Acesso Amplo (Jan/2024)', amount: 39.90 }
    ]
  }
];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);

const fanNamesForMural = ['SuperFan99', 'MusicLover22', 'StarGazer', 'BeatMaster', 'LyricLover', 'RhythmRider', 'PopPrince', 'IndieSoul', 'GrooveGuru'];

const muralPosts: MuralPost[] = [
    // Today's Posts
    { id: 'mp1', artistId: 'lia', imageUrl: 'https://i.ibb.co/84t1YbHc/charles-fan-01.png', fanName: fanNamesForMural[0], fanAvatarUrl: `https://picsum.photos/seed/fan1/100/100`, caption: 'Sonho realizado em encontrar o Charles!', likes: 152, timestamp: today.toISOString() },
    { id: 'mp2', artistId: 'lia', imageUrl: 'https://i.ibb.co/35pgY1Wc/charles-fan-02.png', fanName: fanNamesForMural[1], fanAvatarUrl: `https://picsum.photos/seed/fan2/100/100`, caption: 'Que show incrível! Energia contagiante!', likes: 230, timestamp: today.toISOString() },
    { id: 'mp3', artistId: 'lia', imageUrl: 'https://i.ibb.co/07fq12c/charles-fan-03.png', fanName: fanNamesForMural[2], fanAvatarUrl: `https://picsum.photos/seed/fan3/100/100`, caption: 'Minha camiseta autografada! Nunca vou lavar haha', likes: 189, timestamp: today.toISOString() },
    // Yesterday's Posts
    { id: 'mp4', artistId: 'lia', imageUrl: 'https://i.ibb.co/Kz5g4xMG/charles-fan-04.png', fanName: fanNamesForMural[3], fanAvatarUrl: `https://picsum.photos/seed/fan4/100/100`, caption: 'O melhor dia da minha vida!', likes: 310, timestamp: yesterday.toISOString() },
    { id: 'mp5', artistId: 'lia', imageUrl: 'https://i.ibb.co/995qpf0x/charles-fan-05.png', fanName: fanNamesForMural[4], fanAvatarUrl: `https://picsum.photos/seed/fan5/100/100`, caption: 'Olha quem eu encontrei no aeroporto!', likes: 450, timestamp: yesterday.toISOString() },
    { id: 'mp6', artistId: 'lia', imageUrl: 'https://i.ibb.co/F4Nyx2Rc/charles-fan-06.png', fanName: fanNamesForMural[5], fanAvatarUrl: `https://picsum.photos/seed/fan6/100/100`, caption: 'Valeu cada segundo de espera na fila.', likes: 280, timestamp: yesterday.toISOString() },
    // Two Days Ago Posts
    { id: 'mp7', artistId: 'lia', imageUrl: 'https://i.ibb.co/v6sHcVjr/charles-fan-07.png', fanName: fanNamesForMural[6], fanAvatarUrl: `https://picsum.photos/seed/fan7/100/100`, caption: 'Simpatia em pessoa!', likes: 521, timestamp: twoDaysAgo.toISOString() },
    { id: 'mp8', artistId: 'lia', imageUrl: 'https://i.ibb.co/hxLC3M7L/charles-fan-08.png', fanName: fanNamesForMural[7], fanAvatarUrl: `https://picsum.photos/seed/fan8/100/100`, caption: 'Ainda sem acreditar nesse momento.', likes: 412, timestamp: twoDaysAgo.toISOString() },
    { id: 'mp9', artistId: 'lia', imageUrl: 'https://i.ibb.co/fYXH2sC7/charles-fan-09.png', fanName: fanNamesForMural[8], fanAvatarUrl: `https://picsum.photos/seed/fan9/100/100`, caption: 'Obrigado pelo carinho, Charles!', likes: 356, timestamp: twoDaysAgo.toISOString() },
];

const fanArtPosts: FanArtPost[] = [
    { 
        id: 'fa1', 
        artistId: 'lia', 
        imageUrl: 'https://i.ibb.co/27Pm6XV2/charles-fan-art.png', 
        fanName: 'ArteDoFã', 
        fanAvatarUrl: `https://picsum.photos/seed/fan-art1/100/100`, 
        caption: 'Fiz a caricatura do meu ídolo.', 
        likes: 123, 
        timestamp: new Date().toISOString() 
    },
];

export const getArtists = (): Promise<Artist[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(artists), 500));
}

export const getArtistById = (id: string): Promise<Artist | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(artists.find(a => a.id === id)), 500));
}

export const getPostsForArtist = (artistId: string): Promise<Post[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(posts.filter(p => p.artistId === artistId)), 500));
}

export const getMuralPosts = (artistId: string): Promise<MuralPost[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(muralPosts.filter(p => p.artistId === artistId)), 500));
}

export const getFanArtPosts = (artistId: string): Promise<FanArtPost[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(fanArtPosts.filter(p => p.artistId === artistId)), 500));
}

export const getMerchForArtist = (artistId: string): Promise<MerchItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(merch.filter(m => m.artistId === artistId)), 500));
}

export const getEventsForArtist = (artistId: string): Promise<Event[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(events.filter(e => e.artistId === artistId)), 500));
}

export const getAuctionsForArtist = (artistId: string): Promise<AuctionItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(auctions.filter(a => a.artistId === artistId)), 500));
}

export const getExperiencesForArtist = (artistId: string): Promise<ExperienceItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(experiences.filter(e => e.artistId === artistId)), 500));
}

export const getFanGroupsForArtist = (artistId: string): Promise<FanGroup[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(fanGroups.filter(fg => fg.artistId === artistId)), 500));
}

export const getVaquinhaCampaignsForArtist = (artistId: string): Promise<VaquinhaCampaign[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(vaquinhaCampaigns.filter(v => v.artistId === artistId)), 500));
}

export const getExclusiveRewardsForArtist = (artistId: string): Promise<ExclusiveReward[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(exclusiveRewards.filter(s => s.artistId === artistId)), 500));
}

export const getMediaForArtist = (artistId: string): Promise<MediaItem[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(mediaItems.filter(m => m.artistId === artistId)), 500));
};

export const getCommentsForPost = (postId: string): Promise<Comment[]> => {
    return new Promise((resolve) => {
        const postComments = comments.filter(c => c.postId === postId);
        setTimeout(() => resolve(postComments), 600);
    });
};

export const getPaymentHistory = (artistId: string): Promise<PaymentRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(paymentHistory), 600);
    });
};

const fanNames = ['SuperFan99', 'MusicLover22', 'StarGazer', 'BeatMaster', 'LyricLover', 'RhythmRider', 'PopPrince', 'IndieSoul', 'GrooveGuru', 'SynthWaveSiren', 'AcousticDreamer', 'RockRebel', 'BassBomber', 'VinylVortex', 'MelodyMaestro'];
// Simula um ranking de fãs
export const getFanLeaderboard = (artistId: string, currentUserPoints: number): Promise<FanProfile[]> => {
    return new Promise((resolve) => {
        const mockFans: FanProfile[] = Array.from({ length: 149 }, (_, i) => {
            const points = Math.floor(Math.random() * (25000 - 1000 + 1)) + 1000;
            const monthsAsFan = Math.floor(Math.random() * 24) + 1;
            return {
                id: `fan-${i + 1}`,
                name: `${fanNames[i % fanNames.length]}${Math.floor(Math.random()*90 + 10)}`,
                profileImageUrl: `https://picsum.photos/seed/fan${i+1}/100/100`,
                fanPoints: points,
                level: getFanLevel(points).name,
                memberSince: `${monthsAsFan} mes${monthsAsFan > 1 ? 'es' : ''} atrás`,
                stats: {
                    likes: Math.floor(Math.random() * 500),
                    comments: Math.floor(Math.random() * 100),
                    storePurchases: Math.floor(Math.random() * 20),
                }
            };
        });

        const currentUserProfile: FanProfile = {
            id: 'current-user',
            name: 'Você',
            profileImageUrl: 'https://picsum.photos/seed/user-profile/100/100',
            fanPoints: currentUserPoints,
            level: getFanLevel(currentUserPoints).name,
            isCurrentUser: true,
            memberSince: '12 meses atrás',
            stats: {
              likes: 256,
              comments: 42,
              storePurchases: 12,
            }
        };

        const leaderboard = [...mockFans, currentUserProfile].sort((a, b) => b.fanPoints - a.fanPoints);
        
        setTimeout(() => resolve(leaderboard), 700);
    });
};