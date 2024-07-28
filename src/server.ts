import app from "./index";
import { environment } from "./config";

const PORT = Number(environment.PORT);

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on localhost:${PORT}`);
    });
  } catch (err: any) {
    process.exit(1);
  }
};

startServer();
