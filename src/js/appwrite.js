import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client with Appwrite Cloud
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('your-project-id'); // Replace with your Appwrite Cloud project ID

// Initialize Appwrite account
const account = new Account(client);

export { client, account, ID };