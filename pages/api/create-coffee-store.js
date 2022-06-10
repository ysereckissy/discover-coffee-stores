import {table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const {id, name, address, neighbourhood, voting, imgUrl } = req.body;
        if(!id) {
            res.status(400);
            return res.json({message: "invalid id provided"});
        }
        try {
            const records = await table.select({
                view: 'Grid view',
                filterByFormula: `id="${id}"`
            }).firstPage();
            if(records.length) {
                res.status(200).json(getMinifiedRecords(records));
            } else {
                console.log("Records :", records, "id=", id);
                /// record doesn't exist. create it
                /// make sure the name is valid before moving forward
                if(!name) {
                    return res.status(400).json({
                        message: "invalid record name",
                    });
                }
                try {
                    const createdRecords = await table.create([{
                        fields: { id, name, address, neighbourhood, voting, imgUrl, }
                    }]);
                    res.status(200).json({
                        message: "new record created!",
                        records: getMinifiedRecords(createdRecords),
                    });
                } catch (err) {
                    res.status(500).json({message: err});
                }
            }
        } catch (err) {
            res.status(500).json({message: err});
        }
    }
}
export default createCoffeeStore;