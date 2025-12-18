/**
 * DaisyUI Component Class Generation Utilities
 * 
 * This module provides utilities for generating DaisyUI component classes
 * with proper semantic colors and sizing. Unlike Tailwind utilities that
 * work with specific color values, DaisyUI uses semantic color names that
 * adapt to the current theme.
 * 
 * Key differences from Tailwind:
 * - Semantic colors: 'primary', 'success', 'error' vs 'blue-600', 'green-500'
 * - Component-specific: 'btn-primary' vs generic 'text-blue-600'
 * - Theme-aware: Colors change with DaisyUI themes automatically
 * - Component variants: outline, sizes, states built into the system
 * 
 * Design philosophy:
 * - Generate only modifier classes (not base classes like 'btn')
 * - Let components control their own base classes
 * - Provide type-safe semantic color options
 * - Support all DaisyUI component variants
 * 
 * @example
 * // Component provides base, helper provides modifiers
 * <button class="btn {{ getBtnClass('primary', 'lg') }}">Click me</button>
 * // Renders: <button class="btn btn-primary btn-lg">Click me</button>
 * 
 * // Badge with multiple modifiers
 * <span class="badge {{ getBadgeClass('success', 'sm', true) }}">New</span>  
 * // Renders: <span class="badge badge-success badge-sm badge-outline">New</span>
 */

/**
 * DaisyUI semantic color palette
 * 
 * These colors automatically adapt to the active DaisyUI theme.
 * Unlike Tailwind's specific color values, these represent semantic
 * meaning that changes based on user preferences or theme selection.
 * 
 * Color categories:
 * - Brand: primary, secondary, accent
 * - Feedback: success, warning, error, info  
 * - Neutral: neutral, base-* (backgrounds)
 * - Content: base-content (text that works on base backgrounds)
 */
export type DaisyUIColor = 
  | 'primary' | 'secondary' | 'accent' | 'neutral'
  | 'base-100' | 'base-200' | 'base-300' | 'base-content'
  | 'info' | 'success' | 'warning' | 'error'

/**
 * Standard DaisyUI component size scale
 * 
 * Provides consistent sizing across all DaisyUI components.
 * Not all components support all sizes - refer to DaisyUI docs.
 * 
 * Size scale: xs < sm < md < lg < xl
 * - xs: Extra small (compact interfaces)
 * - sm: Small (dense layouts)
 * - md: Medium (default size)
 * - lg: Large (prominent elements)
 * - xl: Extra large (hero elements)
 */
export type DaisyUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Generate DaisyUI class name from color value and prefix
 * @param prefix - DaisyUI class prefix (e.g., 'btn', 'badge', 'alert', 'text')
 * @param color - DaisyUI color value
 * @param fallback - Fallback color if color is undefined
 * @returns Complete DaisyUI class name
 * 
 * @example
 * getDaisyUIColorClass('btn', 'primary') // 'btn-primary'
 * getDaisyUIColorClass('badge', 'success') // 'badge-success'
 * getDaisyUIColorClass('text', undefined) // 'text-neutral'
 */
export const getDaisyUIColorClass = (
  prefix: string,
  color?: DaisyUIColor | string,
  fallback: DaisyUIColor = 'neutral'
): string => {
  const colorValue = color || fallback
  return `${prefix}-${colorValue}`
}

/**
 * Generate DaisyUI size class
 * @param component - Component name (e.g., 'btn', 'input', 'modal')
 * @param size - Size value
 * @returns Complete DaisyUI size class
 */
export const getDaisyUISizeClass = (
  component: string,
  size?: DaisyUISize
): string => {
  return size ? `${component}-${size}` : component
}

/**
 * DaisyUI component class builders
 * 
 * These functions generate modifier classes for DaisyUI components.
 * They return only the styling modifiers, not the base component class.
 * This allows components to maintain control over their structure while
 * helpers focus purely on styling variations.
 * 
 * Pattern:
 * - Function generates: 'btn-primary btn-lg btn-outline'
 * - Component provides: 'btn' (base class)
 * - Result: 'btn btn-primary btn-lg btn-outline'
 * 
 * Benefits:
 * - Clean separation of concerns
 * - Component flexibility (can combine with other base classes)
 * - No duplication of base classes
 * - Easier to maintain and extend
 */

/**
 * Generate button modifier classes
 * 
 * Creates all styling modifiers for DaisyUI buttons without the base 'btn' class.
 * Supports color variants, sizing, and outline style.
 * 
 * @param color - Semantic color for the button theme
 * @param size - Button size from the DaisyUI scale 
 * @param outline - Whether to use outline variant (transparent with colored border)
 * @returns Space-separated modifier classes ready for use
 * 
 * @example
 * getBtnClass('primary', 'lg')           // 'btn-primary btn-lg'
 * getBtnClass('success', 'sm', true)     // 'btn-success btn-sm btn-outline'
 * getBtnClass()                          // '' (empty string)
 */
export const getBtnClass = (color?: DaisyUIColor, size?: DaisyUISize, outline?: boolean) => {
  const colorClass = color ? getDaisyUIColorClass('btn', color) : ''
  const sizeClass = size ? getDaisyUISizeClass('btn', size) : ''
  const outlineClass = outline ? 'btn-outline' : ''
  
  return [colorClass, sizeClass, outlineClass].filter(Boolean).join(' ')
}

/**
 * Generate badge modifier classes
 * 
 * Creates styling modifiers for DaisyUI badges. Badges are typically used
 * for status indicators, counters, and labels.
 * 
 * @param color - Semantic color for the badge theme
 * @param size - Badge size (note: not all sizes supported by badges)
 * @param outline - Whether to use outline variant
 * @returns Space-separated modifier classes
 * 
 * @example
 * getBadgeClass('success', 'sm')         // 'badge-success badge-sm'
 * getBadgeClass('warning', undefined, true) // 'badge-warning badge-outline'
 */
export const getBadgeClass = (color?: DaisyUIColor, size?: DaisyUISize, outline?: boolean) => {
  const colorClass = color ? getDaisyUIColorClass('badge', color) : ''
  const sizeClass = size ? getDaisyUISizeClass('badge', size) : ''
  const outlineClass = outline ? 'badge-outline' : ''
  
  return [colorClass, sizeClass, outlineClass].filter(Boolean).join(' ')
}

/**
 * Generate alert modifier classes
 * 
 * Creates styling modifiers for DaisyUI alerts. Alerts are used for
 * important messages and notifications.
 * 
 * @param color - Semantic color representing the alert type
 * @returns Alert color class or empty string
 * 
 * @example
 * getAlertClass('error')    // 'alert-error'
 * getAlertClass('success')  // 'alert-success'
 * getAlertClass()          // ''
 */
export const getAlertClass = (color?: DaisyUIColor) => {
  const colorClass = color ? getDaisyUIColorClass('alert', color) : ''
  
  return colorClass
}

/**
 * Generate progress bar modifier classes
 * 
 * Creates styling modifiers for DaisyUI progress bars.
 * 
 * @param color - Semantic color for the progress bar
 * @returns Progress color class or empty string
 * 
 * @example  
 * getProgressClass('primary') // 'progress-primary'
 * getProgressClass('success') // 'progress-success'
 */
export const getProgressClass = (color?: DaisyUIColor) => {
  const colorClass = color ? getDaisyUIColorClass('progress', color) : ''
  
  return colorClass
}

/**
 * Generate multiple DaisyUI component classes at once
 * @param color - DaisyUI color value
 * @param components - Array of component names
 * @returns Object with generated class names
 * 
 * @example
 * getMultipleDaisyUIClasses('primary', ['btn', 'badge', 'progress'])
 * // { btn: 'btn-primary', badge: 'badge-primary', progress: 'progress-primary' }
 */
export const getMultipleDaisyUIClasses = (
  color?: DaisyUIColor,
  components: string[] = ['btn', 'badge', 'alert']
): Record<string, string> => {
  return components.reduce((acc, component) => {
    acc[component] = getDaisyUIColorClass(component, color)
    return acc
  }, {} as Record<string, string>)
}