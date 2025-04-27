<script setup lang="ts">
</script>
<template>
    <div class="space-y-4">
        <Label for="history" class="text-lg text-white">Transaction History</Label>
        <div class="w-[450px] h-[250px] border-2 border-gray-500 rounded-md bg-white/10 shadow-inner overflow-hidden">
            <div class="w-full h-full overflow-auto">
                <table class="w-full text-left text-white border-collapse">
                    <thead class="bg-blue-300 sticky top-0 z-10">
                        <tr>
                            <th class="py-3 px-4 text-lg font-semibold sticky top-0 bg-blue-300">Transaction Date</th>
                            <th class="py-3 px-4 text-lg font-semibold sticky top-0 bg-blue-300">Amount</th>
                            <th class="py-3 px-4 text-lg font-semibold sticky top-0 bg-blue-300">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover:bg-blue-100 transition">
                            <td class="py-2 px-4">2025-04-01</td>
                            <td class="py-2 px-4">$100.00</td>
                            <td class="py-2 px-4">Deposit</td>
                        </tr>
                        <!-- Add more rows as needed -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>