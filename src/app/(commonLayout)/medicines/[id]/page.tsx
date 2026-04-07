
import { getMedicineByIdAction } from "@/actions/medicine.action";
import { getAddressesAction } from "@/actions/address.action";
import { sessionService } from "@/service/token.service";
import { Roles } from "@/constants/roles";
import MedicineDetails from "@/components/medicine/MedicineDetails";

export default async function MedicineDetailsPage({
     params,
}: {
     params: Promise<{ id: string }>;
}) {
     const { id } = await params;

     const user = await sessionService.getUserFromToken();

     const isCustomer = user?.role === Roles.customer;

     const [res, addressesRes] = await Promise.all([
          getMedicineByIdAction(id),
          isCustomer ? getAddressesAction() : Promise.resolve(null),
     ]);

     if (!res?.ok) {
          return <p className="p-4">Medicine not found</p>;
     }

     if (isCustomer && !addressesRes?.ok) {
          return (
               <p className="p-6 text-red-600">Failed to load addresses</p>
          );
     }

     return (
          <MedicineDetails
               medicine={res?.data}
               addresses={addressesRes?.data ?? []} // fallback for non-customer
          />
     );
}