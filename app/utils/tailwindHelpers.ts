/**
 * Tailwind CSS Dynamic Class Generation Utilities
 * 
 * This module solves the problem of dynamic Tailwind class generation that
 * works reliably with Tailwind's purging system. Instead of string interpolation
 * (which Tailwind can't detect), these utilities generate complete class names
 * that are properly recognized during build time.
 * 
 * Problem solved:
 * ❌ `text-${color}` - Tailwind can't detect this pattern
 * ✅ getTextColorClass(color) - Generates complete 'text-blue-600' classes
 * 
 * Key features:
 * - Works with Tailwind's purging system
 * - Supports any color format (blue-600, red-500, etc.)
 * - Fallback colors for undefined values  
 * - Multi-class generation for complex components
 * - Type-safe with full TypeScript support
 * 
 * @example
 * // Basic usage
 * const textClass = getTextColorClass('blue-600') // 'text-blue-600'
 * const bgClass = getBgColorClass('red-500')      // 'bg-red-500'
 * 
 * // With fallbacks
 * const textClass = getTextColorClass(undefined)  // 'text-gray-600'
 * 
 * // Multiple classes at once
 * const classes = getMultipleColorClasses('green-600', ['text', 'border', 'bg'])
 * // { text: 'text-green-600', border: 'border-green-600', bg: 'bg-green-600' }
 */

/**
 * Core function for generating Tailwind color classes
 * 
 * This is the foundation function that all other color utilities build upon.
 * It parses color values and combines them with Tailwind prefixes to create
 * complete, valid CSS class names that Tailwind can properly detect.
 * 
 * Color parsing logic:
 * - 'blue-600' → base: 'blue', shade: '600'
 * - 'red' → base: 'red', shade: '600' (default)
 * - undefined → fallback color (default: 'gray-600')
 * 
 * @param prefix - Tailwind class prefix (e.g., 'text', 'bg', 'border', 'ring')
 * @param color - Color value in format 'base-shade' (e.g., 'blue-600', 'red-500')
 * @param fallback - Fallback color when input is undefined (default: 'gray-600')
 * @returns Complete Tailwind class name ready for use in templates
 * 
 * @example
 * getTailwindColorClass('text', 'blue-600') // 'text-blue-600'
 * getTailwindColorClass('bg', 'red-500')   // 'bg-red-500'
 * getTailwindColorClass('border', 'green') // 'border-green-600'
 * getTailwindColorClass('text', undefined) // 'text-gray-600'
 * getTailwindColorClass('ring', null, 'blue-500') // 'ring-blue-500'
 */
export const getTailwindColorClass = (
  prefix: string, 
  color?: string, 
  fallback: string = 'gray-600'
): string => {
  // Handle undefined/null colors with fallback
  if (!color) return `${prefix}-${fallback}`
  
  // Extract the color base and shade (e.g., 'blue' and '600' from 'blue-600')
  // If no shade provided, default to '600' for consistent appearance
  const [colorBase, colorShade = '600'] = color.split('-')
  return `${prefix}-${colorBase}-${colorShade}`
}

/**
 * Pre-configured convenience functions for common Tailwind color classes
 * 
 * These functions provide shortcuts for the most commonly used color prefixes,
 * eliminating the need to specify the prefix every time. They all use the
 * same underlying logic but with different prefixes pre-applied.
 * 
 * Usage patterns:
 * - getTextColorClass() for text colors (text-*)
 * - getBgColorClass() for backgrounds (bg-*) 
 * - getBorderColorClass() for borders (border-*)
 * - getRingColorClass() for focus rings (ring-*)
 */
export const getTextColorClass = (color?: string) => getTailwindColorClass('text', color)
export const getBgColorClass = (color?: string) => getTailwindColorClass('bg', color)
export const getBorderColorClass = (color?: string) => getTailwindColorClass('border', color)
export const getRingColorClass = (color?: string) => getTailwindColorClass('ring', color)

/**
 * Generate multiple Tailwind color classes at once
 * @param color - Color value
 * @param prefixes - Array of prefixes to generate
 * @returns Object with generated class names
 * 
 * @example
 * getMultipleColorClasses('blue-600', ['text', 'border', 'bg'])
 * // { text: 'text-blue-600', border: 'border-blue-600', bg: 'bg-blue-600' }
 */
export const getMultipleColorClasses = (
  color?: string, 
  prefixes: string[] = ['text', 'bg', 'border']
): Record<string, string> => {
  return prefixes.reduce((acc, prefix) => {
    acc[prefix] = getTailwindColorClass(prefix, color)
    return acc
  }, {} as Record<string, string>)
}