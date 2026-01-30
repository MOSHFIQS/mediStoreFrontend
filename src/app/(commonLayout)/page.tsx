import { sessionService } from "@/service/token.service";



const HomePage = async () => {
     const data = await sessionService.getUserFromToken()
     console.log(data);
     return (
          <div>
               home page
          </div>
     );
};

export default HomePage;