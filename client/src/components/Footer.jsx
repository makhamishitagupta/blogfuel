const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-4 text-xs text-(--color-text-light)">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} BlogFuel. Built for readers and writers.</p>
        <div className="flex gap-4">
          <button type="button" className="hover:text-(--color-primary-hover)">
            Terms
          </button>
          <button type="button" className="hover:text-(--color-primary-hover)">
            Privacy
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

