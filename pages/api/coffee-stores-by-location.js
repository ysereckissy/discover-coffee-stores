import {fetchCoffeeStores} from "../../lib/coffee-stores";

const coffeeStoreByLocation = async (req, res) => {
    /// configure latLong and limit
    try {
        const {latLong, limit} = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        res.status(200);
        res.json(response);
    } catch (error) {
        res.stat(500);
        res.json({message: "Oh no! Something went wrong!"});
    }
}

export default coffeeStoreByLocation;