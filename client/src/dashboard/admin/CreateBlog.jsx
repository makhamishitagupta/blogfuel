import { useState, useRef } from 'react';
import { Bold, Italic, Underline, Heading2, Image, Link2, List, Quote, Heading3, Heading1 } from 'lucide-react';
import { createBlog } from '../../services/blogService.js';

const toolbar = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Underline, label: 'Underline' },
  { icon: Heading1, label: 'Heading' },
  { icon: Heading2, label: 'Heading' },
  { icon: Heading3, label: 'Heading' },
  { icon: List, label: 'List' },
  { icon: Quote, label: 'Quote' },
  { icon: Link2, label: 'Link' },
];

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    // Set cursor position after insertion
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
    { icon: Heading1, label: 'Heading', action: handleH1 },
    { icon: Heading2, label: 'Heading', action: handleH2 },
    { icon: Heading3, label: 'Heading', action: handleH3 },
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
      const message =
        err?.response?.data?.message || err?.message || 'Failed to publish blog.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }; 

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <input
          type="text"
          placeholder="Add a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-none bg-transparent text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
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
          rows={14}
          className="mt-2 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none"
          placeholder="Start writing your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </section>

      <aside className="space-y-4">
        <section className="card flex flex-col gap-3 bg-white text-xs">
          <div>
            <label className="mb-2 block font-semibold text-slate-700">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) focus:outline-none"
            />
          </div>
          
          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
          <button
            type="button"
            onClick={handlePublish}
            disabled={submitting}
            className="flex-1 rounded-full bg-(--color-primary) px-3 py-1.5 font-semibold text-white hover:bg-(--color-primary-hover) disabled:opacity-60"
          >
            {submitting ? 'Publishing…' : 'Publish'}
          </button>
        </section>
      </aside>
    </div>
  );
};

export default CreateBlog;

