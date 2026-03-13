

import { useState, useEffect } from 'react';
import { Post, MerchItem, AuctionItem, ExclusiveReward, CartItem, Order, OrderStatus, Event, MediaItem, PurchasedTicket } from '../types';

const mockShippedOrder: Order = {
    id: 'SF-MOCK12345',
    date: '3 dias atrás',
    status: OrderStatus.SHIPPED,
    items: [
        // FIX: Property 'imageUrl' does not exist in type 'OrderItem'. Did you mean to write 'imageUrls'?
        { id: 'm1', artistId: 'lia', name: 'Camiseta "Tour Estelar"', description: 'Leve a energia da turnê Estelar com você.', price: 89.90, imageUrls: ['https://picsum.photos/seed/lia-merch1/400/400'], sizes: ['M'], quantity: 1, isOnSale: false },
        // FIX: Property 'imageUrl' does not exist in type 'OrderItem'. Did you mean to write 'imageUrls'?
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
                shoppingCart: savedState.shoppingCart || [],
                orders: savedState.orders || [mockShippedOrder],
                purchasedTickets: savedState.purchasedTickets || [],
                paymentMethod: savedState.paymentMethod || 'credit-card',
                posts: savedState.posts || [],
                merch: savedState.merch || [],
                events: savedState.events || [],
                auctions: savedState.auctions || [],
                exclusiveRewards: savedState.exclusiveRewards || [],
                media: savedState.media || [],
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
        shoppingCart: [],
        orders: [mockShippedOrder],
        purchasedTickets: [],
        paymentMethod: 'credit-card',
        posts: [],
        merch: [],
        events: [],
        auctions: [],
        exclusiveRewards: [],
        media: [],
    };
};

export const usePersistentArtistState = (artistId: string, initialFanPoints: number) => {
    const storageKey = `artistState_${artistId}`;

    const [fanPoints, setFanPoints] = useState(() => getInitialState(storageKey, initialFanPoints).fanPoints);
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).likedPostIds);
    const [commentedPostIds, setCommentedPostIds] = useState<Set<string>>(() => getInitialState(storageKey, initialFanPoints).commentedPostIds);
    const [shoppingCart, setShoppingCart] = useState<CartItem[]>(() => getInitialState(storageKey, initialFanPoints).shoppingCart);
    const [orders, setOrders] = useState<Order[]>(() => getInitialState(storageKey, initialFanPoints).orders);
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => getInitialState(storageKey, initialFanPoints).purchasedTickets);
    const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'pix'>(() => getInitialState(storageKey, initialFanPoints).paymentMethod);
    const [posts, setPosts] = useState<Post[]>(() => getInitialState(storageKey, initialFanPoints).posts);
    const [merch, setMerch] = useState<MerchItem[]>(() => getInitialState(storageKey, initialFanPoints).merch);
    const [events, setEvents] = useState<Event[]>(() => getInitialState(storageKey, initialFanPoints).events);
    const [auctions, setAuctions] = useState<AuctionItem[]>(() => getInitialState(storageKey, initialFanPoints).auctions);
    const [exclusiveRewards, setExclusiveRewards] = useState<ExclusiveReward[]>(() => getInitialState(storageKey, initialFanPoints).exclusiveRewards);
    const [media, setMedia] = useState<MediaItem[]>(() => getInitialState(storageKey, initialFanPoints).media);

    // Effect to reset state when artist changes
    useEffect(() => {
        const initialState = getInitialState(`artistState_${artistId}`, initialFanPoints);
        setFanPoints(initialState.fanPoints);
        setLikedPostIds(initialState.likedPostIds);
        setCommentedPostIds(initialState.commentedPostIds);
        setShoppingCart(initialState.shoppingCart);
        setOrders(initialState.orders);
        setPurchasedTickets(initialState.purchasedTickets);
        setPaymentMethod(initialState.paymentMethod);
        setPosts(initialState.posts);
        setMerch(initialState.merch);
        setEvents(initialState.events);
        setAuctions(initialState.auctions);
        setExclusiveRewards(initialState.exclusiveRewards);
        setMedia(initialState.media);
    }, [artistId, initialFanPoints]);

    // Effect to SAVE state to localStorage whenever it changes.
    useEffect(() => {
        const stateToSave = {
            fanPoints,
            likedPostIds: Array.from(likedPostIds),
            commentedPostIds: Array.from(commentedPostIds),
            shoppingCart,
            orders,
            purchasedTickets,
            paymentMethod,
            posts,
            merch,
            events,
            auctions,
            exclusiveRewards,
            media,
        };
        try {
            localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [fanPoints, likedPostIds, commentedPostIds, shoppingCart, orders, purchasedTickets, paymentMethod, posts, merch, events, auctions, exclusiveRewards, media, storageKey]);

    return {
        fanPoints, setFanPoints,
        likedPostIds, setLikedPostIds,
        commentedPostIds, setCommentedPostIds,
        shoppingCart, setShoppingCart,
        orders, setOrders,
        purchasedTickets, setPurchasedTickets,
        paymentMethod, setPaymentMethod,
        posts, setPosts,
        merch, setMerch,
        events, setEvents,
        auctions, setAuctions,
        exclusiveRewards, setExclusiveRewards,
        media, setMedia
    };
};