"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addToCart, getCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Image from "next/image";
import { Input } from "../ui/input";
import { AppImage } from "../shared/image/AppImage";

export default function AllMedicines({ initialMedicines, categories }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // ── Search state ──────────────────────────────────────
  const [search, setSearch] = useState("");
  const categoryFromUrl = searchParams.get("category") || "all";

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
      if (categoryFromUrl && categoryFromUrl !== "all") query.set("category", categoryFromUrl);
      if (search.trim()) query.set("search", search.trim());
      const qs = query.toString();
      router.push(qs ? `/medicines?${qs}` : "/medicines");
    }, 500);

    return () => clearTimeout(timer);
  }, [search, categoryFromUrl]);

  const handleCategoryClick = (id: string) => {
    router.push(id === "all" ? "/medicines" : `/medicines?category=${id}`);
    setSearch("")
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
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines..."
            className="border mt-2 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-300 w-64 bg-white"
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${categoryFromUrl === "all"
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${categoryFromUrl === cat.id
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                <div className="absolute inset-0">
                  <AppImage
                    src={med.images?.[0] || "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"}
                    alt={med.name || "Medicine"}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={300}
                    height={208}
                  />
                </div>
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
                <div className="w-full flex items-center justify-end gap-2">
                  <Button
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
                    onClick={() => {

                      router.push(`/medicines/${med.id}`);
                    }}
                    variant="outline"
                    className="px-4 py-2 rounded-full text-sm"
                  >
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}