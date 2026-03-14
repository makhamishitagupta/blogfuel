import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2 } from 'lucide-react';
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

    return () => {
      active = false;
    };
  }, [id, isAuthenticated, user]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
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
    } catch {
      // keep previous state on error
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!blog) return;
    try {
      await toggleFavorite(blog._id);
      const isNowFavorite = !favorite;
      setFavorite(isNowFavorite);
      
      if (user) {
        let newFavorites;
        if (isNowFavorite) {
          newFavorites = [...(user.favorites || []), blog._id];
        } else {
          newFavorites = (user.favorites || []).filter(favId => favId !== blog._id);
        }
        setUser({ ...user, favorites: newFavorites });
      }
    } catch {
      // ignore for now
    }
  };

  const handleCreateComment = async (text) => {
    if (!isAuthenticated) return;
    setCreatingComment(true);
    try {
      const res = await createComment(id, { text });
      setComments((prev) => [res.comment, ...prev]);
    } catch {
      // ignore error in UI for now
    } finally {
      setCreatingComment(false);
    }
  };

  const handleUpdateComment = async (commentId, text) => {
    setUpdatingCommentId(commentId);
    try {
      const res = await updateComment(id, commentId, { text });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.comment : c)),
      );
    } catch {
      // ignore for now
    } finally {
      setUpdatingCommentId(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      // ignore
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !blog) {
    return (
      <div className="py-10 text-center text-sm text-(--color-text-light)">
        {error || 'Blog not found. It may have been removed.'}
      </div>
    );
  }

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col pb-10">
      <header className="mb-6 space-y-4 border-b border-slate-200 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-(--color-primary)">
          Blog
        </p>
        <h1 className="text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar size="sm" name={blog.author?.name} />
            <div className="leading-tight">
              <p className="text-xs font-semibold text-slate-900">{blog.author?.name}</p>
              <p className="text-[11px] text-(--color-text-light)">
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString()
                  : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <LikeButton
              count={likesCount}
              liked={liked}
              onToggle={handleToggleLike}
            />
            <FavoriteButton
              saved={favorite}
              onToggle={handleToggleFavorite}
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* <div className="mb-6 overflow-hidden rounded-3xl bg-slate-100">
        <img
          src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt={blog.title}
          className="max-h-[380px] w-full object-cover"
        />
      </div> */}

      <section className="prose-blog space-y-5 text-sm text-slate-800 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {blog.content}
        </ReactMarkdown>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-100">
            {blog.tags.map(tag => (
              <button
                key={tag}
                onClick={() => navigate(`/?tag=${tag}`)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </section>

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

