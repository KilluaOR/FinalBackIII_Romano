export const createMockAdoptionService = () => ({
  getAll: jest.fn().mockResolvedValue([
    {
      id: 1,
      petName: 'Max',
      adopterName: 'Juan García',
      adoptionDate: '2024-01-15',
      status: 'completed'
    }
  ]),

  getById: jest.fn().mockImplementation((id) => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        petName: 'Max',
        adopterName: 'Juan García'
      });
    }
    return Promise.reject(new Error('Not found'));
  }),

  create: jest.fn().mockImplementation((data) => {
    if (!data.petName || !data.adopterName) {
      return Promise.reject(new Error('Invalid data'));
    }
    return Promise.resolve({
      id: 3,
      ...data
    });
  }),

  update: jest.fn().mockImplementation((id, data) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, ...data });
    }
    return Promise.reject(new Error('Not found'));
  }),

  delete: jest.fn().mockImplementation((id) => {
    if (id === 1) return Promise.resolve(true);
    return Promise.reject(new Error('Not found'));
  })
});
