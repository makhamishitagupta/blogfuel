import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Avatar from './Avatar.jsx';
import CommentItem from './CommentItem.jsx';

const CommentSection = ({
  comments = [],
  currentUserId,
  onCreate,
  onUpdate,
  onDelete,
  creating = false,
  updatingId,
  deletingId,
  isAuthenticated,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || !onCreate) return;
    await onCreate(value);
    setValue('');
  };

  return (
    <section
      className="mt-10 rounded-2xl p-6 shadow-sm"
      style={{
        background: 'var(--color-surface-elevated)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-primary)' }}
        >
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Comments
          </h2>
          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            {comments.length} {comments.length === 1 ? 'thought' : 'thoughts'} shared
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <Avatar size="sm" />
          <div className="flex-1 space-y-3">
            <textarea
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Share your thoughts, questions, or feedback..."
              className="w-full resize-none rounded-2xl px-4 py-3 text-sm transition-all duration-200 outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="btn-primary rounded-full px-6 py-2 text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                {creating ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          className="mb-8 flex flex-col items-center justify-center rounded-2xl py-8 text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="mb-4 text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Sign in to join the conversation and share your thoughts.
          </p>
          <Link
            to="/login"
            className="btn-primary rounded-full px-8 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200"
          >
            Log in to comment
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-sm font-medium py-6" style={{ color: 'var(--color-text-muted)' }}>
            No comments yet. Be the first to start the conversation!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              canEdit={currentUserId && comment.user && comment.user._id === currentUserId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              updatingId={updatingId}
              deletingId={deletingId}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
