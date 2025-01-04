import { createApp } from '../index';
import { setupTestDB } from './helpers/testHelpers';

// Set up the test database
setupTestDB();

// Create Express app instance for tests
export const app = createApp();
