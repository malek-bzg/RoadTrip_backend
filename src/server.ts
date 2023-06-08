import app from "./app";

const port = process.env.port || 3333;

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});