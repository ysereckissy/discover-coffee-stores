import {createApi} from 'unsplash-js';

// on your node server
const unsplashServerApi = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getCoffeeStoresUrl = (latLong, query, limit = 6) => {
    const baseAddress = `https://api.foursquare.com/v3/places/search?`;
    const latLongString = `ll=${latLong}`;
    const queryString = `query=${query}`;
    const limitString = `limit=${limit}`;
    const radiusString = `radius=100000`;
    return `${baseAddress}${queryString}&${latLongString}&${limitString}&${radiusString}`;
};

const fetchCoffeeStoresPhotos = async (query, limit = 6) => {
    const unsplashResults = await unsplashServerApi.search.getPhotos({
        query: `${query}`,
        page: 1,
        perPage: limit,
    });

    const photos = unsplashResults?.response?.results;
    return photos.map(photo => photo.urls['small']);
}
    
export const fetchCoffeeStores = async (latLong = `29.6752401619802%2C-95.3329080792144`, limit = 6) => {

    const options = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_ACCESS_TOKEN}`
        }
    };
    const response = await fetch(
        getCoffeeStoresUrl(latLong, `coffee`, limit),
        options);
    const data = await response.json();
    const photosUrls = await fetchCoffeeStoresPhotos('coffee shops', limit);

    return data?.results.map((result, idx) => {
        const location = result.location;
        return {
            id: result.fsq_id,
            address: location.formatted_address || "",
            name: result.name,
            neighbourhood: (location.neighborhood && location.neighborhood.length && location.neighborhood[0]) || location.cross_street || "",
            imgUrl: photosUrls[idx],
        };
    }) || [];
}
