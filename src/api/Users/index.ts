import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
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
    useMutation: (opt?: Partial<UseMutationOptions<CheckBalanceResponse, Error, UserId>>) => {
        return useMutation<CheckBalanceResponse, Error, UserId>({
            mutationFn: async (payload: UserId) => {
                const response = await axios.get("User/CheckBalance", {params: payload});
                return response.data;
            },
            ...opt,
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


