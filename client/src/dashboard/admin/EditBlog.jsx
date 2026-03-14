import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bold, Italic, Underline, Heading2, Image, Link2, List, Quote } from 'lucide-react';
import { getBlogById, updateBlog } from '../../services/blogService.js';
import Loader from '../../components/Loader.jsx';

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
        const message =
          err?.response?.data?.message || err?.message || 'Failed to load blog.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
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
      const message =
        err?.response?.data?.message || err?.message || 'Failed to save changes.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !title && !content) {
    return (
      <div className="text-sm text-(--color-text-light)">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-sm font-semibold text-slate-900">Edit blog</h1>
        <p className="text-xs text-(--color-text-light)">
          Update the title and content of this story.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-(--color-primary) focus:bg-white focus:outline-none"
        />
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-50 px-2 py-1.5 text-xs text-slate-600">
          {toolbar.map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-100"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-800 focus:border-(--color-primary) focus:bg-white focus:outline-none"
        />
        
        <div className="space-y-2 py-2">
          <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-widest">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                {tag}
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
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
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-(--color-primary) focus:bg-white focus:outline-none transition"
          />
        </div>
        <div className="flex justify-end gap-2 text-xs">
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => navigate('/dashboard/admin/blogs')}
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-(--color-primary) px-3 py-1.5 font-semibold text-white hover:bg-(--color-primary-hover) disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default EditBlog;

