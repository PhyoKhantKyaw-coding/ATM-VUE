// src/api/Login.ts
import  axios  from 'axios'
import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
export const login = {
  useMutation: (opt?: Partial<UseMutationOptions<LoginResponse, Error, LoginPayload>>) => {
    return useMutation<LoginResponse, Error, LoginPayload>({
      mutationFn: async (payload: LoginPayload) => {
        const response = await axios.post('Login/LoginWeb', payload)
        return response.data
      },
      ...opt
    })
  }
}

