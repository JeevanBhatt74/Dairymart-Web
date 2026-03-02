'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { CartProvider } from './_context/CartContext'
import { ToastProvider } from './_context/ToastContext'
import { NotificationProvider } from './_context/NotificationContext'
import StyledJsxRegistry from './registry'

let clientQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return new QueryClient({
      defaultOptions: {
        queries: { staleTime: 0 },
      },
    })
  }
  // Browser: use singleton pattern to keep the same query client
  if (!clientQueryClient)
    clientQueryClient = new QueryClient({
      defaultOptions: {
        queries: { staleTime: 60 * 1000 },
      },
    })
  return clientQueryClient
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <StyledJsxRegistry>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NotificationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationProvider>
        </ToastProvider>
      </QueryClientProvider>
    </StyledJsxRegistry>
  )
}
