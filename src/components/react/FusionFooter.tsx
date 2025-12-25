import { Github, Twitter, Mail, ArrowUp } from 'lucide-react';
import Magnetic from './Magnetic';

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/99byte", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/ninthbit_ai", label: "Twitter" },
  { icon: Mail, href: "mailto:oldmeatovo@gmail.com", label: "Email" },
];

export default function FusionFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Left: Copyright & Status */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <span>© {new Date().getFullYear()} Silicon Universe</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs text-zinc-500 font-mono">All Systems Normal</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Built with Astro, React & Tailwind. Crafted in Shanghai.
          </p>
        </div>

        {/* Right: Social Links & Scroll Top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((link) => (
              <Magnetic key={link.label} strength={0.2}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              </Magnetic>
            ))}
          </div>

          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-2 hidden md:block"></div>

          <Magnetic>
            <button
              onClick={scrollToTop}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Back to Top"
            >
              <ArrowUp size={20} />
            </button>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
