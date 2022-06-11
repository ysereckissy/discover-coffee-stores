import {updateCoffeeStores} from "../../lib/airtable";

const upvoteCoffeeStore =  async (req, res) => {
    if('PUT' === req.method) {
        try {
            const { id } = req.body;
            if(!id){
                res.status(400);
                return res.json({message: "Id is required"});
            }
            const records = await updateCoffeeStores(id);
            if(records.length){
                res.json(records);
            } else {
                res.status(404);
                res.json({message: "Coffee Store Not Found", id});
            }
        } catch (error) {
            res.status(500);
            res.json({message: "Error up-voting the coffee store"});
        }
    } else {
        res.status(404).json({message: "resource not found."});
    }
}

export default upvoteCoffeeStore;