<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '~/components/ui/sidebar'
import { User2 } from 'lucide-vue-next'
import { ChevronUp } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
</script>

<template>
  <Sidebar>
    <SidebarHeader />
    <SidebarContent>
      <SidebarGroup />
      <SidebarGroup />
    </SidebarContent>
    <SidebarFooter>
        
    </SidebarFooter>
  </Sidebar>
</template>