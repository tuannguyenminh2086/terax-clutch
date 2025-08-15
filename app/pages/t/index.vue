<template>
    <div>Tasks</div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})
</script>
