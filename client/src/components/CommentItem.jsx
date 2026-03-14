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
    <div className="flex gap-3 rounded-xl bg-slate-50/60 p-3 ring-1 ring-slate-100">
      <Avatar size="sm" name={user?.name} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
            <p className="text-[11px] text-(--color-text-light)">
              {date.toLocaleDateString()} •{' '}
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {canEdit && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 hover:bg-slate-100"
                onClick={() => setIsEditing((prev) => !prev)}
                disabled={deletingId === _id}
              >
                <Pencil className="h-3 w-3" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-red-600 hover:bg-red-50"
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
          <div className="space-y-2">
            <textarea
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-(--color-primary) focus:outline-none"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-(--color-primary) px-3 py-1 font-semibold text-white hover:bg-(--color-primary-hover)"
                onClick={handleSave}
                disabled={updatingId === _id}
              >
                {updatingId === _id ? 'Saving' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-800">{text}</p>
        )}
        {!canEdit && (
          <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-(--color-primary-hover)"
            >
              <MessageCircle className="h-3 w-3" />
              <span>Reply</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

