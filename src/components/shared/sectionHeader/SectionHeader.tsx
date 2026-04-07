"use client";

import { cn } from "@/lib/utils";

type Props = {
     title: string;
     description?: string;
     align?: "left" | "center" | "right";
     className?: string;
};

const SectionHeader = ({
     title,
     description,
     align = "left",
     className,
}: Props) => {
     const alignClass =
          align === "center"
               ? "text-center items-center"
               : align === "right"
                    ? "text-right items-end"
                    : "text-left items-start";

     return (
          <div className={cn("flex flex-col gap-2 my-16", alignClass, className)}>
               <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                    {title}
               </h2>

               {description && (
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                         {description}
                    </p>
               )}
          </div>
     );
};

export default SectionHeader;