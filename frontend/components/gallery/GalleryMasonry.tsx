"use client";

import { Play, FileText } from "lucide-react";
import { GalleryItem } from "@/lib/dummyGalleryData";
import { Reveal } from "@/components/motion/Reveal";

interface GalleryMasonryProps {
  items: GalleryItem[];
  onItemClick: (item: GalleryItem) => void;
}

export function GalleryMasonry({ items, onItemClick }: GalleryMasonryProps) {
  // Split items into 4 columns for a bulletproof masonry layout that doesn't break browser height calculations
  const columns = [[], [], [], []] as GalleryItem[][];
  items.forEach((item, index) => {
    columns[index % 4].push(item);
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-28">
        {columns.map((columnItems, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6">
            {columnItems.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 0.05}
                distance={20}
                duration={0.5}
                className={`relative group rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 w-full
                  ${item.aspectRatio === 'portrait' ? 'aspect-[3/4]' : item.aspectRatio === 'video' ? 'aspect-video' : 'aspect-square'}`}
                onClick={() => onItemClick(item)}
              >
                {item.type === 'video' ? (
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    muted loop playsInline preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon Overlay for Video / Documents */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}
                
                {item.type === 'document' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                    <div className="w-12 h-12 bg-blue-500/80 backdrop-blur-md rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Text Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-2">
                    {item.type}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
