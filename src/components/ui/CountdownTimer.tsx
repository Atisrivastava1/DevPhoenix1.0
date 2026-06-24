"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-07-02T23:59:00+05:30").getTime();

interface TimeRemaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

export function CountdownTimer({ onExpire }: { onExpire?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    expired: false,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          expired: true,
        });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        expired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  if (!mounted) {
    return (
      <div className="flex gap-2 justify-center items-center mt-3 text-sm font-bold text-slate-400">
        <span>Loading countdown...</span>
      </div>
    );
  }

  if (timeLeft.expired) {
    return (
      <div className="text-center font-bold text-red-500 text-sm mt-3 uppercase tracking-wider">
        Offer Expired
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2">Offer Ends In</span>
      <div className="flex items-center gap-1.5 font-mono text-slate-800">
        <div className="flex flex-col items-center px-2 py-1 bg-white border border-orange-100 rounded-lg shadow-sm">
          <span className="text-sm font-extrabold text-slate-900">{timeLeft.days}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Days</span>
        </div>
        <span className="text-orange-400 font-bold">:</span>
        <div className="flex flex-col items-center px-2 py-1 bg-white border border-orange-100 rounded-lg shadow-sm">
          <span className="text-sm font-extrabold text-slate-900">{timeLeft.hours}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Hours</span>
        </div>
        <span className="text-orange-400 font-bold">:</span>
        <div className="flex flex-col items-center px-2 py-1 bg-white border border-orange-100 rounded-lg shadow-sm">
          <span className="text-sm font-extrabold text-slate-900">{timeLeft.minutes}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Mins</span>
        </div>
        <span className="text-orange-400 font-bold">:</span>
        <div className="flex flex-col items-center px-2 py-1 bg-white border border-orange-100 rounded-lg shadow-sm w-9">
          <span className="text-sm font-extrabold text-slate-900">{timeLeft.seconds}</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Secs</span>
        </div>
      </div>
    </div>
  );
}
