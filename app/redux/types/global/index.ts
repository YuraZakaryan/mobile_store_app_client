export type TFetchOptions = {
  page?: number;
  limit?: number;
};
export interface IFetchByCategoryOptions extends TFetchOptions {
  category: string;
}
export interface IFetchByAuthorOptions extends TFetchOptions {
  authorId: string;
}
export interface ISearchProductOptions extends TFetchOptions {
  query: string;
}
export type TItemsWithTotalLength<T> = {
  isLoading: boolean | null;
  isError: boolean;
  isNetworkError: boolean;
  showErrorTest?: string;
  total_items: number;
  items: T;
};
export type TUpdateItem<T> = {
  id: string;
  formData: T;
  navigate?: (route: string) => void;
};
export type TDeleteItem = { _id: string; navigate: (route: string) => void };
export type TCreateItemAndNavigate<T> = { formData: T; navigate: (route: string) => void };
