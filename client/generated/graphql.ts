import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  logout: Scalars['Boolean'];
  register: RegisterResponse;
  revokeRefreshToken: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  birthday?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRevokeRefreshTokenArgs = {
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  bye: Scalars['String'];
  emailCheck: RegisterResponse;
  hello: Scalars['String'];
  user?: Maybe<User>;
  usernameCheck: RegisterResponse;
  users: Array<User>;
};


export type QueryEmailCheckArgs = {
  email: Scalars['String'];
};


export type QueryUsernameCheckArgs = {
  username: Scalars['String'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  birthday?: Maybe<Scalars['String']>;
  created_at: Scalars['DateTime'];
  email: Scalars['String'];
  first_name?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  is_verified: Scalars['Boolean'];
  last_name?: Maybe<Scalars['String']>;
  updated_at: Scalars['DateTime'];
  username: Scalars['String'];
  verified_at?: Maybe<Scalars['DateTime']>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string } };

export type RegisterMutMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  birthday?: InputMaybe<Scalars['String']>;
}>;


export type RegisterMutMutation = { __typename?: 'Mutation', register: { __typename?: 'RegisterResponse', ok: boolean, error?: string | null } };

export type EmailCheckQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type EmailCheckQuery = { __typename?: 'Query', emailCheck: { __typename?: 'RegisterResponse', ok: boolean, error?: string | null } };

export type UsernameCheckQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UsernameCheckQuery = { __typename?: 'Query', usernameCheck: { __typename?: 'RegisterResponse', ok: boolean, error?: string | null } };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterMutDocument = gql`
    mutation RegisterMut($password: String!, $email: String!, $username: String!, $first_name: String, $last_name: String, $birthday: String) {
  register(
    password: $password
    email: $email
    username: $username
    first_name: $first_name
    last_name: $last_name
    birthday: $birthday
  ) {
    ok
    error
  }
}
    `;

export function useRegisterMutMutation() {
  return Urql.useMutation<RegisterMutMutation, RegisterMutMutationVariables>(RegisterMutDocument);
};
export const EmailCheckDocument = gql`
    query EmailCheck($email: String!) {
  emailCheck(email: $email) {
    ok
    error
  }
}
    `;

export function useEmailCheckQuery(options: Omit<Urql.UseQueryArgs<EmailCheckQueryVariables>, 'query'>) {
  return Urql.useQuery<EmailCheckQuery>({ query: EmailCheckDocument, ...options });
};
export const UsernameCheckDocument = gql`
    query UsernameCheck($username: String!) {
  usernameCheck(username: $username) {
    ok
    error
  }
}
    `;

export function useUsernameCheckQuery(options: Omit<Urql.UseQueryArgs<UsernameCheckQueryVariables>, 'query'>) {
  return Urql.useQuery<UsernameCheckQuery>({ query: UsernameCheckDocument, ...options });
};