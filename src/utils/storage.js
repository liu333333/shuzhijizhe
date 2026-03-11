// 存储工具类

// SessionStorage
class SessionStorage {
  static setItem(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('SessionStorage setItem error:', error)
    }
  }

  static getItem(key) {
    try {
      const value = sessionStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('SessionStorage getItem error:', error)
      return null
    }
  }

  static removeItem(key) {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('SessionStorage removeItem error:', error)
    }
  }

  static clear() {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('SessionStorage clear error:', error)
    }
  }
}

// LocalStorage
class Storage {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('LocalStorage setItem error:', error)
    }
  }

  static getItem(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('LocalStorage getItem error:', error)
      return null
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage removeItem error:', error)
    }
  }

  static clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('LocalStorage clear error:', error)
    }
  }
}

export { SessionStorage, Storage }