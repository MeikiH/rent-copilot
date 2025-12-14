export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (loggedIn.value) {
    const redirectTo = to.query.redirect as string || '/'
    return navigateTo(redirectTo)
  }
})