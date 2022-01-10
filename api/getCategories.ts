import buildUrl from "../utils/buildUrl";
import { Type } from "../constants";

function getCategories(url: string, username: string, password: string, type: Type) {
    let action = null;

    switch (type) {
        case Type.Live:
            action = "get_live_categories";
            break;
        case Type.Movies:
            action = "get_vod_categories";
            break;
        case Type.Series:
            action = "get_series_categories";
            break;
    }

    try {
        return fetch(buildUrl(url + "/player_api.php", { username, password, action }), { method: "GET" }).then(
            response => {
                if (!response.ok) {
                    throw new Error(`Response status ${response.status}`);
                }

                const contentType = response.headers.get("content-type");

                if (!contentType || contentType.indexOf("application/json") === -1) {
                    throw new Error("Response is not json");
                }

                return response.json();
            },
        );
    } catch (error) {
        throw new Error(error);
    }
}

export default getCategories;
