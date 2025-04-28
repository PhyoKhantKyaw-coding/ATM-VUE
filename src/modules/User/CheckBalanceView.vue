<script setup lang="ts">
import { ref, defineProps, watch, defineEmits } from "vue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from "@/api";

const props = defineProps<{ open: boolean; dialogTitle: string }>();
const emit = defineEmits(["update:open"]);

const balance = ref<number | null>(null);
const { mutateAsync } = api.user.checkBalance.useMutation();

const fetchBalance = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("User ID not found in localStorage");
    return;
  }
  try {
    const response = await mutateAsync({ userId: userId });
    balance.value = response.data;
  } catch (error) {
    console.error("Error fetching balance", error);
  }
};

// Watch for open
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      fetchBalance();
    }
  }
);

// when dialog needs to close
const handleClose = () => {
  emit('update:open', false);
};
</script>
<template>
    <Dialog :open="props.open" @update:open="handleClose">
      <DialogContent class="max-w-md bg-gray-800 text-white p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle>{{ props.dialogTitle }}</DialogTitle>
          <p class="text-gray-400 text-sm">Check your account balance</p>
        </DialogHeader>
  
        <div class="space-y-4 mt-4">
          <label for="balance" class="text-lg"> Your Balance </label>
          <input
            id="balance"
            type="text"
            disabled
            :value="balance !== null ? `${balance} MMK` : 'Loading...'"
            class="text-lg py-3 px-5 w-full border-2 border-gray-500 rounded-md focus:outline-none bg-gray-700"
          />
        </div>
      </DialogContent>
    </Dialog>
  </template>
  