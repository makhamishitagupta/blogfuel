import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, Heading2, Image, Link2, List, Quote, Save, X } from 'lucide-react';
import { getBlogById, updateBlog } from '../../services/blogService.js';
import Loader from '../../components/Loader.jsx';
import ReactMarkdown from 'react-markdown';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = before + selectedText + after;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertText('**', '**');
  const handleItalic = () => insertText('*', '*');
  const handleUnderline = () => insertText('<u>', '</u>');
  const handleHeading = () => insertText('# ');
  const handleList = () => insertText('- ');
  const handleQuote = () => insertText('> ');
  const handleLink = () => insertText('[', '](url)');
  const handleImage = () => insertText('![alt text](', ')');

  const toolbar = [
    { icon: Bold, label: 'Bold', action: handleBold },
    { icon: Italic, label: 'Italic', action: handleItalic },
    { icon: Underline, label: 'Underline', action: handleUnderline },
    { icon: Heading2, label: 'Heading', action: handleHeading },
    { icon: List, label: 'List', action: handleList },
    { icon: Quote, label: 'Quote', action: handleQuote },
    { icon: Link2, label: 'Link', action: handleLink },
    { icon: Image, label: 'Image', action: handleImage },
  ];

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBlogById(id);
        if (!active) return;
        setTitle(data.blog.title || '');
        setContent(data.blog.content || '');
        setTags(data.blog.tags || []);
      } catch (err) {
        if (!active) return;
        const message = err?.response?.data?.message || err?.message || 'Failed to load blog.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateBlog(id, { title, content, tags });
      navigate('/dashboard/admin/blogs');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to save changes.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (error && !title && !content) {
    return (
      <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black" style={{ color: 'var(--color-text)' }}>
            Edit Blog
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Update the title and content of this story.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(p => !p)}
          className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-200"
          style={
            showPreview
              ? { background: 'var(--color-primary)', color: '#fff' }
              : { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }
          }
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </header>

      {/* Editor */}
      <section
        className="rounded-xl overflow-hidden"
        style={{
          background: 'var(--color-surface-elevated)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Title input */}
        <div className="px-5 pt-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b-2 bg-transparent pb-3 text-xl font-black focus:outline-none transition-colors duration-200"
            style={{
              color: 'var(--color-text)',
              borderColor: title ? 'var(--color-primary)' : 'var(--color-border)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = title ? 'var(--color-primary)' : 'var(--color-border)'; }}
          />
        </div>

        {/* Toolbar */}
        <div
          className="flex flex-wrap gap-1 px-4 py-2"
          style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          {toolbar.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              title={label}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {showPreview ? (
          <div className="px-5 py-5 min-h-[240px]">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-primary)' }}>
              Preview
            </p>
            <div className="prose-blog">
              <ReactMarkdown>{content || '*Nothing to preview yet...*'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none bg-transparent px-5 py-4 text-sm leading-relaxed font-mono focus:outline-none"
            style={{ color: 'var(--color-text)' }}
          />
        )}

        {/* Tags */}
        <div
          className="px-5 py-4 space-y-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
                style={{ background: 'var(--color-primary)' }}
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 opacity-80 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type tag and press Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            className="input-base text-xs"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="px-5 pb-2">
            <p
              className="rounded-lg px-3 py-2 text-xs text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-3"
          style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200"
            style={{
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              background: 'transparent',
            }}
            onClick={() => navigate('/dashboard/admin/blogs')}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            <X className="h-3.5 w-3.5" />
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-xs py-2 px-5 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default EditBlog;
