import { IProductHistory } from '../../redux/types';

export const groupedHistory = (sortedHistory: IProductHistory[]) => {
  const history: Record<string, IProductHistory[]> = sortedHistory.reduce(
    (acc, item) => {
      const dateTime = item.created_at || '';
      acc[dateTime] = [...(acc[dateTime] || []), item];
      return acc;
    },
    {} as Record<string, IProductHistory[]>
  );
  return history;
};
