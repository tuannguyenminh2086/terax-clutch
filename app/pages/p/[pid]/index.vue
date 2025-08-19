<template>
    <div v-if="project" class="space-y-6">
        <div>
            <NuxtLink to="/p" class="flex items-center gap-2 text-sm">
                <ArrowLeftIcon class="w-4 h-4" /> Back to projects
            </NuxtLink>
        </div>
        <PageHeader
            :title="'Project: ' + project.name"
            :description="project?.id ? 'ID: ' + project.id : 'N/A'"
        />
        <div>
            <p>Owner: {{ project.owner }}</p>
            <p>Members: {{ project.members.length }}</p>
        </div>
        <div v-html="project.description" class="prose prose-stone max-w-none pb-2 border-b"></div>
        <TasksList :tasks="tasks" :pending="pending" :error="error" />
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})

import type { IProject, ITask } from '~/utils/models';
import PageHeader from '~/components/common/PageHeader.vue';
import { ArrowLeftIcon } from 'lucide-vue-next';
import TasksList from '~/components/tasks/List.vue';


useHead({
    title: 'Project Detail'
})

const route = useRoute()

const { data: project } = await useFetch<IProject>(`/api/projects/${route.params.pid}`);


const { data: tasks, pending, error } = await useFetch<ITask[]>(
    '/api/tasks',
    {
      method: 'GET',
      query: {
          projectId: project.value?.id
      }
    }
)

</script>