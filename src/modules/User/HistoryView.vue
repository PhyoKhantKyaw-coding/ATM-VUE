<script setup lang="ts">
import { ref, computed, defineProps, watch } from "vue";
import api from "@/api";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Props
const props = defineProps<{
  open: boolean;
  dialogTitle: string;  
}>();
const emit = defineEmits(["update:open"]);

// States
const isTransactionHistory = ref(true);
const transactionHistoryData = ref<Transaction[]>([]);
const transferHistoryData = ref<Transfer[]>([]);

// User ID
const userId = localStorage.getItem("userId") || "";

// Pagination states
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed paginated data
const paginatedTransactionData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return transactionHistoryData.value.slice(start, end);
});

const paginatedTransferData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return transferHistoryData.value.slice(start, end);
});

// API Mutations
const getTransactionHistory = api.transfer.getTransactionHistory.useMutation({
  onSuccess: (data) => {
    transactionHistoryData.value = data.data;
  },
  onError: (error) => {
    console.error("Failed to fetch Transaction History:", error);
  }
});

const getTransferHistory = api.transfer.getTransferHistory.useMutation({
  onSuccess: (data) => {
    transferHistoryData.value = data.data;
  },
  onError: (error) => {
    console.error("Failed to fetch Transfer History:", error);
  }
});

// Toggle history type
const toggleHistoryType = () => {
  isTransactionHistory.value = !isTransactionHistory.value;
  currentPage.value = 1; // Reset page
  if (isTransactionHistory.value) {
    getTransactionHistory.mutate({ userId });
  } else {
    getTransferHistory.mutate({ userId });
  }
};

// Pagination handlers
const nextPage = () => {
  if (isTransactionHistory.value) {
    if (currentPage.value * itemsPerPage < transactionHistoryData.value.length) {
      currentPage.value++;
    }
  } else {
    if (currentPage.value * itemsPerPage < transferHistoryData.value.length) {
      currentPage.value++;
    }
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Watch for dialog open
watch(() => props.open, (newVal) => {
  if (newVal) {
    currentPage.value = 1;
    getTransactionHistory.mutate({ userId });
  }
});

const handleClose = () => {
  emit('update:open', false);
};
</script>

<template>
  <Dialog :open="props.open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[700px] max-w-md bg-gray-800 text-white p-6 rounded-lg">
      <DialogHeader>
        <div class="flex justify-between items-center mt-5">
          <DialogTitle>{{ props.dialogTitle }}</DialogTitle>
          <div class="space-x-4 flex items-center">
            <Button
              @click="toggleHistoryType"
              class="text-sm px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white"
            >
              {{ isTransactionHistory ? "View Transfer History" : "View Transaction History" }}
            </Button>
          </div>
        </div>
        <p class="text-white text-sm mt-2">View your transaction or transfer history</p>
      </DialogHeader>

      <div class="space-y-4 mt-6">
        <!-- Transaction History Table -->
        <div v-if="isTransactionHistory"
          class="w-full h-[400px] border-2 border-gray-500 rounded-md bg-white/3 shadow-inner overflow-y-auto">
          <Table>
            <TableHeader class="sticky top-0 bg-gray-700 z-10">
              <TableRow>
                <TableHead class="bg-gray-700 text-white">Date</TableHead>
                <TableHead class="bg-gray-700 text-white">Amount</TableHead>
                <TableHead class="bg-gray-700 text-white">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in paginatedTransactionData"
                :key="item.transactionID"
                class="hover:bg-blue-100/10 transition"
              >
                <TableCell>{{ item.transactionDate }}</TableCell>
                <TableCell>{{ item.amount }}</TableCell>
                <TableCell>{{ item.transactionType }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Pagination Buttons -->
          <div class="flex justify-between items-center mt-2">
            <Button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Previous
            </Button>
            
            <span class="text-sm text-gray-300">
              Page {{ currentPage }}
            </span>
            
            <Button 
              @click="nextPage" 
              :disabled="currentPage * itemsPerPage >= transactionHistoryData.length"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>

        <!-- Transfer History Table -->
        <div v-else
          class="w-full h-[460px] border-2 border-gray-500 rounded-md bg-white/10 shadow-inner overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow class="sticky top-0 bg-gray-700 z-10">
                <TableHead class="bg-gray-700 text-white">Date</TableHead>
                <TableHead class="bg-gray-700 text-white">Amount</TableHead>
                <TableHead class="bg-gray-700 text-white">Sender</TableHead>
                <TableHead class="bg-gray-700 text-white">Receiver</TableHead>
                <TableHead class="bg-gray-700 text-white">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="item in paginatedTransferData"
                :key="item.transferDate + item.senderName"
                class="hover:bg-blue-100/10 transition"
              >
                <TableCell>{{ item.transferDate }}</TableCell>
                <TableCell>{{ item.amount }}</TableCell>
                <TableCell>{{ item.senderName }}</TableCell>
                <TableCell>{{ item.receiverName }}</TableCell>
                <TableCell>{{ item.description }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- Pagination Buttons -->
          <div class="flex justify-between items-center mt-2">
            <Button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Previous
            </Button>
            
            <span class="text-sm text-gray-300">
              Page {{ currentPage }}
            </span>
            
            <Button 
              @click="nextPage" 
              :disabled="currentPage * itemsPerPage >= transferHistoryData.length"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
