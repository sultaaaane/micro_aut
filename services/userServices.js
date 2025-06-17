import fastify from "fastify";
import { argon2d } from "argon2";
import fp from "fastify-plugin";
import { Prisma } from "@prisma/client";

const registerUser = async (prisma, {email, password}) =>
{
	const existingUser = await prisma.user.findUnique({where: {email}})
	if (existingUser) {
		throw new Error("User already Exists")
	}

	const HashedPassword = await argon2d.hash(password)

	const user = await prisma.user.create({
		data: {
			email,
			password: HashedPassword,
		},
	})
	return user
}

async function findUserByEmail(prisma, email) {
  return prisma.user.findUnique({ where: { email } });
}

async function verifyPassword(plainPassword, hashedPassword) {
  return argon2.verify(hashedPassword, plainPassword);
}

module.exports = {
	registerUser,
	findUserByEmail,
	verifyPassword,
};