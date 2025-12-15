<template>
    <div>
        <div class="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
            <div class="stat">
                <div class="stat-title">Personnes</div>
                <div class="stat-value text-primary">{{ stats.persons }}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Mandants</div>
                <div class="stat-value text-secondary">{{ stats.mandateOwners }}</div>
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
            <div class="stat">
                <div class="stat-title">Fournisseurs</div>
                <div class="stat-value text-warning">{{ stats.suppliers }}</div>
            </div>
        </div>
    </div>

    <!-- Data Grid -->
    <div class="grid grid-cols-6 gap-6">
        
        <!-- Persons -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Personnes</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="person in persons" :key="person.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                {{ person.Id }} - {{ person.NomPrenom }}
                </div>
            </div>
        </div>

        <!-- Mandate Owners -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Mandants</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="mandateOwner in mandateOwners" :key="mandateOwner.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                {{ mandateOwner.Id }} - {{ (mandateOwner.Prop.NomPrenom) || 'N/A' }}
                </div>
            </div>
        </div>

        <!-- Properties -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Immeubles</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="property in properties" :key="property.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                {{ property.Id }} - {{ property.Nom || `${property.Adresse_Ligne1 || ''} ${property.Adresse_CodePostal} ${property.Adresse_Commune}` }}
                </div>
            </div>
        </div>

        <!-- Units -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Lots</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="unit in units" :key="unit.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                {{ unit.Id }} - {{ unit.Immeuble_Nom }}
                </div>
            </div>
        </div>

        <!-- Leases -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Baux</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="lease in leases" :key="lease.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                {{ lease.Id }} - {{ lease.Loca_NomPrenom }}
                </div>
            </div>
        </div>

        <!-- Suppliers -->
        <div class="card bg-base-100 shadow-xl">
            <div class="card-header">
                <h3 class="card-title">Fournisseurs</h3>
            </div>
            <div class="card-body p-2 max-h-150 overflow-y-auto">
                <div v-for="supplier in suppliers" :key="supplier.Id" class="p-2 border-b border-base-300 hover:bg-base-200 text-sm">
                <div class="">
                    <p>{{ supplier.Id }} - {{ supplier.NomPrenom }}</p>
                    <p class="badge badge-warning badge-sm h-max">{{ supplier.Activite }}</p>
                </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup lang="ts">
// define Props
const props = defineProps<{
    persons: any[];
    mandateOwners: any[];
    properties: any[];
    units: any[];
    leases: any[];
    suppliers: any[];
}>();

// COMPUTED STATS
const stats = computed(() => ({
    persons: props.persons?.length || 0,
    mandateOwners: props.mandateOwners?.length || 0,
    properties: props.properties?.length || 0,
    units: props.units?.length || 0,
    leases: props.leases?.length || 0,
    suppliers: props.suppliers?.length || 0,
}));
</script>