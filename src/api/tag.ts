import type { baseResponse, listDataType, optionType } from "@/api";
import { cacheRequest, useAxios } from "@/api";

export const tagOptionsApi: () => Promise<baseResponse<optionType[]>> =
  cacheRequest(() => useAxios.get("/api/tag_names"));

export interface tagType {
  tag: string;
  count: number;
}

export function tagArticleListApi(): Promise<
  baseResponse<listDataType<tagType>>
> {
  return useAxios.get("/api/articles/tags");
}
