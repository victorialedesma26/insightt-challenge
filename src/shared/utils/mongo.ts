import { isValidObjectId } from 'mongoose';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/errorCodes';

export const assertValidObjectId = (id: string, resourceName: string): void => {
  if (!isValidObjectId(id)) {
    throw new AppError(`${resourceName} id is invalid`, 400, ErrorCodes.VALIDATION_ERROR);
  }
};
