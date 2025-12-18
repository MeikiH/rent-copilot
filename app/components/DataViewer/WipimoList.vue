<template>
    <div class="space-y-4">
        <!-- Stats Overview -->
        <div class="hidden md:stats stats-horizontal shadow bg-base-100">
            <div 
                v-for="entityConfig in entityConfigs" 
                :key="entityConfig.key"
                class="stat place-items-center"
            >
                <div class="stat-figure" :class="entityConfig.textColorClass">
                    <Icon :code="entityConfig.entity?.icon" class="text-3xl" />
                </div>
                <div class="stat-title">{{ entityConfig.entity?.label }}</div>
                <div class="stat-value " :class="entityConfig.textColorClass">{{ entityConfig.count }}</div>
            </div>
        </div>

        <!-- Data Grid -->
        <div class="grid grid-1 md:grid-cols-6 gap-6">
            <div 
                v-for="entityConfig in entityConfigs" 
                :key="entityConfig.key"
                class="card bg-base-100 shadow-xl"
            >
                <div class="card-header" :class="entityConfig.borderColorClass">
                    <h3 class="card-title flex items-center gap-2" :class="entityConfig.textColorClass">
                        <Icon :code="entityConfig.entity?.icon" />
                        {{ entityConfig.entity?.label }}
                    </h3>
                </div>
                <div class="card-body p-2 max-h-150 overflow-y-auto">
                    <div 
                        v-for="item in entityConfig.data" 
                        :key="item.Id" 
                        class="p-2 border-b border-base-300 hover:bg-base-200 text-sm"
                    >
                        <div 
                            v-if="entityConfig.key === 'supplier'"
                            v-html="entityConfig.display(item)"
                        ></div>
                        <div v-else>{{ entityConfig.display(item) }}</div>
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
    mandateOwners: any[];
    properties: any[];
    units: any[];
    leases: any[];
    suppliers: any[];
}>();

// Entity display functions
const displayPerson = (item: any): string => `${item.Id} - ${item.NomPrenom}`

const displayMandateOwner = (item: any): string => `${item.Id} - ${item.Prop?.NomPrenom || 'N/A'}`

const displayProperty = (item: any): string => `${item.Id} - ${item.Nom || `${item.Adresse_Ligne1 || ''} ${item.Adresse_CodePostal} ${item.Adresse_Commune}`}`

const displayUnit = (item: any): string => `${item.Id} - ${item.Immeuble_Nom}`

const displayLease = (item: any): string => `${item.Id} - ${item.Loca_NomPrenom}`

const displaySupplier = (item: any): string => {
    const main = `${item.Id} - ${item.NomPrenom}`
    const activity = item.Activite ? `<span class="badge badge-warning badge-sm ml-2">${item.Activite}</span>` : ''
    return main + activity
}

// Entity configuration mapping
const entityMap = {
    person: { data: () => props.persons, display: displayPerson },
    mandateOwner: { data: () => props.mandateOwners, display: displayMandateOwner },
    property: { data: () => props.properties, display: displayProperty },
    unit: { data: () => props.units, display: displayUnit },
    lease: { data: () => props.leases, display: displayLease },
    supplier: { data: () => props.suppliers, display: displaySupplier }
}

// Dynamic entity configuration
const entityConfigs = computed(() => 
    Object.entries(entityMap).map(([key, config]) => {
        const data = config.data()
        const entity = getEntity(key)
        return {
            key,
            entity,
            data,
            count: data?.length || 0,
            display: config.display,
            textColorClass: getTextColorClass(entity?.color),
            borderColorClass: getBorderColorClass(entity?.color)
        }
    })
)
</script>