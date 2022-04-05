import {useCallback, useEffect, useState} from 'react';
import {useRoute} from '../../shared/router';

type AuthenticationScopes = Array<'email' | 'profile'>;

const defaultState: AuthenticationScopes = [];

interface Result {
    isLoading: boolean;
    authenticationScopes: AuthenticationScopes;
}

export const useAuthenticationScopes = (connectionCode: string): Result => {
    const url = useRoute('akeneo_connectivity_connection_apps_rest_get_all_connected_app_authentication_scopes', {
        connectionCode,
    });

    const fetchDataCallback = useCallback(async () => {
        const response = await fetch(url, {
            method: 'GET',
            headers: [['X-Requested-With', 'XMLHttpRequest']],
        });
        if (!response.ok) {
            return Promise.reject(`${response.status} ${response.statusText}`);
        }

        return response.json();
    }, [url]);

    const [authenticationScopes, setAuthenticationScopes] = useState<AuthenticationScopes>(defaultState);
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDataCallback()
            .then(setAuthenticationScopes)
            .catch(() => setAuthenticationScopes(defaultState))
            .finally(() => setLoading(false));
    }, []);

    return {isLoading, authenticationScopes};
};
