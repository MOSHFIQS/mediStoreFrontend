"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    params.set("page", "1"); // reset page on search

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-sm">
      <Input
        defaultValue={searchParams.get("search") || ""}
        placeholder="Search..."
        onChange={(e) => handleSearch(e.target.value)}
        className="h-8 text-sm rounded-md border bg-[#eef0ff] dark:bg-[#1f1f23]"
      />
    </div>
  );
}