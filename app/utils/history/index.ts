import { TOrder } from '../../redux/types/order';

export const groupedHistory = (sortedHistory: TOrder[]) => {
  const historyMap = sortedHistory.reduce((map, item) => {
    const dateTime = item.createdAt || '';
    const orders = map.get(dateTime) || [];
    map.set(dateTime, [...orders, item]);
    return map;
  }, new Map<string, TOrder[]>());

  const history: Record<string, TOrder[]> = {};
  historyMap.forEach((value, key) => (history[key] = value));
  return history;
};
