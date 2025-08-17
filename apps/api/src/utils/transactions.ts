import mongoose, { ClientSession } from "mongoose";

export const withMongoTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
