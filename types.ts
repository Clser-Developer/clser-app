
export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  POLL = 'POLL',
}

export interface PostLink {
  text: string;
  targetSection: Section;
  targetSubSection?: StoreSection | FanAreaSection;
  targetItemId?: string;
}

export interface Post {
  id: string;
  artistId: string;
  type: PostType;
  text: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  pollOptions?: string[];
  pollVotes?: number[];
  userVotedOptionIndex?: number | null;
  link?: PostLink;
}

export interface ColorOption {
    name: string;
    hex?: string;
    imageUrls: string[];
}

export interface MerchItem {
  id: string;
  artistId: string;
  name: string;
  price: number;
  description?: string;
  isOnSale?: boolean;
  originalPrice?: number;
  imageUrls: string[];
  sizes: string[];
  colors?: ColorOption[];
  isDigital?: boolean;
  tag?: string;
}

export interface CartItem extends MerchItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface TicketTier {
    name: string;
    price: number;
}

export interface TicketSelection {
    tier: TicketTier;
    quantity: number;
}

export enum EventStatus {
    AVAILABLE = 'AVAILABLE',
    SOLD_OUT = 'SOLD_OUT',
    PAST = 'PAST',
}

export interface Event {
  id: string;
  artistId: string;
  name: string;
  date: string;
  time: string;
  location: string;
  fullAddress: string;
  imageUrl: string;
  startingPrice: number;
  isExclusive: boolean;
  mapImageUrl?: string;
  ticketTiers: TicketTier[];
  status: EventStatus;
}


export interface PurchasedTicket extends Event {
    purchaseId: string;
    alertSet: boolean;
}

export enum PlanType {
  BASIC = 'Básico',
  FULL_ACCESS = 'Acesso Amplo',
}

export interface Plan {
  type: PlanType;
  price: number;
  benefits: string[];
  includesPPV: boolean;
  level: number;
}

export interface Artist {
  id:string;
  name: string;
  genre: string;
  bio: string;
  profileImageUrl: string;
  coverImageUrl: string;
  plans: Plan[]; // Mantido para compatibilidade, mas agora usado como "Benefícios do Clube"
  fanPoints?: number; 
  cardAnuityPrice?: number; // Preço da anuidade do cartão
}

export enum Section {
    TIMELINE = 'timeline',
    MEDIA = 'media',
    FAN_AREA = 'fan_area',
    STORE = 'store',
    PROFILE = 'profile'
}

// Novos tipos para o App do Artista (Backstage)
export enum ArtistSection {
    DASHBOARD = 'dashboard',
    STUDIO = 'studio',
    COMMUNITY = 'community',
    SALES = 'sales',
    MENU = 'menu'
}

export enum StoreSection {
  HOME = 'home',
  MERCH = 'merch',
  AUCTIONS = 'auctions',
  CROWDFUNDING = 'crowdfunding',
  TICKETS = 'tickets',
  EXPERIENCES = 'experiences',
  PPV = 'ppv',
  MY_PURCHASES = 'my_purchases',
}

export enum FanAreaSection {
  HOME = 'home',
  MURAL = 'mural',
  LEADERBOARD = 'leaderboard',
  GROUPS = 'groups',
  POLLS = 'polls',
  REWARDS = 'rewards',
  FAN_ART = 'fan_art',
}

// Tipos para Pedidos
export enum OrderStatus {
    PROCESSING = 'PROCESSANDO',
    SHIPPED = 'ENVIADO',
    DELIVERED = 'ENTREGUE',
}

export interface OrderItem extends CartItem {}

export interface TrackingEvent {
    date: string;
    status: string;
    location: string;
}

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    total: number;
    shippingCost: number;
    trackingCode?: string;
    trackingHistory?: TrackingEvent[];
}

// Tipos para Histórico de Pagamento
export enum TransactionType {
    SUBSCRIPTION = 'Anuidade Cartão',
    MERCH = 'Compra de Produto',
    TICKET = 'Compra de Ingresso',
    DONATION = 'Doação',
    AUCTION = 'Lance em Leilão',
    EXPERIENCE = 'Compra de Experiência',
    PPV = 'Conteúdo Pay-per-view'
}

export interface PaymentRecord {
  id: string;
  date: string;
  type: TransactionType;
  title: string;
  amount: number;
  status: 'Pago' | 'Pendente';
  invoiceUrl: string; 
  items: {
    description: string;
    amount: number;
  }[];
  paymentMethod: string;
  planName?: PlanType; 
}


// Tipos para Gamificação
export interface FanLevel {
    name: string;
    minPoints: number;
    nextLevelPoints: number | null;
    color: string;
}

export interface FanProfile {
  id: string;
  name: string;
  profileImageUrl: string;
  fanPoints: number;
  level: string;
  isCurrentUser?: boolean;
  memberSince: string;
  stats: {
    likes: number;
    comments: number;
    storePurchases: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorImageUrl: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

// Tipos para Leilões
export interface Bid {
    bidderName: string;
    amount: number;
    timestamp: string;
}

export interface AuctionItem {
    id: string;
    artistId: string;
    name: string;
    description: string;
    imageUrl: string;
    startingPrice: number;
    currentBid: number;
    bidIncrement: number;
    endTime: string; 
    bids: Bid[];
    highestBidderName?: string;
}

// Tipos para Gamificação e Recompensas
export enum RewardType {
    SWEEPSTAKE = 'SWEEPSTAKE', 
    PRIZE = 'PRIZE',           
    OFFER = 'OFFER',           
}

export interface ExclusiveReward {
    id: string;
    artistId: string;
    type: RewardType;
    title: string;
    description: string;
    imageUrl: string;
    eligibility: {
        rank?: number;   
        points?: number; 
    };
}

// Tipos para Mural
export interface MuralPost {
  id: string;
  artistId: string;
  imageUrl: string;
  fanName: string;
  fanAvatarUrl: string;
  caption: string;
  likes: number;
  timestamp: string; 
}

// Tipos para Galeria de Arte
export interface FanArtPost {
  id: string;
  artistId: string;
  imageUrl: string;
  fanName: string;
  fanAvatarUrl: string;
  caption: string;
  likes: number;
  timestamp: string; 
}


// Tipos para Mídia
export enum MediaType {
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export enum MediaPlatform {
  YOUTUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY',
}

export interface MediaItem {
  id: string;
  artistId: string;
  platform: MediaPlatform;
  type: MediaType;
  title: string;
  source: string; 
  imageUrl: string;
  externalUrl: string;
  duration: string;
  isPPV?: boolean; // Novo campo para Pay Per View
  price?: number; // Preço se for PPV
}

// Tipos para Central de Ajuda
export interface FAQ {
  question: string;
  answer: string;
}

export interface HelpTopic {
  title: string;
  videoTutorialUrl: string;
  faqs: FAQ[];
}

// Tipos para Vaquinha (Crowdfunding)
export interface VaquinhaCampaign {
  id: string;
  artistId: string;
  title: string;
  description: string;
  imageUrl: string;
  goalAmount: number;
  currentAmount: number;
  supporterCount: number;
  endDate?: string; 
}

// Tipos para Grupos de Fãs
export interface ChatMessage {
  id: string;
  authorName: string;
  authorImageUrl: string;
  text: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export interface FanGroup {
  id: string;
  artistId: string;
  eventId: string; 
  eventName: string;
  name: string;
  description: string;
  memberCount: number;
  coverImageUrl: string;
  messages: ChatMessage[];
}

// Tipos para Experiências
export interface ExperienceItem {
    id: string;
    artistId: string;
    name: string;
    description: string;
    longDescription?: string;
    imageUrl: string;
    price: number;
    participantLimit: number;
    participantsJoined: number;
    format: 'Online (via App)' | 'Presencial';
    duration: string;
    rules: string[];
    eventDate: string;
    eventTime: string;
    location: string;
}

export interface PurchasedExperience extends ExperienceItem {
    purchaseId: string;
}

// Tipos para Dados do Usuário
export interface UserAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserPhone {
  ddi: string;
  number: string;
}

export interface UserDemographics {
    birthDate: string;
    city: string;
    gender: 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não dizer' | '';
}