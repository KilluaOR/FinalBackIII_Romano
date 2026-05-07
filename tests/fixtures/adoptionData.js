export const validAdoptionData = {
  adopterId: "507f1f77bcf86cd799439010",
  petId: "507f1f77bcf86cd799439012",
  adoptionDate: new Date("2024-03-01"),
  notes: "Adopción completada exitosamente",
};

export const invalidAdoptionData = {
  // Faltan campos requeridos
  notes: "Adopción incompleta",
};

export const existingAdoptionId = "507f1f77bcf86cd799439011";
export const nonExistingAdoptionId = "507f1f77bcf86cd799439999";

export const adoptionResponse = {
  _id: existingAdoptionId,
  adopterId: "507f1f77bcf86cd799439010",
  petId: "507f1f77bcf86cd799439012",
  adoptionDate: new Date("2024-01-15"),
  status: "completed",
  createdAt: new Date(),
  updatedAt: new Date(),
};
