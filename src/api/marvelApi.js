import axios from "axios";
const CryptoJS = require("crypto-js");

// API details
const publicKey = "c3e436273499fd3aba9fee6782587c13";
const privateKey = "aa2edea58aa0da15119849e76dd1dc6621b8618e";

// Base API endpoint
const MARVEL_BASE_URL = 'https://gateway.marvel.com/v1/public';

// Generate a timestamp (current date and time)
const ts = new Date().getTime();

// Generate the hash using ts + privateKey + publicKey
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

// API parameters
const params = {
    apikey: publicKey,
    ts: ts,
    hash: hash
}


class MarvelApi {

    static async request(endpoint, method = "get") {
        console.debug("API Call:", endpoint, method);

        const url = `${MARVEL_BASE_URL}/${endpoint}`;

        try {
            return (await axios({ url, method, params })).data;
        }
        catch (err) {
            console.error("API Error:", err.response);
        }
    }

    // Individual API routes

    /** Get the marvel characters */
    static async getMarvelCharacters() {
        delete params?.offset;
        delete params?.nameStartsWith;
        let res = await this.request(`characters`);
        return res.data.results;
    }

    /** Get the marvel characters with offset */
    static async getMarvelCharactersByOffset(offsetVal) {
        params.offset = offsetVal;
        let res = await this.request(`characters`);
        return res.data.results;
    }

    /** Get single marvel character by id */
    static async getMarvelCharacterById(characterId) {
        let res = await this.request(`characters/${characterId}`);
        return res.data.results[0];
    }

    /** Get characters (filtered by name if not undefined) */

    static async getMarvelCharacterByName(name) {
        params.nameStartsWith = name;
        params.limit = 100;
        delete params?.offset;
        let res = await this.request("characters");
        delete params?.nameStartsWith;
        delete params?.limit;
        return res.data.results;
    }

    /** Get comics by characterId */
    static async getMarvelComicsByCharacterId(characterId) {
        let res = await this.request(`characters/${characterId}/comics`);
        return res.data?.results;
    }

    /** Get single comic by id */
    static async getMarvelComicById(comicId) {
        let res = await this.request(`comics/${comicId}`);
        return res.data.results[0];
    }

}


export default MarvelApi
