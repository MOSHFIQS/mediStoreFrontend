import AddressesClient from "@/components/addresses/AddressesClient";
import { addressServiceServer } from "@/service/address.server.service";

export default async function AddressesPage() {
  const res = await addressServiceServer.getAll();
  return <AddressesClient initialAddresses={res.ok ? res.data.data : []} />;
}