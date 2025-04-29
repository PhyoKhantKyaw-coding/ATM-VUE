import axios from "axios";
import { useMutation, type UseMutationOptions} from "@tanstack/vue-query";
import { type UseQueryOptions, useQuery } from '@tanstack/vue-query';
export const withdraw = {
    useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, WithdrawPayload>>) => {
        return useMutation<APIResponse, Error, WithdrawPayload>({
        mutationFn: async (payload: WithdrawPayload) => {
            const response = await axios.patch("User/Withdraw", payload);
            return response.data;
        },
        ...opt,
        });
    },
}
export const deposite ={
    useMutation:(opt?: Partial<UseMutationOptions<APIResponse, Error, DepositePayload>>) => {
        return useMutation<APIResponse, Error, DepositePayload>({
            mutationFn: async (payload: DepositePayload) => {
                const response = await axios.patch("User/Deposit", payload);
                return response.data;
            },
            ...opt,
        });
    }
}

export const checkBalance = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<CheckBalanceResponse, Error>>) => {
        return useQuery<CheckBalanceResponse, Error>({
            queryKey: ['checkBalance', userId],
            queryFn: async () => {
                const response = await axios.get("User/CheckBalance", { params: { userId } });
                return response.data;
            },
            enabled: !!userId, 
            ...opt
        });
    }
}
export const changePin = {
    useMutation: (opt?: Partial<UseMutationOptions<APIResponse, Error, ChangePinPayload>>) => {
        return useMutation<APIResponse, Error, ChangePinPayload>({
            mutationFn: async (payload: ChangePinPayload) => {
                const response = await axios.patch("User/ChangePin", payload);
                return response.data;
            },
            ...opt,
        });
    }
}


