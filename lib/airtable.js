const Airtable = require('airtable');
const base = new Airtable( {
    apiKey: process.env.AIRTABLE_API_KEY,
} ).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");
const getMinifiedRecords = records => records.map(record => ({ ...record.fields, record_id: record.id}));
const findRecordByFilter = async (id) => {
    const records = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();
    return getMinifiedRecords(records);
};
const updateCoffeeStores = async (id) => {

    const records = await findRecordByFilter(id);
    if (records.length) {
        const record = records[0];
        const calculatedVoting = parseInt(record.voting) + 1;
        const updatedRecord = await table.update([{
            id: record.record_id,
            fields: {
                voting: calculatedVoting,
            }
        }]);
        if (updatedRecord) {
            return getMinifiedRecords(updatedRecord);
        }
    }
    return [];
};
/// export symbols
export {
    table,
    getMinifiedRecords,
    findRecordByFilter,
    updateCoffeeStores,
 };

