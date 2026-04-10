"use client";

import { useState, useMemo } from "react";
import { galleryImages } from "@/lib/cricket-data";
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
  AlertDialogTrigger,
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
} from "lucide-react";
import { GalleryImage } from "@/lib/cricket-data";

const categories = [
  "All",
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

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
  });

  const uniqueCategories = useMemo(() => {
    const cats = new Set(galleryImages.map((img) => img.category));
    return categories.filter((c) => c === "All" || cats.has(c));
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return galleryImages;
    return galleryImages.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  const openUploadDialog = () => {
    setUploadForm({ title: "", category: "" });
    setUploadDialogOpen(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setEditForm({ title: image.title, category: image.category });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (image: GalleryImage) => {
    setDeletingImage(image);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Gallery Management</h2>
          <p className="text-sm text-muted-foreground">Manage tournament photos and media</p>
        </div>
        <Button className="gap-2" onClick={openUploadDialog}>
          <Upload className="w-4 h-4" />
          Upload Photos
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Photos"
          value={galleryImages.length}
          icon={Camera}
          description="In gallery"
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-500/15"
        />
        <StatsCard
          title="Categories"
          value={uniqueCategories.length - 1}
          icon={FolderOpen}
          description="Active categories"
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-500/15"
        />
        <StatsCard
          title="Latest Upload"
          value="28 Jan 2025"
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
              {uniqueCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  {category !== "All" && (
                    <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]">
                      {galleryImages.filter((img) => img.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* View Toggle & Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredImages.length} photo{filteredImages.length !== 1 ? "s" : ""} found
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

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No Photos Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                No photos found in the &ldquo;{selectedCategory}&rdquo; category. Try selecting a different category or upload new photos.
              </p>
              <Button variant="outline" onClick={() => setSelectedCategory("All")}>
                <X className="w-4 h-4 mr-2" />
                Clear Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid View */}
      {filteredImages.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((image, idx) => (
            <Card
              key={image.id}
              className="border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Image Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-green-500/10 via-muted to-lime-500/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
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
      {filteredImages.length > 0 && viewMode === "list" && (
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
                      <div className="w-14 h-10 rounded-md bg-gradient-to-br from-green-500/10 via-muted to-lime-500/10 flex items-center justify-center">
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
                      <span className="text-sm text-muted-foreground">28 Jan 2025</span>
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
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upload-category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(val) => setUploadForm({ ...uploadForm, category: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* File Upload Area */}
            <div className="grid gap-2">
              <Label>Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>
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
            <DialogDescription>
              Update photo details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(val) => setEditForm({ ...editForm, category: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
