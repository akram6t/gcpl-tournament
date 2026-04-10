"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import { fetchGallery, type GalleryImage } from "@/lib/cricket-data";

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGallery();
      setImages(data);
    } catch {
      setError("Failed to load gallery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(images.map((img) => img.category))], [images]);
  const filteredImages = images.filter((img) => activeCategory === "All" ? true : img.category === activeCategory);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
          <Camera className="w-6 h-6 text-green-600 dark:text-green-400" /> Gallery
        </h2>
        <p className="text-muted-foreground text-sm">Capturing the best moments of GCPL Season 4</p>
      </motion.div>

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadGallery}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {loading && !error && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {["All", "Highlights", "Teams"].map((cat) => (
              <Skeleton key={cat} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video w-full" />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <Badge key={cat} className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                activeCategory === cat
                  ? "bg-primary/15 text-primary border-primary/25 hover:bg-primary/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              }`} onClick={() => setActiveCategory(cat)}>{cat}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="group">
                <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                  <div className="relative aspect-video bg-gradient-to-br from-green-500/10 via-muted to-lime-500/10 flex items-center justify-center overflow-hidden">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <div className="w-16 h-16 rounded-full bg-green-500/30 blur-xl" />
                        </div>
                        <ImageIcon className="w-10 h-10 text-green-500/40 group-hover:scale-110 transition-transform relative z-0" />
                      </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                      <p className="text-sm font-semibold text-white drop-shadow-lg line-clamp-2">{image.title}</p>
                      <Badge className="mt-1 text-xs bg-white/20 text-white border-white/20 backdrop-blur-sm">
                        <Sparkles className="w-2.5 h-2.5 mr-1" />{image.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No photos in this category yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
