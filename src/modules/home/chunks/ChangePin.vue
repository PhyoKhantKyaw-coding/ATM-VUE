<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toFormValidator } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import api from '@/api'

// Control dialog open/close
const isOpen = ref(false)
// Define Schema for Numeric PIN validation
const schema = z.object({
  currentPin: z.coerce.number()
    .int('Current PIN must be an integer')
    .min(1000, 'Current PIN must be 4 digits')
    .max(9999, 'Current PIN must be 4 digits'),
  newPin: z.coerce.number()
    .int('New PIN must be an integer')
    .min(1000, 'New PIN must be 4 digits')
    .max(9999, 'New PIN must be 4 digits'),
  confirmPin: z.coerce.number()
    .int('Confirm PIN must be an integer')
    .min(1000, 'Confirm PIN must be 4 digits')
    .max(9999, 'Confirm PIN must be 4 digits'),
}).refine((data) => data.newPin === data.confirmPin, {
  message: 'New PIN and Confirm PIN must match',
  path: ['confirmPin'],
})

// Setup Form
const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toFormValidator(schema),
})

const [currentPin] = defineField('currentPin')
const [newPin] = defineField('newPin')
const [confirmPin] = defineField('confirmPin')

// Setup API Mutation (Replace with your actual API endpoint)
const { mutate: changePinMutate, isPending } = api.user.changePin.useMutation({
  onSuccess() {
    toast.success('PIN changed successfully!')
    resetForm()
    isOpen.value = false
  },
  onError(error) {
    console.error(error)
    toast.error('Failed to change PIN. Please try again.')
  }
})

// Cancel handler
const onCancel = () => {
  resetForm()
  toast('PIN change cancelled')
  isOpen.value = false
}

// Submit function
const onSubmit = handleSubmit((formValues) => {
  const payload : ChangePinPayload = {
    oldPin: formValues.currentPin,
    newPin: formValues.newPin,
    confirmPin: formValues.confirmPin,
  }
  changePinMutate(payload)
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[450px] max-w-md bg-gray-800 text-white p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle class="text-white text-2xl">Change PIN</DialogTitle>
        <p class="text-gray-400 text-sm">Please enter your current PIN and the new PIN.</p>
      </DialogHeader>

      <Form @submit="onSubmit" class="space-y-6 mt-6">
        <FormField v-slot="{ componentField }" name="currentPin">
          <FormItem>
            <FormLabel class="text-lg text-white">Current PIN</FormLabel>
            <FormControl>
              <Input
                id="current"
                type="password"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="currentPin"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-400 bg-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="newPin">
          <FormItem>
            <FormLabel class="text-lg text-white">New PIN</FormLabel>
            <FormControl>
              <Input
                id="new"
                type="password"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="newPin"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-400 bg-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="confirmPin">
          <FormItem>
            <FormLabel class="text-lg text-white">Confirm PIN</FormLabel>
            <FormControl>
              <Input
                id="confirm"
                type="password"
                inputmode="numeric"
                pattern="[0-9]*"
                v-model="confirmPin"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-400 bg-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4 flex justify-end space-x-4">
          <Button type="button" variant="secondary" @click="onCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? 'Changing...' : 'Change PIN' }}
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>
