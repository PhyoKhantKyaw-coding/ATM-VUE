<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import Cookies from 'js-cookie'
import {
  LockKeyholeOpen,
  Banknote,
  ArrowRightLeft,
  PiggyBank,
  Wallet,
  Clock,
  Key,
  LogOut
} from 'lucide-vue-next'
import WithdrawDepositDialog from '../home/chunks/WithdrawDeposite.vue'
import TransferDialog from './chunks/CreateTransfer.vue'
import CheckBalanceDialog from '../home/chunks/CheckBalance.vue'
import ChangePinDialog from '../home/chunks/ChangePin.vue'
import HistoryDialog from './chunks/UserHistory.vue'
import { ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  Cookies.remove('token')
  router.push('/login') 
}
// Dialog control
const isWithdrawDialogOpen = ref(false)
const isDepositDialogOpen = ref(false)
const isTransferDialogOpen = ref(false)
const isCheckBalanceDialogOpen = ref(false);
const isChangePinDialogOpen = ref(false);
const isTransactionHistoryDialogOpen = ref(false)
</script>

<template>
  <div 
    class="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-gray-700 to-gray-900 px-6">
    <div class="flex flex-col items-center w-full max-w-7xl bg-clip-padding rounded-3xl shadow-2xl bg-white/5 p-8 space-y-10 h-[800px]">
      <!-- Header -->
      <p class="text-[60px] font-bold text-center text-white">Welcome to ATM Services</p>
      <!-- Button Sections -->
      <div class="flex items-center justify-between w-full">
        <!-- Left Buttons -->
        <div class="flex flex-col mr-30 space-y-30 w-1/3">
          <!-- Withdraw Button -->
          <Button @click="isWithdrawDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <Banknote class="w-12 h-12" /> Withdraw Cash
          </Button>
          <!-- Deposit Button -->
          <Button @click="isDepositDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <PiggyBank class="w-12 h-12" /> Deposit Cash
          </Button>
          <!-- Transfer Button -->
          <Button @click="isTransferDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <ArrowRightLeft class="w-12 h-12" /> Transfer Funds
          </Button>
        </div>
        <!-- Center Lock + Exit -->
        <div class="flex flex-col items-center justify-center space-y-6">
          <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <LockKeyholeOpen class="w-16 h-16 text-blue-1000" />
          </div>
          <Button @click="handleLogout" 
            class="flex items-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xl shadow-md transition-all duration-300">
            <LogOut class="w-6 h-6" /> Exit
          </Button>
        </div>

        <!-- Right Buttons -->
        <div class="flex flex-col ml-30 space-y-30 w-1/3">
          <!-- Check Balance Button -->
          <Button
            @click="isCheckBalanceDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <Wallet class="w-12 h-12" /> Check Balance
          </Button>          
          <!-- History Button -->
          <Button @click="isTransactionHistoryDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <Clock class="w-12 h-12" /> History
          </Button>
          <!-- Change PIN Button -->
          <Button @click="isChangePinDialogOpen = true"
            class="w-full py-10 flex items-center justify-center gap-4 text-3xl font-semibold text-black bg-blue-300 hover:bg-blue-700 transition-all duration-300 rounded-xl shadow-md">
            <Key class="w-12 h-12" /> Change PIN
          </Button>
        </div>        
          <TransferDialog v-model:open="isTransferDialogOpen" dialogTitle="Transfer Funds" />          
          <WithdrawDepositDialog v-model:open="isWithdrawDialogOpen" dialogTitle="Withdraw Cash" />
          <WithdrawDepositDialog v-model:open="isDepositDialogOpen" dialogTitle="Deposit Cash" />
          <CheckBalanceDialog v-model:open="isCheckBalanceDialogOpen" dialogTitle="Check Balance" />
          <ChangePinDialog v-model:open="isChangePinDialogOpen" dialogTitle="Change PIN" />
          <HistoryDialog v-model:open="isTransactionHistoryDialogOpen" dialogTitle="Transaction History"  />
      </div>
    </div>
  </div>
</template>
