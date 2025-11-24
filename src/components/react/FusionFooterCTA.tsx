import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Loader2 } from 'lucide-react';

const AnimatedSignature = () => (
  <svg width="200" height="80" viewBox="0 0 200 80" className="text-zinc-900 dark:text-zinc-100 opacity-80">
    <motion.path
      d="M45.5 40C45.5 40 38.5 28 52.5 25C66.5 22 58.5 52 45.5 52C32.5 52 34.5 34 58.5 34C82.5 34 90.5 45 90.5 45"
      fill="transparent"
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
    />
    <motion.circle
      cx="195" cy="30" r="2"
      fill="currentColor"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 2.2, duration: 0.2 }}
    />
  </svg>
);

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <form className="flex gap-2 max-w-sm relative" onSubmit={handleSubmit}>
      <div className="relative flex-1">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success'}
          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
        />
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center px-4 text-sm text-green-600 dark:text-green-400 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-green-200 dark:border-green-900"
            >
              <Check size={14} className="mr-2" />
              Thanks for subscribing!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px] justify-center"
      >
        {status === 'loading' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : status === 'success' ? (
          <span>Joined</span>
        ) : (
          <>
            <span>Subscribe</span>
            <Send size={14} />
          </>
        )}
      </button>
    </form>
  );
};

export default function FusionFooterCTA() {
  return (
    <section className="max-w-screen-lg mx-auto px-6 py-16 sm:py-24 border-t border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
        <div className="space-y-6">
          <h3 className="font-serif text-3xl font-medium text-zinc-900 dark:text-zinc-100">
            Keep in touch
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
            Get notified about new posts and projects. No spam, just code and design thoughts.
          </p>
          <SubscribeForm />
        </div>

        <div className="flex flex-col items-start md:items-end justify-end">
          <div className="text-zinc-400 text-xs font-mono mb-4 uppercase tracking-widest">
            Digital Garden of
          </div>
          <AnimatedSignature />
        </div>
      </div>
    </section>
  );
}
