<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toFormValidator } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import api from '@/api'
// Control dialog open/close
const isOpen = ref(false)

// Define Schema
const schema = z.object({
  ToAccountNumber: z.number().min(1, "Account Number is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  pin: z.coerce.number()
    .int(' PIN must be an integer')
    .min(1000, ' PIN must be 4 digits')
    .max(9999, ' PIN must be 4 digits'),
  message: z.string().optional(),
})

// Setup Form
const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toFormValidator(schema),
})

const [ToAccountNumber] = defineField('ToAccountNumber')
const [amount] = defineField('amount')
const [pin] = defineField('pin')
const [message] = defineField('message')

// FromId from localStorage
const FromId = localStorage.getItem('userId') || ''

// Setup API Mutation
const { mutate: transferMutate, isPending } = api.transfer.transfer.useMutation({
  onSuccess(data) {
    if (data.message === 'Insufficient funds.' || data.message === 'Receiver not found.' || data.message === 'Sender not found.' || data.message === 'Invalid PIN.') {
      toast.error(data.message)
      return
    }
    const user = data.data
    const message = `Transfer Successful!
      From: ${user.senderName} To: ${user.receiverName}
      Amount: $${user.amount}
      Description: ${user.description}
      Date: ${new Date(user.transferDate).toLocaleString()}`;

    toast.success(message, {
      style: {
        width: '250px',
        whiteSpace: 'pre-line'
      }
    });

    resetForm()
    isOpen.value = false
  },
  onError(error) {
    console.error(error)
    toast.error('Transfer Failed. Please try again.')
  }
})

const onCancel = () => {
  resetForm()
  toast('Transfer cancelled')
  isOpen.value = false
}

// Submit Function
const onSubmit = handleSubmit((formValues) => {
  const payload: TransferPayload = {
    ToAcountNumber: formValues.ToAccountNumber,
    amount: formValues.amount,
    pin: formValues.pin,
    Description: formValues.message || '',
    FromId: FromId,
  }
  transferMutate(payload)
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px] max-w-md bg-gray-800 text-white p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle class="text-white text-9xl">Transfer Money</DialogTitle>
        <p class="text-white text-lg">Please enter the details for the transfer.</p>
      </DialogHeader>

      <Form @submit="onSubmit" class="space-y-6 mt-6">
        <FormField v-slot="{ componentField }" name="ToAccountNumber">
          <FormItem>
            <FormLabel class="text-lg text-white">To Account Number</FormLabel>
            <FormControl>
              <Input
                id="accountNumber"
                type="number"
                v-model="ToAccountNumber"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-300 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="amount">
          <FormItem>
            <FormLabel class="text-lg text-white">Amount</FormLabel>
            <FormControl>
              <Input
                id="amount"
                type="number"
                v-model="amount"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-300 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="pin">
          <FormItem>
            <FormLabel class="text-lg text-white">PIN</FormLabel>
            <FormControl>
              <Input
                id="pin"
                type="password"
                v-model="pin"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-300 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="message">
          <FormItem>
            <FormLabel class="text-lg text-white">Description</FormLabel>
            <FormControl>
              <Input
                id="message"
                type="text"
                v-model="message"
                v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-300 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4">
          <Button type="button" variant="secondary" @click="onCancel">
            Cancel
          </Button>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? 'Transferring...' : 'Confirm Transfer' }}
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>
