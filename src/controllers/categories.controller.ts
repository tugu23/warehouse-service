import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nameMongolian, nameEnglish, description } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ nameMongolian }, { nameEnglish: nameEnglish || undefined }],
      },
    });

    if (existingCategory) {
      throw new AppError("Category with this name already exists", 400);
    }

    const category = await prisma.category.create({
      data: {
        nameMongolian,
        nameEnglish,
        description,
      },
    });

    logger.info(`New category created: ${category.nameMongolian}`);

    res.status(201).json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { nameMongolian: { contains: search, mode: "insensitive" } },
        { nameEnglish: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: {
            select: {
              id: true,
              nameMongolian: true,
              nameEnglish: true,
            },
          },
        },
        orderBy: { nameMongolian: "asc" },
      }),
      prisma.category.count({ where }),
    ]);

    res.json({
      status: "success",
      data: {
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: {
            supplier: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.json({
      status: "success",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nameMongolian, nameEnglish, description } = req.body;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Check if new name already exists
    if (nameMongolian || nameEnglish) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                { nameMongolian: nameMongolian || category.nameMongolian },
                {
                  nameEnglish: nameEnglish || category.nameEnglish || undefined,
                },
              ],
            },
          ],
        },
      });

      if (existingCategory) {
        throw new AppError("Category with this name already exists", 400);
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        nameMongolian,
        nameEnglish,
        description,
      },
    });

    logger.info(`Category updated: ${updatedCategory.nameMongolian}`);

    res.json({
      status: "success",
      data: { category: updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Check if category has products
    if (category.products.length > 0) {
      throw new AppError(
        "Cannot delete category with associated products. Please reassign or delete the products first.",
        400
      );
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    logger.info(`Category deleted: ${category.nameMongolian}`);

    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
