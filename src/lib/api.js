const STATIC_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjA3MTIyOGVkLWQwMjAtNDMwMS05YjBjLTAzN2ZjNzIwMjgzZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJSb2JlcnQgQnJvd24iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyb2JlcnRAc21hcnRjaXR5LmNvbSIsImp0aSI6IjVjMmM1MWRiLWMxZjQtNDVkOS1iM2E2LWNjMDMxNTU5MTMwMSIsImlhdCI6MTc2ODU1NTg2MywiY29udGFjdF9lbWFpbCI6InJvYmVydEBzbWFydGNpdHkuY29tIiwiYWRkaXRpb25hbF9pbmZvIjoiLSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlByb3BlcnR5IE1hbmFnZXIiLCJ1c2VyX3R5cGUiOiJVU0VSIiwiaGllcmFyY2h5X2xldmVsIjoiNCIsInNpZ25fdXBfdHlwZSI6ImRlZmF1bHQiLCJ0ZW5hbnRfaWQiOiI1YWY5NTNkMy1mMTA2LTQzYjYtYTI3Yy1kZDA4ZDhkZWI5N2UiLCJ0ZW5hbnRfbmFtZSI6IklvVCBJbm5vdmF0aW9ucyBMdGQiLCJjdXN0b21lcl9pZCI6ImIxMDI2NWRkLTVmZTQtNGIwMC05ZjY3LTdjZDZkZDhkMGU5MyIsImN1c3RvbWVyX25hbWUiOiJTbWFydCBDaXR5IFByb2plY3QiLCJwYXJlbnRfdXNlcl9pZCI6ImIxMDI2NWRkLTVmZTQtNGIwMC05ZjY3LTdjZDZkZDhkMGU5MyIsInBhcmVudF91c2VyX25hbWUiOiJTbWFydCBDaXR5IFByb2plY3QiLCJleHAiOjE3Njg1NTk0NjMsImlzcyI6IlNtYXJ0TGlmZS5BUEkiLCJhdWQiOiJTbWFydExpZmUuVXNlcnMifQ.M7yMRAnt4Hth7Cfcb-9U-gAdpvrczVAzXzshcWEp-f8";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function serverFetch(endpoint, options = {}) {
    const { method = "GET", body, headers = {}, ...customOptions } = options;
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
        console.error(`Server Fetch Error (${endpoint}):`, err.message);
        throw err;
    }
}
