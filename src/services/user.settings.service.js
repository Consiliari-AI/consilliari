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
