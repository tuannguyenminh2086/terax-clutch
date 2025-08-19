<template>
  <div>
    <div v-if="projects && projects.length > 0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Name
            </TableHead>
            <TableHead>Owner</TableHead>
            <TableHead class="text-right">
              Members
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in projects" :key="project.id">
            <TableCell class="font-medium">
             <NuxtLink :to="`/p/${project.id}`"> {{ project.name ?? 'N/A' }}</NuxtLink>
            </TableCell>
            <TableCell>
              <UserAvatar v-if="project.owner" :user="project.owner" />
            </TableCell>
            <TableCell class="text-right">
              {{ project.members.length ?? 0 }}
            </TableCell>
            <TableCell class="text-right max-w-[150px]">
              <div class="flex items-center justify-end flex-wrap gap-2">
                <Button variant="outline" class="flex items-center gap-2" asChild>
                  <NuxtLink :to="`/p/${project.id}`">
                    <Eye />
                    View
                  </NuxtLink>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div v-else-if="pending">Loading projects...</div>
    <div v-else-if="error">Error loading projects: {{ error.message }}</div>
    <div v-else>No projects found.</div>
  </div>
</template>

<script setup lang="ts">
import type { IProject } from '~/utils/models';
import { useAuth } from '~/composables/useAuth';
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UserAvatar from '@/components/common/UserAvatar.vue'

const { activeTeam } = useAuth();

const { data: projects, pending, error } = await useFetch<IProject[]>(
  '/api/projects',
  {
    method: 'GET',
    query: {
      teamId: activeTeam.value?.id
    }
  }
)
</script>

<style scoped>

</style>