import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AssetStatus = { 'Available' : null } |
  { 'Sold' : null } |
  { 'Invested' : null };
export interface FarmAsset {
  'id' : string,
  'status' : AssetStatus,
  'farmerId' : Principal,
  'size' : number,
  'valuation' : bigint,
  'assetType' : string,
  'registrationDate' : bigint,
  'location' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : FarmAsset } |
  { 'err' : string };
export interface _SERVICE {
  'getAsset' : ActorMethod<[string], Result_2>,
  'getAssetsByFarmer' : ActorMethod<[Principal], Array<FarmAsset>>,
  'getAvailableAssets' : ActorMethod<[], Array<FarmAsset>>,
  'registerAsset' : ActorMethod<[string, string, number, bigint], Result_1>,
  'updateAssetStatus' : ActorMethod<[string, AssetStatus], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
