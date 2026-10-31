import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import { isPrivileged, isSalesAgent } from "./roles";

/**
 * Admin/Manager: must pass agentId query. Agents: may omit agentId (uses own id) or must match self.
 */
export function assertAgentKpiAgentAccess(
  req: AuthRequest,
  requestedAgentId: number | undefined
): number {
  const user = req.user;
  if (!user) throw new AppError("Нэвтрээгүй", 401);

  if (isPrivileged(user.role)) {
    if (requestedAgentId == null || Number.isNaN(requestedAgentId)) {
      throw new AppError("agentId шаардлагатай", 400);
    }
    return requestedAgentId;
  }

  if (isSalesAgent(user.role)) {
    if (
      requestedAgentId != null &&
      !Number.isNaN(requestedAgentId) &&
      requestedAgentId !== user.userId
    ) {
      throw new AppError("Зөвхөн өөрийн KPI харж болно", 403);
    }
    return user.userId;
  }

  throw new AppError("Эрх хүрэлцэхгүй", 403);
}

export function assertManagerOrAdmin(req: AuthRequest): void {
  const user = req.user;
  if (!user) throw new AppError("Нэвтрээгүй", 401);
  if (!isPrivileged(user.role)) {
    throw new AppError("Эрх хүрэлцэхгүй", 403);
  }
}
