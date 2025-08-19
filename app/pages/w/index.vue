<template>
  <div>
    <h1>Welcome to your Dashboard!</h1>
    <!-- Your protected content here -->
    <div v-if="user && activeTeam">
      <h2>Welcome, {{ user.name }}!</h2>
      <h3>Active Team: {{ activeTeam.name }}</h3>

      <div v-if="activeSubscription">
        <p>Subscription Status: <strong>{{ activeSubscription.status }}</strong></p>
        <p>Current Plan: <strong>{{ activePlan.name }}</strong></p>
        <p>Max Members Allowed: {{ activePlan.max_members }}</p>
        <p>Renews on: {{ new Date(activeSubscription.current_period_end).toLocaleDateString() }}</p>
      </div>
      <div v-else>
        <p>This team does not have an active subscription.</p>
      </div>
  </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'authenticated'
});

import { useAuth } from '~/composables/useAuth'

const { user, activeTeam, activeSubscription, activePlan } = useAuth();
</script>