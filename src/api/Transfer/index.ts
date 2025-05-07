import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import { type UseQueryOptions, useQuery } from '@tanstack/vue-query';
import api from "@/api";

export const transfer = {
  useMutation: (opt?: Partial<UseMutationOptions<TransferResponse, Error, TransferPayload>>) => {
    return useMutation<TransferResponse, Error, TransferPayload>({
      mutationFn: async (payload: TransferPayload) => {
        const userId = api.getUserIdFromToken();
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.post("User/CreateTranfer", { ...payload, FromId: userId });
        return response.data;
      },
      ...opt,
    });
  },
};

export const getTransferHistory = {
  useQuery: (opt?: Partial<UseQueryOptions<HistoryResponse, Error>>) => {
    const userId = api.getUserIdFromToken();

    return useQuery<HistoryResponse, Error>({
      queryKey: ['transferHistory', userId],
      queryFn: async () => {
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.get('User/GetTransferbyUserId', { params: { userId } });
        return response.data;
      },
      enabled: !!userId,
      ...opt,
    });
  },
};

export const getTransactionHistory = {
  useQuery: (opt?: Partial<UseQueryOptions<TransactionResponse, Error>>) => {
    const userId = api.getUserIdFromToken();

    return useQuery<TransactionResponse, Error>({
      queryKey: ['transactionHistory', userId],
      queryFn: async () => {
        if (!userId) throw new Error('User ID not found in token');
        const response = await axios.get('User/GetTransactionByUserId', { params: { userId } });
        return response.data;
      },
      enabled: !!userId,
      ...opt,
    });
  },
};

