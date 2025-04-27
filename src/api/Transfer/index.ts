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