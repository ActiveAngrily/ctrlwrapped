import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client with Appwrite Cloud
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68038b6a001ffa473b65'); // Replace with your Appwrite Cloud project ID

// Initialize Appwrite account
const account = new Account(client);

export { client, account, ID };