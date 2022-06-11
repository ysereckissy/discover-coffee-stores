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
/// export symbols
export {
    table,
    getMinifiedRecords,
    findRecordByFilter,
};

