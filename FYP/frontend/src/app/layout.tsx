'use client'

import './globals.css'
import React, { useEffect, useState } from 'react'
import client from '../../apollo/apolloClient'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { store, persistor } from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import LoadingScreen from '../../components/LoadingScreen/page'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <div className="layout-container">
                <div className={`page-content ${loading ? 'hidden-page' : 'visible-page'}`}>
                  {children}
                </div>
                <div className={`loading-overlay ${loading ? 'fade-in' : 'fade-out'}`}>
                  {loading && <LoadingScreen />}
                </div>
              </div>
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </body>
    </html>
  )
}
