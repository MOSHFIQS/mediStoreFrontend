"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCart, getCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingCart, Search, X, Check, Eye, Sparkles, AlertCircle } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Input } from "../ui/input";
import { AppImage } from "../shared/image/AppImage";
import Link from "next/link";

export default function AllMedicines({ initialMedicines = [], categories = [] }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ── Search state ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const categoryFromUrl = searchParams.get("category") || searchParams.get("categoryId") || "all";

  // ── Cart ──────────────────────────────────────────────
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: () => Promise.resolve(getCart()),
  });

  // ── Debounced search → URL ────────────────────────────
  useEffect(() => {
    if (!search.trim() && (!categoryFromUrl || categoryFromUrl === "all")) return;

    const timer = setTimeout(() => {
      const query = new URLSearchParams();
      if (categoryFromUrl && categoryFromUrl !== "all") query.set("categoryId", categoryFromUrl);
      if (search.trim()) query.set("search", search.trim());
      const qs = query.toString();
      router.push(qs ? `/medicines?${qs}` : "/medicines");
    }, 400);

    return () => clearTimeout(timer);
  }, [search, categoryFromUrl]);

  const handleCategoryClick = (id: string) => {
    router.push(id === "all" ? "/medicines" : `/medicines?categoryId=${id}`);
    setSearch("");
  };

  const medicines = Array.isArray(initialMedicines)
    ? (pathname === "/" ? initialMedicines.slice(0, 8) : initialMedicines)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ── Home heading ── */}
      {pathname === "/" && (
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Essential Medicines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Wellness At Your Fingertips
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Browse authentic, physician-recommended medicines and supplements ready for instant delivery.
          </p>
        </div>
      )}

      {/* ── Search & Filters Bar (on /medicines page) ── */}
      {pathname === "/medicines" && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, generic, or condition..."
                className="pl-10 pr-9 rounded-full h-11 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-teal-500/20 focus-visible:border-teal-500 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {(search || categoryFromUrl !== "all") && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs text-slate-600 hover:text-teal-700 border-slate-200"
                onClick={() => {
                  setSearch("");
                  router.push("/medicines");
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* ── Category Pills ── */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  categoryFromUrl === "all"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:text-teal-700"
                }`}
                onClick={() => handleCategoryClick("all")}
              >
                All Medicines
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    categoryFromUrl === cat.id
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400 hover:text-teal-700"
                  }`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Empty State ── */}
      {medicines.length === 0 && (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Medicines Found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any medicine matching your criteria. Try adjusting your search query or filters.
          </p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setSearch("");
              router.push("/medicines");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* ── Medicine Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {medicines.map((med: any) => {
          const itemInCart = cart.find((i: any) => i.medicineId === med.id);
          const outOfStock = med.stock === 0;
          const cartFull = (itemInCart?.quantity ?? 0) >= med.stock;
          const hasDiscount = med.discountPrice && med.discountPrice < med.price;
          const discountPercent = hasDiscount
            ? Math.round(((med.price - med.discountPrice) / med.price) * 100)
            : 0;

          return (
            <div
              key={med.id}
              className="group relative flex flex-col justify-between p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                {/* ── Image & Badges Container ── */}
                <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-3">
                  <AppImage
                    src={
                      med.images?.[0] ||
                      "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"
                    }
                    alt={med.name || "Medicine"}
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                    width={260}
                    height={180}
                  />

                  {/* Stock Pill Badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border ${
                      outOfStock
                        ? "bg-rose-50/90 text-rose-600 border-rose-200"
                        : "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {outOfStock ? "Out of Stock" : "In Stock"}
                  </span>

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* ── Medicine Details ── */}
                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      {categories?.find((c: any) => c.id === med.categoryId)?.name || "Pharmacy"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {outOfStock ? "Unavailable" : `${med.stock} in stock`}
                    </span>
                  </div>

                  <Link href={`/medicines/${med.id}`} className="block group-hover:text-teal-600 transition-colors">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                      {med.name}
                    </h3>
                  </Link>

                  {med.genericName && (
                    <p className="text-xs text-slate-500 italic line-clamp-1">
                      {med.genericName}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                    {med.description || "Certified pharmacy formulation for medical use."}
                  </p>
                </div>
              </div>

              {/* ── Price and Actions ── */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ৳{med.discountPrice && hasDiscount ? med.discountPrice : med.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳{med.price}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full w-9 h-9 p-0 border-slate-200 dark:border-slate-700 hover:text-teal-600"
                    onClick={() => router.push(`/medicines/${med.id}`)}
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    disabled={outOfStock || cartFull}
                    onClick={() => {
                      addToCart({
                        medicineId: med.id,
                        quantity: 1,
                        price: med.discountPrice ?? med.price,
                        image: med.images?.[0],
                        name: med.name,
                      });
                      queryClient.invalidateQueries({ queryKey: ["cart"] });
                      toast.success(`${med.name} added to cart`);
                    }}
                    className={`rounded-full px-3.5 h-9 font-semibold text-xs flex items-center gap-1.5 transition-all ${
                      itemInCart
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20"
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{itemInCart ? `In Cart (${itemInCart.quantity})` : "Add"}</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── View All Link on Homepage ── */}
      {pathname === "/" && medicines.length > 0 && (
        <div className="text-center pt-8">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-12 text-sm font-bold border-teal-200 hover:border-teal-500 hover:bg-teal-50/50 text-teal-700"
          >
            <Link href="/medicines">
              View All Medicines
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
