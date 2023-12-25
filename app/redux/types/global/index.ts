export type TFetchOptions = {
  page?: number;
  limit?: number;
};
export type TItemsWithTotalLength<T> = {
  isLoading: boolean;
  isError: boolean;
  total_items: number;
  items: T;
};
export type TUpdateItem<T> = {
  id: string;
  formData: T;
};
export type TDeleteItem = { _id: string; navigate: (route: string) => void };
