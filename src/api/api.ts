import axios from "axios";

export const BASE_URL = "http://localhost:3001";

const post = async (
    url: string,
    token: string | null,
    data = {},
    _config = {}
) => {
    const config: any = { ..._config };
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    return axios
        .post(url, data, { ...config })
        .then((res: any) => {
            if (res.status) {
                const { data, status } = res;
                return { data, status };
            } else {
                return {
                    status: 200,
                    data: res,
                };
            }
        })
        .catch(({ response }: any) => {
            return response;
        });
};

const get = async (url: string, token: string | null, _config: any = {}) => {
    const config: any = { ..._config };
    if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
    }
    return await axios
        .get(url, { ...config })
        .then((res: any) => {
            if (res.status) {
                return res.data;
            } else {
                return res.data;
            }
        })
        .catch(({ response }: any) => {
            return response.data;
        });
};
export const getCookie = (name: string): string => {
    const nameLenPlus = name.length + 1;
    return (
        document.cookie
            .split(";")
            .map((c) => c.trim())
            .filter((cookie) => {
                return cookie.substring(0, nameLenPlus) === `${name}=`;
            })
            .map((cookie) => {
                return decodeURIComponent(cookie.substring(nameLenPlus));
            })[0] || ""
    );
};

export const api = {
    signIn: async (email: string, password: string) => {
        try {
            const res = await post(`${BASE_URL}/auth/login`, null, {
                email: email,
                password: password,
            });
            if (res?.status === 400) {
                return {
                    success: false,
                    error: res.data.error,
                };
            } else if (res?.statusCode === 401) {
                return {
                    success: false,
                    error: ["Incorrect E-mail Address or password"],
                };
            }
            return res.data;
        } catch (e) {
            return {
                success: false,
                error: e,
            };
        }
    },
    user: () => get(`${BASE_URL}/auth/me`, sessionStorage.getItem("auth")),
    conversation: () => get(`${BASE_URL}/conversation`, sessionStorage.getItem("auth")),
    messages: (id: string) => get(`${BASE_URL}/conversation/${id}`, sessionStorage.getItem("auth")),
    createMessages: async (id: string, params: any) => {
        try {
            const res = await post(`${BASE_URL}/conversation/${id}`, sessionStorage.getItem("auth"), {
                message: params.message
            });
            return res.data;
        } catch (e) {
            return {
                success: false,
                error: e,
            };
        }
    },
}