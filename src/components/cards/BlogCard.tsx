import { DynamicImage } from '@/components/ui/DynamicImage';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { designSystem } from '@/lib/design-system';

interface BlogCardProps {
  post: {
    slug: string;
    cover_image: string;
    title: string;
    excerpt: string;
    category: string;
    published_at: string;
    read_time: string;
    author: {
      name: string;
      avatar: string;
    }
  };
  className?: string;
}

export function BlogCard({ post, className = '' }: BlogCardProps) {
  return (
    <div className={`bg-white ${designSystem.borderRadius.card} overflow-hidden border ${designSystem.colors.border.light} ${designSystem.shadows.soft} hover:${designSystem.shadows.hover} transition-all duration-500 flex flex-col group ${className}`}>
      <Link href={`/blog/${post.slug}`} className="block relative w-full aspect-[16/9] overflow-hidden bg-slate-50 border-b border-slate-100">
        <DynamicImage 
          src={post.cover_image} 
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          category={post.category}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            {post.category}
          </span>
        </div>
      </Link>

      <div className={`${designSystem.spacing.cardPadding} flex flex-col flex-grow`}>
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-4">
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read_time}</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block group-hover:text-orange-500 transition-colors">
          <h2 className={`${designSystem.typography.cardTitle} mb-3 text-slate-900 line-clamp-2`}>
            {post.title}
          </h2>
        </Link>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <span className="text-sm font-bold text-slate-900">{post.author.name}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
             <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
