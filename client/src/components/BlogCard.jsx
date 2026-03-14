import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
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
      // Check if liked (blog.likes can be array of IDs or array of objects)
      setLiked(likeUsers.some(u => (u._id || u) === user.id));
      // Check if favorited
      setFavorite(user.favorites?.some(favId => favId === id));
    }
  }, [blog, user, id]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await toggleFavorite(id);
      const isNowFavorite = !favorite;
      setFavorite(isNowFavorite);
      
      // Update global user state with new favorites
      if (user) {
        let newFavorites;
        if (isNowFavorite) {
          newFavorites = [...(user.favorites || []), id];
        } else {
          newFavorites = (user.favorites || []).filter(favId => favId !== id);
        }
        setUser({ ...user, favorites: newFavorites });
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const title = blog.title;
  const authorName = blog.author?.name || 'Unknown author';
  const createdAt = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '';
  
  const excerpt =
    typeof blog.content === 'string'
      ? blog.content.slice(0, 160)
      : blog.excerpt || '';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow duration-150 hover:-translate-y-1 hover:shadow-md">
      <Link to={`/blog/${id}`} className="relative block overflow-hidden">
        {/* <img
          src={blog.thumbnail}
          alt={title}
          className="h-48 w-full object-cover transition duration-200 group-hover:scale-[1.03]"
        /> */}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <Link to={`/blog/${id}`} className="space-y-1">
          <h2 className="text-base font-semibold leading-snug text-slate-900 line-clamp-2">
            {title}
          </h2>
          <p className="text-xs text-(--color-text-light) line-clamp-2">{excerpt}</p>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar size="xs" name={authorName} />
            <div className="leading-tight">
              <p className="text-xs font-medium text-slate-800">{authorName}</p>
              <p className="text-[11px] text-slate-400">
                {createdAt}
              </p>
            </div>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 2).map((tag) => (
                <Link 
                  key={tag} 
                  to={`/?tag=${tag}`}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-500 uppercase tracking-widest hover:bg-slate-200"
                >
                  #{tag}
                </Link>
              ))}
              {blog.tags.length > 2 && (
                 <span className="text-[10px] text-slate-400">+{blog.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LikeButton 
              count={likesCount} 
              liked={liked} 
              onToggle={handleToggleLike} 
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
              onClick={() => navigate(`/blog/${id}#comments`)}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{commentsCount}</span>
            </button>
          </div>
          <FavoriteButton 
            compact 
            saved={favorite} 
            onToggle={handleToggleFavorite} 
          />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
