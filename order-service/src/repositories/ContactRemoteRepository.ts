import axios, { AxiosInstance, AxiosStatic } from 'axios';
import { Person } from '../models/person';
import { ENV, getEnv } from '../shared/env';

export interface ContactRepository {
  getPerson(id: string): Promise<Person | null>;
}

export class ContactHttpRepository implements ContactRepository {
  private httpClient: AxiosInstance;
  constructor(private httpProvider: AxiosStatic) {
    this.httpClient = this.httpProvider.create({
      baseURL: getEnv(ENV.PERSON_SERVICE_BASE_URL),
      timeout: 5000,
    });
  }

  async getPerson(id: string): Promise<Person | null> {
    return this.httpClient
      .get<Person>(`/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Person service is not available');
        }

        return null;
      });
  }
}

export const contactRepository = new ContactHttpRepository(axios);
