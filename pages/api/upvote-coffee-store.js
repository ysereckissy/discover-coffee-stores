import {findRecordByFilter, getMinifiedRecords, table} from "../../lib/airtable";

export default async (req, res) => {
    if('PUT' === req.method) {
        try {
            const { id } = req.body;
            if(!id){
                res.status(400);
                return res.json({message: "Id is required"});
            }
            const records = await findRecordByFilter(id);
            if(records.length){
                const record = records[0];
                const calculatedVoting = parseInt(record.voting) + 1;
                const updatedRecord = await table.update([{
                    id: record.record_id,
                    fields: {
                        voting: calculatedVoting,
                    }
                }]);
                if(updatedRecord) {
                    res.json(getMinifiedRecords(updatedRecord));
                } else {
                    res.status(500);
                    res.json({message: "Unexpected data format received!"});
                }
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