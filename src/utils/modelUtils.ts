import { AxiosError } from "axios";

// Axios error

export const getAxiosErrorMessage = (axiosError: AxiosError) => {
  if (axiosError.response?.data.message) {
    return axiosError.response?.data.message;
  }
  return axiosError.message;
};
