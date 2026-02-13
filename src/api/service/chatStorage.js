// src/api/service/chatStorage.js
// Professional Chat Storage Service using IndexedDB

const DB_NAME = 'EverTrekChatDB';
const DB_VERSION = 1;
const STORE_SESSIONS = 'sessions';
const STORE_MESSAGES = 'messages';

class ChatStorageService {
  constructor() {
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create sessions store
        if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
          const sessionsStore = db.createObjectStore(STORE_SESSIONS, {
            keyPath: 'id',
            autoIncrement: false
          });
          sessionsStore.createIndex('lastActivity', 'lastActivity', { unique: false });
          sessionsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create messages store
        if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
          const messagesStore = db.createObjectStore(STORE_MESSAGES, {
            keyPath: 'id',
            autoIncrement: true
          });
          messagesStore.createIndex('sessionId', 'sessionId', { unique: false });
          messagesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Create new session
  async createSession(title = 'New Trek Conversation') {
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messageCount: 0
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_SESSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SESSIONS);
        const request = store.add(session);

        request.onsuccess = () => {
          console.log('✅ Session created:', session.id);
          resolve(session);
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get all sessions
  async getAllSessions() {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_SESSIONS], 'readonly');
        const store = transaction.objectStore(STORE_SESSIONS);
        const index = store.index('lastActivity');
        const request = index.openCursor(null, 'prev'); // Most recent first

        const sessions = [];
        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            sessions.push(cursor.value);
            cursor.continue();
          } else {
            resolve(sessions);
          }
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get single session
  async getSession(sessionId) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_SESSIONS], 'readonly');
        const store = transaction.objectStore(STORE_SESSIONS);
        const request = store.get(sessionId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Update session
  async updateSession(sessionId, updates) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_SESSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SESSIONS);
        const getRequest = store.get(sessionId);

        getRequest.onsuccess = () => {
          const session = getRequest.result;
          if (!session) {
            reject(new Error('Session not found'));
            return;
          }

          const updatedSession = {
            ...session,
            ...updates,
            lastActivity: new Date().toISOString()
          };

          const putRequest = store.put(updatedSession);
          putRequest.onsuccess = () => resolve(updatedSession);
          putRequest.onerror = () => reject(putRequest.error);
        };

        getRequest.onerror = () => reject(getRequest.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete session and its messages
  async deleteSession(sessionId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Delete all messages in this session first
        await this.deleteSessionMessages(sessionId);

        // Delete the session
        const transaction = this.db.transaction([STORE_SESSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SESSIONS);
        const request = store.delete(sessionId);

        request.onsuccess = () => {
          console.log('✅ Session deleted:', sessionId);
          resolve(true);
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Save message to session
  async saveMessage(sessionId, message) {
    const messageData = {
      sessionId,
      role: message.role,
      content: message.content,
      htmlContent: message.htmlContent,
      quickButtons: message.quickButtons,
      timestamp: new Date().toISOString()
    };

    return new Promise(async (resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_MESSAGES, STORE_SESSIONS], 'readwrite');
        
        // Save message
        const messagesStore = transaction.objectStore(STORE_MESSAGES);
        const messageRequest = messagesStore.add(messageData);

        messageRequest.onsuccess = async () => {
          // Update session
          const session = await this.getSession(sessionId);
          if (session) {
            let updates = {
              messageCount: (session.messageCount || 0) + 1
            };

            // Auto-update title from first user message
            if (message.role === 'user' && session.messageCount === 0) {
              updates.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
            }

            await this.updateSession(sessionId, updates);
          }
          resolve(messageData);
        };

        messageRequest.onerror = () => reject(messageRequest.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get messages for a session
  async getSessionMessages(sessionId) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_MESSAGES], 'readonly');
        const store = transaction.objectStore(STORE_MESSAGES);
        const index = store.index('sessionId');
        const request = index.getAll(sessionId);

        request.onsuccess = () => {
          const messages = request.result.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
          resolve(messages);
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Delete all messages in a session
  async deleteSessionMessages(sessionId) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_MESSAGES], 'readwrite');
        const store = transaction.objectStore(STORE_MESSAGES);
        const index = store.index('sessionId');
        const request = index.openCursor(IDBKeyRange.only(sessionId));

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve(true);
          }
        };
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Clear all data
  async clearAllData() {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction([STORE_SESSIONS, STORE_MESSAGES], 'readwrite');
        
        const sessionsStore = transaction.objectStore(STORE_SESSIONS);
        const messagesStore = transaction.objectStore(STORE_MESSAGES);
        
        sessionsStore.clear();
        messagesStore.clear();

        transaction.oncomplete = () => {
          console.log('✅ All chat data cleared');
          resolve(true);
        };
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Export all data as JSON
  async exportData() {
    try {
      const sessions = await this.getAllSessions();
      const allMessages = {};

      for (const session of sessions) {
        allMessages[session.id] = await this.getSessionMessages(session.id);
      }

      const exportData = {
        version: DB_VERSION,
        exportDate: new Date().toISOString(),
        sessions,
        messages: allMessages
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  // Import data from JSON
  async importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // Clear existing data
      await this.clearAllData();

      // Import sessions
      for (const session of data.sessions) {
        const transaction = this.db.transaction([STORE_SESSIONS], 'readwrite');
        const store = transaction.objectStore(STORE_SESSIONS);
        await new Promise((resolve, reject) => {
          const request = store.add(session);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      // Import messages
      for (const sessionId in data.messages) {
        const messages = data.messages[sessionId];
        for (const message of messages) {
          const transaction = this.db.transaction([STORE_MESSAGES], 'readwrite');
          const store = transaction.objectStore(STORE_MESSAGES);
          await new Promise((resolve, reject) => {
            const request = store.add(message);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      }

      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatStorage = new ChatStorageService();