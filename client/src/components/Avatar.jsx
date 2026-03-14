const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

const Avatar = ({ name = 'Alex Writer', size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-linear-to-tr from-(--color-primary) to-amber-400 font-semibold text-white shadow-sm ${sizes[size]}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;

