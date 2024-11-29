import server from "./app";

const PORT = process.env.PORT || 8800;

server.listen(PORT, () => {
  console.log(`Server is running...`);
});
