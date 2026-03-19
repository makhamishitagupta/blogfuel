import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Avatar from './Avatar.jsx';

const CommentItem = ({ comment, canEdit, onUpdate, onDelete, updatingId, deletingId }) => {
  const { user, text, createdAt, _id } = comment;
  const date = new Date(createdAt);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleSave = async () => {
    if (!onUpdate) return;
    await onUpdate(_id, value);
    setIsEditing(false);
  };

  return (
    <div
      className="flex gap-4 rounded-2xl p-4 transition-colors duration-200"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <Avatar size="sm" name={user?.name} />
      <div className="flex-1 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} •{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {canEdit && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200"
                style={{ color: 'var(--color-text-muted)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={deletingId === _id}
              >
                <Pencil className="h-3 w-3" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200"
                style={{ color: 'var(--color-text-muted)', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                onClick={() => onDelete?.(_id)}
                disabled={deletingId === _id}
              >
                <Trash2 className="h-3 w-3" />
                <span>{deletingId === _id ? 'Removing' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-3 pt-1">
            <textarea
              rows={3}
              className="w-full resize-none rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            />
            <div className="flex justify-end gap-3 text-xs">
              <button
                type="button"
                className="rounded-full px-5 py-2 font-semibold transition-all duration-200"
                style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary rounded-full px-5 py-2 font-semibold shadow-sm transition-all duration-200 disabled:opacity-50"
                onClick={handleSave}
                disabled={updatingId === _id}
              >
                {updatingId === _id ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-1">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
              {text}
            </p>
          </div>
        )}
        {!canEdit && (
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
