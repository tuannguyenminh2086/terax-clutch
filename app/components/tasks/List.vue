<template>
  <div>
    <div v-if="tasks && tasks.length > 0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="flex-1">
              Name
            </TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead v-if="showProject">Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-center">
                Assignees
            </TableHead>
            <TableHead class="text-right max-w-[200px]">
                Actions
            </TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            <TableRow v-for="task in tasks" :key="task.id">
              <TableCell class="font-medium">
                <NuxtLink :to="`/t/${task.id}`"> {{ task.title }}</NuxtLink>
              </TableCell>
              <TableCell>
                {{ $dayjs(task.due_date).utc().format('DD/MM/YYYY') || 'No due date' }}
              </TableCell>
              <TableCell>
                {{ task.priority || 'Normal' }}
              </TableCell>
              <TableCell v-if="showProject">
                <Badge v-if="task.expand?.project?.name" variant="default">{{ task.expand?.project?.name }}</Badge>
                <Badge v-else variant="secondary">N/A</Badge>
              </TableCell>
              <TableCell>
                <Badge v-if="task.expand?.list?.name" variant="default">{{ task.expand?.list?.name }}</Badge>
                <Badge v-else variant="secondary">N/A</Badge>
              </TableCell>
              <TableCell class="flex justify-center">
                <div v-if="task.expand?.assignees?.length" class="flex -space-x-2 ">
                  <UserAvatar v-for="assignee in task.expand?.assignees" :key="assignee.id" :user="assignee" />
                </div>
                <Badge v-else variant="secondary">Unassigned</Badge>
              </TableCell>
              <TableCell class="max-w-[200px]">
                <div class="flex items-center justify-end flex-wrap gap-2">
                  <Button variant="default" class="flex items-center gap-2">
                    <Play />
                    Track
                  </Button>
                  <Button variant="outline"  asChild>
                    <NuxtLink :to="`/t/${task.id}`" class="flex items-center gap-2">
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
      <div v-else-if="pending">Loading tasks...</div>
      <div v-else-if="error">Error loading tasks: {{ error.message }}</div>
      <div v-else>No tasks found.</div>
  </div>
</template>
<script setup lang="ts">
import {  
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Play, Eye } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import UserAvatar from '@/components/common/UserAvatar.vue'
import type { ITask } from '~/utils/models'

import type { FetchError } from 'ofetch'

defineProps<{
    tasks: ITask[] | null | undefined
    pending: boolean
    error?: FetchError<any>,
    showProject?: boolean
}>()


</script> 
<style scoped>

</style>
