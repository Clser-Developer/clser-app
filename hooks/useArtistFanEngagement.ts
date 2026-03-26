import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { Comment, FanArtPost, FanGroup, MuralPost, Post } from '../types';
import { queueMutationWhenOffline } from '../lib/offline/mutation-queue';

interface ImageViewerLikeUpdates {
  isLiked?: boolean;
  likeCount?: number;
}

interface UseArtistFanEngagementInput {
  artistId: string;
  userNickname: string;
  userProfileImageUrl: string;
  posts: Post[];
  muralPosts: MuralPost[];
  fanArtPosts: FanArtPost[];
  likedPostIds: Set<string>;
  likedMuralPostIds: Set<string>;
  likedFanArtPostIds: Set<string>;
  commentedPostIds: Set<string>;
  joinedGroupIds: Set<string>;
  addFanPoints: (points: number, reason: string) => void;
  setFanPoints: Dispatch<SetStateAction<number>>;
  setPosts: Dispatch<SetStateAction<Post[]>>;
  setMuralPosts: Dispatch<SetStateAction<MuralPost[]>>;
  setFanArtPosts: Dispatch<SetStateAction<FanArtPost[]>>;
  setComments: Dispatch<SetStateAction<Comment[]>>;
  setLikedPostIds: Dispatch<SetStateAction<Set<string>>>;
  setLikedMuralPostIds: Dispatch<SetStateAction<Set<string>>>;
  setLikedFanArtPostIds: Dispatch<SetStateAction<Set<string>>>;
  setCommentedPostIds: Dispatch<SetStateAction<Set<string>>>;
  setFanGroups: Dispatch<SetStateAction<FanGroup[]>>;
  setJoinedGroupIds: Dispatch<SetStateAction<Set<string>>>;
  updateImageViewer: (updates: ImageViewerLikeUpdates) => void;
}

export const useArtistFanEngagement = ({
  artistId,
  userNickname,
  userProfileImageUrl,
  posts,
  muralPosts,
  fanArtPosts,
  likedPostIds,
  likedMuralPostIds,
  likedFanArtPostIds,
  commentedPostIds,
  joinedGroupIds,
  addFanPoints,
  setFanPoints,
  setPosts,
  setMuralPosts,
  setFanArtPosts,
  setComments,
  setLikedPostIds,
  setLikedMuralPostIds,
  setLikedFanArtPostIds,
  setCommentedPostIds,
  setFanGroups,
  setJoinedGroupIds,
  updateImageViewer,
}: UseArtistFanEngagementInput) => {
  const handleLikePost = useCallback(
    (postId: string) => {
      const isAlreadyLiked = likedPostIds.has(postId);
      const newLikedPostIds = new Set(likedPostIds);
      if (isAlreadyLiked) {
        newLikedPostIds.delete(postId);
        setFanPoints((prev) => prev - 5);
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes - 1 } : post)));
      } else {
        newLikedPostIds.add(postId);
        addFanPoints(5, 'Por curtir um post!');
        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)));
      }
      setLikedPostIds(newLikedPostIds);
      queueMutationWhenOffline({
        op: 'fan.like_post',
        artistId,
        payload: { postId, liked: !isAlreadyLiked },
      });
    },
    [addFanPoints, artistId, likedPostIds, setFanPoints, setLikedPostIds, setPosts]
  );

  const handleLikeMuralPost = useCallback(
    (postId: string) => {
      const isAlreadyLiked = likedMuralPostIds.has(postId);
      const newLikedMuralPostIds = new Set(likedMuralPostIds);

      let newLikeCount = 0;

      const updatedMuralPosts = muralPosts.map((post) => {
        if (post.id === postId) {
          const updatedPost = { ...post, likes: isAlreadyLiked ? post.likes - 1 : post.likes + 1 };
          newLikeCount = updatedPost.likes;
          return updatedPost;
        }
        return post;
      });

      if (isAlreadyLiked) {
        newLikedMuralPostIds.delete(postId);
        setFanPoints((prev) => prev - 5);
      } else {
        newLikedMuralPostIds.add(postId);
        addFanPoints(5, 'Por curtir uma foto no mural!');
      }

      setMuralPosts(updatedMuralPosts);
      setLikedMuralPostIds(newLikedMuralPostIds);

      updateImageViewer({
        isLiked: !isAlreadyLiked,
        likeCount: newLikeCount,
      });
      queueMutationWhenOffline({
        op: 'fan.like_mural',
        artistId,
        payload: { postId, liked: !isAlreadyLiked },
      });
    },
    [addFanPoints, artistId, likedMuralPostIds, muralPosts, setFanPoints, setLikedMuralPostIds, setMuralPosts, updateImageViewer]
  );

  const handleLikeFanArtPost = useCallback(
    (postId: string) => {
      const isAlreadyLiked = likedFanArtPostIds.has(postId);
      const newLikedFanArtPostIds = new Set(likedFanArtPostIds);

      let newLikeCount = 0;

      const updatedFanArtPosts = fanArtPosts.map((post) => {
        if (post.id === postId) {
          const updatedPost = { ...post, likes: isAlreadyLiked ? post.likes - 1 : post.likes + 1 };
          newLikeCount = updatedPost.likes;
          return updatedPost;
        }
        return post;
      });

      if (isAlreadyLiked) {
        newLikedFanArtPostIds.delete(postId);
        setFanPoints((prev) => prev - 5);
      } else {
        newLikedFanArtPostIds.add(postId);
        addFanPoints(5, 'Por curtir uma arte!');
      }

      setFanArtPosts(updatedFanArtPosts);
      setLikedFanArtPostIds(newLikedFanArtPostIds);

      updateImageViewer({
        isLiked: !isAlreadyLiked,
        likeCount: newLikeCount,
      });
      queueMutationWhenOffline({
        op: 'fan.like_fan_art',
        artistId,
        payload: { postId, liked: !isAlreadyLiked },
      });
    },
    [addFanPoints, artistId, fanArtPosts, likedFanArtPostIds, setFanArtPosts, setFanPoints, setLikedFanArtPostIds, updateImageViewer]
  );

  const handleAddComment = useCallback(
    (postId: string, commentText: string) => {
      if (!commentedPostIds.has(postId)) {
        addFanPoints(10, 'Por comentar em um post!');
        setCommentedPostIds((prev) => new Set(prev).add(postId));
      }

      const newComment: Comment = {
        id: `c${Date.now()}`,
        postId,
        authorName: userNickname,
        authorImageUrl: userProfileImageUrl,
        text: commentText,
        timestamp: 'Agora mesmo',
        isCurrentUser: true,
      };

      setComments((prev) => [...prev, newComment]);
      setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post)));
      queueMutationWhenOffline({
        op: 'fan.comment_post',
        artistId,
        payload: { postId, text: commentText },
      });
    },
    [addFanPoints, artistId, commentedPostIds, setCommentedPostIds, setComments, setPosts, userNickname, userProfileImageUrl]
  );

  const handleVote = useCallback(
    (postId: string, optionIndex: number) => {
      const post = posts.find((item) => item.id === postId);
      if (!post || post.userVotedOptionIndex != null || !post.pollVotes) return;

      addFanPoints(15, 'Por votar na enquete!');
      setPosts((prev) =>
        prev.map((item) => {
          if (item.id === postId) {
            const newPollVotes = [...item.pollVotes!];
            newPollVotes[optionIndex] += 1;
            return { ...item, pollVotes: newPollVotes, userVotedOptionIndex: optionIndex };
          }
          return item;
        })
      );

      queueMutationWhenOffline({
        op: 'fan.vote_poll',
        artistId,
        payload: { postId, optionIndex },
      });
    },
    [addFanPoints, artistId, posts, setPosts]
  );

  const handleJoinGroup = useCallback(
    (groupId: string) => {
      if (joinedGroupIds.has(groupId)) return;

      addFanPoints(10, 'Por entrar em um grupo de fãs!');
      setJoinedGroupIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(groupId);
        return newSet;
      });
      setFanGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, memberCount: group.memberCount + 1 } : group)));
      queueMutationWhenOffline({
        op: 'fan.join_group',
        artistId,
        payload: { groupId },
      });
    },
    [addFanPoints, artistId, joinedGroupIds, setFanGroups, setJoinedGroupIds]
  );

  return {
    handleAddComment,
    handleJoinGroup,
    handleLikeFanArtPost,
    handleLikeMuralPost,
    handleLikePost,
    handleVote,
  };
};

