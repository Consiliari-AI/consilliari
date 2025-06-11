export const cvFileValidator = (req, res, next) => {
  const file = req.file;
  const allowedExtensions = [".pdf"];
  const maxSizeInBytes = 5 * 1024 * 1024;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "cv is required.",
    });
  }
  const extension = file.originalname.slice(((file.originalname.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

  if (!allowedExtensions.includes(`.${extension}`)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type! Allowed: .pdf",
    });
  }

  if (file.size > maxSizeInBytes) {
    return res.status(400).json({
      success: false,
      message: "cv must not exceed 5MB.",
    });
  }

  next();
};
