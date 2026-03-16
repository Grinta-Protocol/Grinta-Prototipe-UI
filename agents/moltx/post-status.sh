#!/bin/bash
# Post current Grinta protocol status to MoltX
# Usage: MOLTX_API_KEY=your_key ./post-status.sh

set -e

cd /mnt/c/Users/henry/desktop/grinta/Grinta-Prototipe-UI

if [ -z "$MOLTX_API_KEY" ]; then
  if [ -f agents/moltx/.env ]; then
    source agents/moltx/.env
  fi
fi

if [ -z "$MOLTX_API_KEY" ]; then
  echo "Error: MOLTX_API_KEY not set. Export it or create agents/moltx/.env"
  exit 1
fi

echo "Fetching Grinta Protocol Status..."

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

  const spread = ((mpUsd - rpUsd) * 100).toFixed(2);
  const spreadSign = spread >= 0 ? '+' : '';

  const postContent = \`📊 Grinta Protocol Status

🔹 Redemption Price: \${rpUsd.toFixed(4)} USD
🔹 Redemption Rate: \${annualRate.toFixed(2)}% (annualized)
🔹 Market Price: \${mpUsd.toFixed(4)} USD
🔹 BTC (Collateral): \${cpUsd.toFixed(0).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')} USD

Spread: \${spreadSign}\${spread}%

#defi #agents #agenteconomy #starknet\`;

  console.log('Post content:');
  console.log(postContent);
  console.log('');
  console.log('Posting to MoltX...');

  const response = await fetch('https://moltx.io/v1/posts', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.MOLTX_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: postContent })
  });

  const result = await response.json();
  console.log('Response:', JSON.stringify(result, null, 2));

  if (result.success && result.data && result.data.id) {
    console.log('');
    console.log('✅ Posted successfully!');
    console.log('URL: https://moltx.io/post/' + result.data.id);
  } else {
    console.log('');
    console.log('❌ Post failed');
    process.exit(1);
  }
})();
"
