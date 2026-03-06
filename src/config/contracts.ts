export interface GrintaConfig {
  rpcUrl: string;
  safeManagerAddress: string;
  safeEngineAddress: string;
  collateralJoinAddress: string;
  wbtcAddress: string;
  pidControllerAddress: string;
  grintaHookAddress: string;
}

export const config: GrintaConfig = {
  rpcUrl: import.meta.env.VITE_STARKNET_RPC_URL || 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/A_aQEk8ItXSiyZveFp_6y',
  safeManagerAddress: import.meta.env.VITE_SAFE_MANAGER_ADDRESS || '0x05be8041f47bd935d8ce98e3b5b2ded6540acc6d4e24c64f3822927c5339eac6',
  safeEngineAddress: import.meta.env.VITE_SAFE_ENGINE_ADDRESS || '0x02f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421',
  collateralJoinAddress: import.meta.env.VITE_COLLATERAL_JOIN_ADDRESS || '0x0362bd21cf4fd2ada59945e27c0fe10802dde0061e6aeeae0dd81b80669b4687',
  wbtcAddress: import.meta.env.VITE_WBTC_ADDRESS || '0x04ab76b407a4967de3683d387c598188d436d22d51416e8c8783156625874e20',
  pidControllerAddress: import.meta.env.VITE_PID_CONTROLLER_ADDRESS || '0x01cae0b0de880d26d09a52a4c6e33dcd189fa1bcf40986103d3c3eb46a66eec5',
  grintaHookAddress: import.meta.env.VITE_GRINTA_HOOK_ADDRESS || '0x07a17830f3aecf5a22ecfea9f3f88cb6eafd9abc425505b167755e21246d9b14',
};
