export const SAFE_ENGINE_ABI = [
  {
    "type": "impl",
    "name": "SAFEEngineImpl",
    "interface_name": "grinta::interfaces::isafe_engine::ISAFEEngine"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::Safe",
    "members": [
      {
        "name": "collateral",
        "type": "core::integer::u256"
      },
      {
        "name": "debt",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::Health",
    "members": [
      {
        "name": "collateral_value",
        "type": "core::integer::u256"
      },
      {
        "name": "debt",
        "type": "core::integer::u256"
      },
      {
        "name": "ltv",
        "type": "core::integer::u256"
      },
      {
        "name": "liquidation_price",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::isafe_engine::ISAFEEngine",
    "items": [
      {
        "type": "function",
        "name": "get_safe",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "grinta::types::Safe"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_safe_count",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_safe_owner",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_safe_health",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "grinta::types::Health"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_system_health",
        "inputs": [],
        "outputs": [
          {
            "type": "grinta::types::Health"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_collateral_price",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_redemption_price",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_redemption_rate",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_debt",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_collateral",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_debt_ceiling",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_liquidation_ratio",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_grit_balance",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "create_safe",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "deposit_collateral",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "withdraw_collateral",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "borrow",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "repay",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_collateral_price",
        "inputs": [
          {
            "name": "price",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "update_redemption_rate",
        "inputs": [
          {
            "name": "rate",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_debt_ceiling",
        "inputs": [
          {
            "name": "ceiling",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_liquidation_ratio",
        "inputs": [
          {
            "name": "ratio",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_collateral_join",
        "inputs": [
          {
            "name": "join",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_safe_manager",
        "inputs": [
          {
            "name": "manager",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "set_hook",
        "inputs": [
          {
            "name": "hook",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "GritERC20Impl",
    "interface_name": "grinta::interfaces::ierc20::IERC20"
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::internal::bounded_int::BoundedInt::<0, 30>"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::ierc20::IERC20",
    "items": [
      {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "total_supply",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "balance_of",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "allowance",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "transfer_from",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "approve",
        "inputs": [
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "debt_ceiling",
        "type": "core::integer::u256"
      },
      {
        "name": "liquidation_ratio",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::SafeCreated",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::CollateralDeposited",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::CollateralWithdrawn",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::GritBorrowed",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::GritRepaid",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::CollateralPriceUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "price",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::RedemptionRateUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "rate",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::RedemptionPriceUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "price",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::Transfer",
    "kind": "struct",
    "members": [
      {
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::Approval",
    "kind": "struct",
    "members": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_engine::SAFEEngine::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "SafeCreated",
        "type": "grinta::safe_engine::SAFEEngine::SafeCreated",
        "kind": "nested"
      },
      {
        "name": "CollateralDeposited",
        "type": "grinta::safe_engine::SAFEEngine::CollateralDeposited",
        "kind": "nested"
      },
      {
        "name": "CollateralWithdrawn",
        "type": "grinta::safe_engine::SAFEEngine::CollateralWithdrawn",
        "kind": "nested"
      },
      {
        "name": "GritBorrowed",
        "type": "grinta::safe_engine::SAFEEngine::GritBorrowed",
        "kind": "nested"
      },
      {
        "name": "GritRepaid",
        "type": "grinta::safe_engine::SAFEEngine::GritRepaid",
        "kind": "nested"
      },
      {
        "name": "CollateralPriceUpdated",
        "type": "grinta::safe_engine::SAFEEngine::CollateralPriceUpdated",
        "kind": "nested"
      },
      {
        "name": "RedemptionRateUpdated",
        "type": "grinta::safe_engine::SAFEEngine::RedemptionRateUpdated",
        "kind": "nested"
      },
      {
        "name": "RedemptionPriceUpdated",
        "type": "grinta::safe_engine::SAFEEngine::RedemptionPriceUpdated",
        "kind": "nested"
      },
      {
        "name": "Transfer",
        "type": "grinta::safe_engine::SAFEEngine::Transfer",
        "kind": "nested"
      },
      {
        "name": "Approval",
        "type": "grinta::safe_engine::SAFEEngine::Approval",
        "kind": "nested"
      }
    ]
  }
] as const;

export const SAFE_MANAGER_ABI = [
  {
    "type": "impl",
    "name": "SafeManagerImpl",
    "interface_name": "grinta::interfaces::isafe_manager::ISafeManager"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::Health",
    "members": [
      {
        "name": "collateral_value",
        "type": "core::integer::u256"
      },
      {
        "name": "debt",
        "type": "core::integer::u256"
      },
      {
        "name": "ltv",
        "type": "core::integer::u256"
      },
      {
        "name": "liquidation_price",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::isafe_manager::ISafeManager",
    "items": [
      {
        "type": "function",
        "name": "open_safe",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "close_safe",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "deposit",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "withdraw",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "borrow",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "repay",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "open_and_borrow",
        "inputs": [
          {
            "name": "collateral_amount",
            "type": "core::integer::u256"
          },
          {
            "name": "borrow_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_position_health",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "grinta::types::Health"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_max_borrow",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_safe_owner",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "authorize_agent",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "agent",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "revoke_agent",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "agent",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "is_authorized",
        "inputs": [
          {
            "name": "safe_id",
            "type": "core::integer::u64"
          },
          {
            "name": "agent",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "safe_engine",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "collateral_join",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_manager::SafeManager::SafeOpened",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_manager::SafeManager::SafeClosed",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_manager::SafeManager::AgentAuthorized",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "agent",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_manager::SafeManager::AgentRevoked",
    "kind": "struct",
    "members": [
      {
        "name": "safe_id",
        "type": "core::integer::u64",
        "kind": "key"
      },
      {
        "name": "agent",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::safe_manager::SafeManager::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "SafeOpened",
        "type": "grinta::safe_manager::SafeManager::SafeOpened",
        "kind": "nested"
      },
      {
        "name": "SafeClosed",
        "type": "grinta::safe_manager::SafeManager::SafeClosed",
        "kind": "nested"
      },
      {
        "name": "AgentAuthorized",
        "type": "grinta::safe_manager::SafeManager::AgentAuthorized",
        "kind": "nested"
      },
      {
        "name": "AgentRevoked",
        "type": "grinta::safe_manager::SafeManager::AgentRevoked",
        "kind": "nested"
      }
    ]
  }
] as const;

export const PID_CONTROLLER_ABI = [
  {
    "type": "impl",
    "name": "PIDControllerImpl",
    "interface_name": "grinta::interfaces::ipid_controller::IPIDController"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::DeviationObservation",
    "members": [
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      },
      {
        "name": "proportional",
        "type": "core::integer::i128"
      },
      {
        "name": "integral",
        "type": "core::integer::i128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::ControllerGains",
    "members": [
      {
        "name": "kp",
        "type": "core::integer::i128"
      },
      {
        "name": "ki",
        "type": "core::integer::i128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types::PIDControllerParams",
    "members": [
      {
        "name": "noise_barrier",
        "type": "core::integer::u256"
      },
      {
        "name": "integral_period_size",
        "type": "core::integer::u64"
      },
      {
        "name": "feedback_output_upper_bound",
        "type": "core::integer::u256"
      },
      {
        "name": "feedback_output_lower_bound",
        "type": "core::integer::i128"
      },
      {
        "name": "per_second_cumulative_leak",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::ipid_controller::IPIDController",
    "items": [
      {
        "type": "function",
        "name": "compute_rate",
        "inputs": [
          {
            "name": "market_price",
            "type": "core::integer::u256"
          },
          {
            "name": "redemption_price",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_next_redemption_rate",
        "inputs": [
          {
            "name": "market_price",
            "type": "core::integer::u256"
          },
          {
            "name": "redemption_price",
            "type": "core::integer::u256"
          },
          {
            "name": "accumulated_leak",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "(core::integer::u256, core::integer::i128, core::integer::i128)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_bounded_redemption_rate",
        "inputs": [
          {
            "name": "pi_output",
            "type": "core::integer::i128"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_gain_adjusted_pi_output",
        "inputs": [
          {
            "name": "proportional_term",
            "type": "core::integer::i128"
          },
          {
            "name": "integral_term",
            "type": "core::integer::i128"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::i128"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "breaks_noise_barrier",
        "inputs": [
          {
            "name": "pi_sum",
            "type": "core::integer::u256"
          },
          {
            "name": "redemption_price",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_deviation_observation",
        "inputs": [],
        "outputs": [
          {
            "type": "grinta::types::DeviationObservation"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_controller_gains",
        "inputs": [],
        "outputs": [
          {
            "type": "grinta::types::ControllerGains"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_params",
        "inputs": [],
        "outputs": [
          {
            "type": "grinta::types::PIDControllerParams"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "time_since_last_update",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "seed_proposer",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "kp",
        "type": "core::integer::i128"
      },
      {
        "name": "ki",
        "type": "core::integer::i128"
      },
      {
        "name": "noise_barrier",
        "type": "core::integer::u256"
      },
      {
        "name": "integral_period_size",
        "type": "core::integer::u64"
      },
      {
        "name": "feedback_output_upper_bound",
        "type": "core::integer::u256"
      },
      {
        "name": "feedback_output_lower_bound",
        "type": "core::integer::i128"
      },
      {
        "name": "per_second_cumulative_leak",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "function",
    "name": "set_seed_proposer",
    "inputs": [
      {
        "name": "proposer",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_kp",
    "inputs": [
      {
        "name": "kp",
        "type": "core::integer::i128"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_ki",
    "inputs": [
      {
        "name": "ki",
        "type": "core::integer::i128"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_noise_barrier",
    "inputs": [
      {
        "name": "barrier",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_per_second_cumulative_leak",
    "inputs": [
      {
        "name": "leak",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "event",
    "name": "grinta::pid_controller::PIDController::UpdateDeviation",
    "kind": "struct",
    "members": [
      {
        "name": "proportional",
        "type": "core::integer::i128",
        "kind": "data"
      },
      {
        "name": "integral",
        "type": "core::integer::i128",
        "kind": "data"
      },
      {
        "name": "applied_deviation",
        "type": "core::integer::i128",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::pid_controller::PIDController::RateComputed",
    "kind": "struct",
    "members": [
      {
        "name": "market_price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "redemption_price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "redemption_rate",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::pid_controller::PIDController::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "UpdateDeviation",
        "type": "grinta::pid_controller::PIDController::UpdateDeviation",
        "kind": "nested"
      },
      {
        "name": "RateComputed",
        "type": "grinta::pid_controller::PIDController::RateComputed",
        "kind": "nested"
      }
    ]
  }
] as const;

export const GRINTA_HOOK_ABI = [
  {
    "type": "impl",
    "name": "ExtensionImpl",
    "interface_name": "grinta::interfaces::igrinta_hook::IExtension"
  },
  {
    "type": "struct",
    "name": "grinta::types_ekubo::PoolKey",
    "members": [
      {
        "name": "token0",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token1",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "fee",
        "type": "core::integer::u128"
      },
      {
        "name": "tick_spacing",
        "type": "core::integer::u128"
      },
      {
        "name": "extension",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types_ekubo::i129",
    "members": [
      {
        "name": "mag",
        "type": "core::integer::u128"
      },
      {
        "name": "sign",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types_ekubo::SwapParameters",
    "members": [
      {
        "name": "amount",
        "type": "grinta::types_ekubo::i129"
      },
      {
        "name": "is_token1",
        "type": "core::bool"
      },
      {
        "name": "sqrt_ratio_limit",
        "type": "core::integer::u256"
      },
      {
        "name": "skip_ahead",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "type": "struct",
    "name": "grinta::types_ekubo::Delta",
    "members": [
      {
        "name": "amount0",
        "type": "grinta::types_ekubo::i129"
      },
      {
        "name": "amount1",
        "type": "grinta::types_ekubo::i129"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::igrinta_hook::IExtension",
    "items": [
      {
        "type": "function",
        "name": "before_initialize_pool",
        "inputs": [
          {
            "name": "caller",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "pool_key",
            "type": "grinta::types_ekubo::PoolKey"
          },
          {
            "name": "initial_tick",
            "type": "grinta::types_ekubo::i129"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u16"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "after_initialize_pool",
        "inputs": [
          {
            "name": "caller",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "pool_key",
            "type": "grinta::types_ekubo::PoolKey"
          },
          {
            "name": "initial_tick",
            "type": "grinta::types_ekubo::i129"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "before_swap",
        "inputs": [
          {
            "name": "caller",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "pool_key",
            "type": "grinta::types_ekubo::PoolKey"
          },
          {
            "name": "params",
            "type": "grinta::types_ekubo::SwapParameters"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "after_swap",
        "inputs": [
          {
            "name": "caller",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "pool_key",
            "type": "grinta::types_ekubo::PoolKey"
          },
          {
            "name": "params",
            "type": "grinta::types_ekubo::SwapParameters"
          },
          {
            "name": "delta",
            "type": "grinta::types_ekubo::Delta"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "impl",
    "name": "GrintaHookImpl",
    "interface_name": "grinta::interfaces::igrinta_hook::IGrintaHook"
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::igrinta_hook::IGrintaHook",
    "items": [
      {
        "type": "function",
        "name": "update",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_market_price",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_collateral_price",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_last_update_time",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u64"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "safe_engine",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "pid_controller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "ekubo_oracle",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "grit_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "wbtc_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "usdc_token",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "function",
    "name": "set_safe_engine",
    "inputs": [
      {
        "name": "engine",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_pid_controller",
    "inputs": [
      {
        "name": "controller",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "set_ekubo_oracle",
    "inputs": [
      {
        "name": "oracle",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "event",
    "name": "grinta::grinta_hook::GrintaHook::PricesUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "market_price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "collateral_price",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::grinta_hook::GrintaHook::RateUpdated",
    "kind": "struct",
    "members": [
      {
        "name": "new_rate",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::grinta_hook::GrintaHook::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "PricesUpdated",
        "type": "grinta::grinta_hook::GrintaHook::PricesUpdated",
        "kind": "nested"
      },
      {
        "name": "RateUpdated",
        "type": "grinta::grinta_hook::GrintaHook::RateUpdated",
        "kind": "nested"
      }
    ]
  }
] as const;

export const COLLATERAL_JOIN_ABI = [
  {
    "type": "impl",
    "name": "CollateralJoinImpl",
    "interface_name": "grinta::interfaces::icollateral_join::ICollateralJoin"
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::icollateral_join::ICollateralJoin",
    "items": [
      {
        "type": "function",
        "name": "join",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "exit",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_collateral_token",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_total_assets",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "convert_to_internal",
        "inputs": [
          {
            "name": "asset_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "convert_to_assets",
        "inputs": [
          {
            "name": "internal_amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "collateral_token",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "token_decimals",
        "type": "core::integer::u8"
      },
      {
        "name": "safe_engine",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "function",
    "name": "set_safe_manager",
    "inputs": [
      {
        "name": "manager",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "event",
    "name": "grinta::collateral_join::CollateralJoin::Joined",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "asset_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "internal_amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::collateral_join::CollateralJoin::Exited",
    "kind": "struct",
    "members": [
      {
        "name": "user",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "data"
      },
      {
        "name": "asset_amount",
        "type": "core::integer::u256",
        "kind": "data"
      },
      {
        "name": "internal_amount",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::collateral_join::CollateralJoin::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Joined",
        "type": "grinta::collateral_join::CollateralJoin::Joined",
        "kind": "nested"
      },
      {
        "name": "Exited",
        "type": "grinta::collateral_join::CollateralJoin::Exited",
        "kind": "nested"
      }
    ]
  }
] as const;

export const ERC20_ABI = [
  {
    "type": "impl",
    "name": "ERC20Impl",
    "interface_name": "grinta::interfaces::ierc20::IERC20"
  },
  {
    "type": "struct",
    "name": "core::byte_array::ByteArray",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::internal::bounded_int::BoundedInt::<0, 30>"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "interface",
    "name": "grinta::interfaces::ierc20::IERC20",
    "items": [
      {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
          {
            "type": "core::byte_array::ByteArray"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u8"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "total_supply",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "balance_of",
        "inputs": [
          {
            "name": "account",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "allowance",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "transfer",
        "inputs": [
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "transfer_from",
        "inputs": [
          {
            "name": "sender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "recipient",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "approve",
        "inputs": [
          {
            "name": "spender",
            "type": "core::starknet::contract_address::ContractAddress"
          },
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "name",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "symbol",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "decimals",
        "type": "core::integer::u8"
      }
    ]
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "type": "event",
    "name": "grinta::mock::erc20_mintable::ERC20Mintable::Transfer",
    "kind": "struct",
    "members": [
      {
        "name": "from",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "to",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::mock::erc20_mintable::ERC20Mintable::Approval",
    "kind": "struct",
    "members": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress",
        "kind": "key"
      },
      {
        "name": "value",
        "type": "core::integer::u256",
        "kind": "data"
      }
    ]
  },
  {
    "type": "event",
    "name": "grinta::mock::erc20_mintable::ERC20Mintable::Event",
    "kind": "enum",
    "variants": [
      {
        "name": "Transfer",
        "type": "grinta::mock::erc20_mintable::ERC20Mintable::Transfer",
        "kind": "nested"
      },
      {
        "name": "Approval",
        "type": "grinta::mock::erc20_mintable::ERC20Mintable::Approval",
        "kind": "nested"
      }
    ]
  }
] as const;

