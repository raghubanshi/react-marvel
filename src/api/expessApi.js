import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


class ExpressApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {

        console.debug("API Call:", endpoint, data, method);
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${ExpressApi.token}` };
        const params = (method === "get")
            ? data
            : {};


        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** Get the current user. */

    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Get token for login from username, password. */

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    /** Signup for site. */

    static async signup(data) {
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    /** Get all favorite Character */
    static async getCurrentUserCharacter(username,userId) {
        let res = await this.request(`characters/favorite/${username}/${userId}`);
        return res.character;
    }

    /** Create a favorite Character */
    static async createCurrentUserCharacter(username,characterId, data) {
        let res = await this.request(`characters/favorite/${username}/${characterId}`, data, "post");
        return res.character;
    }

    /** Remove a favorite Character */
    static async removeCurrentUserCharacter(username,characterId, data) {
        let res = await this.request(`characters/favorite/${username}/${characterId}`, data, "delete");
        return res.character;
    }

}

export default ExpressApi;