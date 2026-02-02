import Link from "next/link";

export default function EmptyPage() {
     return (
          <div className="min-h-[70vh] flex items-center justify-center px-4">
               <div className="max-w-md w-full text-center border border-gray-200 rounded-xl p-8 shadow-sm bg-white">

                    <div className="flex justify-center mb-4">
                         <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-3xl">
                              🩺
                         </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                         Nothing Here Yet
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                         Looks like there’s no data to display right now.
                         Once items are added, they’ll show up here.
                    </p>

                    <Link href={'/'}
                         className="w-full bg-primary text-white py-2 rounded-md font-medium hover:opacity-90 transition px-2"
                    >
                         Go Home
                    </Link>
               </div>
          </div>
     );
}
