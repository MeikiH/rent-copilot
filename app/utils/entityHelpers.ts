/**
 * Utility functions for handling entity metadata
 */

export const getEntityIcon = (entityType: string): string => {
  const icons: Record<string, string> = {
    mandateOwner: 'mdi:home',
    mandate: 'mdi:clipboard-text',
    model: 'mdi:cash',
    person: 'mdi:person',
    property: 'mdi:office-building',
    unit: 'mdi:home-variant',
    gli_insurance: 'mdi:shield-check',
    tenant: 'mdi:account',
    lease: 'mdi:file-document-edit',
    mrh_insurance: 'mdi:shield-home',
    supplier: 'mdi:truck'
  }
  return icons[entityType] || 'mdi:file-document'
}

export const getEntityLabel = (entityType: string): string => {
  const labels: Record<string, string> = {
    mandateOwner: 'Bailleurs',
    mandate: 'Mandats',
    model: 'Modes de Gestion',
    person: 'Personnes',
    property: 'Immeubles',
    unit: 'Lots',
    gli_insurance: 'Assurances GLI',
    tenant: 'Locataires',
    lease: 'Baux',
    mrh_insurance: 'Assurances MRH',
    supplier: 'Fournisseurs'
  }
  return labels[entityType] || entityType
}

export const getEntityColor = (entityType: string): string => {
  const colors: Record<string, string> = {
    mandateOwner: 'blue-600',
    mandate: 'purple-600',
    model: 'green-600',
    person: 'yellow-600',
    property: 'orange-600',
    unit: 'teal-600',
    gli_insurance: 'indigo-600',
    tenant: 'pink-600',
    lease: 'cyan-600',
    mrh_insurance: 'red-600',
    supplier: 'amber-600'
  }
  return colors[entityType] || 'gray-600'
}

/**
 * Get comprehensive entity metadata
 */
export const getEntityMetadata = (entityType: string) => {
  return {
    type: entityType,
    icon: getEntityIcon(entityType),
    label: getEntityLabel(entityType),
    color: getEntityColor(entityType)
  }
}