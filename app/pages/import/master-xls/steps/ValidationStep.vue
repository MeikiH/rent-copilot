<template>
  <div>
    <div class="text-6xl mb-4">
      <Icon code="mdi:check-circle" class="text-success mx-auto" />
    </div>
    <h3 class="text-xl font-medium text-base-content mb-4 text-center">Validation finale</h3>
    <div class="alert alert-success max-w-2xl mx-auto">
      <Icon code="mdi:check-circle" />
      <div>
        <p class="font-medium">
          Prêt à importer <strong>{{ importData.file?.name || 'le fichier' }}</strong>
        </p>
        <p class="text-sm">Processus d'import et validation à implémenter</p>
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