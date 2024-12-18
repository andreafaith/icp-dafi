import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Investment {
  'id' : string,
  'status' : InvestmentStatus,
  'duration' : bigint,
  'farmerId' : Principal,
  'investorId' : Principal,
  'interestRate' : number,
  'amount' : bigint,
  'startDate' : bigint,
}
export type InvestmentStatus = { 'Active' : null } |
  { 'Defaulted' : null } |
  { 'Completed' : null };
export type Result = { 'ok' : Investment } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'completeInvestment' : ActorMethod<[string], Result_2>,
  'createInvestment' : ActorMethod<
    [Principal, bigint, number, bigint],
    Result_1
  >,
  'getInvestment' : ActorMethod<[string], Result>,
  'getInvestmentsByFarmer' : ActorMethod<[Principal], Array<Investment>>,
  'getInvestmentsByInvestor' : ActorMethod<[Principal], Array<Investment>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
