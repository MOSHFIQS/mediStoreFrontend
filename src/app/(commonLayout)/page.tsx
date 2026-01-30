// "use client"
import { medicineService } from "@/service/medicine.service";
import { sessionService } from "@/service/token.service";



const HomePage = async () => {
     // const data = await sessionService.getUserFromToken()
     // const sellersMedicines = await medicineService.getSellerMedicines()
     // console.log(sellersMedicines);
     // console.log(data);
     return (
          <div>
               home page
          </div>
     );
};

export default HomePage;