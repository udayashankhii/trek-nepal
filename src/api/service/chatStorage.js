// services/chatStorage.js
class ChatStorageService {
  constructor() {
    this.dbName = 'EverTrekChatDB';
    this.version = 1;
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { 
            keyPath: 'id' 
          });
          sessionsStore.createIndex('lastActivity', 'lastActivity', { unique: false });
          sessionsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Create messages store
        if (!db.objectStoreNames.contains('messages')) {
          const messagesStore = db.createObjectStore('messages', { 
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

    const transaction = this.db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');
    await store.add(session);

    return session;
  }

  // Save message to current session
  async saveMessage(sessionId, message) {
    const messageData = {
      sessionId,
      role: message.role,
      content: message.content,
      htmlContent: message.htmlContent,
      quickButtons: message.quickButtons,
      timestamp: new Date().toISOString()
    };

    const transaction = this.db.transaction(['messages', 'sessions'], 'readwrite');
    
    // Save message
    const messagesStore = transaction.objectStore('messages');
    await messagesStore.add(messageData);

    // Update session activity
    const sessionsStore = transaction.objectStore('sessions');
    const session = await sessionsStore.get(sessionId);
    if (session) {
      session.lastActivity = new Date().toISOString();
      session.messageCount = (session.messageCount || 0) + 1;
      
      // Auto-update title from first user message
      if (!session.title.startsWith('New') && session.messageCount === 2 && message.role === 'user') {
        session.title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      }
      
      await sessionsStore.put(session);
    }

    return messageData;
  }

  // Get all sessions
  async getAllSessions() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
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
    });
  }

  // Get messages for a session
  async getSessionMessages(sessionId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('sessionId');
      const request = index.getAll(sessionId);

      request.onsuccess = () => {
        const messages = request.result.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        resolve(messages);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Delete session and its messages
  async deleteSession(sessionId) {
    const transaction = this.db.transaction(['sessions', 'messages'], 'readwrite');
    
    // Delete session
    const sessionsStore = transaction.objectStore('sessions');
    await sessionsStore.delete(sessionId);

    // Delete all messages
    const messagesStore = transaction.objectStore('messages');
    const index = messagesStore.index('sessionId');
    const request = index.openCursor(IDBKeyRange.only(sessionId));

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  // Clear all data
  async clearAllData() {
    const transaction = this.db.transaction(['sessions', 'messages'], 'readwrite');
    await transaction.objectStore('sessions').clear();
    await transaction.objectStore('messages').clear();
  }

  // Export all data as JSON
  async exportData() {
    const sessions = await this.getAllSessions();
    const allData = await Promise.all(
      sessions.map(async (session) => ({
        session,
        messages: await this.getSessionMessages(session.id)
      }))
    );
    return JSON.stringify(allData, null, 2);
  }
}

export const chatStorage = new ChatStorageService();
