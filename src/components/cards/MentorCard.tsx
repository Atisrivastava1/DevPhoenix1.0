import React from 'react';
import { Star, MessageCircle, UserPlus } from 'lucide-react';
import { Mentor } from '@/types';

interface MentorCardProps {
  mentor: Partial<Mentor>;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const { name, role, status, avatar, tags = [], followers } = mentor;
  const isVerified = mentor.is_verified || (mentor as any).isVerified;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 w-full max-w-[320px] mx-auto shadow-[12px_12px_24px_rgba(0,0,0,0.05),-12px_-12px_24px_rgba(255,255,255,0.9)] transition-all duration-500 hover:shadow-[20px_20px_40px_rgba(249,115,22,0.1),-20px_-20px_40px_rgba(255,255,255,1)] hover:scale-105 hover:-translate-y-2 border border-slate-100">
      
      {/* Status indicator with pulse animation */}
      <div className="absolute right-5 top-5 z-10">
        <div className="relative">
          <div
            className={`h-3.5 w-3.5 rounded-full border-2 border-white transition-all duration-300 group-hover:scale-125 ${
              status === "online"
                ? "bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                : status === "away"
                  ? "bg-amber-500"
                  : "bg-slate-400"
            }`}
          ></div>
          {status === "online" && (
            <div className="absolute inset-0 h-3.5 w-3.5 rounded-full bg-green-500 animate-ping opacity-30"></div>
          )}
        </div>
      </div>

      {/* Verified badge */}
      {isVerified && (
        <div className="absolute right-5 top-12 z-10">
          <div className="rounded-full bg-orange-500 p-1 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className="mb-6 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-32 w-32 overflow-hidden rounded-full bg-slate-50 p-1.5 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(249,115,22,0.1),inset_-8px_-8px_16px_rgba(255,255,255,1)] group-hover:scale-110">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-orange-600">
          {name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-slate-600 transition-colors duration-300">
          {role}
        </p>

        {followers && (
          <p className="mt-3 text-xs font-semibold text-slate-400 transition-all duration-300 group-hover:text-orange-500">
            {followers.toLocaleString()} students mentored
          </p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-5 flex justify-center flex-wrap gap-2 relative z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={`inline-block rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm border border-slate-100 transition-all duration-300 ${
                tag === "Premium" || tag === "Premium Mentor"
                  ? "text-orange-600 border-orange-200 group-hover:bg-orange-50 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                  : "text-slate-600 group-hover:scale-105"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 relative z-10">
        <button className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:scale-95 active:scale-90 hover:bg-orange-500 group-hover:shadow-[0_4px_14px_rgba(249,115,22,0.3)]">
          <UserPlus className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
        <button className="flex-1 rounded-xl bg-slate-100 border border-slate-200 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:scale-95 active:scale-90 hover:bg-slate-200">
          <MessageCircle className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
