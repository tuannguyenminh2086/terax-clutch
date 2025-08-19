<template>
    <div class="space-y-10">
        <PageHeader
            title="Create Project"
            description="Fill in the form below to create a new project"
        />
        <div class="flex-none shrink-0 max-w-lg mx-auto">
            <ProjectsCreateForm />
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})

useHead({
    title: 'Create Project'
})

import PageHeader from '~/components/common/PageHeader.vue';
import ProjectsCreateForm from '~/components/projects/CreateForm.vue';
</script>
