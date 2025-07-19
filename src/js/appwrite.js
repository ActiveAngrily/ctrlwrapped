// Use the global Appwrite object provided by the CDN
const { Client, Account, ID } = Appwrite;

// Initialize Appwrite client with Appwrite Cloud
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your custom endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID); // Your project ID

// Initialize Appwrite account
const account = new Account(client);

export { client, account, ID };