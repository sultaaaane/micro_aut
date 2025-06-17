import fastifyPlugin from "fastify-plugin";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

const jwtPlugin = async (fastify, options) => {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT,
    sign: {
      expiresIn: "15min",
    },
  });


fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
	reply.code(401).send({error: 'Unauthorized'})
  }
})
};

module.exports = fp(jwtPlugin);