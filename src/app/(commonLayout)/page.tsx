import { authService } from "@/service/auth.service";
import { decodeToken } from "@/service/decodeToken.service";


const HomePage = async () => {
     const data = await decodeToken.getDecodedUser()
     console.log(data);
     return (
          <div>
               home page 
          </div>
     );
};

export default HomePage;