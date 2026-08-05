type PromotionLike = {
  id?: number;
  type: string;
  buyQty: number | null;
  freeQty: number | null;
  isActive: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

export function isPromotionCurrentlyActive(promo: PromotionLike, at = Date.now()): boolean {
  if (!promo.isActive) return false;
  const start = promo.startDate ? new Date(promo.startDate).getTime() : 0;
  const end = promo.endDate ? new Date(promo.endDate).getTime() : Number.MAX_SAFE_INTEGER;
  return start <= at && at <= end;
}

export function getActiveBuyXGetYPromotions(
  promotions: PromotionLike[] | undefined,
  at = Date.now()
): PromotionLike[] {
  if (!promotions?.length) return [];
  return promotions.filter(
    (p) =>
      p.type === "BUY_X_GET_Y" &&
      p.buyQty != null &&
      p.freeQty != null &&
      p.buyQty > 0 &&
      p.freeQty > 0 &&
      isPromotionCurrentlyActive(p, at)
  );
}

function calcBonusQty(quantity: number, promo: PromotionLike): number {
  const buyQty = Number(promo.buyQty || 0);
  const freeQty = Number(promo.freeQty || 0);
  if (buyQty < 1 || freeQty < 1 || quantity < buyQty) return 0;
  return Math.floor(quantity / buyQty) * freeQty;
}

export function getBuyXGetYBonusQty(
  quantity: number,
  promotions: PromotionLike[] | undefined,
  at = Date.now(),
  options?: { promotionId?: number | null }
): number {
  // Early return: no promotions available → no bonus
  const active = getActiveBuyXGetYPromotions(promotions, at);
  if (!active.length) return 0;

  // If an explicit promotionId was provided, use ONLY that promotion
  // Handle both null and undefined to avoid fallback logic running for non-applicable promos
  if (options?.promotionId !== undefined && options?.promotionId !== null) {
    const selected = active.find((p) => p.id === options.promotionId);
    if (selected) {
      return calcBonusQty(quantity, selected);
    }
    // Selected promotion not found (expired/deleted) → no bonus
    return 0;
  }

  // Fallback: pick best among all active promotions (legacy behavior)
  let bestQty = 0;
  let bestBuy = 0;
  for (const p of active) {
    const buyQty = Number(p.buyQty || 0);
    if (quantity < buyQty) continue;
    const free = calcBonusQty(quantity, p);
    if (free > 0 && (buyQty > bestBuy || (buyQty === bestBuy && free > bestQty))) {
      bestBuy = buyQty;
      bestQty = free;
    }
  }
  return bestQty;
}
