import app from "./app";
import { userController } from "./controllers/user.controller";

app.post("/api/users", userController.createUser);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
