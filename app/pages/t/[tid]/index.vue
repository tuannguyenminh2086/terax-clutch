<template>
    <div>Task detail {{ $route.params.tid }}</div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})
</script>
