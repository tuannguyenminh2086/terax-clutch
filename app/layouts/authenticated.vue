<template>
    <div>
    <SidebarProvider>
        <AppSidebar />
        <main>
        <SidebarTrigger />
        <div class="p-5">
            <slot />
        </div>
        </main>
    </SidebarProvider>
    </div>
    
</template>
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "~/components/AppSidebar.vue";
</script>