<script setup lang="ts" >
  import { Toaster } from 'vue-sonner'
</script>

<template>
    <div class="w-svw min-h-svh flex justify-center">
        <RouterView />
    </div>
    <ClientOnly>
      <Toaster richColors position="top-right" />
    </ClientOnly>
</template>