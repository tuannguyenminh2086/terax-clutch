<template>
  <div class="w-full min-w-[320px]">
    <form @submit="onSubmit" class="space-y-6">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" v-bind="componentField" :disabled="isSubmitting" />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="componentField" :disabled="isSubmitting" />
          </FormControl>
        <FormMessage class="text-xs" />
      </FormItem>
     </FormField>
      <Button type="submit" class="w-full cursor-pointer" variant="default" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="flex items-center gap-2 text-muted-foreground">
          <Loader2 class="w-4 h-4 mr-2 animate-spin" /> Logging in...
        </span>
        <span v-else>Login</span>
      </Button>
    </form>
    <p v-if="error" class="text-red-500 text-xs mt-4">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { loginSchema } from '@/utils/schemas/auth'

import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

const error = ref<string | null>(null)

const formSchema = toTypedSchema(loginSchema)

const { isSubmitting, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const { data } = await useFetch('/api/auth/login', {
    method: 'POST',
    body: values,
  })

  if (typeof data.value === 'undefined') {
    error.value = 'Something went wrong'
    return
  }

  if (data.value?.user) {
    navigateTo('/w')
  }
})
</script>

<style scoped>

</style>