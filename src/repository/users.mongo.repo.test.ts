import { HTTPError } from '../errors/errors';
import { UserModel } from './users.mongo.model.js';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model.js');

describe('Given UsersMongoRepo repository', () => {
  const repo = new UsersMongoRepo();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of UsersMongooseRepo;', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When the query method is used', () => {
    test('Then it should return an empty array', async () => {
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });
  describe('When i use search', () => {
    test('Then should return the data', async () => {
      const query = { key: 'test', value: 'newtest' };
      (UserModel.find as jest.Mock).mockResolvedValue([query]);
      const result = await repo.search(query);
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([query]);
    });
  });
  describe('When i use ReadId and cant fetch data', () => {
    test('Then  it should return HTTPError', () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(undefined);
      const id = '1';
      expect(UserModel.findById).toHaveBeenCalled();
      expect(async () => repo.queryId(id)).rejects.toThrow();
    });
  });
  describe('When i use create', () => {
    test('Then it should return an object if we give a valid id', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue([]);
      const newUser = {
        email: 'test',
        price: 1,
      };
      const result = await repo.create(newUser);
      expect(result).toStrictEqual([]);
    });
  });
  describe('When i use update', () => {
    test('Then it should return the updated object if it has the same id', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test',
      });
      const result = await repo.update({
        id: '1',
        email: 'test1',
      });
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'test',
      });
    });
    test('When given a incorrect data it should thrown an error', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      const user = { email: '' };
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(async () => repo.update(user)).rejects.toThrow();
    });
  });
});
const repo = new UsersMongoRepo();
describe('When you use delete()', () => {
  test('Then it should return the data', async () => {
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
      '[{"id": "1", "test": "3"}]'
    );
    // Act
    const result = await repo.destroy('1');
    // Assert
    expect(result).toBeUndefined();
  });
  test('Then should throw an error', () => {
    // Arrange
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
    // Act

    // Assert
    expect(async () => repo.destroy('1')).rejects.toThrow();
    expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
  });
});