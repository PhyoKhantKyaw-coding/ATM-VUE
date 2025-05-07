import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import { type UseQueryOptions, useQuery } from '@tanstack/vue-query';
import api from "@/api";

export const withdraw = {
  useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, WithdrawPayload>>) => {
    return useMutation<APIResponse, Error, WithdrawPayload>({
      mutationFn: async (payload: WithdrawPayload) => {
        const userId = api.getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.patch("User/Withdraw", { ...payload, id: userId });
        return response.data;
      },
      ...opt,
    });
  },
};

export const deposite = {
  useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, DepositePayload>>) => {
    return useMutation<APIResponse, Error, DepositePayload>({
      mutationFn: async (payload: DepositePayload) => {
        const userId = api.getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.patch("User/Deposit", { ...payload, id: userId });
        return response.data;
      },
      ...opt,
    });
  },
};

export const checkBalance = {
  useQuery: (opt?: Partial<UseQueryOptions<CheckBalanceResponse, Error>>) => {
    const userId = api.getUserIdFromToken();
    return useQuery<CheckBalanceResponse, Error>({
      queryKey: ['checkBalance', userId],
      queryFn: async () => {
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.get("User/CheckBalance", { params: { userId } });
        return response.data;
      },
      enabled: !!userId,
      ...opt,
    });
  },
};

export const changePin = {
  useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, ChangePinPayload>>) => {
    return useMutation<APIResponse, Error, ChangePinPayload>({
      mutationFn: async (payload: ChangePinPayload) => {
        const userId = api.getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.patch("User/ChangePin", { ...payload, id: userId });
        return response.data;
      },
      ...opt,
    });
  },
};