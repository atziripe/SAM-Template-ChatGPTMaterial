const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.CHAT_GPT_TABLE

exports.saveWiki = async (event) => {
    console.log(event);

    const name = event.queryStringParameters.name;

    const item = {
        id: name,
        name: name,
        date: Date.now()
    }

    console.log(item);

    const savedItem = await saveItem(item);

    return {
        statusCode: 200,
        body: JSON.stringify(savedItem),
      }
}

exports.getWiki = async (event) => {
    const name = event.queryStringParameters.name;

    try {
        const item = await getItem(name);
        console.log(item);
    
        if (item.info) {
            
            
            return {
                statusCode: 200,
                body: item.info
            }
        }
    } catch (e) {
        return {
            statusCode: 200,
            body: 'No info for that quesiton'
        }
    }
}

async function saveItem(item) {
    const params = {
		TableName: TABLE_NAME,
		Item: item
	};

    console.log(params)
    
    return dynamo.put(params).promise().then(() => {
        return item;
    });
};

async function getItem (name) {
    console.log('getItem');
    
    const params = {
      Key: {
        id: name,
      },
      TableName: TABLE_NAME
    };

    console.log(params);
  
    return dynamo.get(params).promise().then(result => {
        console.log(result);
        return result.Item;
    });
};