<template>
  <div class="drawer lg:drawer-open">
    <!-- Mobile Menu Toggle -->
    <input id="drawer-toggle" type="checkbox" class="drawer-toggle" />
    
    <!-- Main Content -->
    <div class="drawer-content flex flex-col">

      <!-- Header -->
      <div class="navbar bg-base-100 shadow-sm">

        <div class="navbar-start">

            <!-- Mobile menu button -->
            <div class="flex-none lg:hidden">
                <label for="drawer-toggle" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <Icon code="heroicons:bars-3" />
                </label>
            </div>
            
            <!-- Dynamic Page Title -->
            <div class="flex items-center gap-3 ml-4">
                <h1 v-if="pageTitle" class="card-title text-3xl font-bold text-primary">
                    {{ pageTitle }}
                </h1>
            </div>

        </div>
        
        <div class="navbar-end">
          <!-- User Menu -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
                <Icon code="heroicons:user" />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a class="flex items-center gap-2">
                        <Icon code="heroicons:user" />
                        {{ user?.userName }}
                        </a>
                    </li>
                    <li>
                        <hr />
                    </li>
                    <li>
                        <a @click="handleLogout" class="text-error">
                        <Icon code="heroicons:arrow-right-on-rectangle" />
                        Se déconnecter
                        </a>
                    </li>
                </ul>
          </div>
        </div>
      </div>
      
      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    
    <!-- Sidebar -->
    <div class="drawer-side">
      <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
      <SidebarMenu :menu-entries="menuEntries" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { menuEntries } from '~/layouts/menu'

const { user, clear } = useUserSession()
const router = useRouter()
const route = useRoute()

// Get the page title from the route meta or page data
const pageTitle = computed(() => {
  return route.meta.title || null
})

const handleLogout = () => {
  clear()
  router.push('/auth/login')
}
</script>