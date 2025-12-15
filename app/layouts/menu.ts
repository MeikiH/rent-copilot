export interface MenuEntry {
  slug: string
  name: string
  icon_code: string
  path: string
}

export const menuEntries: MenuEntry[] = [
  {
    slug: 'overview',
    name: 'Connecteurs',
    icon_code: 'heroicons:globe-alt',
    path: '/'
  },
  {
    slug: 'data_viewer',
    name: 'Data Viz 360°',
    icon_code: 'heroicons:chart-pie',
    path: '/data-viewer'
  },
  {
    slug: 'import_master_wipimo',
    name: 'Import Excel Wipimo',
    icon_code: 'heroicons:document-arrow-up',
    path: '/import/wipimo'
  },
  {
    slug: 'transfer_x14_wipimo',
    name: 'Bascule X14 > Wipimo',
    icon_code: 'heroicons:arrow-path',
    path: '/transfer/x14-wipimo'
  }
]