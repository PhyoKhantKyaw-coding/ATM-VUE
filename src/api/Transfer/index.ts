import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";

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
    useMutation: (opt?: Partial<UseMutationOptions<HistoryResponse, Error,UserId>>) => {
        return useMutation<HistoryResponse, Error, UserId>({
            mutationFn: async (payload: UserId) => {
                const response = await axios.get("User/GetTransferbyUserId", {params: payload});
                return response.data;
            },
            ...opt,
        });
    }
};
export const getTransactionHistory = {
    useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, UserId>>) => {  
        return useMutation<TransactionResponse, Error, UserId>({
            mutationFn: async (payload: UserId) => {
                const response = await axios.get("User/GetTransactionByUserId", {params: payload});
                return response.data;
            },
            ...opt,
        });
    }   
};

