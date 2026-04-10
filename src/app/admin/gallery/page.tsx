"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  ImageIcon,
  Grid3X3,
  List,
  Pencil,
  Trash2,
  Camera,
  FolderOpen,
  Calendar,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Predefined category list for dropdowns ──────────────────────────
const predefinedCategories = [
  "Events",
  "Highlights",
  "Teams",
  "Venues",
  "Celebrations",
  "Fans",
  "Match Moments",
  "Behind the Scenes",
];

type ViewMode = "grid" | "list";

// ─── Skeleton components ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
      </CardContent>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell>
        <div className="w-14 h-10 rounded-md bg-muted animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded w-40 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-5 bg-muted rounded w-20 animate-pulse" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <div className="h-4 bg-muted rounded w-24 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function GalleryPage() {
  // Data state
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<GalleryItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
  });

  // ─── Fetch gallery data ──────────────────────────────────────────
  const fetchGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<GalleryItem[]>("/api/gallery");
      setImages(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load gallery";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // ─── Derived data ────────────────────────────────────────────────
  const allCategories = useMemo(() => {
    const dataCategories = new Set(images.map((img) => img.category));
    // Show "All" plus predefined categories that have data, plus any dynamic categories
    const dynamicCategories = Array.from(dataCategories).filter(
      (c) => !predefinedCategories.includes(c)
    );
    const sorted = [...predefinedCategories, ...dynamicCategories].filter(
      (c) => c === "All" || dataCategories.has(c)
    );
    return ["All", ...sorted];
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const latestUploadDate = useMemo(() => {
    if (images.length === 0) return "N/A";
    const sorted = [...images].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return new Date(sorted[0].createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [images]);

  const activeCategoryCount = useMemo(() => {
    return new Set(images.map((img) => img.category)).size;
  }, [images]);

  // ─── Mutation handlers ───────────────────────────────────────────
  const handleUpload = async () => {
    if (!uploadForm.title.trim() || !uploadForm.category) {
      toast.error("Please fill in title and select a category");
      return;
    }
    try {
      setIsMutating(true);
      await apiPost<GalleryItem>("/api/gallery", {
        title: uploadForm.title.trim(),
        category: uploadForm.category,
        imageUrl: uploadForm.imageUrl.trim() || null,
      });
      toast.success("Photo added to gallery successfully");
      setUploadDialogOpen(false);
      setUploadForm({ title: "", category: "", imageUrl: "" });
      await fetchGallery();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload photo";
      toast.error(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleEdit = async () => {
    if (!editingImage || !editForm.title.trim() || !editForm.category) {
      toast.error("Please fill in title and select a category");
      return;
    }
    try {
      setIsMutating(true);
      await apiPut<GalleryItem>("/api/gallery", {
        id: editingImage.id,
        title: editForm.title.trim(),
        category: editForm.category,
        imageUrl: editForm.imageUrl.trim() || null,
      });
      toast.success("Photo updated successfully");
      setEditDialogOpen(false);
      setEditingImage(null);
      await fetchGallery();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update photo";
      toast.error(message);
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingImage) return;
    try {
      setIsMutating(true);
      await apiDelete("/api/gallery", deletingImage.id);
      toast.success(`"${deletingImage.title}" deleted from gallery`);
      setDeleteDialogOpen(false);
      setDeletingImage(null);
      await fetchGallery();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete photo";
      toast.error(message);
    } finally {
      setIsMutating(false);
    }
  };

  // ─── Dialog openers ──────────────────────────────────────────────
  const openUploadDialog = () => {
    setUploadForm({ title: "", category: "", imageUrl: "" });
    setUploadDialogOpen(true);
  };

  const openEditDialog = (image: GalleryItem) => {
    setEditingImage(image);
    setEditForm({
      title: image.title,
      category: image.category,
      imageUrl: image.imageUrl || "",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (image: GalleryItem) => {
    setDeletingImage(image);
    setDeleteDialogOpen(true);
  };

  // ─── Helper: category count ──────────────────────────────────────
  const getCategoryCount = (category: string) => {
    return images.filter((img) => img.category === category).length;
  };

  // ─── Helper: format date ─────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Gallery Management</h2>
          <p className="text-sm text-muted-foreground">Manage tournament photos and media</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={fetchGallery}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="gap-2" onClick={openUploadDialog}>
            <Upload className="w-4 h-4" />
            Upload Photos
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Photos"
          value={images.length}
          icon={Camera}
          description="In gallery"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Categories"
          value={activeCategoryCount}
          icon={FolderOpen}
          description="Active categories"
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/15"
        />
        <StatsCard
          title="Latest Upload"
          value={latestUploadDate}
          icon={Calendar}
          description="Most recent photo"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-500/15"
        />
      </div>

      {/* Category Filter & View Toggle */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Category Badges */}
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                // Loading skeletons for category badges
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 rounded-md bg-muted animate-pulse"
                  />
                ))
              ) : (
                allCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {category !== "All" && (
                      <Badge
                        variant="secondary"
                        className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]"
                      >
                        {getCategoryCount(category)}
                      </Badge>
                    )}
                  </Button>
                ))
              )}
            </div>

            {/* View Toggle & Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : `${filteredImages.length} photo${filteredImages.length !== 1 ? "s" : ""} found`}
              </p>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5">
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Failed to Load Gallery</h3>
              <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
              <Button variant="outline" onClick={fetchGallery} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20">Preview</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-40">Category</TableHead>
                      <TableHead className="w-32 hidden sm:table-cell">Date</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredImages.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Photos Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {selectedCategory !== "All"
                  ? `No photos found in the "${selectedCategory}" category. Try selecting a different category or upload new photos.`
                  : "No photos in the gallery yet. Click the button below to upload your first photo."}
              </p>
              {selectedCategory !== "All" ? (
                <Button variant="outline" onClick={() => setSelectedCategory("All")}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filter
                </Button>
              ) : (
                <Button onClick={openUploadDialog} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload First Photo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {!isLoading && filteredImages.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image) => (
            <Card
              key={image.id}
              className="border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Image / Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-green-500/10 via-muted to-lime-500/10 flex items-center justify-center overflow-hidden">
                {image.imageUrl ? (
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.querySelector(".fallback-icon")!.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <ImageIcon className="w-10 h-10 text-muted-foreground/40 fallback-icon" />
                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openEditDialog(image)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => openDeleteDialog(image)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
              {/* Card Info */}
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {image.title}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => openDeleteDialog(image)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                  </Button>
                </div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {image.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && filteredImages.length > 0 && viewMode === "list" && (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-20">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-40">Category</TableHead>
                  <TableHead className="w-32 hidden sm:table-cell">Date</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImages.map((image) => (
                  <TableRow key={image.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="w-14 h-10 rounded-md bg-gradient-to-br from-green-500/10 via-muted to-lime-500/10 flex items-center justify-center overflow-hidden">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : null}
                        <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{image.title}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {image.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(image.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(image)}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openDeleteDialog(image)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add a new photo to the tournament gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="upload-title">Title</Label>
              <Input
                id="upload-title"
                placeholder="Enter photo title..."
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upload-category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(val) =>
                  setUploadForm({ ...uploadForm, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upload-image-url">Image URL (optional)</Label>
              <Input
                id="upload-image-url"
                placeholder="https://example.com/photo.jpg"
                value={uploadForm.imageUrl}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, imageUrl: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Paste a direct link to the image file
              </p>
            </div>
            {/* Upload area visual */}
            <div className="grid gap-2">
              <Label>Preview</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Or provide an image URL above
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadDialogOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isMutating} className="gap-2">
              {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
              Upload Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <DialogDescription>Update photo details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(val) =>
                  setEditForm({ ...editForm, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image-url">Image URL (optional)</Label>
              <Input
                id="edit-image-url"
                placeholder="https://example.com/photo.jpg"
                value={editForm.imageUrl}
                onChange={(e) =>
                  setEditForm({ ...editForm, imageUrl: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isMutating} className="gap-2">
              {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingImage
                ? `Are you sure you want to delete "${deletingImage.title}"? This action cannot be undone and the photo will be permanently removed from the gallery.`
                : "Are you sure you want to delete this photo?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 gap-2"
              onClick={handleDelete}
              disabled={isMutating}
            >
              {isMutating && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
