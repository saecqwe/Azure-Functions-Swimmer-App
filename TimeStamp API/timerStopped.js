const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const event_id = req.query.event_id;
    const heat_number = req.query.heat_number;
    const lane_number = req.query.lane_number;
    const stopTimeNtp = req.query.stopTimeNtp;

    if (!event_id || !heat_number || !lane_number || !stopTimeNtp) {
        context.res = {
            status: 400,
            body: "Please provide 'event_id', 'heat_number', 'lane_number', and 'stopTimeNtp' parameters"
        };
        return;
    }

    const client = new CosmosClient("AccountEndpoint=https://swimming-dev.documents.azure.com:443/;AccountKey=81Dc5ygZ8psdmfMNK44gh70LRw8bqSxGbsVSp2dqcBjWG92iJjrDMM2jrKYXmmgUuKV0e1J0VhK9ACDbNDMXXw==;");
    const databaseId = "swimmmer-events";
    const containerId = "Lanes";

    try {
        // Create a new document in the lane container
        const document = {
            event_id,
            heat_number,
            lane_number,
            stopTimeNtp
        };
        const { resource } = await client.database(databaseId).container(containerId).items.create(document);

        context.res = {
            body: `Created document: ${JSON.stringify(resource)}`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error creating document: ${error.message}`
        };
    }
};
