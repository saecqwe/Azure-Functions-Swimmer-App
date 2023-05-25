const CosmosClient = require('@azure/cosmos').CosmosClient;

module.exports = async function (context, req) {
    const client = new CosmosClient("AccountEndpoint=https://swimming-dev.documents.azure.com:443/;AccountKey=81Dc5ygZ8psdmfMNK44gh70LRw8bqSxGbsVSp2dqcBjWG92iJjrDMM2jrKYXmmgUuKV0e1J0VhK9ACDbNDMXXw==;");
    const databaseId = "swimmmer-events";
    const containerName = "Events";

    const container = client.database(databaseId).container(containerName);

     try {
    // query all documents in the container
    const querySpec = {
      query: "SELECT * FROM c",
    };
    const { resources: items } = await client
      .database(databaseId)
      .container(containerName)
      .items.query(querySpec)
      .fetchAll();

    context.res = {
      // return the documents as the response
      body: items,
    };
  } catch (error) {
    context.log(`Error getting items from Cosmos DB: ${error}`);
    context.res = {
      status: 500,
      body: "Error getting items from Cosmos DB :"+error,
    };
  }

};

