import SellersMedicineClient from "@/components/sellerMedicines/SellersMedicineClient"
import { medicineServiceServer } from "@/service/medicine.server.service"

export default async function Page() {
     const res = await medicineServiceServer.getSellerMedicines()
     const medicines = res.ok ? res?.data?.data : []

     return <SellersMedicineClient medicines={medicines} />
}
