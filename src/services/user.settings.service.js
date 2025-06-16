import prisma from "../lib/prisma.js";

export const createUserSettings = async (user_id, resume_content, resume, career_blueprint) => {
  const existingSettings = await prisma.userSettings.findUnique({
    where: { user_id },
  });

  if (existingSettings) {
    return existingSettings;
  }
  const newSettings = await prisma.userSettings.create({
    data: {
      user_id,
      resume_content,
      resume,
      career_blueprint,
    },
  });

  return newSettings;
};

export const updateUserSettings = async (userId, updateData) => {
  const updatedSettings = await prisma.userSettings.update({
    where: { user_id: userId },
    data: updateData,
  });

  return updatedSettings;
};

export const getUserSettings = async (userId) => {
  const settings = await prisma.userSettings.findUnique({
    where: { user_id: userId },
  });

  return settings;
};
