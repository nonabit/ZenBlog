import { useEffect, useState } from 'react';

export default function TimeDisplay() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Shanghai',
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <span className="opacity-0 font-mono">00:00 PM</span>;
  }

  return <span className="font-mono tabular-nums tracking-wider">{time}</span>;
}
