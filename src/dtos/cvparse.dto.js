export const cvparseDto = (userSettings) => {
  return {
    resume: JSON.parse(userSettings.resume),
    career_blueprint: JSON.parse(userSettings.career_blueprint),
  };
};
