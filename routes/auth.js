import { registerHandler, loginHandler } from "../controllers/authController";

export async function authRoutes(fastify, options) {
  fastify.post("/auth/register", async (request, reply) => {
    return registerHandler(fastify, request, reply);
  });

  fastify.post("/auth/login", async (request, reply) => {
    return loginHandler(fastify, request, reply);
  });
}
