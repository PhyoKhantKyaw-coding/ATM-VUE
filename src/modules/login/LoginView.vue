<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import api from '@/api'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {toast} from 'vue-sonner'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'

const router = useRouter()
const loginAttempts = ref(0)

// Login mutation
const {mutate } = api.login.login.useMutation({
  onSuccess: (data) => {
    if (data.message === 'Invalid username or password.') {
      toast.error('Invalid username or password.')
      return
    }
    const innerData = data.data
    if (innerData?.passwordStatus === false && innerData?.accountStatus === true) {
      loginAttempts.value++
      toast.warning(`Incorrect password. Attempt ${loginAttempts.value}/3`)
      if (loginAttempts.value >= 3) {
      toast(
        "Too many failed login attempts. Please restart the app",
        {
          action: {
            label: "Restart",
            onClick: () => {
              location.reload()
            }
          },
          duration: 10000,
          description: "Your account is temporarily locked.",
        }
      )
    }
      return
    }
    localStorage.setItem('userId', innerData.data.userID)
    localStorage.setItem('token', innerData.token)
    toast.success('Login successful!')
    router.push('/')
  },
  onError: (error) => {
    toast.error('Login failed. Check console for details.')
    console.error('Login failed:', error)
  },
  onSettled: () => {
    console.log('Login mutation settled')
  }
})

const formSchema = toTypedSchema(z.object({
  Name: z.string().min(2).max(50),
  accountNumber: z.coerce.number(),
  password: z.string().min(2).max(20)
}))
// Login form
const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Login values:', values)
  mutate({
    userName: values.Name,
    accountNumber: Number(values.accountNumber),
    password: values.password
  })
})
const register = () => {
  router.push('/register')
}
</script>  

<template>
      <div class="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-2xl shadow-2xl w-full max-w-md p-8 text-white">
        <!-- Login Header -->
        <div class="flex flex-col items-center space-y-2">
          <div class="bg-gray-600 p-3 rounded-full shadow-lg">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16 21v-2a4 4 0 00-3-3.87M12 3a9 9 0 00-9 9v1a9 9 0 0018 0v-1a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold">ATM Login</h2>
          <p class="text-sm text-gray-400">Secure access to your banking account</p>
        </div>

        <!-- Login Form -->
        <form @submit="onSubmit" class="space-y-4 mt-4">
          <FormField v-slot="{ componentField }" name="Name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="John Doe"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="accountNumber">
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="12345678"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  placeholder="••••••••"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 mt-3 rounded-xl shadow-md transition duration-300"
          >
            Login
          </Button>
        </form>
        <!-- Toggle -->
        <p class="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?
          <span @click="register" class="text-blue-400 hover:text-blue-500 cursor-pointer">Register</span>
        </p>
      </div>
</template>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  transition: transform 0.6s ease, opacity 0.5s ease;
  transform-style: preserve-3d;
}

.flip-enter-from,
.flip-leave-to {
  transform: rotateY(30deg);
  opacity: 0;
}

.flip-enter-to,
.flip-leave-from {
  transform: rotateY(0);
  opacity: 1;
}
</style>
