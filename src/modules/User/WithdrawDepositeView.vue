<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toFormValidator } from '@vee-validate/zod'
import API from '@/api'
import { toast } from 'vue-sonner'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'

// Receive props
const props = defineProps<{ dialogTitle: string }>()

// Control dialog open/close
const isOpen = ref(false)

// Define schema
const schema = z.object({
  amount: z.number().min(1, 'Amount is required'),
  confirmPin: z.coerce.number()
    .int(' PIN must be an integer')
    .min(1000, ' PIN must be 4 digits')
    .max(9999, ' PIN must be 4 digits'),
})

// Setup form
const { handleSubmit, defineField, resetForm } = useForm({
  validationSchema: toFormValidator(schema),
})

const [amount] = defineField('amount')
const [confirmPin] = defineField('confirmPin')

// Setup API mutations
const withdrawMutation = API.user.withdraw.useMutation({
  onSuccess: (data) => {
    if (data.message === 'Insufficient funds.'|| data.message === 'Invalid PIN.') {
      toast.error(data.message)
      return
    }
    toast.success('Withdraw successful!')
    console.log('Withdraw response:', data)
    resetForm()
    isOpen.value = false
  },
  onError: (error) => {
    toast.error('Withdraw failed!')
    console.error(error)
  }
})

const depositeMutation = API.user.deposite.useMutation({
  onSuccess: (data) => {
    if (data.message === 'Invalid PIN.') {
      toast.error(data.message)
      return
    }
    toast.success('Deposit successful!')
    console.log('Deposit response:', data)
    resetForm()
    isOpen.value = false
  },
  onError: (error) => {
    toast.error('Deposit failed!')
    console.error(error)
  }
})

const onCancel = () => {
  resetForm()
  toast('Transaction cancelled')
  isOpen.value = false
}

// Submit function
const onSubmit = handleSubmit((values) => {
  const payload = {
    id: localStorage.getItem('userId') ?? '',
    amount: Number(values.amount),
    pin: Number(values.confirmPin),
  }

  if (props.dialogTitle.toLowerCase() === 'withdraw cash') {
    withdrawMutation.mutate(payload)
  } else if (props.dialogTitle.toLowerCase() === 'deposit cash') {
    depositeMutation.mutate(payload)
  } else {
    toast.error('Unknown transaction type.')
  }
})
</script>

<template>
<Dialog v-model:open="isOpen" >
    <DialogContent class="sm:max-w-[425px] max-w-md bg-gray-800 text-white p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle class="text-white text-9xl">{{ dialogTitle }}</DialogTitle>
        <p class="text-white text-lg">Please enter the amount you want to {{ dialogTitle.toLowerCase() }}.</p>
      </DialogHeader>
      <Form @submit="onSubmit" class="space-y-6 mt-5">
        <FormField v-slot="{ componentField }" name="amount">
          <FormItem>
            <FormLabel class="text-lg text-white">{{ dialogTitle }} Amount</FormLabel>
            <FormControl>
              <Input id="amount" type="number" v-model="amount" v-bind="componentField"
                class="text-lg py-3 px-10 border-2 border-gray-300 rounded-md focus:outline-none bg-gray-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="confirmPin">
          <FormItem>
            <FormLabel class="text-lg text-white">Confirm PIN</FormLabel>
            <FormControl>
              <Input id="confirm" type="password" v-model="confirmPin" v-bind="componentField"
                class="text-lg py-3 px-4 border-2 border-gray-300 bg-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <DialogFooter class="pt-4">
          <Button type="button" variant="secondary" @click="onCancel">
            Cancel
          </Button>
          <Button type="submit">
            OK
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
</Dialog>
</template>
