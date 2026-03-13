

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


export interface Event {
  id: string;
  artistId: string;
  name: string;
  date: string;
  location: string;
  imageUrl: string;
  ticketPrice: number;
  isExclusive: boolean;
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
  plans: Plan[];
  fanPoints?: number; // Optional as it's for subscribed fans
}

export enum Section {
    TIMELINE = 'timeline',
    MEDIA = 'media',
    FAN_AREA = 'fan_area',
    STORE = 'store',
    PROFILE = 'profile'
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
export interface PaymentRecord {
  id: string;
  date: string;
  planName: PlanType;
  amount: number;
  status: 'Pago';
  invoiceUrl: string; // Para simular download
  items: {
    description: string;
    amount: number;
  }[];
  paymentMethod: string;
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
    endTime: string; // ISO 8601 string for easier date parsing
    bids: Bid[];
    highestBidderName?: string;
}

// Tipos para Gamificação e Recompensas
export enum RewardType {
    SWEEPSTAKE = 'SWEEPSTAKE', // Sorteio para os N melhores fãs
    PRIZE = 'PRIZE',           // Recompensa direta para os N melhores fãs
    OFFER = 'OFFER',           // Oferta para fãs com >= X pontos
}

export interface ExclusiveReward {
    id: string;
    artistId: string;
    type: RewardType;
    title: string;
    description: string;
    imageUrl: string;
    eligibility: {
        rank?: number;   // Para SWEEPSTAKE e PRIZE (ex: Top 100)
        points?: number; // Para OFFER (ex: 15000+ pontos)
    };
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
  source: string; // Canal do Youtube ou Artista no Spotify
  imageUrl: string;
  externalUrl: string;
  duration: string;
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