import { getSellerMedicinesAction } from "@/actions/medicine.action"
import SellersMedicines from "@/components/sellerMedicines/SellersMedicines"

export default async function Page() {
     const res = await getSellerMedicinesAction()
     const medicines = res.ok ? res?.data : []

     return <SellersMedicines medicines={medicines} />
}
