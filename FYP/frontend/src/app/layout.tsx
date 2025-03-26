'use client'
import "./globals.css"
import React from "react"
import client from '../../apolloClient/apolloClient'
import { Provider } from "react-redux"
import { ApolloProvider } from '@apollo/client'
import { store, persistor } from "../redux/store"
import { PersistGate } from 'redux-persist/integration/react'

export default function RootLayout({
  children, 
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </Provider>
        </ApolloProvider>
      </body>
    </html>
  )
}
