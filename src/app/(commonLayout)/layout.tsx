
export default function CommonLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div>
               {/* <Navbar /> */}
               this is navbar
               {children}
          </div>
     );
}