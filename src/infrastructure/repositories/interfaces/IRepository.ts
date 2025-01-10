export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findByUsername(username: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
} 