<template>
    <div class="space-y-4">
        <!-- Stats Overview -->
        <div class="hidden md:stats stats-horizontal shadow bg-base-100">
            <div 
                v-for="entityConfig in entityConfigs" 
                :key="entityConfig.key"
                class="stat place-items-center"
            >
                <div class="stat-figure" :class="`text-${entityConfig.entity?.color}`">
                    <Icon :code="entityConfig.entity?.icon" class="text-3xl" />
                </div>
                <div class="stat-title">{{ entityConfig.entity?.label }}</div>
                <div class="stat-value" :class="`text-${entityConfig.entity?.color}`">{{ entityConfig.count }}</div>
            </div>
        </div>

        <!-- Data Grid -->
        <div class="grid grid-1 md:grid-cols-5 gap-2 divide-x-2 divide-base-300">
            <div 
                v-for="entityConfig in entityConfigs" 
                :key="entityConfig.key"
                class="p-2"
            >
                <h2 class="font-black text-center mb-4 flex items-center justify-center gap-2" :class="`text-${entityConfig.entity?.color}`">
                    <Icon :code="entityConfig.entity?.icon" />
                    {{ entityConfig.entity?.label }} ({{ entityConfig.count }})
                </h2>
                <div class="text-sm h-screen overflow-y-scroll space-y-1">
                    <div 
                        v-for="item in entityConfig.data" 
                        :key="item[entityConfig.keyField]" 
                        class="p-2 border-b border-base-300 hover:bg-base-200 text-sm cursor-pointer"
                    >
                        {{ entityConfig.display(item) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Define Props
const props = defineProps<{
    persons: any[];
    mandates: any[];
    properties: any[];
    units: any[];
    leases: any[];
}>();

// X14 Entity display functions
const displayX14Person = (item: any): string => `${item.identites_id} - ${item.computedName}`

const displayX14Mandate = (item: any): string => `${item.mandat_gestion_id} - ${item.mandant_computedName}`

const displayX14Property = (item: any): string => `${item.id} - ${item.nom_batiment}, ${item.postal_code} ${item.locality}`

const displayX14Unit = (item: any): string => `${item.id} - ${item.computed_name}`

const displayX14Lease = (item: any): string => `${item.contrat_location_id} - ${item.computed_libelle}`

// Entity configuration mapping
const entityMap = {
    person: { data: () => props.persons, display: displayX14Person, keyField: 'identites_id' },
    mandate: { data: () => props.mandates, display: displayX14Mandate, keyField: 'mandat_gestion_id' },
    property: { data: () => props.properties, display: displayX14Property, keyField: 'id' },
    unit: { data: () => props.units, display: displayX14Unit, keyField: 'id' },
    lease: { data: () => props.leases, display: displayX14Lease, keyField: 'contrat_location_id' }
}

// Dynamic entity configuration
const entityConfigs = computed(() => 
    Object.entries(entityMap).map(([key, config]) => {
        const data = config.data()
        return {
            key,
            entity: getEntity(key),
            data,
            count: data?.length || 0,
            display: config.display,
            keyField: config.keyField
        }
    })
)
</script>