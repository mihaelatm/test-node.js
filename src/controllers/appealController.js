import Appeal from "../models/appealModel.js";
import { appealStatus } from "../constants/appealStatus.js";

// Создаем новое обращение
export const createAppeal = async (req, res) => {
  const { subject, message } = req.body;

  // Проверяем, есть ли тема и сообщение
  if (!subject || !message) {
    return res
      .status(400)
      .json({ message: "Subject and message are required." });
  }

  try {
    // Сохраняем обращение в базу
    const appeal = new Appeal({ subject, message });
    await appeal.save();
    res.status(201).json(appeal);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании обращения." });
  }
};

// Переводим обращение в статус "В работе"
export const takeInProgress = async (req, res) => {
  try {
    const appeal = await Appeal.findById(req.params.id);

    // Проверяем, что обращение есть и оно "Новое"
    if (!appeal || appeal.status !== appealStatus.NEW) {
      return res.status(400).json({ message: "Нельзя взять это обращение." });
    }

    // Меняем статус на "В работе"
    appeal.status = appealStatus.IN_PROGRESS;
    await appeal.save();
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении обращения." });
  }
};

// Завершаем обращение, добавляем решение
export const completeAppeal = async (req, res) => {
  const { resolutionText } = req.body;

  try {
    const appeal = await Appeal.findById(req.params.id);

    // Проверяем, что обращение в работе
    if (!appeal || appeal.status !== appealStatus.IN_PROGRESS) {
      return res
        .status(400)
        .json({ message: "Нельзя завершить это обращение." });
    }

    // Меняем статус на "Завершено" и сохраняем решение
    appeal.status = appealStatus.COMPLETED;
    appeal.solution = resolutionText;
    await appeal.save();
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при завершении обращения." });
  }
};

// Отменяем обращение с указанием причины
export const cancelAppeal = async (req, res) => {
  const { cancelReason } = req.body;

  try {
    const appeal = await Appeal.findById(req.params.id);

    // Проверяем, что обращение можно отменить
    if (
      !appeal ||
      [appealStatus.COMPLETED, appealStatus.CANCELLED].includes(appeal.status)
    ) {
      return res
        .status(400)
        .json({ message: "Нельзя отменить это обращение." });
    }

    // Меняем статус на "Отменено" и добавляем причину
    appeal.status = appealStatus.CANCELLED;
    appeal.cancelReason = cancelReason;
    await appeal.save();
    res.json(appeal);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при отмене обращения." });
  }
};

// Получаем список обращений с фильтрацией по дате или по диапазону
export const getAppeals = async (req, res) => {
  const { date, from, to } = req.query;
  let filter = {};

  if (date) {
    // Фильтр на один день
    const day = new Date(date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    filter.createdAt = { $gte: day, $lt: nextDay };
  }

  if (from && to) {
    // Фильтр по интервалу дат
    filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
  }

  try {
    const appeals = await Appeal.find(filter);
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении обращений." });
  }
};

// Отменяем все обращения, которые сейчас "В работе"
export const cancelAllInProgress = async (req, res) => {
  try {
    const result = await Appeal.updateMany(
      { status: appealStatus.IN_PROGRESS },
      {
        status: appealStatus.CANCELLED,
        cancelReason: "Отменено администратором",
      }
    );
    console.log("Result updateMany:", result);
    res.json({
      message: "Все обращения в работе отменены.",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Ошибка в cancelAllInProgress:", error);
    res.status(500).json({ message: "Ошибка при отмене обращений." });
    console.error("Error:", error);
  }
};
