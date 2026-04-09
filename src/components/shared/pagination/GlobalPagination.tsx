"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  page: number;
  totalPages: number;
  limit: number;
};

export default function GlobalPagination({
  page,
  totalPages,
  limit,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 👉 PAGE CHANGE
  const handlePageChange = (type: "next" | "prev") => {
    const params = new URLSearchParams(searchParams.toString());

    let newPage = page;

    if (type === "next" && page < totalPages) {
      newPage = page + 1;
    }

    if (type === "prev" && page > 1) {
      newPage = page - 1;
    }

    params.set("page", String(newPage));

    router.push(`?${params.toString()}`);
  };

  // 👉 LIMIT CHANGE
  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", value);
    params.set("page", "1"); // reset page

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {/* LIMIT */}
      <Field
        orientation="horizontal"
        className="w-fit items-center gap-2 px-2 py-1 rounded-lg border bg-[#ebd6fb] dark:bg-white/5 backdrop-blur-sm"
      >
        <FieldLabel
          htmlFor="select-rows-per-page"
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          Rows
        </FieldLabel>

        <Select value={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger
            id="select-rows-per-page"
            className="h-7 w-[70px] text-xs rounded-md border border-purple-200 bg-[#eef0ff] shadow  dark:bg-[#1f1f23] focus:ring-1 focus:ring-violet-500"
          >
            <SelectValue placeholder="10" />
          </SelectTrigger>

          <SelectContent align="end" className="rounded-md text-xs bg-[#eef0ff] dark:bg-[#1f1f23]">
            <SelectGroup>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {/* PAGINATION */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent className="flex items-center gap-2 px-2 py-1 rounded-lg border bg-[#ebd6fb] dark:bg-white/5 backdrop-blur-sm">

          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange("prev")}
              className={`h-7 px-2 text-xs rounded-md transition ${page === 1
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                }`}
            />
          </PaginationItem>

          <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
            {page} / {totalPages}
          </span>

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange("next")}
              className={`h-7 px-2 text-xs rounded-md transition ${page === totalPages
                  ? "pointer-events-none opacity-40"
                  : "cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                }`}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}