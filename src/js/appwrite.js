// Use the global Appwrite object provided by the CDN
const { Client, Account, ID } = Appwrite;

// Initialize Appwrite client with Appwrite Cloud
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68038b6a001ffa473b65'); // Your project ID

// Initialize Appwrite account
const account = new Account(client);

export { client, account, ID };