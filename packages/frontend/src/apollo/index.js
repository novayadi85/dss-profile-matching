import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error'

import { getToken } from '@helpers/auth'
import store from "@store/store"
import { logout } from '@store/auth/action';

const env = process.env

const httpLink = createUploadLink({
    uri: env.REACT_APP_GRAPQL_URL,
});

const authLink = setContext((_, { headers }) => {
    const token = getToken();
    if(token){
        return {
            headers: {
                ...headers,
               authorization: (token) ? `Bearer ${token}` : null,
            }
        }
    }
    
    return headers;
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions: { code }, ...o }) => {
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path},Code:${code}`)
            if (code === "UNAUTHENTICATED") {
                store.dispatch(logout())
            }
        });
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
});

export default client