<template>
  <div>
    <div class="text-6xl mb-4">
      <Icon code="mdi:database-settings" class="text-primary mx-auto" />
    </div>
    <h3 class="text-xl font-medium text-base-content mb-4 text-center">Configuration du mapping</h3>
    <div class="alert alert-info max-w-2xl mx-auto">
      <Icon code="mdi:information" />
      <div>
        <p class="font-medium">
          Fichier sélectionné: <strong>{{ importData.file?.name || 'Aucun fichier' }}</strong>
        </p>
        <p class="text-sm">Interface de mapping des colonnes à implémenter</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  importData: any
}

defineProps<Props>()
</script>