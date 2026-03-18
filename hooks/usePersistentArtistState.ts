import { useEffect, useMemo, useState } from 'react';
import { Post, MerchItem, AuctionItem, ExclusiveReward, Event, MediaItem, MuralPost, FanArtPost, VaquinhaCampaign, FanGroup, ExperienceItem } from '../types';
import { readStorageItem, writeStorageItem } from '../lib/storage';

type PersistentArtistState = {
    fanPoints: number;
    likedPostIds: Set<string>;
    commentedPostIds: Set<string>;
    likedMuralPostIds: Set<string>;
    likedFanArtPostIds: Set<string>;
    joinedGroupIds: Set<string>;
    posts: Post[];
    merch: MerchItem[];
    events: Event[];
    auctions: AuctionItem[];
    experiences: ExperienceItem[];
    vaquinhaCampaigns: VaquinhaCampaign[];
    fanGroups: FanGroup[];
    donatedCampaigns: Record<string, number>;
    exclusiveRewards: ExclusiveReward[];
    media: MediaItem[];
    muralPosts: MuralPost[];
    fanArtPosts: FanArtPost[];
};

const createDefaultState = (artistFanPoints: number): PersistentArtistState => ({
    fanPoints: artistFanPoints,
    likedPostIds: new Set<string>(),
    commentedPostIds: new Set<string>(),
    likedMuralPostIds: new Set<string>(),
    likedFanArtPostIds: new Set<string>(),
    joinedGroupIds: new Set<string>(),
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
});

const getInitialState = (storageKey: string, artistFanPoints: number): PersistentArtistState => {
    const savedStateJSON = readStorageItem(storageKey);
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
    return createDefaultState(artistFanPoints);
};

export const usePersistentArtistState = (artistId: string, initialFanPoints: number) => {
    const storageKey = `artistState_${artistId}`;
    const initialState = useMemo(
        () => getInitialState(storageKey, initialFanPoints),
        [storageKey, initialFanPoints]
    );

    const [fanPoints, setFanPoints] = useState(initialState.fanPoints);
    const [likedPostIds, setLikedPostIds] = useState<Set<string>>(initialState.likedPostIds);
    const [commentedPostIds, setCommentedPostIds] = useState<Set<string>>(initialState.commentedPostIds);
    const [likedMuralPostIds, setLikedMuralPostIds] = useState<Set<string>>(initialState.likedMuralPostIds);
    const [likedFanArtPostIds, setLikedFanArtPostIds] = useState<Set<string>>(initialState.likedFanArtPostIds);
    const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(initialState.joinedGroupIds);
    const [posts, setPosts] = useState<Post[]>(initialState.posts);
    const [merch, setMerch] = useState<MerchItem[]>(initialState.merch);
    const [events, setEvents] = useState<Event[]>(initialState.events);
    const [auctions, setAuctions] = useState<AuctionItem[]>(initialState.auctions);
    const [experiences, setExperiences] = useState<ExperienceItem[]>(initialState.experiences);
    const [vaquinhaCampaigns, setVaquinhaCampaigns] = useState<VaquinhaCampaign[]>(initialState.vaquinhaCampaigns);
    const [fanGroups, setFanGroups] = useState<FanGroup[]>(initialState.fanGroups);
    const [donatedCampaigns, setDonatedCampaigns] = useState<Record<string, number>>(initialState.donatedCampaigns);
    const [exclusiveRewards, setExclusiveRewards] = useState<ExclusiveReward[]>(initialState.exclusiveRewards);
    const [media, setMedia] = useState<MediaItem[]>(initialState.media);
    const [muralPosts, setMuralPosts] = useState<MuralPost[]>(initialState.muralPosts);
    const [fanArtPosts, setFanArtPosts] = useState<FanArtPost[]>(initialState.fanArtPosts);

    useEffect(() => {
        setFanPoints(initialState.fanPoints);
        setLikedPostIds(initialState.likedPostIds);
        setCommentedPostIds(initialState.commentedPostIds);
        setLikedMuralPostIds(initialState.likedMuralPostIds);
        setLikedFanArtPostIds(initialState.likedFanArtPostIds);
        setJoinedGroupIds(initialState.joinedGroupIds);
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
    }, [initialState]);

    useEffect(() => {
        const stateToSave = {
            fanPoints,
            likedPostIds: Array.from(likedPostIds),
            commentedPostIds: Array.from(commentedPostIds),
            likedMuralPostIds: Array.from(likedMuralPostIds),
            likedFanArtPostIds: Array.from(likedFanArtPostIds),
            joinedGroupIds: Array.from(joinedGroupIds),
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
            writeStorageItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [fanPoints, likedPostIds, commentedPostIds, likedMuralPostIds, likedFanArtPostIds, joinedGroupIds, posts, merch, events, auctions, experiences, vaquinhaCampaigns, fanGroups, donatedCampaigns, exclusiveRewards, media, muralPosts, fanArtPosts, storageKey]);

    return {
        fanPoints, setFanPoints,
        likedPostIds, setLikedPostIds,
        commentedPostIds, setCommentedPostIds,
        likedMuralPostIds, setLikedMuralPostIds,
        likedFanArtPostIds, setLikedFanArtPostIds,
        joinedGroupIds, setJoinedGroupIds,
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
