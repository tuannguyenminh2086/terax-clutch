<template>
  <div>
   <form @submit="onSubmit" class="space-y-5">
      <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" :disabled="isSubmitting" placeholder="Project Name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Project Description</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" :disabled="isSubmitting" placeholder="Project Description" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        </FormField>

        <Button type="submit" size="lg" class="w-full" variant="default" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="flex items-center">
            <Loader2 class="w-4 h-4 mr-2 animate-spin" /> Creating...
          </span>
          <span v-else>
            Create Project
          </span>
        </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toTypedSchema } from '@vee-validate/zod';
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'

const formSchema = toTypedSchema(z.object({
  name: z.string({ "error": "Project name is required" })
                .min(2, { "error": "Project name is required"} )
                .max(300, { "error": "Project name must be at most 300 characters" }),
  description: z.string({ "error": "Project description is required" })
                .min(2, { "error": "Project description is required" })
                .max(300, { "error": "Project description must be at most 300 characters" }),
})) 

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
    console.log(values)
    try {
      const { data } = await useFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      console.log(data.value)
    } catch (error) {
      console.log(error)
    }
})

</script>

<style scoped>

</style>