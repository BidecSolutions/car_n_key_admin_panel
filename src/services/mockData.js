// mockData.js
// -------------------- Mock Data --------------------
export const mockDoctors = [
  { id: 1, name: 'Dr. Ahmed Khan', specialty: ['Cardiology', 'General Medicine'], availableDays: ['monday','wednesday','friday'], timeSlots: ['09:00','17:00'] },
  { id: 2, name: 'Dr. Fatima Ali', specialty: ['Pediatrics'], availableDays: ['tuesday','thursday','saturday'], timeSlots: ['10:00','18:00'] },
  { id: 3, name: 'Dr. Muhammad Hassan', specialty: ['Neurology'], availableDays: ['monday','tuesday','wednesday','thursday'], timeSlots: ['08:00','16:00'] },
];

// export const mockTests = [
//   { id: 1, name: 'Complete Blood Count (CBC)', price: 1500, duration: 30, description: 'Measures blood components.' },
//   { id: 2, name: 'Blood Glucose Test', price: 800, duration: 15, description: 'Measures blood sugar.' },
//   { id: 3, name: 'Lipid Profile', price: 1200, duration: 45, description: 'Measures cholesterol and fats.' },
//   { id: 4, name: 'Liver Function Test', price: 1800, duration: 60, description: 'Measures liver enzymes.' },
// ];

export const mockUsers = [
  { id: 1, name: 'Ali Raza', email: 'ali@example.com', role: 'admin' },
  { id: 2, name: 'Sara Khan', email: 'sara@example.com', role: 'user' },
];

export const mockRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Doctor' },
];


export const mockPermissions = [
  { id: 1, module: 'Users', permissionName: 'Create', name: 'Create User' },
  { id: 2, module: 'Users', permissionName: 'Edit', name: 'Edit User' },
  { id: 3, module: 'Users', permissionName: 'Delete', name: 'Delete User' },
  { id: 4, module: 'Roles', permissionName: 'Create', name: 'Create Role' },
  { id: 5, module: 'Roles', permissionName: 'Edit', name: 'Edit Role' },
  { id: 6, module: 'Roles', permissionName: 'Delete', name: 'Delete Role' },
  { id: 7, module: 'Doctors', permissionName: 'View', name: 'View Doctors' },
  { id: 8, module: 'Admin', permissionName: 'Selec All', name: 'Super master' },
];


// -------------------- Mock API --------------------
export const mockAPI = {
  doctors: {
    getAll: () => Promise.resolve({ data: mockDoctors }),
    getById: (id) => Promise.resolve({ data: mockDoctors.find(d => d.id === id) }),
    create: (data) => { const newDoctor = { ...data, id: Math.max(...mockDoctors.map(d=>d.id))+1 }; mockDoctors.push(newDoctor); return Promise.resolve({ data: newDoctor }); },
    update: (id, data) => { const index = mockDoctors.findIndex(d=>d.id===id); if(index!==-1){ mockDoctors[index] = {...mockDoctors[index],...data}; return Promise.resolve({data: mockDoctors[index]}); } return Promise.reject(new Error('Doctor not found')); },
    delete: (id) => { const index = mockDoctors.findIndex(d=>d.id===id); if(index!==-1){ mockDoctors.splice(index,1); return Promise.resolve({success:true}); } return Promise.reject(new Error('Doctor not found')); }
  },

  tests: {
    getAll: () => Promise.resolve({ data: mockTests }),
    getById: (id) => Promise.resolve({ data: mockTests.find(t => t.id === id) }),
    create: (data) => { const newTest = { ...data, id: Math.max(...mockTests.map(t=>t.id))+1 }; mockTests.push(newTest); return Promise.resolve({ data: newTest }); },
    update: (id, data) => { const index = mockTests.findIndex(t=>t.id===id); if(index!==-1){ mockTests[index] = {...mockTests[index],...data}; return Promise.resolve({data: mockTests[index]}); } return Promise.reject(new Error('Test not found')); },
    delete: (id) => { const index = mockTests.findIndex(t=>t.id===id); if(index!==-1){ mockTests.splice(index,1); return Promise.resolve({success:true}); } return Promise.reject(new Error('Test not found')); }
  },

  users: {
    getAll: () => Promise.resolve({ data: mockUsers }),
    getById: (id) => Promise.resolve({ data: mockUsers.find(u => u.id === id) }),
    create: (data) => { const newUser = { ...data, id: Math.max(...mockUsers.map(u=>u.id))+1 }; mockUsers.push(newUser); return Promise.resolve({ data: newUser }); },
    update: (id, data) => { const index = mockUsers.findIndex(u=>u.id===id); if(index!==-1){ mockUsers[index] = {...mockUsers[index],...data}; return Promise.resolve({data: mockUsers[index]}); } return Promise.reject(new Error('User not found')); },
    delete: (id) => { const index = mockUsers.findIndex(u=>u.id===id); if(index!==-1){ mockUsers.splice(index,1); return Promise.resolve({success:true}); } return Promise.reject(new Error('User not found')); }
  },

 roles: {
    getAll: () => Promise.resolve({ data: mockRoles }),
    getById: (id) => Promise.resolve({ data: mockRoles.find(r => r.id === id) }),
    create: (data) => {
      const newRole = { ...data, id: Math.max(...mockRoles.map(r => r.id))+1 };
      mockRoles.push(newRole);
      return Promise.resolve({ data: newRole });
    },
    update: (id, data) => {
      const index = mockRoles.findIndex(r => r.id === id);
      if(index !== -1){
        mockRoles[index] = { ...mockRoles[index], ...data };
        return Promise.resolve({ data: mockRoles[index] });
      }
      return Promise.reject(new Error('Role not found'));
    },
    delete: (id) => {
      const index = mockRoles.findIndex(r => r.id === id);
      if(index !== -1){
        mockRoles.splice(index,1);
        return Promise.resolve({ success:true });
      }
      return Promise.reject(new Error('Role not found'));
    }
  },

   permissions: {
    getAll: () => Promise.resolve({ data: mockPermissions }),
    getById: (id) => Promise.resolve({ data: mockPermissions.find(p => p.id === id) }),
    create: (data) => {
      const newPermission = { ...data, id: Math.max(...mockPermissions.map(p => p.id)) + 1 };
      mockPermissions.push(newPermission);
      return Promise.resolve({ data: newPermission });
    },
    update: (id, data) => {
      const index = mockPermissions.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPermissions[index] = { ...mockPermissions[index], ...data };
        return Promise.resolve({ data: mockPermissions[index] });
      }
      return Promise.reject(new Error('Permission not found'));
    },
    delete: (id) => {
      const index = mockPermissions.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPermissions.splice(index, 1);
        return Promise.resolve({ success: true });
      }
      return Promise.reject(new Error('Permission not found'));
    },
  },

};
