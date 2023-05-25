const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const time = req.query.time;
    const event_id = req.query.event_id;
    const heat_number = req.query.heat_number;

    if (!time || !event_id || !heat_number) {
        context.res = {
            status: 400,
            body: "Please provide 'time', 'event_id', and 'heat_number' parameters"
        };
        return;
    }

    const client = new CosmosClient("AccountEndpoint=https://swimming-dev.documents.azure.com:443/;AccountKey=81Dc5ygZ8psdmfMNK44gh70LRw8bqSxGbsVSp2dqcBjWG92iJjrDMM2jrKYXmmgUuKV0e1J0VhK9ACDbNDMXXw==;");
    const databaseId = "swimmmer-events";
    const containerId = "Heats";

    try {
        // Retrieve the existing document based on event_id and heat_number
        const querySpec = {
            query: "SELECT * FROM Heats h WHERE h.event_id ="+event_id+" AND h.heat_number ="+heat_number,
            parameters: [
                { name: "@event_id", value: event_id },
                { name: "@heat_number", value: heat_number }
            ]
        };
        const { resources } = await client.database(databaseId).container(containerId).items.query(querySpec).fetchAll();

        if (resources.length === 0) {
            context.res = {
                status: 404,
                body: `Could not find a document with event_id '${event_id}' and heat_number '${heat_number}'`
            };
            return;
        }

        // Update the document with the new startTime property
        const document = resources[0];
        document.startTime = time;
        const { resource } = await client.database(databaseId).container(containerId).item(document.id, document.partition_key).replace(document);

        context.res = {
            body: `Updated document: ${JSON.stringify(resource)}`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error updating document: ${error.message}`
        };
    }
};
