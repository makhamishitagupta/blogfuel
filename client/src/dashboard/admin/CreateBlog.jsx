import { useState, useRef } from 'react';
import { Bold, Italic, Underline, Heading2, Image, Link2, List, Quote, Heading3, Heading1, Rocket } from 'lucide-react';
import { createBlog } from '../../services/blogService.js';
import ReactMarkdown from 'react-markdown';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

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
  const handleH1 = () => insertText('\n# ');
  const handleH2 = () => insertText('\n## ');
  const handleH3 = () => insertText('\n### ');
  const handleList = () => insertText('- ');
  const handleQuote = () => insertText('> ');
  const handleLink = () => insertText('[', '](url)');

  const toolbar = [
    { icon: Bold, label: 'Bold', action: handleBold },
    { icon: Italic, label: 'Italic', action: handleItalic },
    { icon: Underline, label: 'Underline', action: handleUnderline },
    { icon: Heading1, label: 'H1', action: handleH1 },
    { icon: Heading2, label: 'H2', action: handleH2 },
    { icon: Heading3, label: 'H3', action: handleH3 },
    { icon: List, label: 'List', action: handleList },
    { icon: Quote, label: 'Quote', action: handleQuote },
    { icon: Link2, label: 'Link', action: handleLink },
  ];

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

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await createBlog({ title, content, tags });
      setSuccess('Blog published successfully.');
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to publish blog.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black" style={{ color: 'var(--color-text)' }}>
            Create New Blog
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Write and publish your story to the world.
          </p>
        </div>
        {/* Preview toggle */}
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Editor */}
        <section
          className="space-y-3 rounded-xl overflow-hidden"
          style={{
            background: 'var(--color-surface-elevated)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Title area */}
          <div className="px-5 pt-5">
            <input
              type="text"
              placeholder="Add a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b-2 bg-transparent pb-3 text-xl font-black placeholder:font-normal focus:outline-none transition-colors duration-200"
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

          {/* Content area */}
          {showPreview ? (
            <div className="px-5 pb-5 min-h-[280px]">
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
              rows={14}
              className="w-full resize-none bg-transparent px-5 pb-5 text-sm leading-relaxed font-mono focus:outline-none"
              placeholder="Start writing your story here... (Supports Markdown)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ color: 'var(--color-text)' }}
            />
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Tags */}
          <section
            className="rounded-xl p-4 space-y-3"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
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
          </section>

          {/* Publish */}
          <section
            className="rounded-xl p-4 space-y-3"
            style={{
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {error && (
              <p
                className="rounded-lg px-3 py-2 text-xs text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </p>
            )}
            {success && (
              <p
                className="rounded-lg px-3 py-2 text-xs text-emerald-400"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                {success}
              </p>
            )}
            <button
              type="button"
              onClick={handlePublish}
              disabled={submitting}
              className="btn-primary w-full justify-center py-2.5 text-sm disabled:opacity-60"
            >
              <Rocket className="h-4 w-4" />
              {submitting ? 'Publishing…' : 'Publish Blog'}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default CreateBlog;
