import prisma from "../lib/prisma.js";

export const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user;
};

export const createUser = async (userData) => {
  const user = await prisma.user.create({
    data: {
      id: userData.id,
      email: userData.email.toLowerCase(),
      full_name: userData.full_name,
      email_verified: false,
    },
  });
  return user;
};

export const updateUserEmailVerification = async (userId) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { email_verified: true },
  });
  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  return user;
};
