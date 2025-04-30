<script setup lang="ts">
import { defineProps, defineEmits,watch } from "vue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from "@/api";

const props = defineProps<{ open: boolean; dialogTitle: string }>();
const emit = defineEmits(["update:open"]);

const userId = localStorage.getItem("userId");

// If userId is missing, you can handle it safely
const { data: balanceResponse, refetch } = api.user.checkBalance.useQuery(userId || "");

// Watch for dialog open
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      refetch();
    }
  }
);

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
            :value="balanceResponse !== undefined ? `${balanceResponse.data} MMK` : 'Loading...'"
            class="text-lg py-3 px-5 w-full border-2 border-gray-500 rounded-md focus:outline-none bg-gray-700"
          />
        </div>
      </DialogContent>
    </Dialog>
</template>
