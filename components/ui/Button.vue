<script setup lang="ts">
import { cn } from '@/utils/utils'
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-base ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs',
  {
    variants: {
      variant: {
        // TODO::COLOR
        default: 'bg-[#1976D2] text-white hover:bg-[#1E88E5]',
        destructive:
          'bg-red-500 text-white hover:bg-red-700',
        outline:
          'border border-neutral-200 hover:bg-white bg-neutral-50',
        secondary:
          'bg-neutral-100 hover:bg-neutral-200/50',
        ghost: 'hover:bg-neutral-100 shadow-none',
        link: 'shadow-none hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-xl px-3 py-1',
        lg: 'h-11 rounded-xl px-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface Props {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  as?: string
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <component
    :is="as"
    :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>