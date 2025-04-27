<script setup lang="ts">
</script>
<template>
    <div class="space-y-5 mt-10">
        <Label for="current" class="text-lg text-white">Current PIN </Label>
        <Input id="current" type="password"
            class="text-lg py-3 px-4  border-2 border-gray-500  bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 " /> 

        <Label for="new" class="text-lg  text-white">New PIN </Label>
           <Input id="new" type="password"
            class="text-lg py-3 ml-9 px-4 border-2 border-gray-500 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 " /> 

        <Label for="confirm" class="text-lg  text-white">Confirm PIN </Label> 
        <Input id="confirm" type="password"
            class="text-lg py-3 px-4  border-2  border-gray-500 bg-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 " /> 
    </div>
</template>