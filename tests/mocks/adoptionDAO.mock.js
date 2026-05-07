// Mock del DAO de MongoDB (Mongoose)
export const mockAdoptionDAO = {
  getAll: jest.fn().mockResolvedValue([
    {
      _id: '507f1f77bcf86cd799439011',
      adopterId: '507f1f77bcf86cd799439010',
      petId: '507f1f77bcf86cd799439012',
      adoptionDate: new Date('2024-01-15'),
      status: 'completed'
    }
  ]),

  getById: jest.fn().mockImplementation((aid) => {
    if (aid === '507f1f77bcf86cd799439011') {
      return Promise.resolve({
        _id: aid,
        adopterId: '507f1f77bcf86cd799439010',
        petId: '507f1f77bcf86cd799439012',
        adoptionDate: new Date('2024-01-15'),
        status: 'completed'
      });
    }
    return Promise.resolve(null);
  }),

  create: jest.fn().mockImplementation((adoptionData) => {
    if (!adoptionData.adopterId || !adoptionData.petId) {
      return Promise.reject(new Error('Invalid adoption data'));
    }
    return Promise.resolve({
      _id: '507f1f77bcf86cd799439013',
      ...adoptionData,
      adoptionDate: new Date()
    });
  }),

  update: jest.fn().mockImplementation((aid, updateData) => {
    if (aid === '507f1f77bcf86cd799439011') {
      return Promise.resolve({ _id: aid, ...updateData });
    }
    return Promise.resolve(null);
  }),

  delete: jest.fn().mockImplementation((aid) => {
    if (aid === '507f1f77bcf86cd799439011') {
      return Promise.resolve({ deletedCount: 1 });
    }
    return Promise.resolve({ deletedCount: 0 });
  })
};
