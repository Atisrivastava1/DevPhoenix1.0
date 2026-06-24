import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { designSystem } from '@/lib/design-system';

interface TestimonialCardProps {
  testimonial: {
    name: string;
    role: string;
    company?: string;
    avatar: string;
    content: string; // or quote
    program: string;
    rating?: number;
  };
  className?: string;
}

export function TestimonialCard({ testimonial, className = '' }: TestimonialCardProps) {
  return (
    <div className={`bg-white ${designSystem.borderRadius.card} ${designSystem.spacing.cardPadding} border ${designSystem.colors.border.light} ${designSystem.shadows.soft} ${designSystem.shadows.hover} transition-all duration-300 relative flex flex-col h-full ${className}`}>
      <div className="absolute top-8 right-8 text-orange-100">
        <Quote className="w-12 h-12 rotate-180" fill="currentColor" />
      </div>

      <div className="flex items-center gap-1 mb-6 text-orange-400">
         {[...Array(testimonial.rating || 5)].map((_, i) => (
           <Star key={i} className="w-4 h-4" fill="currentColor" />
         ))}
      </div>

      <p className={`${designSystem.typography.body} text-slate-700 italic mb-8 relative z-10 flex-grow`}>
        "{testimonial.content}"
      </p>

      <div className="flex items-center gap-4 mt-auto border-t border-slate-50 pt-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden relative shrink-0 border-2 border-white shadow-sm">
          <Image
             src={testimonial.avatar}
             alt={testimonial.name}
             fill
             sizes="48px"
             className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{testimonial.name}</h4>
          <p className="text-xs text-slate-500 font-medium mb-1">
            {testimonial.role} {testimonial.company ? ` @ ${testimonial.company}` : ''}
          </p>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{testimonial.program}</p>
        </div>
      </div>
    </div>
  );
}
