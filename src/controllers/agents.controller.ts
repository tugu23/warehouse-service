import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";
import logger from "../utils/logger";

export const recordAgentLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const agentId = parseInt(id);

    // Sales agents can only record their own location
    if (
      authReq.user?.role === "SalesAgent" &&
      authReq.user.userId !== agentId
    ) {
      throw new AppError("You can only record your own location", 403);
    }

    // Verify agent exists
    const agent = await prisma.employee.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new AppError("Agent not found", 404);
    }

    const location = await prisma.agentLocation.create({
      data: {
        agentId,
        latitude,
        longitude,
      },
    });

    logger.debug(
      `Location recorded for agent ${agentId}: (${latitude}, ${longitude})`
    );

    res.status(201).json({
      status: "success",
      data: { location },
    });
  } catch (error) {
    next(error);
  }
};

export const getAgentRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { startDate, endDate, excludeMarket } = req.query;

    const agentId = parseInt(id);

    // Verify agent exists
    const agent = await prisma.employee.findUnique({
      where: { id: agentId },
      include: { 
        role: true,
        store: true,
      },
    });

    if (!agent) {
      throw new AppError("Agent not found", 404);
    }

    const where: any = { agentId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate as string);
      }
    }

    let locations = await prisma.agentLocation.findMany({
      where,
      orderBy: { timestamp: "asc" },
    });

    // Filter out market locations if requested
    if (excludeMarket === "true" && agent.store) {
      if (agent.store.storeType === "Market") {
        // If agent is assigned to a market, filter out locations near that market
        const marketLat = agent.store.locationLatitude;
        const marketLng = agent.store.locationLongitude;
        
        if (marketLat && marketLng) {
          // Filter out locations within ~200m of the market (approximately 0.002 degrees)
          const threshold = 0.002;
          locations = locations.filter((loc) => {
            const latDiff = Math.abs(loc.latitude - marketLat);
            const lngDiff = Math.abs(loc.longitude - marketLng);
            return latDiff > threshold || lngDiff > threshold;
          });
        }
      }
    }

    res.json({
      status: "success",
      data: {
        agent: {
          id: agent.id,
          name: agent.name,
          email: agent.email,
          role: agent.role.name,
          store: agent.store ? {
            id: agent.store.id,
            name: agent.store.name,
            storeType: agent.store.storeType,
          } : null,
        },
        route: locations,
        totalPoints: locations.length,
        filtered: excludeMarket === "true",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAgentLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date } = req.query;

    const where: any = {};

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      where.timestamp = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const locations = await prisma.agentLocation.findMany({
      where,
      include: {
        agent: {
          include: { role: true },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    // Group by agent
    const groupedByAgent: any = {};

    locations.forEach((location) => {
      if (!groupedByAgent[location.agentId]) {
        groupedByAgent[location.agentId] = {
          agent: {
            id: location.agent.id,
            name: location.agent.name,
            email: location.agent.email,
            role: location.agent.role.name,
          },
          locations: [],
        };
      }
      groupedByAgent[location.agentId].locations.push({
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp,
      });
    });

    res.json({
      status: "success",
      data: {
        agents: Object.values(groupedByAgent),
        totalLocations: locations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
