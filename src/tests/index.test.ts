import { useCraftUrlBuilder } from '../index';
import { describe, it, expect } from 'vitest';
import type { ElementType, ExecutionMethods } from '../index';

describe('useQueryBuilder Tests', () => {
  describe('useQueryBuilder - CommonQueryBuilder', () => {
    const arrOfExecutionTypes: ExecutionMethods[] = ['one', 'all']
    const arrOfElementTypes: ElementType[] = ['addresses', 'assets', 'entries', 'users']

    arrOfElementTypes.forEach(elementType => {
      const queryBuilder = useCraftUrlBuilder(elementType);
      const baseQuery = queryBuilder
      .id(1)
      .limit(5)
      .status('active')
      .offset(2)
      .orderBy('name')
      .fields(['title', 'heroImage'])
      
      arrOfExecutionTypes.forEach(executionType => {
        it(`Should execute all commonQueryBuilder functions for ${elementType} with ${executionType}()`, async () => {
          const queryUrlOne = baseQuery.buildBaseUrl(executionType);
    
          expect(queryUrlOne).toContain(
            `elementType=${elementType}&id=1&limit=5&status=active&offset=2&orderBy=name&fields=title%2CheroImage&${executionType}=1`,
          );
        });
      });
    });
  });

  describe('useQueryBuilder - AddressQueryBuilder', () => {
    it('Should execute all addressQueryBuilder functions', async () => {
      const queryBuilder = useCraftUrlBuilder('addresses');
      const queryUrl = queryBuilder
        .addressLine1('123 Main St')
        .addressLine2('123')
        .addressLine3('St.')
        .locality('Springfield')
        .fullName('John Doe')
        .buildBaseUrl('one');

      expect(queryUrl).toContain(
        'elementType=addresses&addressLine1=123+Main+St&addressLine2=123&addressLine3=St.&locality=Springfield&fullName=John+Doe&one=1',
      );
    });
  })

  describe('useQueryBuilder - AssetQueryBuilder', () => {
    it('Should execute all assetQueryBuilder functions', async () => {
      const queryBuilder = useCraftUrlBuilder('assets');
      const queryUrl = queryBuilder
        .volume('images')
        .kind('png')
        .filename('example.png')
        .site('default')
        .siteId(2)
        .buildBaseUrl('one');

      expect(queryUrl).toContain(
        'elementType=assets&volume=images&kind=png&filename=example.png&site=default&siteId=2&one=1',
      );
    });
  });

  describe('useQueryBuilder - EntryQueryBuilder', () => {
    it('Should execute all entryQueryBuilder functions', async () => {
      const queryBuilder = useCraftUrlBuilder('entries');
      const queryUrl = queryBuilder
        .slug('my-slug')
        .uri(['news', '2023'])
        .section('news')
        .postDate('2023-01-01')
        .site('default')
        .siteId(1)
        .buildBaseUrl('one');

      expect(queryUrl).toContain(
        'elementType=entries&slug=my-slug&uri=news%2F2023&section=news&postDate=2023-01-01&site=default&siteId=1&one=1',
      );
    });
  });

  describe('useQueryBuilder - UserQueryBuilder', () => {
    it('Should execute all userQueryBuilder functions', async () => {
      const queryBuilder = useCraftUrlBuilder('users');
      const queryUrl = queryBuilder
        .group('admins')
        .groupId(1)
        .email('admin@test.com')
        .fullName('superuser')
        .hasPhoto(true)
        .buildBaseUrl('one');

      expect(queryUrl).toContain(
        'elementType=users&group=admins&groupId=1&email=admin%40test.com&fullName=superuser&hasPhoto=true&one=1',
      );
    });
  });

  describe('useQueryBuilder - Edge cases', () => {
    it('Should handle null, empty strings, and undefined gracefully', async () => {
      const queryBuilder = useCraftUrlBuilder('entries');

      // @ts-ignore: Is for testing
      const nullQueryUrl = queryBuilder.slug(null).buildBaseUrl('one');
      const emptyQueryUrl = queryBuilder.slug('').buildBaseUrl('one');
       // @ts-ignore: Is for testing
      const undefinedQueryUrl = queryBuilder.slug(undefined).buildBaseUrl('one');

      // Null value
      expect(nullQueryUrl).toContain('elementType=entries&one=1'); // slug should not be in the query
      // Empty string
      expect(emptyQueryUrl).toContain('elementType=entries&one=1'); // slug should not be in the query
      // Undefined value
      expect(undefinedQueryUrl).toContain('elementType=entries&one=1'); // slug should not be in the query
    });

    it('Should handle special characters in parameters correctly', async () => {
      const queryBuilder = useCraftUrlBuilder('entries');

      const spacesQueryUrl = queryBuilder.slug('my slug with spaces').buildBaseUrl('one');
      const specialCharsQueryUrl = queryBuilder
        .slug('my_slug_with_special_chars_!@#$%^&*()')
        .buildBaseUrl('one');

      // Check spaces encoding
      expect(spacesQueryUrl).toContain('elementType=entries&slug=my+slug+with+spaces&one=1');
      // Check special characters encoding
      expect(specialCharsQueryUrl).toContain(
        'elementType=entries&slug=my_slug_with_special_chars_%21%40%23%24%25%5E%26*%28%29&one=1',
      );
    });

    it('Should handle multiple values for the same parameter (arrays)', async () => {
      const queryBuilder = useCraftUrlBuilder('entries');
      const queryUrl = queryBuilder.uri(['news', '2023', 'sports', '']).buildBaseUrl('one');

      // Ensure the query string correctly joins the array
      expect(queryUrl).toContain('elementType=entries&uri=news%2F2023%2Fsports&one=1');
    });
  });

  describe('useQueryBuilder - Invalid element type', () => {
    it('Should throw an error when an invalid elementType is provided', () => {
      expect(() => {
        useCraftUrlBuilder('invalidType' as any);
      }).toThrowError('Unsupported element type: invalidType');
    });
  });
})