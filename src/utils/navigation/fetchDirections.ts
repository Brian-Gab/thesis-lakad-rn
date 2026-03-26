import { MAPBOX_DIRECTIONS_URL } from "@/src/constants/url";

const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

interface MapboxManeuver {
    type: string
    instruction: string
    location: [number, number]
    distance: number
    bearing_after: number
    bearing_before: number
}

interface MapboxStep {
    duration: number
    distance: number
    name: string
    driving_side: "left" | "right" | "straight"
    weight: number
    mode: "driving" | "walking" | "cycling"
    geometry: GeoJSON.LineString
    maneuver: MapboxManeuver
}

interface MapboxLeg {
    weight: number
    duration: number
    distance: number
    summary: string
    steps: MapboxStep[]
}

export interface MapboxRoute {
    weight_name: string
    weight: number
    duration: number
    distance: number
    geometry: GeoJSON.LineString
    legs: MapboxLeg[]
}

interface MapboxWaypoint {
    distance: number
    name: string
    location: [number, number]
}

export interface MapboxResponse {
    code: "Ok" | string
    routes: MapboxRoute[]
    waypoints: MapboxWaypoint[]
    uuid: string
}


const MAX_WAYPOINTS = 25;

const fetchDirectionsChunk = async ({
    waypoints,
    steps = true,
    accessToken = ACCESS_TOKEN,
    alternatives = true,
    overview = 'full',
    profile = 'driving',
    exclude = [],
}: {
    waypoints: [number, number][],
    steps?: boolean,
    alternatives?: boolean,
    accessToken?: string,
    overview?: 'full' | 'simplified' | 'false',
    profile?: 'driving' | 'walking' | 'cycling',
    exclude?: string[],
}): Promise<MapboxResponse> => {
    const coordinates = waypoints.map(v => v.join(',')).join(';');
    const url = new URL(`${MAPBOX_DIRECTIONS_URL}/${profile}/` + coordinates)
    url.searchParams.set('geometries', 'geojson')
    url.searchParams.set('steps', steps.toString())
    url.searchParams.set('alternatives', alternatives.toString())
    url.searchParams.set('access_token', accessToken)
    url.searchParams.set('overview', overview)
    if (exclude.length > 0) url.searchParams.set('exclude', exclude.join(','))
    try {
        const response = await fetch(url.toString())
        const data: MapboxResponse = await response.json()
        if (data.code !== "Ok")
            throw new Error(`Mapbox API Error code: ${data.code}. ${JSON.stringify(data, null, 2)}`)
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchDirections = async (params: {
    waypoints: [number, number][],
    steps?: boolean,
    alternatives?: boolean,
    accessToken?: string,
    overview?: 'full' | 'simplified' | 'false',
    profile?: 'driving' | 'walking' | 'cycling',
    exclude?: string[],
}): Promise<MapboxResponse> => {
    if (params.waypoints.length <= MAX_WAYPOINTS) {
        return fetchDirectionsChunk(params);
    }

    if (params.waypoints.length > 50) {
        throw new Error("Maximum of 50 waypoints supported.");
    }

    // Split into chunks of MAX_WAYPOINTS (25), with 1 overlapping waypoint 
    // to ensure the route connects properly.
    const chunkPromises = [];
    for (let i = 0; i < params.waypoints.length - 1; i += MAX_WAYPOINTS - 1) {
        const chunkWaypoints = params.waypoints.slice(i, i + MAX_WAYPOINTS);
        chunkPromises.push(fetchDirectionsChunk({ ...params, waypoints: chunkWaypoints }));
    }

    const responses = await Promise.all(chunkPromises);

    for (const response of responses) {
        if (!response.routes || !response.routes.length) {
            throw new Error("One or more requests returned no routes.");
        }
    }

    // Base everything off the first chunk's response
    const mergedRoute: MapboxRoute = {
        weight_name: responses[0].routes[0].weight_name,
        weight: 0,
        duration: 0,
        distance: 0,
        geometry: {
            type: "LineString",
            coordinates: []
        },
        legs: []
    };

    const mergedWaypoints: MapboxWaypoint[] = [];

    responses.forEach((res, index) => {
        const route = res.routes[0];
        mergedRoute.weight += route.weight;
        mergedRoute.duration += route.duration;
        mergedRoute.distance += route.distance;
        mergedRoute.legs.push(...route.legs);

        if (index === 0) {
            mergedRoute.geometry.coordinates.push(...route.geometry.coordinates);
            mergedWaypoints.push(...res.waypoints);
        } else {
            // Avoid duplicating the connection point
            mergedRoute.geometry.coordinates.push(...route.geometry.coordinates.slice(1));
            // Avoid duplicating the connection waypoint
            mergedWaypoints.push(...res.waypoints.slice(1));
        }
    });

    return {
        code: "Ok",
        routes: [mergedRoute],
        waypoints: mergedWaypoints,
        uuid: responses[0].uuid
    };
}