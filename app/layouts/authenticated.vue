<template>
    <SidebarProvider>
        <AppSidebar />
        <main id="main-content" class="px-5 relative w-full">
            <div class="flex items-center justify-between py-2">
                <SidebarTrigger />
            </div>
            <div class="py-5">
                <slot />
            </div>
        </main>
    </SidebarProvider>
</template>
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "~/components/AppSidebar.vue";
</script>