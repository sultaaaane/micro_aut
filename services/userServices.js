import fastify from "fastify";
import * as argon2 from "argon2"; // ✅ correct

import fp from "fastify-plugin";
import { Prisma } from "@prisma/client";

export const registerUser = async (prisma, email, password) => {
  console.log("EMAIL:", email);
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already Exists");
  }

  const HashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: HashedPassword,
    },
  });
  return user;
};

export async function findUserByEmail(prisma, email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(plainPassword, hashedPassword) {
  console.log("SGSDGSDGSDG:", hashedPassword, plainPassword);
  return argon2.verify(hashedPassword, plainPassword);
}
