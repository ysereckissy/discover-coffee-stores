import {findRecordByFilter} from "../../lib/airtable";

const getCoffeeStoreById = async(req, res) => {
    const { id } = req.query;
    try {
        if(id) {
            const records = await findRecordByFilter(id);
            if(records.length) {
                res.status(200).json(records);
            } else {
                res.json({message: "Record not found"});
            }
        } else {
            res.status(400).json({message: "Invalid ID"});
        }
    } catch (error) {
        res.status(500)
        res.json({message: "Something went wrong:", error});
    }
}

export default getCoffeeStoreById;