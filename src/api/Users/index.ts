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