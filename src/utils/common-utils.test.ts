import { flattenObsList, hasRendering, clearSubmission, gracefullySetSubmission, hasSubmission } from './common-utils';
import { isEmpty } from '../validators/form-validator';
import { type FormField, type OpenmrsObs } from '../types';

jest.mock('@openmrs/esm-framework', () => ({
  formatDate: jest.fn(),
  restBaseUrl: 'http://openmrs.com/rest',
}));

jest.mock('../validators/form-validator', () => ({
  isEmpty: jest.fn(),
}));

describe('utils functions', () => {
  describe('flattenObsList', () => {
    it('should flatten a nested obs list', () => {
      const obsList: OpenmrsObs[] = [
        {
          concept: '7e43b05b-b6d8-4eb5-8f37-0b14f5347368',
          obsDatetime: '2023-07-01',
          obsGroup: null,
          groupMembers: [
            {
              concept: '4c43b05b-b6d8-4eb5-8f37-0b14f5347548',
              obsDatetime: '2023-07-02',
              obsGroup: null,
              groupMembers: [],
              comment: '',
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: null,
              formFieldPath: '',
              formFieldNamespace: '',
              status: '',
              interpretation: '',
              uuid: '',
            },
          ],
          comment: '',
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          formFieldPath: '',
          formFieldNamespace: '',
          status: '',
          interpretation: '',
          uuid: '',
        },
      ];

      const result = flattenObsList(obsList);
      expect(result).toHaveLength(2);
    });
  });

  describe('hasRendering', () => {
    it('should return true if the field has the specified rendering', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: { rendering: 'text' },
        id: 'testFieldId',
      } as FormField;

      expect(hasRendering(field, 'text')).toBe(true);
    });

    it('should return false if the field does not have the specified rendering', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: { rendering: 'textarea' },
        id: 'testFieldId',
      } as FormField;

      expect(hasRendering(field, 'text')).toBe(false);
    });
  });

  describe('clearSubmission', () => {
    it('should initialize the submission object if not present and clear values', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: {},
        id: 'testFieldId',
        meta: {},
      } as FormField;

      clearSubmission(field);

      expect(field.meta.submission).toEqual({
        voidedValue: null,
        newValue: null,
      });
    });
  });

  describe('gracefullySetSubmission', () => {
    it('should set the newValue and voidedValue correctly', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: {},
        id: 'testFieldId',
        meta: {},
      } as FormField;

      (isEmpty as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(false);

      const newValue = 'new value';
      const voidedValue = 'voided value';

      gracefullySetSubmission(field, newValue, voidedValue);

      expect(field.meta.submission).toEqual({
        voidedValue: 'voided value',
        newValue: 'new value',
      });
    });

    it('should not set values if they are empty', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: {},
        id: 'testFieldId',
        meta: {},
      } as FormField;

      (isEmpty as jest.Mock).mockReturnValueOnce(true).mockReturnValueOnce(true);

      gracefullySetSubmission(field, '', '');

      expect(field.meta.submission).toEqual({});
    });
  });

  describe('hasSubmission', () => {
    it('should return true if there is a newValue or voidedValue', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: {},
        id: 'testFieldId',
        meta: {
          submission: {
            newValue: 'new value',
            voidedValue: 'voided value',
          },
        },
      } as FormField;

      expect(hasSubmission(field)).toBe(true);
    });

    it('should return false if there is no newValue or voidedValue', () => {
      const field: FormField = {
        label: 'Test Field',
        type: 'obs',
        questionOptions: {},
        id: 'testFieldId',
        meta: {},
      } as FormField;

      expect(hasSubmission(field)).toBe(false);
    });
  });
});
