<script setup lang="ts">
import { ref } from 'vue'
import LoginView from './LoginView.vue'
import RegisterView from './RegisterView.vue'
const isLogin = ref(true)
function toggleForm() {
  isLogin.value = !isLogin.value
}
function showLogin() {
  isLogin.value = true
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
<template>
    <div class="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-300">
      <transition name="fade" mode="out-in">
        <LoginView v-if="isLogin" key="login" @toggle-form="toggleForm" />
        <RegisterView v-else key="register" @toggle-form="toggleForm" @register-success="showLogin" />
      </transition>
    </div>
</template>
  


  

  