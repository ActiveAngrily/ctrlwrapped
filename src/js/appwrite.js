import { Client, Account, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint('http://localhost/v1')
    .setProject('your-project-id'); // Replace with your project ID after setup

// Initialize Appwrite account
const account = new Account(client);

export { client, account, ID };