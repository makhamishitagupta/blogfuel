import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Avatar from '../components/Avatar.jsx';
import LikeButton from '../components/LikeButton.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import CommentSection from '../components/CommentSection.jsx';
import Loader from '../components/Loader.jsx';
import { getBlogById } from '../services/blogService.js';
import { getFavoriteBlogs, toggleFavorite, likeBlog, unlikeBlog } from '../services/blogService.js';
import { getComments, createComment, updateComment, deleteComment } from '../services/commentService.js';
import * as authService from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import rehypeRaw from "rehype-raw";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, setUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [creatingComment, setCreatingComment] = useState(false);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [blogRes, commentsRes, favoritesRes] = await Promise.all([
          getBlogById(id),
          getComments(id),
          isAuthenticated ? getFavoriteBlogs() : Promise.resolve({ blogs: [] }),
        ]);
        if (!active) return;
        const loadedBlog = blogRes.blog;
        setBlog(loadedBlog);
        if (isAuthenticated) {
          authService.addToHistory(id).catch(() => {});
        }
        setComments(commentsRes);
        const likeUsers = Array.isArray(loadedBlog.likes) ? loadedBlog.likes : [];
        setLikesCount(likeUsers.length);
        if (user) {
          setLiked(likeUsers.some((u) => u._id === user.id));
          if (favoritesRes.blogs) {
            setFavorite(favoritesRes.blogs.some((b) => (b._id || b.id) === id));
          }
        }
      } catch (err) {
        if (!active) return;
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load blog details.';
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
          setCommentsLoading(false);
        }
      }
    };
    load();
    return () => { active = false; };
  }, [id, isAuthenticated, user]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!blog) return;
    try {
      if (liked) {
        const res = await unlikeBlog(blog._id);
        setLiked(false);
        setLikesCount(res.totalLikes);
      } else {
        const res = await likeBlog(blog._id);
        setLiked(true);
        setLikesCount(res.totalLikes);
      }
    } catch { /* keep previous state */ }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!blog) return;
    try {
      await toggleFavorite(blog._id);
      const isNowFavorite = !favorite;
      setFavorite(isNowFavorite);
      if (user) {
        const newFavorites = isNowFavorite
          ? [...(user.favorites || []), blog._id]
          : (user.favorites || []).filter(favId => favId !== blog._id);
        setUser({ ...user, favorites: newFavorites });
      }
    } catch { /* ignore */ }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleCreateComment = async (text) => {
    if (!isAuthenticated) return;
    setCreatingComment(true);
    try {
      const res = await createComment(id, { text });
      setComments((prev) => [res.comment, ...prev]);
    } catch { /* ignore */ } finally {
      setCreatingComment(false);
    }
  };

  const handleUpdateComment = async (commentId, text) => {
    setUpdatingCommentId(commentId);
    try {
      const res = await updateComment(id, commentId, { text });
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.comment : c)));
    } catch { /* ignore */ } finally {
      setUpdatingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch { /* ignore */ } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) return <Loader />;

  if (error || !blog) {
    return (
      <div className="py-10 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {error || 'Blog not found. It may have been removed.'}
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(blog.content?.split(/\s+/).length / 200));

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col pb-16">

      {/* ── Header / Banner ─────────────────────────────── */}
      <header
        className="mb-8 overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(160deg, #0a0a0a 0%, #1a0533 60%, #0a0a0a 100%)',
        }}
      >
        <div className="px-8 py-10 sm:px-12 sm:py-14 relative overflow-hidden">
          {/* glow */}
          <div
            className="pointer-events-none absolute"
            style={{ top: '-40px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => navigate(`/?tag=${tag}`)}
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-200"
                  style={{ background: 'rgba(124,58,237,0.5)', border: '1px solid rgba(168,85,247,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.5)'; }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          <h1
            className="text-balance font-black leading-tight text-white mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.8rem)' }}
          >
            {blog.title}
          </h1>

          {/* Author row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar size="sm" name={blog.author?.name} />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">{blog.author?.name}</p>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  {' · '}
                  {readTime} min read
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <LikeButton count={likesCount} liked={liked} onToggle={handleToggleLike} />
              <FavoriteButton saved={favorite} onToggle={handleToggleFavorite} />
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Blog Content ─────────────────────────────────── */}
      <section className="prose-blog space-y-2 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {blog.content}
        </ReactMarkdown>
      </section>

      {/* ── Comments ─────────────────────────────────────── */}
      <CommentSection
        comments={comments}
        currentUserId={user?.id}
        onCreate={handleCreateComment}
        onUpdate={handleUpdateComment}
        onDelete={handleDeleteComment}
        creating={creatingComment}
        updatingId={updatingCommentId}
        deletingId={deletingCommentId}
        isAuthenticated={isAuthenticated}
      />
    </article>
  );
};

export default BlogDetails;
