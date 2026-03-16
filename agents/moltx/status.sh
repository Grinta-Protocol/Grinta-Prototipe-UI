#!/bin/bash
# Get current protocol status: redemption price, market price, redemption rate
# Usage: ./status.sh

set -e

cd /mnt/c/Users/henry/desktop/grinta/Grinta-Prototipe-UI

node -e "
const { RpcProvider } = require('starknet');

const p = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/A_aQEk8ItXSiyZveFp_6y' });

const engine = '0x078802abe86444d116c73821c7b6aff8175bd558bf335b28247b825d49490ef2';
const hook = '0x062347cbbb4e4da5c5eea0df072c471ffa530da08b9c04080875d2087f39f38d';
const RAY = 10n ** 27n;
const WAD = 10n ** 18n;

(async () => {
  const [rPrice, rRate, mPrice, cPrice] = await Promise.all([
    p.callContract({ contractAddress: engine, entrypoint: 'get_redemption_price', calldata: [] }),
    p.callContract({ contractAddress: engine, entrypoint: 'get_redemption_rate', calldata: [] }),
    p.callContract({ contractAddress: hook, entrypoint: 'get_market_price', calldata: [] }),
    p.callContract({ contractAddress: engine, entrypoint: 'get_collateral_price', calldata: [] }),
  ]);

  const redemptionPrice = BigInt(rPrice[0]) + (BigInt(rPrice[1] || '0x0') << 128n);
  const redemptionRate = BigInt(rRate[0]) + (BigInt(rRate[1] || '0x0') << 128n);
  const marketPrice = BigInt(mPrice[0]) + (BigInt(mPrice[1] || '0x0') << 128n);
  const collateralPrice = BigInt(cPrice[0]) + (BigInt(cPrice[1] || '0x0') << 128n);

  const rpUsd = Number(redemptionPrice * 1000000n / RAY) / 1000000;
  const mpUsd = Number(marketPrice * 1000000n / WAD) / 1000000;
  const cpUsd = Number(collateralPrice * 100n / WAD) / 100;

  const ratePerSec = Number(redemptionRate) / Number(RAY);
  const annualRate = (Math.exp(Math.log(Math.max(ratePerSec, 1e-15)) * 31536000) - 1) * 100;

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║           GRINTA PROTOCOL STATUS                    ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log('║  Market Price:     \$' + mpUsd.toFixed(4).padStart(24) + '       ║');
  console.log('║  Redemption Price:  \$' + rpUsd.toFixed(4).padStart(24) + '       ║');
  console.log('║  Redemption Rate:   ' + annualRate.toFixed(2).padStart(24) + '%       ║');
  console.log('║  Collateral (WBTC): \$' + cpUsd.toFixed(2).padStart(22) + '       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Spread (Market - Redemption): ' + ((mpUsd - rpUsd) * 100).toFixed(2) + '%');
})();
"
