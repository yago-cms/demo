require('./bootstrap');

import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createUploadLink } from "apollo-upload-client";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { onError } from "@apollo/client/link/error";
import { render } from 'react-dom';
import { setContext } from '@apollo/client/link/context';
import App from './components/App';
import React from 'react';

const uploadLink = createUploadLink({
    uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ extensions }) => {
            // unset token reload window if authenticated
            if (extensions.category == 'authentication') {
                localStorage.removeItem('accessToken');
                location.reload();
            }
        });
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache()
});

render(
    <ApolloProvider client={client}>
        <BrowserRouter basename="/admin">
            <DndProvider backend={HTML5Backend}>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </DndProvider>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('app'));