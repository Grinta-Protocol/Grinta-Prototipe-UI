import {
  SAFE_ENGINE_ABI,
  SAFE_MANAGER_ABI,
  PID_CONTROLLER_ABI,
  GRINTA_HOOK_ABI,
  COLLATERAL_JOIN_ABI,
  ERC20_ABI
} from '../lib/abi/contracts-abi';

export interface GrintaConfig {
  rpcUrl: string;
  safeManagerAddress: string;
  safeEngineAddress: string;
  gritTokenAddress: string;
  collateralJoinAddress: string;
  wbtcAddress: string;
  pidControllerAddress: string;
  grintaHookAddress: string;
  oracleRelayerAddress: string;
  usdcAddress: string;
  abis: {
    safeEngine: any;
    safeManager: any;
    pidController: any;
    grintaHook: any;
    collateralJoin: any;
    erc20: any;
  };
}

export const config: GrintaConfig = {
  rpcUrl: import.meta.env.VITE_STARKNET_RPC_URL || 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/A_aQEk8ItXSiyZveFp_6y',
  safeManagerAddress: import.meta.env.VITE_SAFE_MANAGER_ADDRESS || '0x044728823ae43429eb96c14646077a461101a5db09ce6329a16684dcf199e552',
  safeEngineAddress: import.meta.env.VITE_SAFE_ENGINE_ADDRESS || '0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2',
  gritTokenAddress: import.meta.env.VITE_GRIT_TOKEN_ADDRESS || '0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2',
  collateralJoinAddress: import.meta.env.VITE_COLLATERAL_JOIN_ADDRESS || '0x042a4228c74a2d8933549fb06208b1055ea628d63fa43081d76e41a9d43a8c22',
  wbtcAddress: import.meta.env.VITE_WBTC_ADDRESS || '0x055adbd6123ce69b2498fc99aec5006d00ac8b57070c99133f2c67c262e69223',
  pidControllerAddress: import.meta.env.VITE_PID_CONTROLLER_ADDRESS || '0x06928a6c33a6284d5f4c68278960ba888045856dc0ff30548972a866a838427d',
  grintaHookAddress: import.meta.env.VITE_GRINTA_HOOK_ADDRESS || '0x062347cbbb4e4da5c5eea0df072c471ffa530da08b9c04080875d2087f39f38d',
  oracleRelayerAddress: import.meta.env.VITE_ORACLE_RELAYER_ADDRESS || '0x04acb771661162edeb881001a38282faff841e9118230b08f6df8e3a0920516f',
  usdcAddress: import.meta.env.VITE_USDC_ADDRESS || '0x0728f54606297716e46af72251733521e2c2a374abbc3dce4bcee8df4744dd30',
  abis: {
    safeEngine: SAFE_ENGINE_ABI,
    safeManager: SAFE_MANAGER_ABI,
    pidController: PID_CONTROLLER_ABI,
    grintaHook: GRINTA_HOOK_ABI,
    collateralJoin: COLLATERAL_JOIN_ABI,
    erc20: ERC20_ABI,
  }
};
