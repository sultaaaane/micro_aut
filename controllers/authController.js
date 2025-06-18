import fastify from "fastify";
import {
  registerUser,
  findUserByEmail,
  verifyPassword,
} from "../services/userServices.js";

export const registerHandler = async (fastify, request, reply) => {
  const { email, password } = request.body;
  console.log("BODY:", request.body, email);

  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password are required" });
  }
  try {
    const user = registerUser(fastify.prisma, email, password);
    const token = fastify.jwt.sign({ userId: user.id });

    return reply.code(201).send({ token, user });
  } catch (err) {
    return reply.code(400).send({ error: err.message });
  }
};

export const loginHandler = async (fastify, request, reply) => {
  const { email, password } = request.body;
  try {
    const user = await findUserByEmail(fastify.prisma, email);
    console.log("PASSWORD:",password,email,user)
    const passwordcheck = verifyPassword(password, user.password);

    if (!passwordcheck) return reply.code(400).send("No match to the password");
    const token = fastify.jwt.sign({ userId: user.id });
    return reply.code(201).send({ token, user });
  } catch (error) {
    return reply.code(400).send("Unauthorized");
  }
};
