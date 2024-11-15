import { getPreviewToken, type Prettify } from './utils/helper';

export type ElementType = 'addresses' | 'assets' | 'entries' | 'users';
export type ExecutionMethod = 'all' | 'one';
type Operator = 'and' | 'not' | 'or';
export type EntryStatusString = Prettify<'live' | 'pending' | 'expired' | 'disabled' | Operator>;
export type EntryStatus = EntryStatusString | EntryStatusString[];
export type UserStatusString = Prettify<
  'active' | 'pending' | 'credentialed' | 'suspended' | 'locked' | 'inactive' | Operator
>;
export type UserStatus = UserStatusString | UserStatusString[];

// Common query parameters shared by all element types, including allowed default methods
export interface CommonQueryParams {
  elementType: ElementType;
  one?: string;
  all?: string;
  id?: number | number[];
  limit?: number;
  offset?: number;
  orderBy?: string;
  fields?: string | string[];
}

// Specific query parameters for each element type
export interface AddressQueryParams {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  locality?: string;
  organization?: string;
  fullName?: string;
}

export interface AssetQueryParams {
  volume?: string;
  kind?: string;
  filename?: string;
  site?: string;
  siteId?: number;
}

export interface EntryQueryParams {
  slug?: string;
  uri?: string | string[];
  section?: string | string[];
  postDate?: string;
  site?: string;
  siteId?: number;
  status?: EntryStatus;
}

export interface UserQueryParams {
  group?: string | string[];
  groupId?: number;
  email?: string;
  fullName?: string;
  hasPhoto?: boolean;
  status?: UserStatus;
}

// Merge Queryparams for better dx
export type MergedQueryParams<T extends ElementType> = CommonQueryParams &
  (T extends 'addresses'
    ? AddressQueryParams
    : T extends 'assets'
      ? AssetQueryParams
      : T extends 'entries'
        ? EntryQueryParams
        : T extends 'users'
          ? UserQueryParams
          : {});

// Common query methods shared by all element types, including allowed default methods
export interface CommonQueryBuilder {
  id: (value: number) => this;
  limit: (value: number) => this;
  offset: (value: number) => this;
  orderBy: (value: string) => this;
  fields: (value: string | string[]) => this;
  buildBaseUrl: (value: ExecutionMethod) => string;
}

// Element-specific query builder methods
export interface AddressQueryBuilder extends CommonQueryBuilder {
  addressLine1: (value: string) => this;
  addressLine2: (value: string) => this;
  addressLine3: (value: string) => this;
  locality: (value: string) => this;
  organization: (value: string) => this;
  fullName: (value: string) => this;
}

export interface AssetQueryBuilder extends CommonQueryBuilder {
  volume: (value: string) => this;
  kind: (value: string) => this;
  filename: (value: string) => this;
  site: (value: string) => this;
  siteId: (value: number) => this;
}

export interface EntryQueryBuilder extends CommonQueryBuilder {
  slug: (value: string) => this;
  uri: (value: string | string[]) => this;
  section: (value: string | string[]) => this;
  postDate: (value: string) => this;
  site: (value: string) => this;
  siteId: (value: number) => this;
  status: (value: EntryStatus) => this;
}

export interface UserQueryBuilder extends CommonQueryBuilder {
  group: (value: string) => this;
  groupId: (value: number) => this;
  email: (value: string) => this;
  fullName: (value: string) => this;
  hasPhoto: (value: boolean) => this;
  status: (value: UserStatus) => this;
}

// Mapping from ElementType to its specific QueryBuilder
export interface QueryBuilderMap {
  addresses: AddressQueryBuilder;
  assets: AssetQueryBuilder;
  entries: EntryQueryBuilder;
  users: UserQueryBuilder;
}

export type QueryBuilder<T extends ElementType> = QueryBuilderMap[T];

// Generic implementation of the function
export function buildCraftQueryUrl<T extends ElementType>(elementType: T): QueryBuilder<T> {
  const defaultParams: MergedQueryParams<T> = {
    elementType: 'entries',
  } as MergedQueryParams<T>;

  let params: MergedQueryParams<T> = defaultParams;
  params.elementType = elementType;

  // Common methods shared by all element types, including allowed default methods
  const commonBuilder: CommonQueryBuilder = {
    id(value) {
      params.id = value;
      return this;
    },
    limit(value) {
      params.limit = value;
      return this;
    },
    offset(value) {
      params.offset = value;
      return this;
    },
    orderBy(value) {
      params.orderBy = value;
      return this;
    },
    fields(value) {
      params.fields = value;
      return this;
    },
    buildBaseUrl(value) {
      if (value === 'all') {
        params.one = undefined;
        params.all = '1';
      } else {
        params.one = '1';
        params.all = undefined;
      }

      /* TODO: add more error handling */
      const queryParams = Object.fromEntries(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null && value != '')
          .map(([key, value]) => [key, String(value)]),
      );

      const queryString = new URLSearchParams(queryParams).toString();
      const previewToken = getPreviewToken();
      return `/v1/api/queryApi/customQuery?${queryString}${previewToken ? '&token=' + previewToken : ''}`;
    },
  };

  // Element-specific methods based on elementType
  if (elementType === 'addresses') {
    const addressParams = params as CommonQueryParams & AddressQueryParams;
    return {
      ...commonBuilder,
      addressLine1(value) {
        addressParams.addressLine1 = value;
        return this;
      },
      addressLine2(value) {
        addressParams.addressLine2 = value;
        return this;
      },
      addressLine3(value) {
        addressParams.addressLine3 = value;
        return this;
      },
      locality(value) {
        addressParams.locality = value;
        return this;
      },
      organization(value) {
        addressParams.organization = value;
        return this;
      },
      fullName(value) {
        addressParams.fullName = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'assets') {
    const assetParams = params as CommonQueryParams & AssetQueryParams;
    return {
      ...commonBuilder,
      volume(value) {
        assetParams.volume = value;
        return this;
      },
      kind(value) {
        assetParams.kind = value;
        return this;
      },
      filename(value) {
        assetParams.filename = value;
        return this;
      },
      site(value) {
        assetParams.site = value;
        return this;
      },
      siteId(value) {
        assetParams.siteId = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'entries') {
    const entryParams = params as CommonQueryParams & EntryQueryParams;
    return {
      ...commonBuilder,
      slug(value) {
        entryParams.slug = value;
        return this;
      },
      uri(value) {
        entryParams.uri = Array.isArray(value)
          ? value.filter((value) => value !== '').join('/')
          : value;
        return this;
      },
      section(value) {
        entryParams.section = value;
        return this;
      },
      postDate(value) {
        entryParams.postDate = value;
        return this;
      },
      site(value) {
        entryParams.site = value;
        return this;
      },
      siteId(value) {
        entryParams.siteId = value;
        return this;
      },
      status(value: EntryStatus) {
        entryParams.status = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  if (elementType === 'users') {
    // Cast params to include address-specific parameters
    const userParams = params as CommonQueryParams & UserQueryParams;
    return {
      ...commonBuilder,
      group(value) {
        userParams.group = value;
        return this;
      },
      groupId(value) {
        userParams.groupId = value;
        return this;
      },
      email(value) {
        userParams.email = value;
        return this;
      },
      fullName(value) {
        userParams.fullName = value;
        return this;
      },
      hasPhoto(value) {
        userParams.hasPhoto = value;
        return this;
      },
      status(value: UserStatus) {
        userParams.status = value;
        return this;
      },
    } as QueryBuilder<T>;
  }

  throw new Error(`Unsupported element type: ${elementType}`);
}
