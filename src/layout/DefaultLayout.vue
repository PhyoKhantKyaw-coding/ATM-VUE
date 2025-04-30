<script setup lang="ts" >
  import { Toaster } from 'vue-sonner'
</script>

<template>
    <div  class="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-400">
        <RouterView />
    </div>
    <ClientOnly>
      <Toaster richColors position="top-right" />
    </ClientOnly>
</template>