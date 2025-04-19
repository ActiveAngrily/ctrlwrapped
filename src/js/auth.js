import { account, ID } from './appwrite.js';

class AuthService {
    /**
     * Create a new user account
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} username - Username
     * @returns {Promise} - Promise with user data or error
     */
    async createAccount(email, password, username) {
        try {
            const user = await account.create(
                ID.unique(),
                email,
                password,
                username
            );
            
            if (user) {
                // Login immediately after successful account creation
                return await this.login(email, password);
            }
            
            return user;
        } catch (error) {
            console.error('Appwrite service :: createAccount :: error', error);
            throw error;
        }
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} - Promise with session data or error
     */
    async login(email, password) {
        try {
            return await account.createEmailSession(email, password);
        } catch (error) {
            console.error('Appwrite service :: login :: error', error);
            throw error;
        }
    }

    /**
     * Get current user data
     * @returns {Promise} - Promise with user data or null
     */
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            console.error('Appwrite service :: getCurrentUser :: error', error);
            return null;
        }
    }

    /**
     * Logout current user
     * @returns {Promise} - Promise with logout result
     */
    async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error('Appwrite service :: logout :: error', error);
            throw error;
        }
    }

    /**
     * Check if user is logged in
     * @returns {Promise<boolean>} - Promise with boolean result
     */
    async isLoggedIn() {
        try {
            const user = await this.getCurrentUser();
            return !!user;
        } catch (error) {
            return false;
        }
    }
}

export const authService = new AuthService();