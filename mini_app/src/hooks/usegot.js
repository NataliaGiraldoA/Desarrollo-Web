import { useEffect, useState, useCallback, useRef } from "react";
import { http } from "../api/http"

const httpGet = (url, { params, signal }) => axios.get(url, { params, signal });

export default function useGot(endpoint = '', { lazy = false, defaultData = null } = {}) {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(!lazy);
    const [error, setError] = useState(null);
    const controllerRef = useRef(null);

    const request = useCallback(async (path = endpoint, { method = 'GET', body = null, params = null } = {}) => {
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        setLoading(true);
        setError(null);
        try {
            const url = path;
            const signal = controllerRef.current.signal;
            const response = method === "GET" ? await httpGet(url, { params, signal }) : await http({ method, url, data: body, params, signal });
            setData(response.data);
            setLoading(false);
            return response.data;
        } catch (err) {
            if (err.canceled) return;
            setError(err);
            setLoading(false);
            throw err;
        }
    }, [endpoint]);

    useEffect(() => {
        if (!lazy) request();
        return () => controllerRef.current?.abort();
    }, [request, lazy]);

    const refresh = useCallback(() => request(), [request]);
    const get = useCallback((path, opts) => request(path ?? endpoint, { method: 'GET', ...(opts || {}) }), [request, endpoint]);
    const post = useCallback((path, body, opts) => request(path ?? endpoint, { method: 'POST', body, ...(opts || {}) }), [request, endpoint]);
    const put = useCallback((path, body, opts) => request(path ?? endpoint, { method: 'PUT', body, ...(opts || {}) }), [request, endpoint]);
    const del = useCallback((path, opts) => request(path ?? endpoint, { method: 'DELETE', ...(opts || {}) }), [request, endpoint]);

    return { data, loading, error, refresh, get, post, put, del };
}
