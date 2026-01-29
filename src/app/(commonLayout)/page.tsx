
import { serverAuthService } from '@/service/auth.service';
export const dynamic = "force-dynamic"

const HomePage = async () => {
     const data =await serverAuthService.getDecodedToken()
     console.log(data);
     return (
          <div>
               home page 
          </div>
     );
};

export default HomePage;