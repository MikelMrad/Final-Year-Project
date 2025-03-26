import { getToken } from '../utils/auth'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default client
