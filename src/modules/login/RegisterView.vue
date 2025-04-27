<script setup lang="ts">
import { useForm } from 'vee-validate'
import api from '@/api'
import { toast } from 'vue-sonner' 
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
const registerfromSchema = toTypedSchema(z.object({
  registerName: z.string().min(2, 'Name too short').max(50),
  registerWallet: z.coerce.number().min(1, 'Invalid wallet number'),
  registerPin: z.number(),
  registerPassword: z.string().min(2).max(20)
}))

const form = useForm({
  validationSchema: registerfromSchema,
})

const emit = defineEmits(['toggle-form']) 

const { mutate } = api.register.register.useMutation({
  onSuccess: (data) => {
    console.log('Register success response:', data)
    if (data.status === 0) {
      toast.success('Registration successful') 
      emit('toggle-form')                       
    } else {
      toast.error('Registration failed')       
    }
  },
  onError: (error) => {
    console.error('Registration error:', error)
    toast.error('Registration error. Check console.')  // ✅ use toaster.error
  }
})

const registerSubmit = form.handleSubmit((values) => {
  console.log("Submitting with values:", values)
  mutate({
    userName: values.registerName,
    wallet: values.registerWallet,
    pin: Number(values.registerPin),
    password: values.registerPassword
  })
})
</script>



<template>
    <div class="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-600 rounded-2xl shadow-2xl w-full max-w-md p-8 text-white">
        <!-- Register Header -->
        <div class="flex flex-col items-center space-y-2">
          <div class="bg-gray-600 p-3 rounded-full shadow-lg">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.121 17.804A6 6 0 0112 15a6 6 0 016.879 2.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold">Register</h2>
          <p class="text-sm text-gray-400">Create your ATM account</p>
        </div>

        <!-- Register Form -->
        <form class="space-y-4 mt-6" @submit="registerSubmit">

          <FormField v-slot="{ componentField }" name="registerName">
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Your full name"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="registerWallet">
            <FormItem>
              <FormLabel>Wallet Balance</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="registerPin">
            <FormItem>
              <FormLabel>PIN</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  placeholder="Create a PIN"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="registerPassword">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  placeholder="Create a password"
                  class="w-full rounded-md px-4 py-2 text-sm bg-gray-700/50 text-white placeholder:text-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button
            type="submit"
            class="w-full bg-gradient-to-r mt-2.5 from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 rounded-xl shadow-md transition duration-300"
          >
            Register
          </Button>
          <p class="text-sm text-gray-400 mt-4 text-center">
            Already have an account?
            <span @click="$emit('toggle-form')" class="text-blue-400 hover:text-blue-500 cursor-pointer">Login</span>
          </p>
        </form>
    </div>
</template>