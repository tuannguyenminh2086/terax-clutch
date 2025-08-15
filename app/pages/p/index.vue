<template>
    <div>Projects</div>
    <div v-if="user && activeTeam" class="flex flex-col gap-2">
    <h2>Welcome, {{ user.name }}!</h2>
    <h3>Active Team: {{ activeTeam.name }}</h3>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})

import { useAuth } from '@/composable/useAuth'
const { user, activeTeam } = useAuth();

</script>
