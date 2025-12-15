<template>
    <div>
        <div class="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
            <div class="stat">
                <div class="stat-title">Personnes</div>
                <div class="stat-value text-primary">{{ stats.persons }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Mandats</div>
                <div class="stat-value text-secondary">{{ stats.mandates }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Immeubles</div>
                <div class="stat-value text-accent">{{ stats.properties }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Lots</div>
                <div class="stat-value text-info">{{ stats.units }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Baux</div>
                <div class="stat-value text-success">{{ stats.leases }}</div>
            </div>
        </div>
    </div>

    <!-- Data Grid -->
    <div class="grid grid-cols-5 gap-2 divide-x-2 divide-base-300">
        
        <!-- Persons -->
        <div class="p-2">
            <h2 class="font-black text-center mb-4">Personnes ({{ persons.length }})</h2>
            <div class="text-sm h-screen overflow-y-scroll space-y-1">
                <div v-for="person in persons" :key="person.identites_id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer">
                {{ person.identites_id }} - {{ person.computedName }}
                </div>
            </div>
        </div>

        <!-- Mandates -->
        <div class="p-2">
            <h2 class="font-black text-center mb-4">Mandats ({{ mandates.length }})</h2>
            <div class="text-sm h-screen overflow-y-scroll space-y-1">
                <div v-for="mandate in mandates" :key="mandate.mandat_gestion_id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer">
                {{ mandate.mandat_gestion_id }} - {{ mandate.mandant_computedName }}
                </div>
            </div>
        </div>

        <!-- Properties -->
        <div class="p-2">
            <h2 class="font-black text-center mb-4">Immeubles ({{ properties.length }})</h2>
            <div class="text-sm h-screen overflow-y-scroll space-y-1">
                <div v-for="property in properties" :key="property.id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer">
                {{ property.id }} - {{ property.nom_batiment }}, {{ property.postal_code }} {{ property.locality }}
                </div>
            </div>
        </div>

        <!-- Units -->
        <div class="p-2">
            <h2 class="font-black text-center mb-4">Lots ({{ units.length }})</h2>
            <div class="text-sm h-screen overflow-y-scroll space-y-1">
                <div v-for="unit in units" :key="unit.id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer">
                {{ unit.id }} - {{ unit.computed_name }}
                </div>
            </div>
        </div>

        <!-- Leases -->
        <div class="p-2">
            <h2 class="font-black text-center mb-4">Baux ({{ leases.length }})</h2>
            <div class="text-sm h-screen overflow-y-scroll space-y-1">
                <div v-for="lease in leases" :key="lease.contrat_location_id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer">
                {{ lease.contrat_location_id }} - {{ lease.computed_libelle }}
                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
// define Props
const props = defineProps<{
    persons: any[];
    mandates: any[];
    properties: any[];
    units: any[];
    leases: any[];
}>();


// COMPUTED STATS
const stats = computed(() => ({
    persons: props.persons?.length || 0,
    mandates: props.mandates?.length || 0,
    properties: props.properties?.length || 0,
    units: props.units?.length || 0,
    leases: props.leases?.length || 0,
}));
</script>