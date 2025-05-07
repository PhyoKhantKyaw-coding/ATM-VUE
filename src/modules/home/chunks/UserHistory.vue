<script setup lang="ts">
import { ref, defineProps, watch, h } from "vue";
import api from "@/api";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/vue-table';
import { ChevronDown, ChevronsUpDown } from 'lucide-vue-next';

// Props
const props = defineProps<{
  open: boolean;
  dialogTitle: string;
}>();
const emit = defineEmits(["update:open"]);

// Interfaces
interface Transaction {
  transactionID: string;
  transactionDate: string;
  amount: number;
  transactionType: string;
}

interface Transfer {
  transferDate: string;
  amount: number;
  senderName: string;
  receiverName: string;
  description: string;
}

// States
const isTransactionHistory = ref(true);
const transactionHistoryData = ref<Transaction[]>([]);
const transferHistoryData = ref<Transfer[]>([]);


// Table states
const transactionSorting = ref<SortingState>([]);
const transactionColumnFilters = ref<ColumnFiltersState>([]);
const transactionColumnVisibility = ref<VisibilityState>({});
const transactionRowSelection = ref({});

const transferSorting = ref<SortingState>([]);
const transferColumnFilters = ref<ColumnFiltersState>([]);
const transferColumnVisibility = ref<VisibilityState>({});
const transferRowSelection = ref({});

const { refetch: refetchTransaction, data: transactionData } = api.transfer.getTransactionHistory.useQuery({
  enabled: false,
});

const { refetch: refetchTransfer, data: transferData } = api.transfer.getTransferHistory.useQuery({
  enabled: false, 
});

// Log the API response for debugging
watch(transactionData, (data) => {
  if (data) {
    console.log("Transaction data:", data);  // Log the full response data
    if (data.data) {
      console.log("Transaction data content:", data.data);
      transactionHistoryData.value = data.data;  // Update the transaction history data
    } else {
      console.log("No transaction data found.");
    }
  } else {
    console.log("Transaction data is null or undefined.");
  }
});

watch(transferData, (data) => {
  if (data) {
    console.log("Transfer data:", data);  // Log the full response data
    if (data.data) {
      console.log("Transfer data content:", data.data);
      transferHistoryData.value = data.data;  // Update the transfer history data
    } else {
      console.log("No transfer data found.");
    }
  } else {
    console.log("Transfer data is null or undefined.");
  }
});

// Column definitions
const transactionColumnHelper = createColumnHelper<Transaction>();
const transactionColumns = [
  transactionColumnHelper.display({
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  }),
  transactionColumnHelper.accessor('transactionDate', {
    header: ({ column }) => h(Button, {
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', row.getValue('transactionDate')),
  }),
  transactionColumnHelper.accessor('amount', {
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return h('div', { class: 'text-right font-medium' }, formatted);
    },
  }),
  transactionColumnHelper.accessor('transactionType', {
    header: 'Type',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('transactionType')),
  }),
];

const transferColumnHelper = createColumnHelper<Transfer>();
const transferColumns = [
  transferColumnHelper.display({
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),      
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  }),
  transferColumnHelper.accessor('transferDate', {
    header: ({ column }) => h(Button, {
      variant: 'ghost',
      onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
    }, () => ['Date', h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })]),
    cell: ({ row }) => h('div', row.getValue('transferDate')),
  }),
  transferColumnHelper.accessor('amount', {
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return h('div', { class: 'text-right font-medium' }, formatted);
    },
  }),
  transferColumnHelper.accessor('senderName', {
    header: 'Sender',
    cell: ({ row }) => h('div', row.getValue('senderName')),
  }),
  transferColumnHelper.accessor('receiverName', {
    header: 'Receiver',
    cell: ({ row }) => h('div', row.getValue('receiverName')),
  }),
  transferColumnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => h('div', row.getValue('description')),
  }),
];

// Table instances
const transactionTable = useVueTable({
  data: transactionHistoryData, // Use Ref directly
  columns: transactionColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updater) => {
    if (typeof updater === 'function') {
      transactionSorting.value = updater(transactionSorting.value);
    } else {
      transactionSorting.value = updater;
    }
  },
  onColumnFiltersChange: (updater) => {
    if (typeof updater === 'function') {
      transactionColumnFilters.value = updater(transactionColumnFilters.value);
    } else {
      transactionColumnFilters.value = updater;
    }
  },
  onColumnVisibilityChange: (updater) => {
    if (typeof updater === 'function') {
      transactionColumnVisibility.value = updater(transactionColumnVisibility.value);
    } else {
      transactionColumnVisibility.value = updater;
    }
  },
  onRowSelectionChange: (updater) => {
    if (typeof updater === 'function') {
      transactionRowSelection.value = updater(transactionRowSelection.value);
    } else {
      transactionRowSelection.value = updater;
    }
  },
  state: {
    get sorting() { return transactionSorting.value },
    get columnFilters() { return transactionColumnFilters.value },
    get columnVisibility() { return transactionColumnVisibility.value },
    get rowSelection() { return transactionRowSelection.value },
  },
});

const transferTable = useVueTable({
  data: transferHistoryData, // Use Ref directly
  columns: transferColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updater) => {
    if (typeof updater === 'function') {
      transferSorting.value = updater(transferSorting.value);
    } else {
      transferSorting.value = updater;
    }
  },
  onColumnFiltersChange: (updater) => {
    if (typeof updater === 'function') {
      transferColumnFilters.value = updater(transferColumnFilters.value);
    } else {
      transferColumnFilters.value = updater;
    }
  },
  onColumnVisibilityChange: (updater) => {
    if (typeof updater === 'function') {
      transferColumnVisibility.value = updater(transferColumnVisibility.value);
    } else {
      transferColumnVisibility.value = updater;
    }
  },
  onRowSelectionChange: (updater) => {
    if (typeof updater === 'function') {
      transferRowSelection.value = updater(transferRowSelection.value);
    } else {
      transferRowSelection.value = updater;
    }
  },
  state: {
    get sorting() { return transferSorting.value },
    get columnFilters() { return transferColumnFilters.value },
    get columnVisibility() { return transferColumnVisibility.value },
    get rowSelection() { return transferRowSelection.value },
  },
});

// Toggle history type
const toggleHistoryType = async () => {
  isTransactionHistory.value = !isTransactionHistory.value;
  console.log("Toggling history type. isTransactionHistory:", isTransactionHistory.value);
  if (isTransactionHistory.value) {
    await refetchTransaction();
  } else {
    await refetchTransfer();
  }
};

// Watch for dialog open
watch(() => props.open, async (newVal) => {
  console.log("Dialog open changed:", newVal);
  if (newVal) {
    if (isTransactionHistory.value) {
      await refetchTransaction();
    } else {
      await refetchTransfer();
    }
  }
});

const handleClose = () => {
  console.log("Closing dialog");
  emit('update:open', false);
};
</script>

<template>
  <Dialog :open="props.open" @update:open="handleClose">
    <DialogContent class="sm:max-w-[900px] max-w-md bg-gray-800 text-white p-6 rounded-lg">
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
        <div v-if="isTransactionHistory" class="w-full h-[560px] border-2 border-gray-500 rounded-md bg-white/3 shadow-inner overflow-y-auto">
          <div class="flex gap-2 items-center py-4 px-4">
            <Input
              class="max-w-sm"
              placeholder="Filter by type..."
              :model-value="transactionTable.getColumn('transactionType')?.getFilterValue() as string"
              @update:model-value="transactionTable.getColumn('transactionType')?.setFilterValue($event)"
            />
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="ml-auto bg-gray-600 hover:bg-gray-700 text-white">
                  Columns <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>              
              <DropdownMenuContent align="end" class="bg-gray-800 text-white">
                <DropdownMenuCheckboxItem 
                  v-for="column in transactionTable.getAllColumns().filter((column) => column.getCanHide())"
                  :key="column.id"
                  class="capitalize"
                  :model-value="column.getIsVisible()"
                  @update:model-value="(value) => column.toggleVisibility(!!value)"
                >
                  {{ column.id }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table>
            <TableHeader class="sticky top-0 bg-gray-700 z-10">
              <TableRow v-for="headerGroup in transactionTable.getHeaderGroups()" :key="headerGroup.id">
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  class="bg-gray-700 text-white"
                >
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="transactionTable.getRowModel().rows?.length">
                <TableRow
                  v-for="row in transactionTable.getRowModel().rows"
                  :key="row.id"
                  :data-state="row.getIsSelected() && 'selected'"
                  class="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                >
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
              </template>
              <TableRow v-else>
                <TableCell :colspan="transactionColumns.length" class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div class="flex items-center justify-end space-x-2 py-4 px-4">
            <div class="flex-1 text-sm text-gray-300  bg-gray-500">
              {{ transactionTable.getFilteredSelectedRowModel().rows.length }} of
              {{ transactionTable.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="space-x-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="!transactionTable.getCanPreviousPage()"
                @click="transactionTable.previousPage()"
                class="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Previous
              </Button>
              <span class="text-sm text-gray-300">
                Page {{ transactionTable.getState().pagination.pageIndex + 1 }}
              </span>
              <Button
                variant="outline"
                size="sm"
                :disabled="!transactionTable.getCanNextPage()"
                @click="transactionTable.nextPage()"
                class="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <!-- Transfer History Table -->
        <div v-else class="w-full h-[560px] border-2 border-gray-500 rounded-md bg-white/10 shadow-inner overflow-y-auto">
          <div class="flex gap-2 items-center py-4 px-4">
            <Input
              class="max-w-sm"
              placeholder="Filter by description..."
              :model-value="transferTable.getColumn('description')?.getFilterValue() as string"
              @update:model-value="transferTable.getColumn('description')?.setFilterValue($event)"
            />
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="ml-auto  bg-gray-600 hover:bg-gray-700 text-white">
                  Columns <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="bg-gray-800 text-white">
                <DropdownMenuCheckboxItem
                  v-for="column in transferTable.getAllColumns().filter((column) => column.getCanHide())"
                  :key="column.id"
                  class="capitalize"
                  :model-value="column.getIsVisible() " 
                  @update:model-value="(value) => column.toggleVisibility(!!value)"
                >
                  {{ column.id }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Table>
            <TableHeader class="sticky top-0 bg-gray-700 z-10">
              <TableRow v-for="headerGroup in transferTable.getHeaderGroups()" :key="headerGroup.id">
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  class="bg-gray-700 text-white"
                >
                  <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="transferTable.getRowModel().rows?.length">
                <TableRow
                  v-for="row in transferTable.getRowModel().rows"
                  :key="row.id"
                  :data-state="row.getIsSelected() && 'selected'"
                  class="row.getIsSelected()  bg-gray-600 "
                >
                  <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </TableCell>
                </TableRow>
              </template>
              <TableRow v-else>
                <TableCell :colspan="transferColumns.length" class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div class="flex items-center justify-end space-x-2 py-4 px-4">
            <div class="flex-1 text-sm text-gray-300">
              {{ transferTable.getFilteredSelectedRowModel().rows.length }} of
              {{ transferTable.getFilteredRowModel().rows.length }} row(s) selected.
            </div>
            <div class="space-x-2">
              <Button
                variant="outline"
                size="sm"
                :disabled="!transferTable.getCanPreviousPage()"
                @click="transferTable.previousPage()"
                class="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Previous
              </Button>
              <span class="text-sm text-gray-300">
                Page {{ transferTable.getState().pagination.pageIndex + 1 }}
              </span>
              <Button
                variant="outline"
                size="sm"
                :disabled="!transferTable.getCanNextPage()"
                @click="transferTable.nextPage()"
                class="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>