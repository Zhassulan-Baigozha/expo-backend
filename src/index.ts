import dotenv from "dotenv";
import Fastify from "fastify";

dotenv.config();

const app = Fastify({ logger: true });

app.get("/", async () => ({ status: "Hello Word" }));

app.listen({ port: Number(process.env.PORT) || 8080 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
