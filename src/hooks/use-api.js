"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

const STATIC_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjA3MTIyOGVkLWQwMjAtNDMwMS05YjBjLTAzN2ZjNzIwMjgzZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJSb2JlcnQgQnJvd24iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyb2JlcnRAc21hcnRjaXR5LmNvbSIsImp0aSI6IjRhZDI0NjdmLTg4ODUtNGJkOS1hYzRmLTZjNjliMmM4ZmQwYyIsImlhdCI6MTc2ODQ4NTE2NiwiY29udGFjdF9lbWFpbCI6InJvYmVydEBzbWFydGNpdHkuY29tIiwiYWRkaXRpb25hbF9pbmZvIjoiLSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlByb3BlcnR5IE1hbmFnZXIiLCJ1c2VyX3R5cGUiOiJVU0VSIiwiaGllcmFyY2h5X2xldmVsIjoiNCIsInNpZ25fdXBfdHlwZSI6ImRlZmF1bHQiLCJ0ZW5hbnRfaWQiOiI1YWY5NTNkMy1mMTA2LTQzYjYtYTI3Yy1kZDA4ZDhkZWI5N2UiLCJ0ZW5hbnRfbmFtZSI6IklvVCBJbm5vdmF0aW9ucyBMdGQiLCJjdXN0b21lcl9pZCI6ImIxMDI2NWRkLTVmZTQtNGIwMC05ZjY3LTdjZDZkZDhkMGU5MyIsImN1c3RvbWVyX25hbWUiOiJTbWFydCBDaXR5IFByb2plY3QiLCJwYXJlbnRfdXNlcl9pZCI6ImIxMDI2NWRkLTVmZTQtNGIwMC05ZjY3LTdjZDZkZDhkMGU5MyIsInBhcmVudF91c2VyX25hbWUiOiJTbWFydCBDaXR5IFByb2plY3QiLCJleHAiOjE3Njg0ODg3NjYsImlzcyI6IlNtYXJ0TGlmZS5BUEkiLCJhdWQiOiJTbWFydExpZmUuVXNlcnMifQ.dnw9rAt2gjr4jTcKFo3-0P-g1AUVaTxZTuhXIxOlvzg";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function useApi(queryEndpoint = null, options = {}) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(!!queryEndpoint);
    const [error, setError] = useState(null);

    const optionsMemo = useMemo(() => options, [JSON.stringify(options)]);

    const request = useCallback(async (endpoint, reqOptions = {}) => {
        setIsLoading(true);
        setError(null);

        const { method = "GET", body, headers = {}, ...customOptions } = reqOptions;
        const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

        const defaultHeaders = {
            "Accept": "text/plain",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${STATIC_TOKEN}`,
            ...headers,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: defaultHeaders,
                body: body ? JSON.stringify(body) : undefined,
                ...customOptions,
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.message || `Error ${response.status}: ${response.statusText}`);
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetch = useCallback(async () => {
        if (!queryEndpoint) return;
        try {
            const result = await request(queryEndpoint, optionsMemo);
            setData(result);
            return result;
        } catch (err) {

        }
    }, [queryEndpoint, request, optionsMemo]);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (queryEndpoint && !hasFetched.current) {
            hasFetched.current = true;
            refetch();
        }
    }, [queryEndpoint, refetch]);

    const post = useCallback((endpoint, body, opt = {}) =>
        request(endpoint, { ...opt, method: "POST", body }), [request]);

    const put = useCallback((endpoint, body, opt = {}) =>
        request(endpoint, { ...opt, method: "PUT", body }), [request]);

    const del = useCallback((endpoint, opt = {}) =>
        request(endpoint, { ...opt, method: "DELETE" }), [request]);

    const clearError = () => setError(null);

    const ErrorAlert = () => {
        if (!error) return null;
        return (
            <Alert variant="destructive" className="mb-6 relative animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Server Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <button onClick={clearError} className="absolute right-4 top-4 hover:opacity-70 transition-opacity">
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        );
    };

    return {
        data,
        isLoading,
        error,
        refetch,
        post,
        put,
        del,
        clearError,
        ErrorAlert
    };
}
