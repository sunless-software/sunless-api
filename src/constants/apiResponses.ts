import { ApiResponse } from "../interfaces";

export const DEFAULT_API_RESPONSE: ApiResponse<[]> = {
  status: 200,
  message: "Sucessful request",
  data: [],
};

export const DEFAULT_HEALTH_ENDPOINT_RESPONSE: ApiResponse<[]> = {
  status: 200,
  message: "May the moon shine upon you, Sunless one.",
  data: [],
};
