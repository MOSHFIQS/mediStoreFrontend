"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { addToCart, getCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquareText, Star, ShoppingCart } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createReviewAction } from "@/actions/review.action";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function AllMedicinesClient({ initialMedicines, categories }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ── Review state ──────────────────────────────────────
  const [reviewOpen, setReviewOpen] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Search state ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const categoryFromUrl = searchParams.get("category") || "all";

  // ── Cart ──────────────────────────────────────────────
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: () => Promise.resolve(getCart()),
  });

  // ── Reset review state when dialog closes ─────────────
  const handleDialogChange = (open: boolean, medId: string) => {
    setReviewOpen(open ? medId : null);
    if (!open) {
      setRating(5);
      setReviewTitle("");
      setComment("");
    }
  };

  // ── Submit review ─────────────────────────────────────
  const handleReviewSubmit = async (medicineId: string) => {
    if (!user) { router.push("/login"); return; }
    if (!comment.trim()) { toast.error("Please write a comment"); return; }

    setIsSubmitting(true);
    try {
      await createReviewAction({ medicineId, rating, title: reviewTitle, comment });
      toast.success("Review submitted!");
      setReviewOpen(null);
      setRating(5);
      setReviewTitle("");
      setComment("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Debounced search → URL ────────────────────────────
  useEffect(() => {
    if (!search.trim() && (!categoryFromUrl || categoryFromUrl === "all")) return;

    const timer = setTimeout(() => {
      const query = new URLSearchParams();
      if (categoryFromUrl && categoryFromUrl !== "all") query.set("category", categoryFromUrl);
      if (search.trim()) query.set("search", search.trim());
      const qs = query.toString();
      router.push(qs ? `/medicines?${qs}` : "/medicines");
    }, 500);

    return () => clearTimeout(timer);
  }, [search, categoryFromUrl]);

  const handleCategoryClick = (id: string) => {
    router.push(id === "all" ? "/medicines" : `/medicines?category=${id}`);
  };

  const medicines =
    pathname === "/" ? initialMedicines.slice(0, 8) : initialMedicines;

  return (
    <div className="px-4">
      {/* ── Home heading ── */}
      {pathname === "/" && (
        <div className="py-10 text-center">
          <h2 className="text-3xl font-bold pb-4">Wellness at Your Fingertips</h2>
          <p className="text-gray-600">Simple steps you can take today to improve your wellness.</p>
        </div>
      )}

      {/* ── Search + reset ── */}
      {pathname === "/medicines" && (
        <div className="mb-4 flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines..."
            className="border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-300 w-64"
          />
          {(search || categoryFromUrl !== "all") && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => { setSearch(""); router.push("/medicines"); }}
            >
              Reset
            </Button>
          )}
        </div>
      )}

      {/* ── Category pills ── */}
      {pathname === "/medicines" && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              categoryFromUrl === "all"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            All
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                categoryFromUrl === cat.id
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {medicines.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No medicines found.</p>
          <Button variant="ghost" className="mt-3" onClick={() => router.push("/medicines")}>
            Clear filters
          </Button>
        </div>
      )}

      {/* ── Medicine cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {medicines.map((med: any) => {
          const itemInCart = cart.find((i: any) => i.medicineId === med.id);
          const outOfStock = med.stock === 0;
          const cartFull = (itemInCart?.quantity ?? 0) >= med.stock;

          return (
            <Card
              key={med.id}
              className="p-3 rounded-3xl border-2 shadow hover:shadow-md transition-all duration-300 flex flex-col gap-3"
            >
              {/* ── Image ── */}
              <div className="relative h-52 w-full overflow-hidden rounded-2xl group border-2 border-gray-200">
                <Image
                  src={med.image || "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"}
                  alt={med.name || "Medicine"}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Category badge */}
                <span
                  className="absolute top-3 left-3 bg-white/85 backdrop-blur px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-white transition"
                  onClick={() => handleCategoryClick(med.categoryId)}
                >
                  {categories?.find((c: any) => c.id === med.categoryId)?.name || "General"}
                </span>

                {/* Stock badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-medium
                  ${outOfStock ? "bg-red-100 text-red-600" : "bg-white/85 backdrop-blur"}`}>
                  {outOfStock ? "Out of stock" : "In Stock"}
                </span>

                {/* Price */}
                <div className="absolute bottom-3 left-3 flex items-baseline gap-1">
                  {med.discountPrice && med.discountPrice < med.price ? (
                    <>
                      <span className="text-white font-bold text-lg">৳{med.discountPrice}</span>
                      <span className="text-white/70 text-sm line-through">৳{med.price}</span>
                    </>
                  ) : (
                    <span className="text-white font-bold text-lg">৳{med.price}</span>
                  )}
                </div>
              </div>

              {/* ── Content ── */}
              <CardContent className="px-2 pb-0">
                <h3 className="font-semibold line-clamp-1">{med.name}</h3>
                {med.genericName && (
                  <p className="text-xs text-purple-500 font-medium">{med.genericName}</p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                  {med.description}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {outOfStock ? "Out of stock" : `${med.stock} available`}
                </span>
              </CardContent>

              {/* ── Footer ── */}
              <CardFooter className="mt-auto pt-2 px-0">
                <div className="w-full flex items-center justify-between gap-2">

                  {/* Review button — customers only */}
                  {user?.role === "CUSTOMER" && (
                    <Dialog
                      open={reviewOpen === med.id}
                      onOpenChange={(o) => handleDialogChange(o, med.id)}
                    >
                      <DialogTrigger asChild>
                        <button
                          className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition"
                          title="Write a review"
                        >
                          <MessageSquareText className="w-4 h-4 text-gray-500" />
                        </button>
                      </DialogTrigger>

                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Review — {med.name}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 pt-1">
                          {/* Stars */}
                          <div className="space-y-1">
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="transition hover:scale-110"
                                >
                                  <Star
                                    className={`w-7 h-7 transition-colors ${
                                      star <= rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-200 hover:text-yellow-200"
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">
                                {RATING_LABELS[rating]}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <div className="space-y-1">
                            <Label>Title <span className="text-muted-foreground font-normal">(optional)</span></Label>
                            <Input
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                              placeholder="Summarise your experience..."
                              maxLength={80}
                            />
                          </div>

                          {/* Comment */}
                          <div className="space-y-1">
                            <Label>Comment <span className="text-red-400">*</span></Label>
                            <Textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share details about your experience..."
                              rows={3}
                            />
                          </div>

                          <Button
                            onClick={() => handleReviewSubmit(med.id)}
                            disabled={isSubmitting || !comment.trim()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Cart + View */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      onClick={() => {
                        addToCart({
                          medicineId: med.id,
                          quantity: 1,
                          price: med.discountPrice ?? med.price,
                          image: med.image,
                          name: med.name,
                        });
                        queryClient.invalidateQueries({ queryKey: ["cart"] });
                        toast.success(`${med.name} added to cart`);
                      }}
                      disabled={outOfStock || cartFull}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition
                        ${itemInCart
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-800 hover:bg-black text-white"
                        }
                        ${outOfStock || cartFull ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
                    >
                      {itemInCart ? (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span className="bg-white text-green-600 text-xs px-1.5 py-0.5 rounded-full font-bold">
                            {itemInCart.quantity}
                          </span>
                        </>
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5" />
                      )}
                    </Button>

                    <Button
                      onClick={() => router.push(`/medicines/${med.id}`)}
                      variant="outline"
                      className="px-4 py-2 rounded-full text-sm"
                    >
                      View
                    </Button>
                  </div>

                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}