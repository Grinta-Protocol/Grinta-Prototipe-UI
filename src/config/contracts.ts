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
  safeManagerAddress: import.meta.env.VITE_SAFE_MANAGER_ADDRESS || '0x5be8041f47bd935d8ce98e3b5b2ded6540acc6d4e24c64f3822927c5339eac6',
  safeEngineAddress: import.meta.env.VITE_SAFE_ENGINE_ADDRESS || '0x2f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421',
  gritTokenAddress: import.meta.env.VITE_GRIT_TOKEN_ADDRESS || '0x2f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421',
  collateralJoinAddress: import.meta.env.VITE_COLLATERAL_JOIN_ADDRESS || '0x362bd21cf4fd2ada59945e27c0fe10802dde0061e6aeeae0dd81b80669b4687',
  wbtcAddress: import.meta.env.VITE_WBTC_ADDRESS || '0x04ab76b407a4967de3683d387c598188d436d22d51416e8c8783156625874e20',
  pidControllerAddress: import.meta.env.VITE_PID_CONTROLLER_ADDRESS || '0x694c76e4817aea5ae3858e99048ceb844679ed479d075ab9e0cd083fc9aee6a',
  grintaHookAddress: import.meta.env.VITE_GRINTA_HOOK_ADDRESS || '0x0064dc1c0264cc91d871b0cc5cda181730ff79978db5934abc4f2830993b10b5',
  oracleRelayerAddress: import.meta.env.VITE_ORACLE_RELAYER_ADDRESS || '0x06ed1049ac5d4bccd34eb476a28a62816747c4bb8a90d71f713d21938d5f633d',
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
