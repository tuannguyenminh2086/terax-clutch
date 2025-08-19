<template>
    <div>
        <PageHeader
            title="My Tasks"
            description="List of tasks"
        />
        <TasksList :tasks="tasks" :pending="pending" :error="error" :showProject="true" />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})

useHead({
    title: 'My Tasks'
})

import type { ITask } from '~/utils/models';
import PageHeader from '~/components/common/PageHeader.vue';
import TasksList from '~/components/tasks/List.vue';
import { useAuth } from '~/composables/useAuth';

const { user } = useAuth();



const { data: tasks, pending, error } = await useFetch<ITask[]>(
    '/api/users/' + user.value?.id + '/tasks',
    {
        method: 'GET'
    }
)


</script>
