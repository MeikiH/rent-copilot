/**
 * Entity Metadata Management Utilities
 * 
 * This module provides centralized management of entity metadata for the application.
 * It contains all entity definitions with their properties like labels, icons, colors,
 * and business rules (master requirements, relationships, etc.).
 * 
 * Key features:
 * - Single source of truth for all entity metadata
 * - Consistent entity properties across the application
 * - Support for entity relationships (belongsTo hierarchy)
 * - Master import configuration flags
 * - Multilingual label support (French labels)
 * 
 * @example
 * const entity = getEntity('mandateOwner')
 * console.log(entity?.label) // 'Mandant'
 * console.log(entity?.icon)  // 'mdi:home'
 * console.log(entity?.color) // 'blue-600'
 */

/**
 * Complete metadata structure for an entity
 * Contains all information needed to display and manage an entity type
 */
interface EntityMetadata {
  /** French display label for the entity */
  label: string
  /** Unique identifier key for the entity type */
  key: string
  /** Material Design Icon code for visual representation */
  icon: string
  /** Tailwind color value (e.g., 'blue-600') for consistent theming */
  color: string
  /** Whether this entity is included in master data imports */
  in_master: boolean
  /** Whether this entity is required for master data validation */
  master_required: boolean
  /** Parent entity key for hierarchical relationships */
  belongsTo?: string
  /** Whether this entity is included in light master imports */
  master_light_version: boolean
}

/**
 * Master registry of all application entities
 * 
 * This array contains complete metadata for every entity type in the system.
 * Each entity defines its display properties, business rules, and relationships.
 * 
 * Entity hierarchy (belongsTo relationships):
 * - mandateOwner (root)
 *   ├── mandate
 *   ├── model 
 *   └── property
 *       └── unit
 *           ├── gli_insurance
 *           └── tenant
 *               └── lease
 *                   └── mrh_insurance
 * 
 * Standalone entities:
 * - person (not in master)
 * - supplier (not in master)
 */
const ENTITIES: EntityMetadata[] = [
  {
    label: 'Mandant',
    key: 'mandateOwner',
    icon: 'mdi:home',
    color: 'blue-600',
    in_master: true,
    master_required: true,
    master_light_version: true
  },
  {
    label: 'Mandat',
    key: 'mandate',
    icon: 'mdi:clipboard-text',
    color: 'purple-600',
    in_master: true,
    master_required: false,
    belongsTo: 'mandateOwner',
    master_light_version: true
  },
  {
    label: 'Mode Gestion (Honos)',
    key: 'model',
    icon: 'mdi:cash',
    color: 'green-600',
    in_master: true,
    master_required: true,
    belongsTo: 'mandateOwner',
    master_light_version: true
  },
  {
    label: 'Immeuble',
    key: 'property',
    icon: 'mdi:office-building',
    color: 'orange-600',
    in_master: true,
    master_required: true,
    belongsTo: 'mandateOwner',
    master_light_version: true
  },
  {
    label: 'Lot',
    key: 'unit',
    icon: 'mdi:home-variant',
    color: 'teal-600',
    in_master: true,
    master_required: true,
    belongsTo: 'property',
    master_light_version: true
  },
  {
    label: 'GLI',
    key: 'gli_insurance',
    icon: 'mdi:shield-check',
    color: 'indigo-600',
    in_master: true,
    master_required: false,
    belongsTo: 'unit',
    master_light_version: false
  },
  {
    label: 'Locataire',
    key: 'tenant',
    icon: 'mdi:account',
    color: 'pink-600',
    in_master: true,
    master_required: true,
    belongsTo: 'unit',
    master_light_version: true
  },
  {
    label: 'Bail',
    key: 'lease',
    icon: 'mdi:file-document-edit',
    color: 'cyan-600',
    in_master: true,
    master_required: true,
    belongsTo: 'tenant',
    master_light_version: true
  },
  {
    label: 'Assurance HAB',
    key: 'mrh_insurance',
    icon: 'mdi:shield-home',
    color: 'red-600',
    in_master: true,
    master_required: false,
    belongsTo: 'lease',
    master_light_version: false
  },
  {
    label: 'Fournisseur',
    key: 'supplier',
    icon: 'mdi:truck',
    color: 'amber-600',
    in_master: false,
    master_required: false,
    master_light_version: false
  },
  {
    label: 'Personne',
    key: 'person',
    icon: 'mdi:person',
    color: 'yellow-600',
    in_master: false,
    master_required: false,
    master_light_version: false
  }
]

/**
 * Retrieve entity metadata by key or label
 * 
 * This is the primary function for accessing entity information throughout
 * the application. It supports lookup by both the internal key and the
 * display label, making it flexible for different use cases.
 * 
 * @param keyOrLabel - Entity key (e.g., 'mandateOwner') or display label (e.g., 'Mandant')
 * @returns Complete entity metadata object, or undefined if not found
 * 
 * @example
 * // Lookup by key
 * const entity = getEntity('mandateOwner')
 * 
 * // Lookup by French label  
 * const entity = getEntity('Mandant')
 * 
 * // Safe property access
 * const icon = getEntity('property')?.icon || 'mdi:help'
 * const color = getEntity('unit')?.color || 'gray-600'
 * 
 * // Check entity relationships
 * const parent = getEntity('unit')?.belongsTo // 'property'
 * const isMasterRequired = getEntity('lease')?.master_required // true
 */
export const getEntity = (keyOrLabel: string): EntityMetadata | undefined => {
  return ENTITIES.find(entity => 
    entity.key === keyOrLabel || entity.label === keyOrLabel
  )
}

/**
 * Retrieve multiple entities with optional filtering
 * 
 * Returns an array of entities that match the provided filter criteria.
 * If no filters are provided, returns all entities. Filters are combined
 * with AND logic (all conditions must be met).
 * 
 * @param filters - Optional object with filter criteria (key/value pairs)
 * @returns Array of entities matching the filter criteria
 * 
 * @example
 * // Get all entities
 * const allEntities = getEntities()
 * 
 * // Get entities included in master imports
 * const masterEntities = getEntities({ in_master: true })
 * 
 * // Get required master entities
 * const requiredEntities = getEntities({ in_master: true, master_required: true })
 * 
 * // Get entities by parent relationship
 * const propertyChildren = getEntities({ belongsTo: 'property' })
 * 
 * // Get entities by color theme
 * const blueEntities = getEntities({ color: 'blue-600' })
 * 
 * // Get light master version entities
 * const lightEntities = getEntities({ master_light_version: true })
 * 
 * // Combine multiple filters
 * const specificEntities = getEntities({ 
 *   in_master: true, 
 *   belongsTo: 'mandateOwner' 
 * })
 */
export const getEntities = (filters?: Partial<EntityMetadata>): EntityMetadata[] => {
  // If no filters provided, return all entities
  if (!filters || Object.keys(filters).length === 0) {
    return [...ENTITIES]
  }
  
  return ENTITIES.filter(entity => {
    // Check if entity matches all filter criteria
    return Object.entries(filters).every(([key, value]) => {
      const entityValue = entity[key as keyof EntityMetadata]
      return entityValue === value
    })
  })
}