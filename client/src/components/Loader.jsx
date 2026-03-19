const Loader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div 
        className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
      />
    </div>
  );
};

export default Loader;
