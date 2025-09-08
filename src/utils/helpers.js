import countries from "./countries.json";

export const hasPermission = (permissions, required) => {
  if (!permissions) return false;
  return permissions.includes(required);
};

export const hasAnyPermission = (permissions, requiredPermissions) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) return false;
  
  return requiredPermissions.some(required => permissions.includes(required));
};

export const hasAllPermissions = (permissions, requiredPermissions) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) return false;
  
  return requiredPermissions.every(required => permissions.includes(required));
};

export const hasPermissionPattern = (permissions, pattern) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => permission.startsWith(pattern));
};

export const hasAnyPermissionPattern = (permissions, patterns) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  if (!patterns || !Array.isArray(patterns)) return false;
  
  return patterns.some(pattern => 
    permissions.some(permission => permission.startsWith(pattern))
  );
};

export const filterByPermission = (items, permissions, permissionKey = 'permission') => {
  if (!permissions || !Array.isArray(permissions)) return [];
  
  return items.filter(item => {
    const requiredPermission = item[permissionKey];
    if (!requiredPermission) return true; // If no permission required, show item
    
    if (Array.isArray(requiredPermission)) {
      return hasAnyPermission(permissions, requiredPermission);
    }
    
    return hasPermission(permissions, requiredPermission);
  });
};

// Debug helper for development
export const debugPermissions = (permissions, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔐 Permission Debug ${context ? `- ${context}` : ''}`);
    console.log('Current permissions:', permissions);
    console.log('Permission count:', permissions?.length || 0);
    console.log('User data in localStorage:', JSON.parse(localStorage.getItem('user') || 'null'));
    console.groupEnd();
  }
};

// Helper to force permission refresh (useful for debugging)
export const forcePermissionRefresh = () => {
  const userData = JSON.parse(localStorage.getItem('user') || 'null');
  const event = new CustomEvent('userChange', {
    detail: { type: 'login', userData }
  });
  window.dispatchEvent(event);
  console.log('🔄 Permission refresh triggered');
};

// Get all countries
export const getCountries = () => {
  return countries;
};

// Convert file to base64
export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });