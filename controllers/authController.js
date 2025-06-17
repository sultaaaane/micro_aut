import fastify from "fastify";
import {
  registerUser,
  findUserByEmail,
  verifyPassword,
} from ("../services/userServices");

export const registerHandler = async (fastify, request, reply) => {
  const { email, password } = reply.body;
  try {
    const user = registerUser(fastify.prisma, email, password);
    const token = fastify.jwt.sign({ userId: user.id });

    return reply.code(201).send({ token, user });
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
};

export const loginHandler = async (fastify, request, reply) => {
  const { email, password } = reply.body;
  try {
    const user = findUserByEmail(fastify.prisma, email);
    const passwordcheck = verifyPassword(password, user.password);

    if (!passwordcheck) return reply.code(400).send("No match to the password");
    const token = fastify.jwt.sign({ userId: user.id });
    return reply.code(201).send({ token, user });
  } catch (error) {
    return reply.code(400).send("Unauthorized");
  }
};
