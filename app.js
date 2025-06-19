import path from "path";
import { fileURLToPath } from "url";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import fastifyStatic from "@fastify/static";

import prismaPlugin from "./plugins/prisma.js";
import { authRoutes } from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

await fastify.register(formbody);

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

await fastify.register(prismaPlugin);

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: "Unauthorized" });
  }
});

await fastify.register(authRoutes);

fastify.get("/", async (_, reply) => {
  reply.redirect("index.html");
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server ready at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
