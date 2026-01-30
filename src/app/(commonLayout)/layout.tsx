import { Navbar } from "@/components/Navbar";

export default function CommonLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div className="max-w-[90vw] mx-auto">
              <Navbar />
               {children}
          </div>
     );
}