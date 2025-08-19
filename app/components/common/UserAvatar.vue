<template>
   <Avatar class="bg-white ring-2 ring-gray-200">
    <AvatarImage v-if="props.user?.avatar" :src="avatarUrl" :title="props.user.name" />
    <AvatarFallback>{{ firstLetter }}</AvatarFallback>
  </Avatar>
</template>
<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { computed, type PropType } from "vue"
import type { IUser } from "~/utils/models"
const props = defineProps({
   user: {
    type: Object as PropType<IUser>,
    required: true
   }
})

const config = useRuntimeConfig();

const firstLetter = computed(() => {
   return props.user?.name ? props.user.name.charAt(0).toUpperCase() : 'MT';
})

const avatarUrl = computed(() => {
    return props.user?.avatar ? config.public.pocketbaseUrl + '/api/files/_pb_users_auth_/' + props.user.id + '/' + props.user.avatar : '';
})


// @exists(project.team.id=@request.auth.team_members_via_user.team.id)
</script> 
