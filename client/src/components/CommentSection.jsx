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
    <section className="mt-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-(--color-primary)" />
        <h2 className="text-sm font-semibold text-slate-900">
          Comments <span className="ml-1 text-xs text-slate-400">({comments.length})</span>
        </h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-5 flex gap-3">
          <Avatar size="sm" />
          <div className="flex-1 space-y-2">
            <textarea
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Share your thoughts, questions, or feedback..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-(--color-primary) focus:bg-white focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center rounded-full bg-(--color-primary) px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-(--color-primary-hover) disabled:opacity-60"
              >
                {creating ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-6 text-center ring-1 ring-slate-100">
          <p className="mb-3 text-xs text-slate-600">
            Sign in to join the conversation and share your thoughts.
          </p>
          <Link
            to="/login"
            className="rounded-full bg-(--color-primary) px-6 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-(--color-primary-hover)"
          >
            Log in to comment
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-(--color-text-light)">
            No comments yet. Be the first to start the conversation.
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

