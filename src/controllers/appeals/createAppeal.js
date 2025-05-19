import Appeal from "../../models/appealModel";
import { appealStatus } from "../../constants/appealStatus";

export const createAppeal = async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res
      .status(400)
      .json({ message: "Subject and message are required." });
  }
  try {
    const appeal = new appeal.create({
      subject,
      message,
    });

    await appeal.save();

    res.status(201).json(appeal);
  } catch (error) {
    res.status(500).json({ message: "Error occured while creating appeal." });
  }
};
