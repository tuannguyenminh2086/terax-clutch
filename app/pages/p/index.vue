<template>
    <div class="space-y-6">
        <PageHeader
            title="Projects"
            description="List of projects"
        />

        <div>
            <Button
                variant="default"
                @click="createProject"
                size="lg"
                class="cursor-pointer"
            >
                Create Project
            </Button>
        </div>

       <ProjectsList />
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: 'authenticated'
})

useHead({
    title: 'Projects'
})

import Button from '~/components/ui/button/Button.vue';
import PageHeader from '~/components/common/PageHeader.vue';
import ProjectsList from '~/components/projects/List.vue';


const createProject = () => {
    navigateTo('/p/create');
}
</script>
