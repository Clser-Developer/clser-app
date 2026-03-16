
import { useState, useEffect } from 'react';
import { Post, MerchItem, AuctionItem, ExclusiveReward, CartItem, Order, OrderStatus, Event, MediaItem, PurchasedTicket, MuralPost, FanArtPost, VaquinhaCampaign, PaymentRecord, FanGroup, ExperienceItem, PurchasedExperience } from '../types';

const mockShippedOrder: Order = {
    id: 'CL-MOCK12345',
    date: '3 dias atrás',
    status: OrderStatus.SHIPPED,
    items: [
        { id: 'm1', artistId: 'lia', name: 'Camiseta "Tour Estelar"', description: 'Leve a energia da turnê Estelar com você.', price: 89.90, imageUrls: ['https://picsum.photos/seed/lia-merch1/400/400'], sizes: ['M'], quantity: 1, isOnSale: false },
        { id: 'm2', artistId: 'lia', name: 'Moletom LIA Signature', description: 'Conforto e estilo para os dias mais frios.', price: 179.90, imageUrls: ['https://picsum.photos/seed/lia-merch2/400/400'], sizes: ['G'], quantity: 1, isOnSale: false }
    ],
    total: 284.80,
    shippingCost: 15.00,
    trackingCode: 'BR123456789XX',
    trackingHistory: [
        { date: 'Ontem, 18:30', status: 'Objeto em trânsito - por favor aguarde', location: 'de Unidade de Tratamento, CURITIBA - PR para Unidade de Distribuição, SAO PAULO - SP' },
        { date: '2 dias atrás, 14:15', status: 'Objeto postado', location: 'Agência dos Correios, CURITIBA - PR' }
    ]
};


const getInitialState = (storageKey: string, artistFanPoints: number) => {
    const savedStateJSON = localStorage.getItem(storageKey);
    if (savedStateJSON) {
        try {
            const savedState = JSON.parse(savedStateJSON);
            const initialFanPoints = savedState.fanPoints !== undefined ? savedState.fanPoints : artistFanPoints;

            return {
                fanPoints: initialFanPoints,
                likedPostIds: new Set<string>(savedState.likedPostIds || []),
                commentedPostIds: new Set<string>(savedState.commentedPostIds || []),
                likedMuralPostIds: new Set<string>(savedState.likedMuralPostIds || []),
                likedFanArtPostIds: new Set<string>(savedState.likedFanArtPostIds || []),
                joinedGroupIds: new Set<string>(savedState.joinedGroupIds || []),
                shoppingCart: savedState.shoppingCart || [],
                orders: savedState.orders || [mockShippedOrder],
                purchasedTickets: savedState.purchasedTickets || [],
                purchasedExperiences: savedState.purchasedExperiences || [],
                posts: savedState.posts || [],
                merch: savedState.merch || [],
                events: savedState.events || [],
                auctions: savedState.auctions || [],
                experiences: savedState.experiences || [],
                vaquinhaCampaigns: savedState.vaquinhaCampaigns || [],
                fanGroups: savedState.fanGroups || [],
                donatedCampaigns: savedState.donatedCampaigns || {},
                exclusiveRewards: savedState.exclusiveRewards || [],
                media: savedState.media || [],
                muralPosts: savedState.muralPosts || [],
                fanArtPosts: savedState.fanArtPosts || [],
            };
        } catch (e) {
            console.error("Failed to parse saved state, starting fresh.", e);
        }
    }
    // Default initial state
    return {
        fanPoints: artistFanPoints,
        likedPostIds: new Set<string>(),
        commentedPostIds: new Set<string>(),
        likedMuralPostIds: new Set<string>(),
        likedFanArtPostIds: new Set<string>(),
        joinedGroupIds: new Set<string>(),
        shoppingCart: [],
        orders: [mockShippedOrder],
        purchasedTickets: [],
        purchasedExperiences: [],
        posts: [],
        merch: [],
        events: [],
        auctions: [],
        experiences: [],
        vaquinhaCampaigns: [],
        fanGroups: [],
        donatedCampaigns: {},
        exclusiveRewards: [],
        media: [],
        muralPosts: [],
        fanArtPosts: [],
    };
};

export const usePersistentArtistState = (artistId: string, initialFanPoints: number) => {
    const storageKey = `artistState_${artistId}`;

    const [fanPoints, setFanPoints] = useState(() => getInitialState(storageKey, initialFanPoints).fanPoints);
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).likedPostIds);
    const [commentedPostIds, setCommentedPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).commentedPostIds);
    const [likedMuralPostIds, setLikedMuralPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).likedMuralPostIds);
    const [likedFanArtPostIds, setLikedFanArtPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).likedFanArtPostIds);
    const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).joinedGroupIds);
    const [shoppingCart, setShoppingCart] = useState<CartItem[]>(() => getInitialState(storageKey, initialFanPoints).shoppingCart);
    const [orders, setOrders] = useState<Order[]>(() => getInitialState(storageKey, initialFanPoints).orders);
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => getInitialState(storageKey, initialFanPoints).purchasedTickets);
    const [purchasedExperiences, setPurchasedExperiences] = useState<PurchasedExperience[]>(() => getInitialState(storageKey, initialFanPoints).purchasedExperiences);
    const [posts, setPosts] = useState<Post[]>(() => getInitialState(storageKey, initialFanPoints).posts);
    const [merch, setMerch] = useState<MerchItem[]>(() => getInitialState(storageKey, initialFanPoints).merch);
    const [events, setEvents] = useState<Event[]>(() => getInitialState(storageKey, initialFanPoints).events);
    const [auctions, setAuctions] = useState<AuctionItem[]>(() => getInitialState(storageKey, initialFanPoints).auctions);
    const [experiences, setExperiences] = useState<ExperienceItem[]>(() => getInitialState(storageKey, initialFanPoints).experiences);
    const [vaquinhaCampaigns, setVaquinhaCampaigns] = useState<VaquinhaCampaign[]>(() => getInitialState(storageKey, initialFanPoints).vaquinhaCampaigns);
    const [fanGroups, setFanGroups] = useState<FanGroup[]>(() => getInitialState(storageKey, initialFanPoints).fanGroups);
    const [donatedCampaigns, setDonatedCampaigns] = useState<Record<string, number>>(() => getInitialState(storageKey, initialFanPoints).donatedCampaigns);
    const [exclusiveRewards, setExclusiveRewards] = useState<ExclusiveReward[]>(() => getInitialState(storageKey, initialFanPoints).exclusiveRewards);
    const [media, setMedia] = useState<MediaItem[]>(() => getInitialState(storageKey, initialFanPoints).media);
    const [muralPosts, setMuralPosts] = useState<MuralPost[]>(() => getInitialState(storageKey, initialFanPoints).muralPosts);
    const [fanArtPosts, setFanArtPosts] = useState<FanArtPost[]>(() => getInitialState(storageKey, initialFanPoints).fanArtPosts);

    // Effect to reset state when artist changes
    useEffect(() => {
        const initialState = getInitialState(`artistState_${artistId}`, initialFanPoints);
        setFanPoints(initialState.fanPoints);
        setLikedPostIds(initialState.likedPostIds);
        setCommentedPostIds(initialState.commentedPostIds);
        setLikedMuralPostIds(initialState.likedMuralPostIds);
        setLikedFanArtPostIds(initialState.likedFanArtPostIds);
        setJoinedGroupIds(initialState.joinedGroupIds);
        setShoppingCart(initialState.shoppingCart);
        setOrders(initialState.orders);
        setPurchasedTickets(initialState.purchasedTickets);
        setPurchasedExperiences(initialState.purchasedExperiences);
        setPosts(initialState.posts);
        setMerch(initialState.merch);
        setEvents(initialState.events);
        setAuctions(initialState.auctions);
        setExperiences(initialState.experiences);
        setVaquinhaCampaigns(initialState.vaquinhaCampaigns);
        setFanGroups(initialState.fanGroups);
        setDonatedCampaigns(initialState.donatedCampaigns);
        setExclusiveRewards(initialState.exclusiveRewards);
        setMedia(initialState.media);
        setMuralPosts(initialState.muralPosts);
        setFanArtPosts(initialState.fanArtPosts);
    }, [artistId, initialFanPoints]);

    // Effect to SAVE state to localStorage whenever it changes.
    useEffect(() => {
        const stateToSave = {
            fanPoints,
            likedPostIds: Array.from(likedPostIds),
            commentedPostIds: Array.from(commentedPostIds),
            likedMuralPostIds: Array.from(likedMuralPostIds),
            likedFanArtPostIds: Array.from(likedFanArtPostIds),
            joinedGroupIds: Array.from(joinedGroupIds),
            shoppingCart,
            orders,
            purchasedTickets,
            purchasedExperiences,
            posts,
            merch,
            events,
            auctions,
            experiences,
            vaquinhaCampaigns,
            fanGroups,
            donatedCampaigns,
            exclusiveRewards,
            media,
            muralPosts,
            fanArtPosts,
        };
        try {
            localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [fanPoints, likedPostIds, commentedPostIds, likedMuralPostIds, likedFanArtPostIds, joinedGroupIds, shoppingCart, orders, purchasedTickets, purchasedExperiences, posts, merch, events, auctions, experiences, vaquinhaCampaigns, fanGroups, donatedCampaigns, exclusiveRewards, media, muralPosts, fanArtPosts, storageKey]);

    return {
        fanPoints, setFanPoints,
        likedPostIds, setLikedPostIds,
        commentedPostIds, setCommentedPostIds,
        likedMuralPostIds, setLikedMuralPostIds,
        likedFanArtPostIds, setLikedFanArtPostIds,
        joinedGroupIds, setJoinedGroupIds,
        shoppingCart, setShoppingCart,
        orders, setOrders,
        purchasedTickets, setPurchasedTickets,
        purchasedExperiences, setPurchasedExperiences,
        posts, setPosts,
        merch, setMerch,
        events, setEvents,
        auctions, setAuctions,
        experiences, setExperiences,
        vaquinhaCampaigns, setVaquinhaCampaigns,
        fanGroups, setFanGroups,
        donatedCampaigns, setDonatedCampaigns,
        exclusiveRewards, setExclusiveRewards,
        media, setMedia,
        muralPosts, setMuralPosts,
        fanArtPosts, setFanArtPosts,
    };
};
