const TagBadge = ({ label }) => {
  return (
    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-primary)] ring-1 ring-orange-100">
      {label}
    </span>
  );
};

export default TagBadge;

