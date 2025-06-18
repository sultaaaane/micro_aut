import path from "path";
import { fileURLToPath } from "url";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import fastifyStatic from "@fastify/static";

import prismaPlugin from "./plugins/prisma.js";
import { authRoutes } from "./routes/auth.js";

// Needed for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Fastify instance
const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});
// 1. Register core plugins
await fastify.register(formbody);
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

// 2. Register Prisma plugin
await fastify.register(prismaPlugin);

// 3. Add JWT auth decorator
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: "Unauthorized" });
  }
});

// 4. Register routes
await fastify.register(authRoutes);

fastify.get("/", async (_, reply) => {
  reply.redirect("index.html");
});
// 5. Start server
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
