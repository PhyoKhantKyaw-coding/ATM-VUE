import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
export const register = {
  useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, RegisterPayload>>) => {
    return useMutation<APIResponse, Error, RegisterPayload>({
      mutationFn: async (payload: RegisterPayload) => {
        const response = await axios.post("User/CreateUser", payload);
        return response.data;
      },
      ...opt,
    });
  }
};