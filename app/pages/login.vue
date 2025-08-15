<template>
    <div class="space-y-6 flex-none shrink-0">
        <div>
            <h2 class="text-4xl">Welcome back</h2>
            <p class="text-muted-foreground">Login to your account</p>
        </div>
        <AuthLoginForm />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    layout: 'unauthenticated'
})

useHead({
    title: 'Login'
})
</script>
