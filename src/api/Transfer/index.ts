import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import { type UseQueryOptions, useQuery } from '@tanstack/vue-query';

export const transfer = {
    useMutation: (opt?: Partial<UseMutationOptions<TransferResponse, Error, TransferPayload>>) => {
        return useMutation<TransferResponse, Error, TransferPayload>({
            mutationFn: async (payload: TransferPayload) => {
                const response = await axios.post("User/CreateTranfer", payload);
                return response.data;
            },
            ...opt,
        });
    }
};
export const getTransferHistory = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<HistoryResponse, Error>>) => {
      return useQuery<HistoryResponse, Error>({
        queryKey: ['transferHistory', userId],
        queryFn: async () => {
          const response = await axios.get("User/GetTransferbyUserId", { params: { userId } });
          return response.data;
        },
        enabled: !!userId,
        ...opt,
      });
    }
  };
  
  export const getTransactionHistory = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<TransactionResponse, Error>>) => {
      return useQuery<TransactionResponse, Error>({
        queryKey: ['transactionHistory', userId],
        queryFn: async () => {
          const response = await axios.get("User/GetTransactionByUserId", { params: { userId } });
          return response.data;
        },
        enabled: !!userId,
        ...opt,
      });
    }
  };
  

