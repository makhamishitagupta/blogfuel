import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Avatar from './Avatar.jsx';
import LikeButton from './LikeButton.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { likeBlog, unlikeBlog, toggleFavorite } from '../services/blogService.js';

const BlogCard = ({ blog, commentsCount = 0 }) => {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();

  const id = blog._id || blog.id;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const likeUsers = Array.isArray(blog.likes) ? blog.likes : [];
    setLikesCount(likeUsers.length);
    if (user) {
      setLiked(likeUsers.some(u => (u._id || u) === user.id));
      setFavorite(user.favorites?.some(favId => favId === id));
    }
  }, [blog, user, id]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (liked) {
        const res = await unlikeBlog(id);
        setLiked(false);
        setLikesCount(res.totalLikes);
      } else {
        const res = await likeBlog(id);
        setLiked(true);
        setLikesCount(res.totalLikes);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await toggleFavorite(id);
      const isNowFavorite = !favorite;
      setFavorite(isNowFavorite);
      if (user) {
        const newFavorites = isNowFavorite
          ? [...(user.favorites || []), id]
          : (user.favorites || []).filter(favId => favId !== id);
        setUser({ ...user, favorites: newFavorites });
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const title = blog.title;
  const authorName = blog.author?.name || 'Unknown author';
  const createdAt = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const excerpt =
    typeof blog.content === 'string'
      ? blog.content.replace(/[#*>`\[\]]/g, '').slice(0, 140)
      : blog.excerpt || '';

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1"
      style={{
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.25)';
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Card body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="tag-badge"
                style={{
                  background: 'rgba(124,58,237,0.12)',
                  color: 'var(--color-primary-soft)',
                }}
              >
                #{tag}
              </Link>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title + excerpt */}
        <Link to={`/blog/${id}`} className="group/link space-y-1.5 flex-1">
          <h2
            className="text-base font-bold leading-snug line-clamp-2 transition-colors duration-200"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h2>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
            {excerpt}
          </p>
        </Link>

        {/* Read more */}
        <Link
          to={`/blog/${id}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200"
          style={{ color: 'var(--color-primary)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
        >
          Read more
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        {/* Divider */}
        <div className="my-3" style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* Author + actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar size="xs" name={authorName} />
            <div className="leading-tight">
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{authorName}</p>
              <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <LikeButton count={likesCount} liked={liked} onToggle={handleToggleLike} />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              onClick={() => navigate(`/blog/${id}#comments`)}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{commentsCount}</span>
            </button>
            <FavoriteButton compact saved={favorite} onToggle={handleToggleFavorite} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
