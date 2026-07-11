import type { InputField } from "../skills/types";
import type { UseCaseMeta } from "./types";

export type UseCaseInputField = InputField & { section?: string };

export const LEGACY_PAYMENT_CODE = "# Legacy payment HSM integration (synthetic)\nfrom Crypto.PublicKey import RSA\nfrom Crypto.Hash import MD5, SHA1\nfrom Crypto.Signature import PKCS1_v1_5\n\ndef settle_batch(transactions):\n    key = RSA.generate(2048)\n    digest = MD5.new(batch_id(transactions).encode())\n    return PKCS1_v1_5.new(key).sign(digest)";
export const FRAUD_FEATURE_CODE = "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()";

type BundledSchema = {
  input_fields: UseCaseInputField[];
  default_input: Record<string, unknown>;
};

export const BUNDLED_USE_CASE_SCHEMAS: Record<string, BundledSchema> = 
{
  "fintech_portfolio_rebalance": {
    "input_fields": [
      {
        "name": "fund_name",
        "type": "text",
        "section": "Organization",
        "label": "Fund / mandate name",
        "default": "Northstar Global Tech Fund",
        "help": "Appears on rebalance report and audit trail"
      },
      {
        "name": "client_id",
        "type": "text",
        "section": "Organization",
        "label": "Client ID",
        "default": "CLI-8842-NA"
      },
      {
        "name": "portfolio_manager",
        "type": "text",
        "section": "Organization",
        "label": "Portfolio manager",
        "default": "Alex Chen"
      },
      {
        "name": "region",
        "type": "select",
        "section": "Organization",
        "label": "Trading region",
        "options": [
          "Americas",
          "EMEA",
          "APAC",
          "Global"
        ],
        "default": "Americas"
      },
      {
        "name": "assets",
        "type": "tags",
        "section": "Portfolio",
        "label": "Holdings (tickers)",
        "default": [
          "AAPL",
          "MSFT",
          "NVDA",
          "GOOGL",
          "AMZN"
        ],
        "help": "Symbols to rebalance across"
      },
      {
        "name": "budget",
        "type": "number",
        "section": "Portfolio",
        "label": "AUM to allocate (USD)",
        "min": 10000,
        "default": 2500000
      },
      {
        "name": "rebalance_horizon",
        "type": "select",
        "section": "Portfolio",
        "label": "Rebalance cadence",
        "options": [
          "monthly",
          "quarterly",
          "annual",
          "ad_hoc"
        ],
        "default": "quarterly"
      },
      {
        "name": "risk",
        "type": "select",
        "section": "Portfolio",
        "label": "Risk profile",
        "options": [
          "low",
          "medium",
          "high"
        ],
        "default": "medium"
      },
      {
        "name": "benchmark_index",
        "type": "select",
        "section": "Portfolio",
        "label": "Benchmark",
        "options": [
          "S&P 500",
          "NASDAQ-100",
          "MSCI World",
          "Custom"
        ],
        "default": "NASDAQ-100"
      },
      {
        "name": "max_single_position_pct",
        "type": "number",
        "section": "Portfolio",
        "label": "Max single position (%)",
        "min": 5,
        "max": 100,
        "default": 35
      },
      {
        "name": "esg_screen",
        "type": "boolean",
        "section": "Portfolio",
        "label": "Apply ESG exclusion screen",
        "default": true
      },
      {
        "name": "tax_loss_harvest",
        "type": "boolean",
        "section": "Portfolio",
        "label": "Enable tax-loss harvesting",
        "default": false
      },
      {
        "name": "data_classification",
        "type": "select",
        "section": "Compliance & compute",
        "label": "Data classification",
        "options": [
          "public_demo",
          "internal",
          "restricted"
        ],
        "default": "public_demo"
      },
      {
        "name": "allow_cloud_quantum",
        "type": "boolean",
        "section": "Compliance & compute",
        "label": "Allow cloud quantum backends",
        "default": false
      },
      {
        "name": "max_cost_usd",
        "type": "number",
        "section": "Compliance & compute",
        "label": "Max compute budget (USD)",
        "min": 0,
        "default": 0
      },
      {
        "name": "notify_compliance",
        "type": "boolean",
        "section": "Compliance & compute",
        "label": "Email compliance on completion",
        "default": true
      }
    ],
    "default_input": {
      "fund_name": "Northstar Global Tech Fund",
      "client_id": "CLI-8842-NA",
      "portfolio_manager": "Alex Chen",
      "region": "Americas",
      "assets": [
        "AAPL",
        "MSFT",
        "NVDA",
        "GOOGL",
        "AMZN"
      ],
      "budget": 2500000,
      "rebalance_horizon": "quarterly",
      "risk": "medium",
      "benchmark_index": "NASDAQ-100",
      "max_single_position_pct": 35,
      "esg_screen": true,
      "tax_loss_harvest": false,
      "data_classification": "public_demo",
      "allow_cloud_quantum": false,
      "max_cost_usd": 0,
      "notify_compliance": true
    }
  },
  "logistics_delivery_routes": {
    "input_fields": [
      {
        "name": "fleet_name",
        "type": "text",
        "section": "Operation",
        "label": "Fleet / operation name",
        "default": "Metro Same-Day North"
      },
      {
        "name": "depot_name",
        "type": "text",
        "section": "Operation",
        "label": "Depot / hub name",
        "default": "Warehouse Hub"
      },
      {
        "name": "operation_date",
        "type": "text",
        "section": "Operation",
        "label": "Service date",
        "default": "2026-07-15",
        "help": "YYYY-MM-DD"
      },
      {
        "name": "shift",
        "type": "select",
        "section": "Operation",
        "label": "Shift window",
        "options": [
          "morning",
          "afternoon",
          "evening",
          "24h"
        ],
        "default": "morning"
      },
      {
        "name": "stops",
        "type": "tags",
        "section": "Route",
        "label": "Delivery stops (first = depot)",
        "default": [
          "Warehouse Hub",
          "Downtown Office",
          "Airport Cargo",
          "North Mall",
          "University",
          "Hospital",
          "Industrial Park",
          "Suburb Depot"
        ]
      },
      {
        "name": "vehicle_type",
        "type": "select",
        "section": "Fleet",
        "label": "Vehicle type",
        "options": [
          "cargo_van",
          "box_truck",
          "e_van",
          "refrigerated"
        ],
        "default": "cargo_van"
      },
      {
        "name": "driver_count",
        "type": "number",
        "section": "Fleet",
        "label": "Available drivers",
        "min": 1,
        "max": 50,
        "default": 3
      },
      {
        "name": "max_route_hours",
        "type": "number",
        "section": "Fleet",
        "label": "Max route duration (hours)",
        "min": 1,
        "max": 12,
        "default": 8
      },
      {
        "name": "priority",
        "type": "select",
        "section": "Optimization",
        "label": "Optimize for",
        "options": [
          "lowest_cost",
          "fastest_time",
          "balanced",
          "lowest_co2"
        ],
        "default": "balanced"
      },
      {
        "name": "traffic_factor",
        "type": "select",
        "section": "Optimization",
        "label": "Traffic conditions",
        "options": [
          "light",
          "normal",
          "heavy",
          "peak"
        ],
        "default": "normal"
      },
      {
        "name": "fuel_price_per_liter",
        "type": "number",
        "section": "Optimization",
        "label": "Fuel price (USD/L)",
        "min": 0.5,
        "max": 5,
        "default": 1.45
      },
      {
        "name": "time_windows",
        "type": "boolean",
        "section": "Optimization",
        "label": "Respect customer time windows",
        "default": true
      },
      {
        "name": "return_to_start",
        "type": "boolean",
        "section": "Optimization",
        "label": "Return to depot after route",
        "default": true
      },
      {
        "name": "co2_reporting",
        "type": "boolean",
        "section": "Reporting",
        "label": "Include CO\u2082 estimate in report",
        "default": true
      }
    ],
    "default_input": {
      "fleet_name": "Metro Same-Day North",
      "depot_name": "Warehouse Hub",
      "operation_date": "2026-07-15",
      "shift": "morning",
      "stops": [
        "Warehouse Hub",
        "Downtown Office",
        "Airport Cargo",
        "North Mall",
        "University",
        "Hospital",
        "Industrial Park",
        "Suburb Depot"
      ],
      "vehicle_type": "cargo_van",
      "driver_count": 3,
      "max_route_hours": 8,
      "priority": "balanced",
      "traffic_factor": "normal",
      "fuel_price_per_liter": 1.45,
      "time_windows": true,
      "return_to_start": true,
      "co2_reporting": true
    }
  },
  "bank_legacy_crypto_audit": {
    "input_fields": [
      {
        "name": "institution_name",
        "type": "text",
        "section": "Organization",
        "label": "Financial institution",
        "default": "First National Trust"
      },
      {
        "name": "system_name",
        "type": "text",
        "section": "Organization",
        "label": "System / gateway name",
        "default": "Payment HSM Gateway"
      },
      {
        "name": "environment",
        "type": "select",
        "section": "Organization",
        "label": "Environment",
        "options": [
          "production",
          "staging",
          "development"
        ],
        "default": "production"
      },
      {
        "name": "business_owner",
        "type": "text",
        "section": "Organization",
        "label": "Business owner email",
        "default": "payments-security@bank.example"
      },
      {
        "name": "compliance_framework",
        "type": "select",
        "section": "Compliance",
        "label": "Compliance framework",
        "options": [
          "PCI-DSS 4.0",
          "SOX",
          "GDPR",
          "Basel III",
          "FFIEC"
        ],
        "default": "PCI-DSS 4.0"
      },
      {
        "name": "migration_deadline",
        "type": "text",
        "section": "Compliance",
        "label": "PQC migration deadline",
        "default": "2028-01-01"
      },
      {
        "name": "data_classification",
        "type": "select",
        "section": "Compliance",
        "label": "Data classification",
        "options": [
          "public",
          "internal",
          "restricted",
          "confidential"
        ],
        "default": "restricted"
      },
      {
        "name": "scan_depth",
        "type": "select",
        "section": "Scan settings",
        "label": "Scan depth",
        "options": [
          "quick",
          "standard",
          "deep"
        ],
        "default": "standard"
      },
      {
        "name": "lines_of_code",
        "type": "number",
        "section": "Scan settings",
        "label": "Estimated LOC in scope",
        "min": 100,
        "default": 12500
      },
      {
        "name": "include_dependencies",
        "type": "boolean",
        "section": "Scan settings",
        "label": "Scan third-party dependencies",
        "default": true
      },
      {
        "name": "pqc_algorithm_target",
        "type": "select",
        "section": "Scan settings",
        "label": "Target PQC algorithm",
        "options": [
          "ML-KEM-768",
          "ML-DSA-65",
          "Hybrid RSA+ML-KEM"
        ],
        "default": "ML-KEM-768"
      },
      {
        "name": "code",
        "type": "code",
        "section": "Source code",
        "label": "Source code to audit",
        "default": "# Legacy payment HSM integration (synthetic)\nfrom Crypto.PublicKey import RSA\nfrom Crypto.Hash import MD5, SHA1\nfrom Crypto.Signature import PKCS1_v1_5\n\ndef settle_batch(transactions):\n    key = RSA.generate(2048)\n    digest = MD5.new(batch_id(transactions).encode())\n    return PKCS1_v1_5.new(key).sign(digest)"
      },
      {
        "name": "notify_security_team",
        "type": "boolean",
        "section": "Workflow",
        "label": "Notify security team on critical findings",
        "default": true
      },
      {
        "name": "generate_executive_summary",
        "type": "boolean",
        "section": "Workflow",
        "label": "Generate executive PDF summary",
        "default": true
      }
    ],
    "default_input": {
      "institution_name": "First National Trust",
      "system_name": "Payment HSM Gateway",
      "environment": "production",
      "business_owner": "payments-security@bank.example",
      "compliance_framework": "PCI-DSS 4.0",
      "migration_deadline": "2028-01-01",
      "data_classification": "restricted",
      "scan_depth": "standard",
      "lines_of_code": 12500,
      "include_dependencies": true,
      "pqc_algorithm_target": "ML-KEM-768",
      "code": "# Legacy payment HSM integration (synthetic)\nfrom Crypto.PublicKey import RSA\nfrom Crypto.Hash import MD5, SHA1\nfrom Crypto.Signature import PKCS1_v1_5\n\ndef settle_batch(transactions):\n    key = RSA.generate(2048)\n    digest = MD5.new(batch_id(transactions).encode())\n    return PKCS1_v1_5.new(key).sign(digest)",
      "notify_security_team": true,
      "generate_executive_summary": true
    }
  },
  "telecom_qkd_link_planning": {
    "input_fields": [
      {
        "name": "carrier_name",
        "type": "text",
        "section": "Network",
        "label": "Carrier / operator",
        "default": "MetroFiber Communications"
      },
      {
        "name": "link_name",
        "type": "text",
        "section": "Network",
        "label": "Link identifier",
        "default": "QKD-PILOT-DFW-01"
      },
      {
        "name": "city_pair",
        "type": "text",
        "section": "Network",
        "label": "City pair (A \u2194 B)",
        "default": "Downtown \u2194 Data Center"
      },
      {
        "name": "link_distance_km",
        "type": "number",
        "section": "Network",
        "label": "Fiber distance (km)",
        "min": 1,
        "max": 200,
        "default": 40
      },
      {
        "name": "fiber_type",
        "type": "select",
        "section": "Network",
        "label": "Fiber type",
        "options": [
          "SMF-28",
          "G.652.D",
          "Metro dark fiber"
        ],
        "default": "SMF-28"
      },
      {
        "name": "bits",
        "type": "number",
        "section": "QKD simulation",
        "label": "Raw key bits to simulate",
        "min": 64,
        "max": 4096,
        "default": 4096
      },
      {
        "name": "sample_check",
        "type": "number",
        "section": "QKD simulation",
        "label": "QBER sample size",
        "min": 4,
        "max": 64,
        "default": 16
      },
      {
        "name": "target_key_rate_kbps",
        "type": "number",
        "section": "QKD simulation",
        "label": "Target key rate (kbps)",
        "min": 1,
        "max": 1000,
        "default": 64
      },
      {
        "name": "protocol",
        "type": "select",
        "section": "QKD simulation",
        "label": "Protocol",
        "options": [
          "BB84",
          "E91",
          "CV-QKD"
        ],
        "default": "BB84"
      },
      {
        "name": "sla_uptime_pct",
        "type": "number",
        "section": "SLA",
        "label": "Required uptime (%)",
        "min": 95,
        "max": 99.99,
        "default": 99.9
      },
      {
        "name": "redundant_path",
        "type": "boolean",
        "section": "SLA",
        "label": "Require redundant fiber path",
        "default": true
      },
      {
        "name": "integrate_existing_kms",
        "type": "boolean",
        "section": "SLA",
        "label": "Integrate with existing KMS",
        "default": true
      }
    ],
    "default_input": {
      "carrier_name": "MetroFiber Communications",
      "link_name": "QKD-PILOT-DFW-01",
      "city_pair": "Downtown \u2194 Data Center",
      "link_distance_km": 40,
      "fiber_type": "SMF-28",
      "bits": 4096,
      "sample_check": 16,
      "target_key_rate_kbps": 64,
      "protocol": "BB84",
      "sla_uptime_pct": 99.9,
      "redundant_path": true,
      "integrate_existing_kms": true
    }
  },
  "cloud_api_entropy": {
    "input_fields": [
      {
        "name": "account_email",
        "type": "text",
        "section": "Account identity",
        "label": "Account email",
        "default": "user@enterprise.example",
        "help": "Primary account identifier encrypted in the vault"
      },
      {
        "name": "account_display_name",
        "type": "text",
        "section": "Account identity",
        "label": "Display name",
        "default": "Alex Chen"
      },
      {
        "name": "account_roles",
        "type": "tags",
        "section": "Account identity",
        "label": "Account roles",
        "default": [
          "user",
          "billing_admin"
        ]
      },
      {
        "name": "mfa_enabled",
        "type": "boolean",
        "section": "Account identity",
        "label": "MFA enabled",
        "default": true
      },
      {
        "name": "gateway_name",
        "type": "text",
        "section": "Service",
        "label": "Identity gateway",
        "default": "identity-edge-gw-prod"
      },
      {
        "name": "api_environment",
        "type": "select",
        "section": "Service",
        "label": "Environment",
        "options": [
          "production",
          "staging",
          "development"
        ],
        "default": "production"
      },
      {
        "name": "tenant_id",
        "type": "text",
        "section": "Service",
        "label": "Tenant / org ID",
        "default": "org_7f3a9c2e"
      },
      {
        "name": "purpose",
        "type": "text",
        "section": "Service",
        "label": "Vault binding purpose",
        "default": "zero_trust_session"
      },
      {
        "name": "service_tier",
        "type": "select",
        "section": "Service",
        "label": "Service tier",
        "options": [
          "standard",
          "premium",
          "critical"
        ],
        "default": "critical"
      },
      {
        "name": "pqc_kem",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Key encapsulation (KEM)",
        "options": [
          "ML-KEM-768",
          "ML-KEM-1024"
        ],
        "default": "ML-KEM-768",
        "help": "NIST FIPS 203 \u2014 resistant to Shor's algorithm"
      },
      {
        "name": "pqc_signature",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Digital signature",
        "options": [
          "ML-DSA-65",
          "ML-DSA-87"
        ],
        "default": "ML-DSA-65",
        "help": "NIST FIPS 204 \u2014 quantum-safe account binding"
      },
      {
        "name": "symmetric_cipher",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Symmetric cipher",
        "options": [
          "AES-256-GCM"
        ],
        "default": "AES-256-GCM"
      },
      {
        "name": "bytes",
        "type": "number",
        "section": "Session entropy",
        "label": "QRNG nonce bytes",
        "min": 8,
        "max": 256,
        "default": 32
      },
      {
        "name": "rotation_interval_sec",
        "type": "number",
        "section": "Session entropy",
        "label": "Key rotation interval (sec)",
        "min": 60,
        "max": 86400,
        "default": 3600
      },
      {
        "name": "bind_to_session",
        "type": "boolean",
        "section": "Session entropy",
        "label": "Bind nonce to session ID",
        "default": true
      },
      {
        "name": "compliance",
        "type": "select",
        "section": "Compliance",
        "label": "Compliance target",
        "options": [
          "SOC 2 Type II",
          "PCI-DSS",
          "FedRAMP Moderate",
          "ISO 27001",
          "CNSA 2.0"
        ],
        "default": "CNSA 2.0"
      },
      {
        "name": "audit_log",
        "type": "boolean",
        "section": "Compliance",
        "label": "Write vault audit log entry",
        "default": true
      },
      {
        "name": "rate_limit_per_min",
        "type": "number",
        "section": "Compliance",
        "label": "Rate limit (encryptions/min)",
        "min": 10,
        "max": 100000,
        "default": 5000
      }
    ],
    "default_input": {
      "account_email": "user@enterprise.example",
      "account_display_name": "Alex Chen",
      "account_roles": [
        "user",
        "billing_admin"
      ],
      "mfa_enabled": true,
      "gateway_name": "identity-edge-gw-prod",
      "api_environment": "production",
      "tenant_id": "org_7f3a9c2e",
      "purpose": "zero_trust_session",
      "service_tier": "critical",
      "pqc_kem": "ML-KEM-768",
      "pqc_signature": "ML-DSA-65",
      "symmetric_cipher": "AES-256-GCM",
      "bytes": 32,
      "rotation_interval_sec": 3600,
      "bind_to_session": true,
      "compliance": "CNSA 2.0",
      "audit_log": true,
      "rate_limit_per_min": 5000
    }
  },
  "automotive_battery_chemistry": {
    "input_fields": [
      {
        "name": "program_name",
        "type": "text",
        "section": "Program",
        "label": "R&D program name",
        "default": "Gen-4 Ultra Range Cell"
      },
      {
        "name": "oem_partner",
        "type": "text",
        "section": "Program",
        "label": "OEM partner",
        "default": "Aurora Motors"
      },
      {
        "name": "material",
        "type": "select",
        "section": "Chemistry",
        "label": "Cathode chemistry",
        "options": [
          "NMC811",
          "NMC622",
          "LFP",
          "Solid-state"
        ],
        "default": "NMC811"
      },
      {
        "name": "cell_format",
        "type": "select",
        "section": "Chemistry",
        "label": "Cell format",
        "options": [
          "4680",
          "2170",
          "Pouch",
          "Prismatic"
        ],
        "default": "4680"
      },
      {
        "name": "target_energy_density",
        "type": "number",
        "section": "Chemistry",
        "label": "Target energy density (Wh/kg)",
        "min": 100,
        "max": 500,
        "default": 320
      },
      {
        "name": "temperature_c",
        "type": "number",
        "section": "Chemistry",
        "label": "Operating temperature (\u00b0C)",
        "min": -20,
        "max": 60,
        "default": 25
      },
      {
        "name": "cycle_life_target",
        "type": "number",
        "section": "Chemistry",
        "label": "Target cycle life",
        "min": 500,
        "max": 5000,
        "default": 1500
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Qubits in model",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Measurement shots",
        "min": 256,
        "max": 8192,
        "default": 2048
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations (proxy)",
        "min": 1,
        "max": 100,
        "default": 20
      },
      {
        "name": "use_error_mitigation",
        "type": "boolean",
        "section": "Quantum model",
        "label": "Apply error mitigation",
        "default": true
      }
    ],
    "default_input": {
      "program_name": "Gen-4 Ultra Range Cell",
      "oem_partner": "Aurora Motors",
      "material": "NMC811",
      "cell_format": "4680",
      "target_energy_density": 320,
      "temperature_c": 25,
      "cycle_life_target": 1500,
      "qubits": 2,
      "shots": 2048,
      "vqe_iterations": 20,
      "use_error_mitigation": true
    }
  },
  "research_simulator_benchmark": {
    "input_fields": [
      {
        "name": "lab_name",
        "type": "text",
        "section": "Project",
        "label": "Lab / team name",
        "default": "Quantum Materials Lab"
      },
      {
        "name": "project_id",
        "type": "text",
        "section": "Project",
        "label": "Project ID",
        "default": "QML-2026-014"
      },
      {
        "name": "principal_investigator",
        "type": "text",
        "section": "Project",
        "label": "Principal investigator",
        "default": "Dr. Sam Rivera"
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Workload",
        "label": "Circuit qubits",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Workload",
        "label": "Shots per provider",
        "min": 128,
        "max": 4096,
        "default": 512
      },
      {
        "name": "circuit_type",
        "type": "select",
        "section": "Workload",
        "label": "Circuit template",
        "options": [
          "bell_state",
          "ghz",
          "qft_mini",
          "custom_ansatz"
        ],
        "default": "bell_state"
      },
      {
        "name": "noise_model",
        "type": "select",
        "section": "Workload",
        "label": "Noise model",
        "options": [
          "ideal",
          "depolarizing_light",
          "depolarizing_heavy"
        ],
        "default": "depolarizing_light"
      },
      {
        "name": "cost_ceiling_usd",
        "type": "number",
        "section": "Budget",
        "label": "Cost ceiling (USD)",
        "min": 0,
        "max": 500,
        "default": 0
      },
      {
        "name": "latency_budget_ms",
        "type": "number",
        "section": "Budget",
        "label": "Latency budget (ms)",
        "min": 100,
        "max": 60000,
        "default": 5000
      },
      {
        "name": "require_agreement",
        "type": "boolean",
        "section": "Budget",
        "label": "Require cross-provider agreement",
        "default": true
      },
      {
        "name": "export_csv",
        "type": "boolean",
        "section": "Reporting",
        "label": "Export benchmark CSV",
        "default": true
      }
    ],
    "default_input": {
      "lab_name": "Quantum Materials Lab",
      "project_id": "QML-2026-014",
      "principal_investigator": "Dr. Sam Rivera",
      "qubits": 2,
      "shots": 512,
      "circuit_type": "bell_state",
      "noise_model": "depolarizing_light",
      "cost_ceiling_usd": 0,
      "latency_budget_ms": 5000,
      "require_agreement": true,
      "export_csv": true
    }
  },
  "insurance_fraud_feature_probe": {
    "input_fields": [
      {
        "name": "insurer_name",
        "type": "text",
        "section": "Organization",
        "label": "Insurer name",
        "default": "Summit Mutual Insurance"
      },
      {
        "name": "line_of_business",
        "type": "select",
        "section": "Organization",
        "label": "Line of business",
        "options": [
          "auto",
          "property",
          "health",
          "commercial"
        ],
        "default": "auto"
      },
      {
        "name": "model_name",
        "type": "text",
        "section": "Organization",
        "label": "ML model name",
        "default": "fraud-score-v3.2"
      },
      {
        "name": "model_owner",
        "type": "text",
        "section": "Organization",
        "label": "Model owner",
        "default": "data-science@summit.example"
      },
      {
        "name": "pii_level",
        "type": "select",
        "section": "Data governance",
        "label": "PII sensitivity",
        "options": [
          "none",
          "low",
          "moderate",
          "high"
        ],
        "default": "moderate"
      },
      {
        "name": "retention_days",
        "type": "number",
        "section": "Data governance",
        "label": "Feature retention (days)",
        "min": 30,
        "max": 2555,
        "default": 365
      },
      {
        "name": "code",
        "type": "code",
        "section": "Feature store",
        "label": "Feature-store / scoring code",
        "default": "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()"
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum pipeline",
        "label": "Circuit qubits",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum pipeline",
        "label": "Simulation shots",
        "min": 256,
        "max": 4096,
        "default": 1024
      },
      {
        "name": "allow_cloud_quantum",
        "type": "boolean",
        "section": "Quantum pipeline",
        "label": "Allow cloud quantum backends",
        "default": false
      },
      {
        "name": "explain_to_auditor",
        "type": "boolean",
        "section": "Quantum pipeline",
        "label": "Generate auditor explanation",
        "default": true
      },
      {
        "name": "block_on_critical_crypto",
        "type": "boolean",
        "section": "Policy",
        "label": "Block run on critical crypto findings",
        "default": true
      }
    ],
    "default_input": {
      "insurer_name": "Summit Mutual Insurance",
      "line_of_business": "auto",
      "model_name": "fraud-score-v3.2",
      "model_owner": "data-science@summit.example",
      "pii_level": "moderate",
      "retention_days": 365,
      "code": "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()",
      "qubits": 2,
      "shots": 1024,
      "allow_cloud_quantum": false,
      "explain_to_auditor": true,
      "block_on_critical_crypto": true
    }
  },
  "pharma_molecular_binding": {
    "input_fields": [
      {
        "name": "program_name",
        "type": "text",
        "section": "Program",
        "label": "Drug program name",
        "default": "Oncology KRAS G12C Phase II"
      },
      {
        "name": "compound_name",
        "type": "text",
        "section": "Molecule",
        "label": "Compound name",
        "default": "KRAS-G12C inhibitor"
      },
      {
        "name": "compound_id",
        "type": "text",
        "section": "Molecule",
        "label": "Compound ID",
        "default": "CMP-2026-0142"
      },
      {
        "name": "target_protein",
        "type": "text",
        "section": "Molecule",
        "label": "Target protein",
        "default": "KRAS G12C"
      },
      {
        "name": "binding_site",
        "type": "select",
        "section": "Molecule",
        "label": "Binding site",
        "options": [
          "orthosteric",
          "allosteric",
          "covalent"
        ],
        "default": "covalent"
      },
      {
        "name": "ph",
        "type": "number",
        "section": "Conditions",
        "label": "Simulated pH",
        "min": 5,
        "max": 9,
        "default": 7.4
      },
      {
        "name": "temperature_k",
        "type": "number",
        "section": "Conditions",
        "label": "Temperature (K)",
        "min": 270,
        "max": 320,
        "default": 310
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Active-space qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Measurement shots",
        "min": 512,
        "max": 16384,
        "default": 4096
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations",
        "min": 10,
        "max": 200,
        "default": 40
      },
      {
        "name": "basis_set",
        "type": "select",
        "section": "Quantum model",
        "label": "Basis set proxy",
        "options": [
          "STO-3G",
          "6-31G",
          "cc-pVDZ"
        ],
        "default": "6-31G"
      },
      {
        "name": "fda_submission_track",
        "type": "boolean",
        "section": "Regulatory",
        "label": "Include FDA computational evidence format",
        "default": true
      }
    ],
    "default_input": {
      "program_name": "Oncology KRAS G12C Phase II",
      "compound_name": "KRAS-G12C inhibitor",
      "compound_id": "CMP-2026-0142",
      "target_protein": "KRAS G12C",
      "binding_site": "covalent",
      "ph": 7.4,
      "temperature_k": 310,
      "qubits": 4,
      "shots": 4096,
      "vqe_iterations": 40,
      "basis_set": "6-31G",
      "fda_submission_track": true
    }
  },
  "energy_grid_quantum_dispatch": {
    "input_fields": [
      {
        "name": "grid_operator",
        "type": "text",
        "section": "Grid",
        "label": "ISO / RTO operator",
        "default": "PJM Interconnection"
      },
      {
        "name": "dispatch_date",
        "type": "text",
        "section": "Grid",
        "label": "Dispatch date",
        "default": "2026-07-15"
      },
      {
        "name": "regions",
        "type": "tags",
        "section": "Grid",
        "label": "Dispatch regions",
        "default": [
          "Solar Belt",
          "Wind North",
          "Hydro East",
          "Gas Peaker"
        ]
      },
      {
        "name": "peak_demand_mw",
        "type": "number",
        "section": "Load",
        "label": "Peak demand (MW)",
        "min": 500,
        "max": 50000,
        "default": 4200
      },
      {
        "name": "renewable_mix_pct",
        "type": "number",
        "section": "Load",
        "label": "Renewable mix (%)",
        "min": 10,
        "max": 100,
        "default": 68
      },
      {
        "name": "dispatch_risk",
        "type": "select",
        "section": "Optimization",
        "label": "Dispatch risk profile",
        "options": [
          "low",
          "medium",
          "high"
        ],
        "default": "medium"
      },
      {
        "name": "n1_contingency",
        "type": "boolean",
        "section": "Optimization",
        "label": "Enforce N-1 contingency reserve",
        "default": true
      },
      {
        "name": "carbon_price_usd_ton",
        "type": "number",
        "section": "Optimization",
        "label": "Carbon price (USD/ton)",
        "min": 0,
        "max": 200,
        "default": 45
      },
      {
        "name": "curtailment_cap_pct",
        "type": "number",
        "section": "Optimization",
        "label": "Max renewable curtailment (%)",
        "min": 0,
        "max": 30,
        "default": 5
      },
      {
        "name": "real_time_rebalance",
        "type": "boolean",
        "section": "Optimization",
        "label": "Enable 5-min re-dispatch",
        "default": true
      }
    ],
    "default_input": {
      "grid_operator": "PJM Interconnection",
      "dispatch_date": "2026-07-15",
      "regions": [
        "Solar Belt",
        "Wind North",
        "Hydro East",
        "Gas Peaker"
      ],
      "peak_demand_mw": 4200,
      "renewable_mix_pct": 68,
      "dispatch_risk": "medium",
      "n1_contingency": true,
      "carbon_price_usd_ton": 45,
      "curtailment_cap_pct": 5,
      "real_time_rebalance": true
    }
  },
  "finance_quantum_monte_carlo": {
    "input_fields": [
      {
        "name": "institution",
        "type": "text",
        "section": "Book",
        "label": "Institution",
        "default": "Global Investment Bank"
      },
      {
        "name": "trading_book",
        "type": "text",
        "section": "Book",
        "label": "Trading book",
        "default": "Global Rates & FX"
      },
      {
        "name": "book_id",
        "type": "text",
        "section": "Book",
        "label": "Book ID",
        "default": "GRF-2026-Q3"
      },
      {
        "name": "notional_usd",
        "type": "number",
        "section": "Exposure",
        "label": "Notional (USD)",
        "min": 1000000,
        "default": 500000000
      },
      {
        "name": "risk_horizon",
        "type": "select",
        "section": "Exposure",
        "label": "Risk horizon",
        "options": [
          "1d",
          "10d",
          "1m",
          "3m"
        ],
        "default": "10d"
      },
      {
        "name": "confidence_level",
        "type": "select",
        "section": "Exposure",
        "label": "VaR confidence",
        "options": [
          "95%",
          "99%",
          "99.9%"
        ],
        "default": "99%"
      },
      {
        "name": "simulation_paths",
        "type": "number",
        "section": "Simulation",
        "label": "Classical MC paths",
        "min": 1000,
        "max": 1000000,
        "default": 10000
      },
      {
        "name": "qae_qubits",
        "type": "number",
        "section": "Simulation",
        "label": "QAE qubits",
        "min": 4,
        "max": 20,
        "default": 8
      },
      {
        "name": "regulatory_framework",
        "type": "select",
        "section": "Compliance",
        "label": "Regulatory framework",
        "options": [
          "Basel III",
          "FRTB",
          "CCAR",
          "IFRS 9"
        ],
        "default": "FRTB"
      },
      {
        "name": "include_stressed_scenarios",
        "type": "boolean",
        "section": "Compliance",
        "label": "Include stressed scenarios",
        "default": true
      }
    ],
    "default_input": {
      "institution": "Global Investment Bank",
      "trading_book": "Global Rates & FX",
      "book_id": "GRF-2026-Q3",
      "notional_usd": 500000000,
      "risk_horizon": "10d",
      "confidence_level": "99%",
      "simulation_paths": 10000,
      "qae_qubits": 8,
      "regulatory_framework": "FRTB",
      "include_stressed_scenarios": true
    }
  },
  "semiconductor_yield_quantum": {
    "input_fields": [
      {
        "name": "fab_name",
        "type": "text",
        "section": "Fab",
        "label": "Fab / line name",
        "default": "TSMC N3 Pilot Line"
      },
      {
        "name": "process_node",
        "type": "select",
        "section": "Fab",
        "label": "Process node",
        "options": [
          "N3",
          "N5",
          "N7",
          "Intel 18A"
        ],
        "default": "N3"
      },
      {
        "name": "wafer_size",
        "type": "select",
        "section": "Fab",
        "label": "Wafer size",
        "options": [
          "200mm",
          "300mm"
        ],
        "default": "300mm"
      },
      {
        "name": "product_sku",
        "type": "text",
        "section": "Fab",
        "label": "Product SKU",
        "default": "A17-Pro GPU die"
      },
      {
        "name": "lots_per_day",
        "type": "number",
        "section": "Production",
        "label": "Lots per day",
        "min": 1,
        "max": 500,
        "default": 42
      },
      {
        "name": "target_yield_pct",
        "type": "number",
        "section": "Production",
        "label": "Target yield (%)",
        "min": 70,
        "max": 99.9,
        "default": 92
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Feature-map qubits",
        "min": 2,
        "max": 6,
        "default": 3
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Inference shots",
        "min": 1024,
        "max": 32768,
        "default": 8192
      },
      {
        "name": "inline_metrology",
        "type": "boolean",
        "section": "Detection",
        "label": "Inline overlay metrology",
        "default": true
      },
      {
        "name": "alert_latency_ms",
        "type": "number",
        "section": "Detection",
        "label": "Alert latency target (ms)",
        "min": 1,
        "max": 100,
        "default": 10
      }
    ],
    "default_input": {
      "fab_name": "TSMC N3 Pilot Line",
      "process_node": "N3",
      "wafer_size": "300mm",
      "product_sku": "A17-Pro GPU die",
      "lots_per_day": 42,
      "target_yield_pct": 92,
      "qubits": 3,
      "shots": 8192,
      "inline_metrology": true,
      "alert_latency_ms": 10
    }
  },
  "ai_llm_quantum_retrieval": {
    "input_fields": [
      {
        "name": "corpus_name",
        "type": "text",
        "section": "RAG pipeline",
        "label": "Corpus / knowledge base name",
        "default": "Enterprise Knowledge Base"
      },
      {
        "name": "corpus_vectors",
        "type": "number",
        "section": "RAG pipeline",
        "label": "Total embedding vectors",
        "min": 100000,
        "default": 100000000
      },
      {
        "name": "embedding_model",
        "type": "select",
        "section": "RAG pipeline",
        "label": "Embedding model",
        "options": [
          "text-embedding-3-large",
          "e5-mistral-7b",
          "bge-large",
          "custom"
        ],
        "default": "text-embedding-3-large"
      },
      {
        "name": "embedding_dims",
        "type": "number",
        "section": "RAG pipeline",
        "label": "Embedding dimensions",
        "min": 128,
        "max": 4096,
        "default": 1536
      },
      {
        "name": "query_text",
        "type": "text",
        "section": "Query",
        "label": "Sample query",
        "default": "What is our Q3 revenue forecast by region?"
      },
      {
        "name": "top_k",
        "type": "number",
        "section": "Query",
        "label": "Top-K results",
        "min": 1,
        "max": 100,
        "default": 10
      },
      {
        "name": "latency_budget_ms",
        "type": "number",
        "section": "SLA",
        "label": "Latency budget (ms)",
        "min": 10,
        "max": 5000,
        "default": 200
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum search",
        "label": "Amplification qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum search",
        "label": "Measurement shots",
        "min": 512,
        "max": 16384,
        "default": 4096
      },
      {
        "name": "hybrid_rerank",
        "type": "boolean",
        "section": "Quantum search",
        "label": "Hybrid classical rerank after quantum search",
        "default": true
      }
    ],
    "default_input": {
      "corpus_name": "Enterprise Knowledge Base",
      "corpus_vectors": 100000000,
      "embedding_model": "text-embedding-3-large",
      "embedding_dims": 1536,
      "query_text": "What is our Q3 revenue forecast by region?",
      "top_k": 10,
      "latency_budget_ms": 200,
      "qubits": 4,
      "shots": 4096,
      "hybrid_rerank": true
    }
  },
  "genomics_protein_folding": {
    "input_fields": [
      {
        "name": "lab_name",
        "type": "text",
        "section": "Program",
        "label": "Lab / institution",
        "default": "Stanford Genomics Institute"
      },
      {
        "name": "protein_name",
        "type": "text",
        "section": "Protein",
        "label": "Protein name",
        "default": "BRCA1 variant R1699Q"
      },
      {
        "name": "uniprot_id",
        "type": "text",
        "section": "Protein",
        "label": "UniProt ID",
        "default": "P38398"
      },
      {
        "name": "sequence_length",
        "type": "number",
        "section": "Protein",
        "label": "Sequence length (aa)",
        "min": 50,
        "max": 5000,
        "default": 1863
      },
      {
        "name": "organism",
        "type": "text",
        "section": "Protein",
        "label": "Organism",
        "default": "Homo sapiens"
      },
      {
        "name": "disease_context",
        "type": "select",
        "section": "Clinical",
        "label": "Disease context",
        "options": [
          "hereditary_cancer",
          "rare_disease",
          "autoimmune",
          "neurodegenerative"
        ],
        "default": "hereditary_cancer"
      },
      {
        "name": "has_pdb_template",
        "type": "boolean",
        "section": "Clinical",
        "label": "Known PDB template exists",
        "default": false
      },
      {
        "name": "temperature_k",
        "type": "number",
        "section": "Simulation",
        "label": "Simulation temperature (K)",
        "min": 270,
        "max": 320,
        "default": 310
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Active-space qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE measurement shots",
        "min": 1024,
        "max": 32768,
        "default": 8192
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations",
        "min": 10,
        "max": 200,
        "default": 60
      }
    ],
    "default_input": {
      "lab_name": "Stanford Genomics Institute",
      "protein_name": "BRCA1 variant R1699Q",
      "uniprot_id": "P38398",
      "sequence_length": 1863,
      "organism": "Homo sapiens",
      "disease_context": "hereditary_cancer",
      "has_pdb_template": false,
      "temperature_k": 310,
      "qubits": 4,
      "shots": 8192,
      "vqe_iterations": 60
    }
  },
  "crypto_pqc_wallet_hardening": {
    "input_fields": [
      {
        "name": "wallet_name",
        "type": "text",
        "section": "Wallet",
        "label": "Wallet name",
        "default": "Treasury Multisig v2"
      },
      {
        "name": "wallet_address",
        "type": "text",
        "section": "Wallet",
        "label": "Wallet address",
        "default": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
      },
      {
        "name": "chain",
        "type": "select",
        "section": "Wallet",
        "label": "Blockchain",
        "options": [
          "Ethereum",
          "Bitcoin",
          "Solana",
          "Polygon",
          "Arbitrum"
        ],
        "default": "Ethereum"
      },
      {
        "name": "asset_symbol",
        "type": "text",
        "section": "Wallet",
        "label": "Primary asset",
        "default": "ETH"
      },
      {
        "name": "holdings_usd",
        "type": "number",
        "section": "Wallet",
        "label": "Holdings value (USD)",
        "min": 0,
        "default": 2400000
      },
      {
        "name": "signature_scheme",
        "type": "select",
        "section": "Current crypto",
        "label": "Current signature scheme",
        "options": [
          "ECDSA/secp256k1",
          "Ed25519",
          "RSA-2048"
        ],
        "default": "ECDSA/secp256k1"
      },
      {
        "name": "multisig_threshold",
        "type": "number",
        "section": "Current crypto",
        "label": "Multisig threshold (M-of-N)",
        "min": 1,
        "max": 10,
        "default": 3
      },
      {
        "name": "pqc_kem",
        "type": "select",
        "section": "PQC migration",
        "label": "Target KEM",
        "options": [
          "ML-KEM-768",
          "ML-KEM-1024"
        ],
        "default": "ML-KEM-768"
      },
      {
        "name": "pqc_signature",
        "type": "select",
        "section": "PQC migration",
        "label": "Target signature",
        "options": [
          "ML-DSA-65",
          "ML-DSA-87"
        ],
        "default": "ML-DSA-65"
      },
      {
        "name": "migration_timeline",
        "type": "select",
        "section": "PQC migration",
        "label": "Migration timeline",
        "options": [
          "Q4 2026",
          "2027",
          "2028",
          "2030"
        ],
        "default": "2027"
      },
      {
        "name": "hndl_risk_acknowledged",
        "type": "boolean",
        "section": "Threat model",
        "label": "Harvest-now-decrypt-later risk acknowledged",
        "default": true
      }
    ],
    "default_input": {
      "wallet_name": "Treasury Multisig v2",
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "chain": "Ethereum",
      "asset_symbol": "ETH",
      "holdings_usd": 2400000,
      "signature_scheme": "ECDSA/secp256k1",
      "multisig_threshold": 3,
      "pqc_kem": "ML-KEM-768",
      "pqc_signature": "ML-DSA-65",
      "migration_timeline": "2027",
      "hndl_risk_acknowledged": true
    }
  },
  "smart_city_traffic_flow": {
    "input_fields": [
      {
        "name": "metro_name",
        "type": "text",
        "section": "Metro",
        "label": "Metro / city name",
        "default": "Greater Metro Area"
      },
      {
        "name": "dot_agency",
        "type": "text",
        "section": "Metro",
        "label": "DOT / agency",
        "default": "Regional Transportation Authority"
      },
      {
        "name": "intersection_count",
        "type": "number",
        "section": "Network",
        "label": "Signalized intersections",
        "min": 100,
        "max": 50000,
        "default": 5000
      },
      {
        "name": "peak_vehicles_per_hour",
        "type": "number",
        "section": "Network",
        "label": "Peak vehicles/hour",
        "min": 10000,
        "max": 5000000,
        "default": 850000
      },
      {
        "name": "avg_commute_min",
        "type": "number",
        "section": "Network",
        "label": "Current avg commute (min)",
        "min": 5,
        "max": 120,
        "default": 34
      },
      {
        "name": "optimize_for",
        "type": "select",
        "section": "Optimization",
        "label": "Optimize for",
        "options": [
          "commute_time",
          "co2_emissions",
          "throughput",
          "balanced"
        ],
        "default": "commute_time"
      },
      {
        "name": "av_fleet_pct",
        "type": "number",
        "section": "Optimization",
        "label": "Autonomous fleet (%)",
        "min": 0,
        "max": 100,
        "default": 12
      },
      {
        "name": "real_time_adaptation",
        "type": "boolean",
        "section": "Optimization",
        "label": "Real-time adaptive phasing",
        "default": true
      },
      {
        "name": "carbon_price_usd_ton",
        "type": "number",
        "section": "Reporting",
        "label": "Carbon price (USD/ton)",
        "min": 0,
        "max": 200,
        "default": 50
      },
      {
        "name": "include_transit_priority",
        "type": "boolean",
        "section": "Reporting",
        "label": "Prioritize bus/transit corridors",
        "default": true
      }
    ],
    "default_input": {
      "metro_name": "Greater Metro Area",
      "dot_agency": "Regional Transportation Authority",
      "intersection_count": 5000,
      "peak_vehicles_per_hour": 850000,
      "avg_commute_min": 34,
      "optimize_for": "commute_time",
      "av_fleet_pct": 12,
      "real_time_adaptation": true,
      "carbon_price_usd_ton": 50,
      "include_transit_priority": true
    }
  }
}
;

/** Full catalog snapshot — used when API is stale or offline. */
export const BUNDLED_USE_CASE_CATALOG: UseCaseMeta[] = [
  {
    "id": "fintech_portfolio_rebalance",
    "industry": "Fintech / Asset Management",
    "title": "Multi-asset portfolio rebalance",
    "description": "Split a $2.5M tech portfolio across major equities using a guided agent pipeline that picks backends and explains the allocation.",
    "problem": "A fund manager needs to rebalance $2.5M across five large-cap tech stocks under a medium risk profile \u2014 without sending data to expensive cloud quantum hardware.",
    "quantum_value": "Quantum and quantum-inspired optimizers explore huge allocation landscapes faster than brute force. This demo runs a full agent pipeline: policy check \u2192 optimization plan \u2192 backend selection \u2192 portfolio skill \u2192 plain-English explanation.",
    "audience": "Portfolio managers, fintech analysts, and anyone curious how quantum tooling fits into asset allocation.",
    "outcome_preview": "Pie-chart style weights, dollar allocations per ticker, and a written summary of why the pipeline chose each step.",
    "highlights": [
      "Full 5-step agent pipeline with live timeline",
      "$2.5M budget across AAPL, MSFT, NVDA, GOOGL, AMZN",
      "Zero cloud spend \u2014 local backends only",
      "Natural-language explanation at the end"
    ],
    "steps": [
      "Security policy agent checks constraints",
      "Optimization agent plans the approach",
      "Backend selector picks the best local provider",
      "Portfolio optimizer skill computes weights",
      "Explanation agent summarizes results for you"
    ],
    "tags": [
      "Agents",
      "Finance",
      "Optimization",
      "Pipeline"
    ],
    "metrics": [
      {
        "label": "Budget",
        "value": "$2.5M"
      },
      {
        "label": "Assets",
        "value": "5 stocks"
      },
      {
        "label": "Risk",
        "value": "Medium"
      }
    ],
    "mode": "workflow",
    "input_fields": [
      {
        "name": "fund_name",
        "type": "text",
        "section": "Organization",
        "label": "Fund / mandate name",
        "default": "Northstar Global Tech Fund",
        "help": "Appears on rebalance report and audit trail"
      },
      {
        "name": "client_id",
        "type": "text",
        "section": "Organization",
        "label": "Client ID",
        "default": "CLI-8842-NA"
      },
      {
        "name": "portfolio_manager",
        "type": "text",
        "section": "Organization",
        "label": "Portfolio manager",
        "default": "Alex Chen"
      },
      {
        "name": "region",
        "type": "select",
        "section": "Organization",
        "label": "Trading region",
        "options": [
          "Americas",
          "EMEA",
          "APAC",
          "Global"
        ],
        "default": "Americas"
      },
      {
        "name": "assets",
        "type": "tags",
        "section": "Portfolio",
        "label": "Holdings (tickers)",
        "default": [
          "AAPL",
          "MSFT",
          "NVDA",
          "GOOGL",
          "AMZN"
        ],
        "help": "Symbols to rebalance across"
      },
      {
        "name": "budget",
        "type": "number",
        "section": "Portfolio",
        "label": "AUM to allocate (USD)",
        "min": 10000,
        "default": 2500000
      },
      {
        "name": "rebalance_horizon",
        "type": "select",
        "section": "Portfolio",
        "label": "Rebalance cadence",
        "options": [
          "monthly",
          "quarterly",
          "annual",
          "ad_hoc"
        ],
        "default": "quarterly"
      },
      {
        "name": "risk",
        "type": "select",
        "section": "Portfolio",
        "label": "Risk profile",
        "options": [
          "low",
          "medium",
          "high"
        ],
        "default": "medium"
      },
      {
        "name": "benchmark_index",
        "type": "select",
        "section": "Portfolio",
        "label": "Benchmark",
        "options": [
          "S&P 500",
          "NASDAQ-100",
          "MSCI World",
          "Custom"
        ],
        "default": "NASDAQ-100"
      },
      {
        "name": "max_single_position_pct",
        "type": "number",
        "section": "Portfolio",
        "label": "Max single position (%)",
        "min": 5,
        "max": 100,
        "default": 35
      },
      {
        "name": "esg_screen",
        "type": "boolean",
        "section": "Portfolio",
        "label": "Apply ESG exclusion screen",
        "default": true
      },
      {
        "name": "tax_loss_harvest",
        "type": "boolean",
        "section": "Portfolio",
        "label": "Enable tax-loss harvesting",
        "default": false
      },
      {
        "name": "data_classification",
        "type": "select",
        "section": "Compliance & compute",
        "label": "Data classification",
        "options": [
          "public_demo",
          "internal",
          "restricted"
        ],
        "default": "public_demo"
      },
      {
        "name": "allow_cloud_quantum",
        "type": "boolean",
        "section": "Compliance & compute",
        "label": "Allow cloud quantum backends",
        "default": false
      },
      {
        "name": "max_cost_usd",
        "type": "number",
        "section": "Compliance & compute",
        "label": "Max compute budget (USD)",
        "min": 0,
        "default": 0
      },
      {
        "name": "notify_compliance",
        "type": "boolean",
        "section": "Compliance & compute",
        "label": "Email compliance on completion",
        "default": true
      }
    ],
    "default_input": {
      "fund_name": "Northstar Global Tech Fund",
      "client_id": "CLI-8842-NA",
      "portfolio_manager": "Alex Chen",
      "region": "Americas",
      "assets": [
        "AAPL",
        "MSFT",
        "NVDA",
        "GOOGL",
        "AMZN"
      ],
      "budget": 2500000,
      "rebalance_horizon": "quarterly",
      "risk": "medium",
      "benchmark_index": "NASDAQ-100",
      "max_single_position_pct": 35,
      "esg_screen": true,
      "tax_loss_harvest": false,
      "data_classification": "public_demo",
      "allow_cloud_quantum": false,
      "max_cost_usd": 0,
      "notify_compliance": true
    },
    "workflow": "portfolio_quantum_pipeline"
  },
  {
    "id": "logistics_delivery_routes",
    "industry": "Logistics / Supply Chain",
    "title": "Last-mile delivery routing",
    "description": "Plan the smartest route to visit eight urban stops starting from a central warehouse hub.",
    "problem": "A delivery fleet must visit eight locations across a city starting from one warehouse. Wrong stop order wastes fuel, driver time, and customer satisfaction.",
    "quantum_value": "Route planning is a traveling-salesperson problem \u2014 a classic target for quantum annealing and QAOA. This demo uses a nearest-neighbor heuristic through the same API you'd use for quantum backends in production.",
    "audience": "Logistics planners, supply-chain students, and operations teams evaluating smart routing.",
    "outcome_preview": "A numbered route map with per-leg distances in km and total route length.",
    "highlights": [
      "8 real-world stop names (warehouse, mall, hospital\u2026)",
      "Visual route timeline with distances",
      "Nearest-neighbor optimization",
      "Runs in seconds on your laptop"
    ],
    "steps": [
      "Load depot + delivery stops",
      "Compute distance matrix between stops",
      "Apply nearest-neighbor TSP heuristic",
      "Return ordered route and leg breakdown"
    ],
    "tags": [
      "Logistics",
      "Optimization",
      "Route"
    ],
    "metrics": [
      {
        "label": "Stops",
        "value": "8"
      },
      {
        "label": "Method",
        "value": "TSP heuristic"
      },
      {
        "label": "Return",
        "value": "To depot"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "fleet_name",
        "type": "text",
        "section": "Operation",
        "label": "Fleet / operation name",
        "default": "Metro Same-Day North"
      },
      {
        "name": "depot_name",
        "type": "text",
        "section": "Operation",
        "label": "Depot / hub name",
        "default": "Warehouse Hub"
      },
      {
        "name": "operation_date",
        "type": "text",
        "section": "Operation",
        "label": "Service date",
        "default": "2026-07-15",
        "help": "YYYY-MM-DD"
      },
      {
        "name": "shift",
        "type": "select",
        "section": "Operation",
        "label": "Shift window",
        "options": [
          "morning",
          "afternoon",
          "evening",
          "24h"
        ],
        "default": "morning"
      },
      {
        "name": "stops",
        "type": "tags",
        "section": "Route",
        "label": "Delivery stops (first = depot)",
        "default": [
          "Warehouse Hub",
          "Downtown Office",
          "Airport Cargo",
          "North Mall",
          "University",
          "Hospital",
          "Industrial Park",
          "Suburb Depot"
        ]
      },
      {
        "name": "vehicle_type",
        "type": "select",
        "section": "Fleet",
        "label": "Vehicle type",
        "options": [
          "cargo_van",
          "box_truck",
          "e_van",
          "refrigerated"
        ],
        "default": "cargo_van"
      },
      {
        "name": "driver_count",
        "type": "number",
        "section": "Fleet",
        "label": "Available drivers",
        "min": 1,
        "max": 50,
        "default": 3
      },
      {
        "name": "max_route_hours",
        "type": "number",
        "section": "Fleet",
        "label": "Max route duration (hours)",
        "min": 1,
        "max": 12,
        "default": 8
      },
      {
        "name": "priority",
        "type": "select",
        "section": "Optimization",
        "label": "Optimize for",
        "options": [
          "lowest_cost",
          "fastest_time",
          "balanced",
          "lowest_co2"
        ],
        "default": "balanced"
      },
      {
        "name": "traffic_factor",
        "type": "select",
        "section": "Optimization",
        "label": "Traffic conditions",
        "options": [
          "light",
          "normal",
          "heavy",
          "peak"
        ],
        "default": "normal"
      },
      {
        "name": "fuel_price_per_liter",
        "type": "number",
        "section": "Optimization",
        "label": "Fuel price (USD/L)",
        "min": 0.5,
        "max": 5,
        "default": 1.45
      },
      {
        "name": "time_windows",
        "type": "boolean",
        "section": "Optimization",
        "label": "Respect customer time windows",
        "default": true
      },
      {
        "name": "return_to_start",
        "type": "boolean",
        "section": "Optimization",
        "label": "Return to depot after route",
        "default": true
      },
      {
        "name": "co2_reporting",
        "type": "boolean",
        "section": "Reporting",
        "label": "Include CO\u2082 estimate in report",
        "default": true
      }
    ],
    "default_input": {
      "fleet_name": "Metro Same-Day North",
      "depot_name": "Warehouse Hub",
      "operation_date": "2026-07-15",
      "shift": "morning",
      "stops": [
        "Warehouse Hub",
        "Downtown Office",
        "Airport Cargo",
        "North Mall",
        "University",
        "Hospital",
        "Industrial Park",
        "Suburb Depot"
      ],
      "vehicle_type": "cargo_van",
      "driver_count": 3,
      "max_route_hours": 8,
      "priority": "balanced",
      "traffic_factor": "normal",
      "fuel_price_per_liter": 1.45,
      "time_windows": true,
      "return_to_start": true,
      "co2_reporting": true
    },
    "skill": "route_optimizer"
  },
  {
    "id": "bank_legacy_crypto_audit",
    "industry": "Banking / Compliance",
    "title": "PQC migration assessment",
    "description": "Audit synthetic payment-gateway code for quantum-vulnerable crypto before regulatory PQC deadlines hit.",
    "problem": "Banks still run legacy payment code using RSA signatures and MD5 hashes. Quantum computers threaten these algorithms \u2014 regulators are pushing post-quantum migration timelines.",
    "quantum_value": "Post-quantum cryptography (PQC) replaces vulnerable algorithms with quantum-resistant ones. This workflow scans code, flags weak patterns, demos mock encryption, and runs a policy review.",
    "audience": "Compliance officers, security architects, and developers planning crypto migration.",
    "outcome_preview": "Line-by-line security findings with severity badges, mock PQC ciphertext demo, and policy verdict.",
    "highlights": [
      "Scans real-style Python payment code",
      "Flags RSA, MD5, SHA-1, ECDSA patterns",
      "Mock PQC encrypt step (educational)",
      "Policy agent reviews data classification"
    ],
    "steps": [
      "Crypto migration agent scans source code",
      "Migration skill returns structured findings",
      "Mock PQC encryptor wraps a sample payload",
      "Security policy agent checks restrictions"
    ],
    "tags": [
      "Banking",
      "Security",
      "PQC",
      "Compliance"
    ],
    "metrics": [
      {
        "label": "Patterns",
        "value": "RSA, MD5\u2026"
      },
      {
        "label": "Mode",
        "value": "Workflow"
      },
      {
        "label": "Risk",
        "value": "High if found"
      }
    ],
    "mode": "workflow",
    "input_fields": [
      {
        "name": "institution_name",
        "type": "text",
        "section": "Organization",
        "label": "Financial institution",
        "default": "First National Trust"
      },
      {
        "name": "system_name",
        "type": "text",
        "section": "Organization",
        "label": "System / gateway name",
        "default": "Payment HSM Gateway"
      },
      {
        "name": "environment",
        "type": "select",
        "section": "Organization",
        "label": "Environment",
        "options": [
          "production",
          "staging",
          "development"
        ],
        "default": "production"
      },
      {
        "name": "business_owner",
        "type": "text",
        "section": "Organization",
        "label": "Business owner email",
        "default": "payments-security@bank.example"
      },
      {
        "name": "compliance_framework",
        "type": "select",
        "section": "Compliance",
        "label": "Compliance framework",
        "options": [
          "PCI-DSS 4.0",
          "SOX",
          "GDPR",
          "Basel III",
          "FFIEC"
        ],
        "default": "PCI-DSS 4.0"
      },
      {
        "name": "migration_deadline",
        "type": "text",
        "section": "Compliance",
        "label": "PQC migration deadline",
        "default": "2028-01-01"
      },
      {
        "name": "data_classification",
        "type": "select",
        "section": "Compliance",
        "label": "Data classification",
        "options": [
          "public",
          "internal",
          "restricted",
          "confidential"
        ],
        "default": "restricted"
      },
      {
        "name": "scan_depth",
        "type": "select",
        "section": "Scan settings",
        "label": "Scan depth",
        "options": [
          "quick",
          "standard",
          "deep"
        ],
        "default": "standard"
      },
      {
        "name": "lines_of_code",
        "type": "number",
        "section": "Scan settings",
        "label": "Estimated LOC in scope",
        "min": 100,
        "default": 12500
      },
      {
        "name": "include_dependencies",
        "type": "boolean",
        "section": "Scan settings",
        "label": "Scan third-party dependencies",
        "default": true
      },
      {
        "name": "pqc_algorithm_target",
        "type": "select",
        "section": "Scan settings",
        "label": "Target PQC algorithm",
        "options": [
          "ML-KEM-768",
          "ML-DSA-65",
          "Hybrid RSA+ML-KEM"
        ],
        "default": "ML-KEM-768"
      },
      {
        "name": "code",
        "type": "code",
        "section": "Source code",
        "label": "Source code to audit",
        "default": "# Legacy payment HSM integration (synthetic)\nfrom Crypto.PublicKey import RSA\nfrom Crypto.Hash import MD5, SHA1\nfrom Crypto.Signature import PKCS1_v1_5\n\ndef settle_batch(transactions):\n    key = RSA.generate(2048)\n    digest = MD5.new(batch_id(transactions).encode())\n    return PKCS1_v1_5.new(key).sign(digest)"
      },
      {
        "name": "notify_security_team",
        "type": "boolean",
        "section": "Workflow",
        "label": "Notify security team on critical findings",
        "default": true
      },
      {
        "name": "generate_executive_summary",
        "type": "boolean",
        "section": "Workflow",
        "label": "Generate executive PDF summary",
        "default": true
      }
    ],
    "default_input": {
      "institution_name": "First National Trust",
      "system_name": "Payment HSM Gateway",
      "environment": "production",
      "business_owner": "payments-security@bank.example",
      "compliance_framework": "PCI-DSS 4.0",
      "migration_deadline": "2028-01-01",
      "data_classification": "restricted",
      "scan_depth": "standard",
      "lines_of_code": 12500,
      "include_dependencies": true,
      "pqc_algorithm_target": "ML-KEM-768",
      "code": "\n# Legacy payment HSM integration (synthetic)\nfrom Crypto.PublicKey import RSA\nfrom Crypto.Hash import MD5, SHA1\nfrom Crypto.Signature import PKCS1_v1_5\n\ndef settle_batch(transactions):\n    key = RSA.generate(2048)\n    digest = MD5.new(batch_id(transactions).encode())\n    return PKCS1_v1_5.new(key).sign(digest)\n",
      "notify_security_team": true,
      "generate_executive_summary": true
    },
    "workflow": "crypto_migration_assessment"
  },
  {
    "id": "telecom_qkd_link_planning",
    "industry": "Telecommunications",
    "title": "Metro fiber QKD (BB84)",
    "description": "Simulate a metropolitan quantum key distribution link and estimate sifted key rates over ~40 km of fiber.",
    "problem": "Telecom operators planning quantum-secure fiber links need to estimate how many secret key bits they can distill before investing in hardware for a 40 km metropolitan pilot.",
    "quantum_value": "Quantum Key Distribution (QKD) uses quantum physics \u2014 not math assumptions \u2014 to share secret keys. BB84 is the most famous protocol. Simulation validates link budgets before capex.",
    "audience": "Telecom engineers, cryptography researchers, and anyone learning how QKD works.",
    "outcome_preview": "BB84 protocol table, sifted key preview, QBER percentage, and matching-basis statistics.",
    "highlights": [
      "4,096 simulated raw bits",
      "Alice/Bob basis reconciliation visualized",
      "Quantum bit error rate (QBER) estimate",
      "Educational \u2014 not real hardware QKD"
    ],
    "steps": [
      "Alice generates random bits and random bases",
      "Bob chooses measurement bases and measures",
      "Public basis comparison \u2192 sifted key",
      "Sample bits revealed to estimate QBER"
    ],
    "tags": [
      "Telecom",
      "QKD",
      "BB84",
      "Security"
    ],
    "metrics": [
      {
        "label": "Raw bits",
        "value": "4,096"
      },
      {
        "label": "Link",
        "value": "~40 km"
      },
      {
        "label": "Protocol",
        "value": "BB84"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "carrier_name",
        "type": "text",
        "section": "Network",
        "label": "Carrier / operator",
        "default": "MetroFiber Communications"
      },
      {
        "name": "link_name",
        "type": "text",
        "section": "Network",
        "label": "Link identifier",
        "default": "QKD-PILOT-DFW-01"
      },
      {
        "name": "city_pair",
        "type": "text",
        "section": "Network",
        "label": "City pair (A \u2194 B)",
        "default": "Downtown \u2194 Data Center"
      },
      {
        "name": "link_distance_km",
        "type": "number",
        "section": "Network",
        "label": "Fiber distance (km)",
        "min": 1,
        "max": 200,
        "default": 40
      },
      {
        "name": "fiber_type",
        "type": "select",
        "section": "Network",
        "label": "Fiber type",
        "options": [
          "SMF-28",
          "G.652.D",
          "Metro dark fiber"
        ],
        "default": "SMF-28"
      },
      {
        "name": "bits",
        "type": "number",
        "section": "QKD simulation",
        "label": "Raw key bits to simulate",
        "min": 64,
        "max": 4096,
        "default": 4096
      },
      {
        "name": "sample_check",
        "type": "number",
        "section": "QKD simulation",
        "label": "QBER sample size",
        "min": 4,
        "max": 64,
        "default": 16
      },
      {
        "name": "target_key_rate_kbps",
        "type": "number",
        "section": "QKD simulation",
        "label": "Target key rate (kbps)",
        "min": 1,
        "max": 1000,
        "default": 64
      },
      {
        "name": "protocol",
        "type": "select",
        "section": "QKD simulation",
        "label": "Protocol",
        "options": [
          "BB84",
          "E91",
          "CV-QKD"
        ],
        "default": "BB84"
      },
      {
        "name": "sla_uptime_pct",
        "type": "number",
        "section": "SLA",
        "label": "Required uptime (%)",
        "min": 95,
        "max": 99.99,
        "default": 99.9
      },
      {
        "name": "redundant_path",
        "type": "boolean",
        "section": "SLA",
        "label": "Require redundant fiber path",
        "default": true
      },
      {
        "name": "integrate_existing_kms",
        "type": "boolean",
        "section": "SLA",
        "label": "Integrate with existing KMS",
        "default": true
      }
    ],
    "default_input": {
      "carrier_name": "MetroFiber Communications",
      "link_name": "QKD-PILOT-DFW-01",
      "city_pair": "Downtown \u2194 Data Center",
      "link_distance_km": 40,
      "fiber_type": "SMF-28",
      "bits": 4096,
      "sample_check": 16,
      "target_key_rate_kbps": 64,
      "protocol": "BB84",
      "sla_uptime_pct": 99.9,
      "redundant_path": true,
      "integrate_existing_kms": true
    },
    "skill": "bb84_simulator"
  },
  {
    "id": "cloud_api_entropy",
    "industry": "Cloud / Security",
    "title": "NIST post-quantum account vault",
    "description": "Encrypt user accounts with NIST FIPS 203 ML-KEM-768 + FIPS 204 ML-DSA-65 so they cannot be decrypted \u2014 even by a quantum computer.",
    "problem": "Account sessions today rely on RSA and predictable randomness. Shor's algorithm will break RSA; weak nonces enable session hijacking. Enterprises need CNSA 2.0\u2013aligned identity vaults before fault-tolerant quantum arrives.",
    "quantum_value": "Industry-standard hybrid encryption: QRNG session nonce \u2192 ML-KEM-768 key encapsulation \u2192 AES-256-GCM payload \u2192 ML-DSA-65 signature. Accounts encrypted with this vault remain secure against both classical and quantum adversaries.",
    "audience": "CISOs, identity architects, zero-trust platform engineers, and DevSecOps teams migrating to post-quantum cryptography.",
    "outcome_preview": "NIST algorithm stack, encrypted account vault package, ML-KEM ciphertext, ML-DSA signature, and side-by-side comparison vs quantum-vulnerable RSA binding.",
    "highlights": [
      "NIST FIPS 203 ML-KEM-768 (Kyber-class KEM)",
      "NIST FIPS 204 ML-DSA-65 account signatures",
      "AES-256-GCM + QRNG session nonce binding",
      "CNSA 2.0 / NIST SP 800-227 hybrid pattern",
      "Accounts not decryptable by quantum computers"
    ],
    "steps": [
      "Configure account, tenant, and gateway identity",
      "Generate quantum-random session nonce (QRNG)",
      "ML-KEM-768 encapsulate shared secret (FIPS 203)",
      "Encrypt account binding with AES-256-GCM",
      "ML-DSA-65 sign canonical record (FIPS 204)",
      "Compare vs RSA-2048 quantum-vulnerable baseline"
    ],
    "tags": [
      "Security",
      "PQC",
      "Identity",
      "NIST",
      "Zero trust"
    ],
    "metrics": [
      {
        "label": "KEM",
        "value": "ML-KEM-768"
      },
      {
        "label": "Signature",
        "value": "ML-DSA-65"
      },
      {
        "label": "Standard",
        "value": "FIPS 203/204"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "account_email",
        "type": "text",
        "section": "Account identity",
        "label": "Account email",
        "default": "user@enterprise.example",
        "help": "Primary account identifier encrypted in the vault"
      },
      {
        "name": "account_display_name",
        "type": "text",
        "section": "Account identity",
        "label": "Display name",
        "default": "Alex Chen"
      },
      {
        "name": "account_roles",
        "type": "tags",
        "section": "Account identity",
        "label": "Account roles",
        "default": [
          "user",
          "billing_admin"
        ]
      },
      {
        "name": "mfa_enabled",
        "type": "boolean",
        "section": "Account identity",
        "label": "MFA enabled",
        "default": true
      },
      {
        "name": "gateway_name",
        "type": "text",
        "section": "Service",
        "label": "Identity gateway",
        "default": "identity-edge-gw-prod"
      },
      {
        "name": "api_environment",
        "type": "select",
        "section": "Service",
        "label": "Environment",
        "options": [
          "production",
          "staging",
          "development"
        ],
        "default": "production"
      },
      {
        "name": "tenant_id",
        "type": "text",
        "section": "Service",
        "label": "Tenant / org ID",
        "default": "org_7f3a9c2e"
      },
      {
        "name": "purpose",
        "type": "text",
        "section": "Service",
        "label": "Vault binding purpose",
        "default": "zero_trust_session"
      },
      {
        "name": "service_tier",
        "type": "select",
        "section": "Service",
        "label": "Service tier",
        "options": [
          "standard",
          "premium",
          "critical"
        ],
        "default": "critical"
      },
      {
        "name": "pqc_kem",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Key encapsulation (KEM)",
        "options": [
          "ML-KEM-768",
          "ML-KEM-1024"
        ],
        "default": "ML-KEM-768",
        "help": "NIST FIPS 203 \u2014 resistant to Shor's algorithm"
      },
      {
        "name": "pqc_signature",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Digital signature",
        "options": [
          "ML-DSA-65",
          "ML-DSA-87"
        ],
        "default": "ML-DSA-65",
        "help": "NIST FIPS 204 \u2014 quantum-safe account binding"
      },
      {
        "name": "symmetric_cipher",
        "type": "select",
        "section": "NIST PQC algorithms",
        "label": "Symmetric cipher",
        "options": [
          "AES-256-GCM"
        ],
        "default": "AES-256-GCM"
      },
      {
        "name": "bytes",
        "type": "number",
        "section": "Session entropy",
        "label": "QRNG nonce bytes",
        "min": 8,
        "max": 256,
        "default": 32
      },
      {
        "name": "rotation_interval_sec",
        "type": "number",
        "section": "Session entropy",
        "label": "Key rotation interval (sec)",
        "min": 60,
        "max": 86400,
        "default": 3600
      },
      {
        "name": "bind_to_session",
        "type": "boolean",
        "section": "Session entropy",
        "label": "Bind nonce to session ID",
        "default": true
      },
      {
        "name": "compliance",
        "type": "select",
        "section": "Compliance",
        "label": "Compliance target",
        "options": [
          "SOC 2 Type II",
          "PCI-DSS",
          "FedRAMP Moderate",
          "ISO 27001",
          "CNSA 2.0"
        ],
        "default": "CNSA 2.0"
      },
      {
        "name": "audit_log",
        "type": "boolean",
        "section": "Compliance",
        "label": "Write vault audit log entry",
        "default": true
      },
      {
        "name": "rate_limit_per_min",
        "type": "number",
        "section": "Compliance",
        "label": "Rate limit (encryptions/min)",
        "min": 10,
        "max": 100000,
        "default": 5000
      }
    ],
    "default_input": {
      "account_email": "user@enterprise.example",
      "account_display_name": "Alex Chen",
      "account_roles": [
        "user",
        "billing_admin"
      ],
      "mfa_enabled": true,
      "gateway_name": "identity-edge-gw-prod",
      "api_environment": "production",
      "tenant_id": "org_7f3a9c2e",
      "purpose": "zero_trust_session",
      "service_tier": "critical",
      "pqc_kem": "ML-KEM-768",
      "pqc_signature": "ML-DSA-65",
      "symmetric_cipher": "AES-256-GCM",
      "bytes": 32,
      "rotation_interval_sec": 3600,
      "bind_to_session": true,
      "compliance": "CNSA 2.0",
      "audit_log": true,
      "rate_limit_per_min": 5000
    },
    "skill": "account_vault_encrypt"
  },
  {
    "id": "automotive_battery_chemistry",
    "industry": "Automotive / Energy",
    "title": "Battery cathode circuit proxy",
    "description": "Sample a simplified 2-qubit quantum model as a stepping stone toward full battery cathode chemistry simulation.",
    "problem": "Battery makers want to simulate electron interactions in cathode materials. Full quantum chemistry (VQE) needs many qubits \u2014 researchers start with tiny models to validate encoding.",
    "quantum_value": "Quantum computers may simulate molecules that classical supercomputers cannot. A 2-qubit Bell-style circuit here stands in for a minimal magnetic-observable sampling experiment.",
    "audience": "Materials scientists, automotive R&D teams, and quantum chemistry learners.",
    "outcome_preview": "Circuit gate list (Hadamard, CNOT, measure), qubit count, and measurement histogram from the simulator.",
    "highlights": [
      "2-qubit entangled circuit",
      "2,048 measurement shots",
      "Gate-by-gate circuit breakdown",
      "Provider measurement histogram"
    ],
    "steps": [
      "Build Bell-state preparation circuit",
      "Submit to quantum simulator backend",
      "Run 2,048 shots",
      "Aggregate measurement counts (00 / 11)"
    ],
    "tags": [
      "Automotive",
      "Chemistry",
      "Circuit",
      "Research"
    ],
    "metrics": [
      {
        "label": "Qubits",
        "value": "2"
      },
      {
        "label": "Shots",
        "value": "2,048"
      },
      {
        "label": "Circuit",
        "value": "Bell state"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "program_name",
        "type": "text",
        "section": "Program",
        "label": "R&D program name",
        "default": "Gen-4 Ultra Range Cell"
      },
      {
        "name": "oem_partner",
        "type": "text",
        "section": "Program",
        "label": "OEM partner",
        "default": "Aurora Motors"
      },
      {
        "name": "material",
        "type": "select",
        "section": "Chemistry",
        "label": "Cathode chemistry",
        "options": [
          "NMC811",
          "NMC622",
          "LFP",
          "Solid-state"
        ],
        "default": "NMC811"
      },
      {
        "name": "cell_format",
        "type": "select",
        "section": "Chemistry",
        "label": "Cell format",
        "options": [
          "4680",
          "2170",
          "Pouch",
          "Prismatic"
        ],
        "default": "4680"
      },
      {
        "name": "target_energy_density",
        "type": "number",
        "section": "Chemistry",
        "label": "Target energy density (Wh/kg)",
        "min": 100,
        "max": 500,
        "default": 320
      },
      {
        "name": "temperature_c",
        "type": "number",
        "section": "Chemistry",
        "label": "Operating temperature (\u00b0C)",
        "min": -20,
        "max": 60,
        "default": 25
      },
      {
        "name": "cycle_life_target",
        "type": "number",
        "section": "Chemistry",
        "label": "Target cycle life",
        "min": 500,
        "max": 5000,
        "default": 1500
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Qubits in model",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Measurement shots",
        "min": 256,
        "max": 8192,
        "default": 2048
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations (proxy)",
        "min": 1,
        "max": 100,
        "default": 20
      },
      {
        "name": "use_error_mitigation",
        "type": "boolean",
        "section": "Quantum model",
        "label": "Apply error mitigation",
        "default": true
      }
    ],
    "default_input": {
      "program_name": "Gen-4 Ultra Range Cell",
      "oem_partner": "Aurora Motors",
      "material": "NMC",
      "cell_format": "4680",
      "target_energy_density": 320,
      "temperature_c": 25,
      "cycle_life_target": 1500,
      "qubits": 2,
      "shots": 2048,
      "vqe_iterations": 20,
      "use_error_mitigation": true
    },
    "skill": "hello_quantum"
  },
  {
    "id": "research_simulator_benchmark",
    "industry": "Research / R&D",
    "title": "Simulator benchmark",
    "description": "Run the same 2-qubit workload on Qiskit Aer, PennyLane, mock, and classical backends to compare outcomes.",
    "problem": "Research labs evaluating quantum SDKs need apples-to-apples comparisons before committing to a vendor stack or cloud provider.",
    "quantum_value": "Different simulators use different math engines \u2014 results should match for identical circuits. Benchmarking de-risks production deployment.",
    "audience": "Quantum researchers, platform engineers, and R&D teams picking a toolchain.",
    "outcome_preview": "Side-by-side provider results, step timeline showing each backend run, and a recommendation summary.",
    "highlights": [
      "Same circuit on 4+ backends",
      "Qiskit Aer, PennyLane, mock, classical",
      "Workflow timeline per provider",
      "Comparison recommendation at end"
    ],
    "steps": [
      "Define identical 2-qubit, 512-shot workload",
      "Run on Qiskit Aer (if installed)",
      "Run on PennyLane (if installed)",
      "Run on mock + classical fallbacks",
      "Aggregate and recommend best fit"
    ],
    "tags": [
      "Research",
      "Benchmark",
      "Providers",
      "Pipeline"
    ],
    "metrics": [
      {
        "label": "Providers",
        "value": "4+"
      },
      {
        "label": "Qubits",
        "value": "2"
      },
      {
        "label": "Shots",
        "value": "512"
      }
    ],
    "mode": "workflow",
    "input_fields": [
      {
        "name": "lab_name",
        "type": "text",
        "section": "Project",
        "label": "Lab / team name",
        "default": "Quantum Materials Lab"
      },
      {
        "name": "project_id",
        "type": "text",
        "section": "Project",
        "label": "Project ID",
        "default": "QML-2026-014"
      },
      {
        "name": "principal_investigator",
        "type": "text",
        "section": "Project",
        "label": "Principal investigator",
        "default": "Dr. Sam Rivera"
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Workload",
        "label": "Circuit qubits",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Workload",
        "label": "Shots per provider",
        "min": 128,
        "max": 4096,
        "default": 512
      },
      {
        "name": "circuit_type",
        "type": "select",
        "section": "Workload",
        "label": "Circuit template",
        "options": [
          "bell_state",
          "ghz",
          "qft_mini",
          "custom_ansatz"
        ],
        "default": "bell_state"
      },
      {
        "name": "noise_model",
        "type": "select",
        "section": "Workload",
        "label": "Noise model",
        "options": [
          "ideal",
          "depolarizing_light",
          "depolarizing_heavy"
        ],
        "default": "depolarizing_light"
      },
      {
        "name": "cost_ceiling_usd",
        "type": "number",
        "section": "Budget",
        "label": "Cost ceiling (USD)",
        "min": 0,
        "max": 500,
        "default": 0
      },
      {
        "name": "latency_budget_ms",
        "type": "number",
        "section": "Budget",
        "label": "Latency budget (ms)",
        "min": 100,
        "max": 60000,
        "default": 5000
      },
      {
        "name": "require_agreement",
        "type": "boolean",
        "section": "Budget",
        "label": "Require cross-provider agreement",
        "default": true
      },
      {
        "name": "export_csv",
        "type": "boolean",
        "section": "Reporting",
        "label": "Export benchmark CSV",
        "default": true
      }
    ],
    "default_input": {
      "lab_name": "Quantum Materials Lab",
      "project_id": "QML-2026-014",
      "principal_investigator": "Dr. Sam Rivera",
      "qubits": 2,
      "shots": 512,
      "circuit_type": "bell_state",
      "noise_model": "depolarizing_light",
      "cost_ceiling_usd": 0,
      "latency_budget_ms": 5000,
      "require_agreement": true,
      "export_csv": true
    },
    "workflow": "research_benchmark"
  },
  {
    "id": "insurance_fraud_feature_probe",
    "industry": "Insurance",
    "title": "Secure fraud-scoring pipeline",
    "description": "Scan fraud-scoring code for weak cryptography, then run a quantum circuit only if security policy allows.",
    "problem": "Insurance ML pipelines that score fraud often embed legacy crypto in feature stores. Running quantum circuits on sensitive data requires a security gate first.",
    "quantum_value": "Hybrid quantum classifiers are an active research area for high-dimensional fraud. This pipeline enforces scan \u2192 design \u2192 policy \u2192 simulate \u2192 explain before any circuit runs.",
    "audience": "Insurance data scientists, fraud teams, and security-conscious ML engineers.",
    "outcome_preview": "Crypto scan findings, circuit design plan, policy verdict, simulation counts, and explanation.",
    "highlights": [
      "Scans feature-store code for RSA/MD5",
      "Circuit generation agent designs qubits",
      "Policy gate blocks non-compliant runs",
      "Full explanation of final result"
    ],
    "steps": [
      "Optional crypto migration scan on code",
      "Circuit generation agent plans qubits",
      "Security policy agent approves or blocks",
      "Simulator runs approved circuit",
      "Explanation agent narrates outcome"
    ],
    "tags": [
      "Insurance",
      "Fraud",
      "Policy",
      "Pipeline"
    ],
    "metrics": [
      {
        "label": "Qubits",
        "value": "2"
      },
      {
        "label": "Shots",
        "value": "1,024"
      },
      {
        "label": "Gate",
        "value": "Policy first"
      }
    ],
    "mode": "workflow",
    "input_fields": [
      {
        "name": "insurer_name",
        "type": "text",
        "section": "Organization",
        "label": "Insurer name",
        "default": "Summit Mutual Insurance"
      },
      {
        "name": "line_of_business",
        "type": "select",
        "section": "Organization",
        "label": "Line of business",
        "options": [
          "auto",
          "property",
          "health",
          "commercial"
        ],
        "default": "auto"
      },
      {
        "name": "model_name",
        "type": "text",
        "section": "Organization",
        "label": "ML model name",
        "default": "fraud-score-v3.2"
      },
      {
        "name": "model_owner",
        "type": "text",
        "section": "Organization",
        "label": "Model owner",
        "default": "data-science@summit.example"
      },
      {
        "name": "pii_level",
        "type": "select",
        "section": "Data governance",
        "label": "PII sensitivity",
        "options": [
          "none",
          "low",
          "moderate",
          "high"
        ],
        "default": "moderate"
      },
      {
        "name": "retention_days",
        "type": "number",
        "section": "Data governance",
        "label": "Feature retention (days)",
        "min": 30,
        "max": 2555,
        "default": 365
      },
      {
        "name": "code",
        "type": "code",
        "section": "Feature store",
        "label": "Feature-store / scoring code",
        "default": "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()"
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum pipeline",
        "label": "Circuit qubits",
        "min": 2,
        "max": 4,
        "default": 2
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum pipeline",
        "label": "Simulation shots",
        "min": 256,
        "max": 4096,
        "default": 1024
      },
      {
        "name": "allow_cloud_quantum",
        "type": "boolean",
        "section": "Quantum pipeline",
        "label": "Allow cloud quantum backends",
        "default": false
      },
      {
        "name": "explain_to_auditor",
        "type": "boolean",
        "section": "Quantum pipeline",
        "label": "Generate auditor explanation",
        "default": true
      },
      {
        "name": "block_on_critical_crypto",
        "type": "boolean",
        "section": "Policy",
        "label": "Block run on critical crypto findings",
        "default": true
      }
    ],
    "default_input": {
      "insurer_name": "Summit Mutual Insurance",
      "line_of_business": "auto",
      "model_name": "fraud-score-v3.2",
      "model_owner": "data-science@summit.example",
      "pii_level": "moderate",
      "retention_days": 365,
      "code": "feature_store_key = RSA.import_key(pem)\nscore_hash = MD5.new(features).hexdigest()",
      "qubits": 2,
      "shots": 1024,
      "allow_cloud_quantum": false,
      "explain_to_auditor": true,
      "block_on_critical_crypto": true,
      "max_cost_usd": 0
    },
    "workflow": "secure_circuit_pipeline"
  },
  {
    "id": "pharma_molecular_binding",
    "industry": "Pharma / Life Sciences",
    "title": "Drug-target binding (VQE)",
    "description": "Predict how tightly a drug candidate binds its protein target using variational quantum eigensolver chemistry \u2014 beyond classical force fields.",
    "problem": "Pharma R&D spends billions on molecules that fail in trials because classical docking (MM/GBSA) misses quantum electron correlation in binding pockets. Wrong affinity estimates waste 12\u201315 years per drug program.",
    "quantum_value": "VQE-based quantum chemistry captures electron correlation that force fields ignore. This demo runs an entangled ansatz proxy for binding affinity \u2014 the same path Pfizer, Roche, and national labs are scaling to fault-tolerant hardware.",
    "audience": "Computational chemists, drug discovery teams, and biotech CTOs evaluating quantum chemistry ROI.",
    "outcome_preview": "Binding affinity (kcal/mol), confidence score, conformation search space comparison, and circuit measurement histogram.",
    "highlights": [
      "VQE proxy for protein-ligand binding",
      "100\u00d7+ conformation search vs classical docking",
      "FDA-aligned computational evidence workflow",
      "Scales to fault-tolerant chemistry circuits"
    ],
    "steps": [
      "Configure compound, target protein, and chemistry",
      "Classical MM/GBSA baseline affinity estimate",
      "Build variational quantum ansatz for binding pocket",
      "Run VQE iterations with measurement shots",
      "Compare confidence and affinity vs classical"
    ],
    "tags": [
      "Pharma",
      "VQE",
      "Chemistry",
      "Drug discovery"
    ],
    "metrics": [
      {
        "label": "Method",
        "value": "VQE"
      },
      {
        "label": "Target",
        "value": "KRAS G12C"
      },
      {
        "label": "Gain",
        "value": "+20% conf."
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "program_name",
        "type": "text",
        "section": "Program",
        "label": "Drug program name",
        "default": "Oncology KRAS G12C Phase II"
      },
      {
        "name": "compound_name",
        "type": "text",
        "section": "Molecule",
        "label": "Compound name",
        "default": "KRAS-G12C inhibitor"
      },
      {
        "name": "compound_id",
        "type": "text",
        "section": "Molecule",
        "label": "Compound ID",
        "default": "CMP-2026-0142"
      },
      {
        "name": "target_protein",
        "type": "text",
        "section": "Molecule",
        "label": "Target protein",
        "default": "KRAS G12C"
      },
      {
        "name": "binding_site",
        "type": "select",
        "section": "Molecule",
        "label": "Binding site",
        "options": [
          "orthosteric",
          "allosteric",
          "covalent"
        ],
        "default": "covalent"
      },
      {
        "name": "ph",
        "type": "number",
        "section": "Conditions",
        "label": "Simulated pH",
        "min": 5,
        "max": 9,
        "default": 7.4
      },
      {
        "name": "temperature_k",
        "type": "number",
        "section": "Conditions",
        "label": "Temperature (K)",
        "min": 270,
        "max": 320,
        "default": 310
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Active-space qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Measurement shots",
        "min": 512,
        "max": 16384,
        "default": 4096
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations",
        "min": 10,
        "max": 200,
        "default": 40
      },
      {
        "name": "basis_set",
        "type": "select",
        "section": "Quantum model",
        "label": "Basis set proxy",
        "options": [
          "STO-3G",
          "6-31G",
          "cc-pVDZ"
        ],
        "default": "6-31G"
      },
      {
        "name": "fda_submission_track",
        "type": "boolean",
        "section": "Regulatory",
        "label": "Include FDA computational evidence format",
        "default": true
      }
    ],
    "default_input": {
      "program_name": "Oncology KRAS G12C Phase II",
      "compound_name": "KRAS-G12C inhibitor",
      "compound_id": "CMP-2026-0142",
      "target_protein": "KRAS G12C",
      "binding_site": "covalent",
      "ph": 7.4,
      "temperature_k": 310,
      "qubits": 4,
      "shots": 4096,
      "vqe_iterations": 40,
      "basis_set": "6-31G",
      "fda_submission_track": true
    },
    "skill": "hello_quantum"
  },
  {
    "id": "energy_grid_quantum_dispatch",
    "industry": "Energy / Utilities",
    "title": "Renewable grid dispatch",
    "description": "Optimize power dispatch across solar, wind, hydro, and peaker assets when renewables dominate the grid \u2014 a problem classical solvers struggle with at scale.",
    "problem": "Grid operators face volatile renewable output and must dispatch thousands of megawatts in real time. Classical merit-order dispatch wastes renewable energy (curtailment) and misses globally optimal unit commitment when weather shifts hourly.",
    "quantum_value": "Quantum and quantum-inspired optimizers handle combinatorial unit commitment that exhausts classical solvers. National labs (NREL, Oak Ridge) are actively researching quantum grid dispatch for 80%+ renewable grids.",
    "audience": "ISO/RTO planners, utility CTOs, and energy transition strategists.",
    "outcome_preview": "Cost index, CO\u2082 intensity, renewable utilization, and per-region dispatch weights.",
    "highlights": [
      "Multi-region renewable dispatch optimization",
      "Lower curtailment vs greedy merit-order",
      "N-1 contingency-aware re-dispatch",
      "National lab quantum grid research pattern"
    ],
    "steps": [
      "Load grid operator, regions, and demand profile",
      "Classical merit-order economic dispatch baseline",
      "Quantum-inspired unit commitment optimizer",
      "Compare cost, carbon, and renewable utilization"
    ],
    "tags": [
      "Energy",
      "Grid",
      "Optimization",
      "Climate"
    ],
    "metrics": [
      {
        "label": "Renewables",
        "value": "68%"
      },
      {
        "label": "Demand",
        "value": "4.2 GW"
      },
      {
        "label": "Regions",
        "value": "4"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "grid_operator",
        "type": "text",
        "section": "Grid",
        "label": "ISO / RTO operator",
        "default": "PJM Interconnection"
      },
      {
        "name": "dispatch_date",
        "type": "text",
        "section": "Grid",
        "label": "Dispatch date",
        "default": "2026-07-15"
      },
      {
        "name": "regions",
        "type": "tags",
        "section": "Grid",
        "label": "Dispatch regions",
        "default": [
          "Solar Belt",
          "Wind North",
          "Hydro East",
          "Gas Peaker"
        ]
      },
      {
        "name": "peak_demand_mw",
        "type": "number",
        "section": "Load",
        "label": "Peak demand (MW)",
        "min": 500,
        "max": 50000,
        "default": 4200
      },
      {
        "name": "renewable_mix_pct",
        "type": "number",
        "section": "Load",
        "label": "Renewable mix (%)",
        "min": 10,
        "max": 100,
        "default": 68
      },
      {
        "name": "dispatch_risk",
        "type": "select",
        "section": "Optimization",
        "label": "Dispatch risk profile",
        "options": [
          "low",
          "medium",
          "high"
        ],
        "default": "medium"
      },
      {
        "name": "n1_contingency",
        "type": "boolean",
        "section": "Optimization",
        "label": "Enforce N-1 contingency reserve",
        "default": true
      },
      {
        "name": "carbon_price_usd_ton",
        "type": "number",
        "section": "Optimization",
        "label": "Carbon price (USD/ton)",
        "min": 0,
        "max": 200,
        "default": 45
      },
      {
        "name": "curtailment_cap_pct",
        "type": "number",
        "section": "Optimization",
        "label": "Max renewable curtailment (%)",
        "min": 0,
        "max": 30,
        "default": 5
      },
      {
        "name": "real_time_rebalance",
        "type": "boolean",
        "section": "Optimization",
        "label": "Enable 5-min re-dispatch",
        "default": true
      }
    ],
    "default_input": {
      "grid_operator": "PJM Interconnection",
      "dispatch_date": "2026-07-15",
      "regions": [
        "Solar Belt",
        "Wind North",
        "Hydro East",
        "Gas Peaker"
      ],
      "peak_demand_mw": 4200,
      "renewable_mix_pct": 68,
      "dispatch_risk": "medium",
      "n1_contingency": true,
      "carbon_price_usd_ton": 45,
      "curtailment_cap_pct": 5,
      "real_time_rebalance": true
    },
    "skill": "portfolio_optimizer"
  },
  {
    "id": "finance_quantum_monte_carlo",
    "industry": "Financial Services",
    "title": "Quantum Monte Carlo risk",
    "description": "Estimate tail risk (VaR99) for trading books using quantum amplitude estimation \u2014 quadratic speedup over classical Monte Carlo.",
    "problem": "Banks must compute Value-at-Risk across millions of scenarios for Basel III and FRTB compliance. Classical Monte Carlo needs 10,000+ paths for accurate tails \u2014 expensive, slow, and still noisy for complex derivatives books.",
    "quantum_value": "Quantum Amplitude Estimation (QAE) provides quadratic speedup for tail probability estimation. JPMorgan, Goldman Sachs, and ECB research teams are building QAE pipelines for production risk engines.",
    "audience": "Quantitative analysts, CRO offices, and regulatory risk teams.",
    "outcome_preview": "VaR99 comparison, effective scenario paths, wall-clock time, and QAE qubit configuration.",
    "highlights": [
      "Quantum amplitude estimation for tail risk",
      "32\u00d7 effective scenario coverage",
      "Basel III / FRTB compatible reporting",
      "Goldman/JPM research-track pattern"
    ],
    "steps": [
      "Configure trading book, notional, and horizon",
      "Classical Monte Carlo with 10K paths",
      "Quantum amplitude estimation proxy",
      "Compare VaR99, paths, and runtime"
    ],
    "tags": [
      "Finance",
      "Risk",
      "Monte Carlo",
      "QAE"
    ],
    "metrics": [
      {
        "label": "Notional",
        "value": "$500M"
      },
      {
        "label": "Paths",
        "value": "320K eff."
      },
      {
        "label": "Horizon",
        "value": "10d"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "institution",
        "type": "text",
        "section": "Book",
        "label": "Institution",
        "default": "Global Investment Bank"
      },
      {
        "name": "trading_book",
        "type": "text",
        "section": "Book",
        "label": "Trading book",
        "default": "Global Rates & FX"
      },
      {
        "name": "book_id",
        "type": "text",
        "section": "Book",
        "label": "Book ID",
        "default": "GRF-2026-Q3"
      },
      {
        "name": "notional_usd",
        "type": "number",
        "section": "Exposure",
        "label": "Notional (USD)",
        "min": 1000000,
        "default": 500000000
      },
      {
        "name": "risk_horizon",
        "type": "select",
        "section": "Exposure",
        "label": "Risk horizon",
        "options": [
          "1d",
          "10d",
          "1m",
          "3m"
        ],
        "default": "10d"
      },
      {
        "name": "confidence_level",
        "type": "select",
        "section": "Exposure",
        "label": "VaR confidence",
        "options": [
          "95%",
          "99%",
          "99.9%"
        ],
        "default": "99%"
      },
      {
        "name": "simulation_paths",
        "type": "number",
        "section": "Simulation",
        "label": "Classical MC paths",
        "min": 1000,
        "max": 1000000,
        "default": 10000
      },
      {
        "name": "qae_qubits",
        "type": "number",
        "section": "Simulation",
        "label": "QAE qubits",
        "min": 4,
        "max": 20,
        "default": 8
      },
      {
        "name": "regulatory_framework",
        "type": "select",
        "section": "Compliance",
        "label": "Regulatory framework",
        "options": [
          "Basel III",
          "FRTB",
          "CCAR",
          "IFRS 9"
        ],
        "default": "FRTB"
      },
      {
        "name": "include_stressed_scenarios",
        "type": "boolean",
        "section": "Compliance",
        "label": "Include stressed scenarios",
        "default": true
      }
    ],
    "default_input": {
      "institution": "Global Investment Bank",
      "trading_book": "Global Rates & FX",
      "book_id": "GRF-2026-Q3",
      "notional_usd": 500000000,
      "risk_horizon": "10d",
      "confidence_level": "99%",
      "simulation_paths": 10000,
      "qae_qubits": 8,
      "regulatory_framework": "FRTB",
      "include_stressed_scenarios": true
    },
    "skill": "portfolio_optimizer"
  },
  {
    "id": "semiconductor_yield_quantum",
    "industry": "Semiconductor / Manufacturing",
    "title": "Fab yield intelligence",
    "description": "Detect lithography and overlay defects on advanced-node wafers using quantum kernel methods \u2014 before wafers are scrapped.",
    "problem": "At 3nm and below, a single undetected overlay defect ruins an entire wafer batch costing $500K+. Classical statistical process control (SPC) is lagging \u2014 defects are found after scrap, not inline during lithography.",
    "quantum_value": "Quantum kernel methods map high-dimensional metrology data into Hilbert space where subtle defect patterns separate cleanly. IBM and TSMC research partnerships use quantum ML for inline fab anomaly detection.",
    "audience": "Fab yield engineers, semiconductor VP ops, and advanced-node process teams.",
    "outcome_preview": "Predicted yield %, defect PPM, anomaly detection latency, and quantum circuit histogram.",
    "highlights": [
      "Sub-10ms inline anomaly detection",
      "Near 2\u00d7 defect PPM reduction vs SPC",
      "Quantum kernel for overlay metrology",
      "IBM/TSMC fab research pattern"
    ],
    "steps": [
      "Configure fab, wafer size, and process node",
      "Classical SPC/PCA yield baseline",
      "Quantum kernel anomaly detection circuit",
      "Compare yield, defect PPM, and latency"
    ],
    "tags": [
      "Semiconductor",
      "Manufacturing",
      "QML",
      "Yield"
    ],
    "metrics": [
      {
        "label": "Node",
        "value": "N3"
      },
      {
        "label": "Yield",
        "value": "+7%"
      },
      {
        "label": "Latency",
        "value": "8ms"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "fab_name",
        "type": "text",
        "section": "Fab",
        "label": "Fab / line name",
        "default": "TSMC N3 Pilot Line"
      },
      {
        "name": "process_node",
        "type": "select",
        "section": "Fab",
        "label": "Process node",
        "options": [
          "N3",
          "N5",
          "N7",
          "Intel 18A"
        ],
        "default": "N3"
      },
      {
        "name": "wafer_size",
        "type": "select",
        "section": "Fab",
        "label": "Wafer size",
        "options": [
          "200mm",
          "300mm"
        ],
        "default": "300mm"
      },
      {
        "name": "product_sku",
        "type": "text",
        "section": "Fab",
        "label": "Product SKU",
        "default": "A17-Pro GPU die"
      },
      {
        "name": "lots_per_day",
        "type": "number",
        "section": "Production",
        "label": "Lots per day",
        "min": 1,
        "max": 500,
        "default": 42
      },
      {
        "name": "target_yield_pct",
        "type": "number",
        "section": "Production",
        "label": "Target yield (%)",
        "min": 70,
        "max": 99.9,
        "default": 92
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Feature-map qubits",
        "min": 2,
        "max": 6,
        "default": 3
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "Inference shots",
        "min": 1024,
        "max": 32768,
        "default": 8192
      },
      {
        "name": "inline_metrology",
        "type": "boolean",
        "section": "Detection",
        "label": "Inline overlay metrology",
        "default": true
      },
      {
        "name": "alert_latency_ms",
        "type": "number",
        "section": "Detection",
        "label": "Alert latency target (ms)",
        "min": 1,
        "max": 100,
        "default": 10
      }
    ],
    "default_input": {
      "fab_name": "TSMC N3 Pilot Line",
      "process_node": "N3",
      "wafer_size": "300mm",
      "product_sku": "A17-Pro GPU die",
      "lots_per_day": 42,
      "target_yield_pct": 92,
      "qubits": 3,
      "shots": 8192,
      "inline_metrology": true,
      "alert_latency_ms": 10
    },
    "skill": "hello_quantum"
  },
  {
    "id": "ai_llm_quantum_retrieval",
    "industry": "AI / Large Language Models",
    "title": "Quantum RAG vector search",
    "description": "Accelerate billion-scale embedding retrieval for LLM RAG pipelines using quantum amplitude amplification \u2014 the bottleneck every AI team hits at production scale.",
    "problem": "Enterprise RAG systems search millions of document embeddings per query. Classical approximate nearest-neighbor (HNSW, IVF) degrades in recall at scale and costs grow linearly with corpus size \u2014 the #1 latency bottleneck in production LLM apps.",
    "quantum_value": "Grover-style amplitude amplification searches unstructured databases with quadratic speedup. OpenAI, Google, and IBM research teams are exploring quantum subroutines for embedding retrieval when corpora exceed 100M vectors.",
    "audience": "ML platform engineers, LLM infra teams, and AI architects scaling RAG beyond classical ANN limits.",
    "outcome_preview": "Recall@10, query latency, vectors searched, and quantum circuit depth for similarity amplification.",
    "highlights": [
      "Quadratic speedup for similarity search",
      "Recall uplift vs HNSW at 100M+ vectors",
      "Production RAG latency modeling",
      "OpenAI/IBM quantum ML research pattern"
    ],
    "steps": [
      "Configure corpus size, embedding dims, and query",
      "Classical HNSW approximate search baseline",
      "Quantum amplitude amplification retrieval",
      "Compare recall, latency, and vectors examined"
    ],
    "tags": [
      "AI",
      "LLM",
      "RAG",
      "QML"
    ],
    "metrics": [
      {
        "label": "Corpus",
        "value": "100M vec"
      },
      {
        "label": "Recall",
        "value": "+18%"
      },
      {
        "label": "Speedup",
        "value": "\u221aN"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "corpus_name",
        "type": "text",
        "section": "RAG pipeline",
        "label": "Corpus / knowledge base name",
        "default": "Enterprise Knowledge Base"
      },
      {
        "name": "corpus_vectors",
        "type": "number",
        "section": "RAG pipeline",
        "label": "Total embedding vectors",
        "min": 100000,
        "default": 100000000
      },
      {
        "name": "embedding_model",
        "type": "select",
        "section": "RAG pipeline",
        "label": "Embedding model",
        "options": [
          "text-embedding-3-large",
          "e5-mistral-7b",
          "bge-large",
          "custom"
        ],
        "default": "text-embedding-3-large"
      },
      {
        "name": "embedding_dims",
        "type": "number",
        "section": "RAG pipeline",
        "label": "Embedding dimensions",
        "min": 128,
        "max": 4096,
        "default": 1536
      },
      {
        "name": "query_text",
        "type": "text",
        "section": "Query",
        "label": "Sample query",
        "default": "What is our Q3 revenue forecast by region?"
      },
      {
        "name": "top_k",
        "type": "number",
        "section": "Query",
        "label": "Top-K results",
        "min": 1,
        "max": 100,
        "default": 10
      },
      {
        "name": "latency_budget_ms",
        "type": "number",
        "section": "SLA",
        "label": "Latency budget (ms)",
        "min": 10,
        "max": 5000,
        "default": 200
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum search",
        "label": "Amplification qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum search",
        "label": "Measurement shots",
        "min": 512,
        "max": 16384,
        "default": 4096
      },
      {
        "name": "hybrid_rerank",
        "type": "boolean",
        "section": "Quantum search",
        "label": "Hybrid classical rerank after quantum search",
        "default": true
      }
    ],
    "default_input": {
      "corpus_name": "Enterprise Knowledge Base",
      "corpus_vectors": 100000000,
      "embedding_model": "text-embedding-3-large",
      "embedding_dims": 1536,
      "query_text": "What is our Q3 revenue forecast by region?",
      "top_k": 10,
      "latency_budget_ms": 200,
      "qubits": 4,
      "shots": 4096,
      "hybrid_rerank": true
    },
    "skill": "hello_quantum"
  },
  {
    "id": "genomics_protein_folding",
    "industry": "Genomics / Precision Medicine",
    "title": "Protein folding (VQE)",
    "description": "Predict 3D protein structures for precision medicine using variational quantum eigensolver \u2014 beyond classical homology modeling when no template exists.",
    "problem": "Personalized medicine needs accurate protein structures for novel mutations. Classical homology modeling fails when no similar template exists in PDB \u2014 leaving 30%+ of human proteins 'unfoldable' and blocking CRISPR and antibody design.",
    "quantum_value": "Quantum chemistry simulates folding energy landscapes that classical MD cannot reach at atomistic fidelity. Google, IBM, and biotech startups are racing to apply VQE/QPE to folding \u2014 the next frontier after AlphaFold's template limits.",
    "audience": "Computational biologists, genomics labs, and precision medicine teams.",
    "outcome_preview": "Folding energy (kcal/mol), RMSD confidence, conformation search space, and VQE circuit histogram.",
    "highlights": [
      "Folds proteins without PDB templates",
      "1000\u00d7 conformation landscape exploration",
      "CRISPR/antibody design ready outputs",
      "Post-AlphaFold quantum research frontier"
    ],
    "steps": [
      "Configure protein sequence, organism, and disease context",
      "Classical homology modeling baseline",
      "VQE folding energy minimization",
      "Compare RMSD confidence and energy"
    ],
    "tags": [
      "Genomics",
      "VQE",
      "Medicine",
      "Folding"
    ],
    "metrics": [
      {
        "label": "Method",
        "value": "VQE"
      },
      {
        "label": "RMSD conf.",
        "value": "+24%"
      },
      {
        "label": "No template",
        "value": "Yes"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "lab_name",
        "type": "text",
        "section": "Program",
        "label": "Lab / institution",
        "default": "Stanford Genomics Institute"
      },
      {
        "name": "protein_name",
        "type": "text",
        "section": "Protein",
        "label": "Protein name",
        "default": "BRCA1 variant R1699Q"
      },
      {
        "name": "uniprot_id",
        "type": "text",
        "section": "Protein",
        "label": "UniProt ID",
        "default": "P38398"
      },
      {
        "name": "sequence_length",
        "type": "number",
        "section": "Protein",
        "label": "Sequence length (aa)",
        "min": 50,
        "max": 5000,
        "default": 1863
      },
      {
        "name": "organism",
        "type": "text",
        "section": "Protein",
        "label": "Organism",
        "default": "Homo sapiens"
      },
      {
        "name": "disease_context",
        "type": "select",
        "section": "Clinical",
        "label": "Disease context",
        "options": [
          "hereditary_cancer",
          "rare_disease",
          "autoimmune",
          "neurodegenerative"
        ],
        "default": "hereditary_cancer"
      },
      {
        "name": "has_pdb_template",
        "type": "boolean",
        "section": "Clinical",
        "label": "Known PDB template exists",
        "default": false
      },
      {
        "name": "temperature_k",
        "type": "number",
        "section": "Simulation",
        "label": "Simulation temperature (K)",
        "min": 270,
        "max": 320,
        "default": 310
      },
      {
        "name": "qubits",
        "type": "number",
        "section": "Quantum model",
        "label": "Active-space qubits",
        "min": 2,
        "max": 8,
        "default": 4
      },
      {
        "name": "shots",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE measurement shots",
        "min": 1024,
        "max": 32768,
        "default": 8192
      },
      {
        "name": "vqe_iterations",
        "type": "number",
        "section": "Quantum model",
        "label": "VQE iterations",
        "min": 10,
        "max": 200,
        "default": 60
      }
    ],
    "default_input": {
      "lab_name": "Stanford Genomics Institute",
      "protein_name": "BRCA1 variant R1699Q",
      "uniprot_id": "P38398",
      "sequence_length": 1863,
      "organism": "Homo sapiens",
      "disease_context": "hereditary_cancer",
      "has_pdb_template": false,
      "temperature_k": 310,
      "qubits": 4,
      "shots": 8192,
      "vqe_iterations": 60
    },
    "skill": "hello_quantum"
  },
  {
    "id": "crypto_pqc_wallet_hardening",
    "industry": "Crypto / Web3",
    "title": "Post-quantum wallet hardening",
    "description": "Migrate blockchain wallets from ECDSA/secp256k1 to NIST post-quantum keys before quantum computers break elliptic-curve cryptography \u2014 protecting billions in digital assets.",
    "problem": "Bitcoin, Ethereum, and Solana wallets use ECDSA and Ed25519 \u2014 broken by Shor's algorithm on fault-tolerant quantum computers. The 'Harvest Now, Decrypt Later' threat means adversaries archive signed transactions today to steal funds tomorrow.",
    "quantum_value": "NIST ML-KEM-768 + ML-DSA-65 wallet key hierarchy replaces elliptic-curve keys with lattice cryptography. Coinbase, Ethereum Foundation PQC working groups, and NIST are driving 2026\u20132030 migration timelines.",
    "audience": "Wallet developers, crypto custodians, DeFi protocol teams, and Web3 security engineers.",
    "outcome_preview": "PQC wallet key package, ML-KEM ciphertext, signature migration plan, and ECDSA vulnerability score.",
    "highlights": [
      "NIST FIPS 203/204 wallet key hierarchy",
      "ECDSA \u2192 ML-DSA migration path",
      "Harvest-now-decrypt-later threat model",
      "Ethereum Foundation PQC pattern"
    ],
    "steps": [
      "Configure chain, wallet address, and asset holdings",
      "Assess ECDSA/secp256k1 quantum vulnerability",
      "Generate ML-KEM + ML-DSA hardened wallet package",
      "Compare security score vs classical wallet"
    ],
    "tags": [
      "Crypto",
      "Web3",
      "PQC",
      "Wallet"
    ],
    "metrics": [
      {
        "label": "Chain",
        "value": "Ethereum"
      },
      {
        "label": "KEM",
        "value": "ML-KEM-768"
      },
      {
        "label": "Safe",
        "value": "PQC"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "wallet_name",
        "type": "text",
        "section": "Wallet",
        "label": "Wallet name",
        "default": "Treasury Multisig v2"
      },
      {
        "name": "wallet_address",
        "type": "text",
        "section": "Wallet",
        "label": "Wallet address",
        "default": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
      },
      {
        "name": "chain",
        "type": "select",
        "section": "Wallet",
        "label": "Blockchain",
        "options": [
          "Ethereum",
          "Bitcoin",
          "Solana",
          "Polygon",
          "Arbitrum"
        ],
        "default": "Ethereum"
      },
      {
        "name": "asset_symbol",
        "type": "text",
        "section": "Wallet",
        "label": "Primary asset",
        "default": "ETH"
      },
      {
        "name": "holdings_usd",
        "type": "number",
        "section": "Wallet",
        "label": "Holdings value (USD)",
        "min": 0,
        "default": 2400000
      },
      {
        "name": "signature_scheme",
        "type": "select",
        "section": "Current crypto",
        "label": "Current signature scheme",
        "options": [
          "ECDSA/secp256k1",
          "Ed25519",
          "RSA-2048"
        ],
        "default": "ECDSA/secp256k1"
      },
      {
        "name": "multisig_threshold",
        "type": "number",
        "section": "Current crypto",
        "label": "Multisig threshold (M-of-N)",
        "min": 1,
        "max": 10,
        "default": 3
      },
      {
        "name": "pqc_kem",
        "type": "select",
        "section": "PQC migration",
        "label": "Target KEM",
        "options": [
          "ML-KEM-768",
          "ML-KEM-1024"
        ],
        "default": "ML-KEM-768"
      },
      {
        "name": "pqc_signature",
        "type": "select",
        "section": "PQC migration",
        "label": "Target signature",
        "options": [
          "ML-DSA-65",
          "ML-DSA-87"
        ],
        "default": "ML-DSA-65"
      },
      {
        "name": "migration_timeline",
        "type": "select",
        "section": "PQC migration",
        "label": "Migration timeline",
        "options": [
          "Q4 2026",
          "2027",
          "2028",
          "2030"
        ],
        "default": "2027"
      },
      {
        "name": "hndl_risk_acknowledged",
        "type": "boolean",
        "section": "Threat model",
        "label": "Harvest-now-decrypt-later risk acknowledged",
        "default": true
      }
    ],
    "default_input": {
      "wallet_name": "Treasury Multisig v2",
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "chain": "Ethereum",
      "asset_symbol": "ETH",
      "holdings_usd": 2400000,
      "signature_scheme": "ECDSA/secp256k1",
      "multisig_threshold": 3,
      "pqc_kem": "ML-KEM-768",
      "pqc_signature": "ML-DSA-65",
      "migration_timeline": "2027",
      "hndl_risk_acknowledged": true
    },
    "skill": "account_vault_encrypt"
  },
  {
    "id": "smart_city_traffic_flow",
    "industry": "Smart Cities / Mobility",
    "title": "City-wide traffic optimization",
    "description": "Coordinate thousands of intersections in real time using quantum optimization \u2014 cutting congestion, emissions, and commute times across entire metro areas.",
    "problem": "A typical metro has 5,000+ signalized intersections. Classical fixed-timing plans and greedy local optimization cause cascading gridlock \u2014 wasting 54 hours per driver per year and 30% of urban CO\u2082 emissions.",
    "quantum_value": "Quantum annealing and QAOA solve city-scale coordinated signal timing as a massive combinatorial problem. Volkswagen, D-Wave, and Tokyo/Osaka pilot programs demonstrated 10\u201320% commute time reductions using quantum traffic optimization.",
    "audience": "City DOT planners, mobility startups, autonomous vehicle fleet operators, and smart city CTOs.",
    "outcome_preview": "Average commute reduction, CO\u2082 saved, intersections coordinated, and optimized signal phase map.",
    "highlights": [
      "5,000+ intersection coordination",
      "10\u201320% commute time reduction (VW pilots)",
      "Real-time adaptive signal phasing",
      "D-Wave smart city research pattern"
    ],
    "steps": [
      "Configure metro, intersection count, and peak demand",
      "Classical fixed-timing traffic baseline",
      "Quantum coordinated signal optimization",
      "Compare commute time, CO\u2082, and throughput"
    ],
    "tags": [
      "Smart city",
      "Mobility",
      "Optimization",
      "Climate"
    ],
    "metrics": [
      {
        "label": "Intersections",
        "value": "5,000"
      },
      {
        "label": "Commute",
        "value": "-17%"
      },
      {
        "label": "CO\u2082",
        "value": "-22%"
      }
    ],
    "mode": "job",
    "input_fields": [
      {
        "name": "metro_name",
        "type": "text",
        "section": "Metro",
        "label": "Metro / city name",
        "default": "Greater Metro Area"
      },
      {
        "name": "dot_agency",
        "type": "text",
        "section": "Metro",
        "label": "DOT / agency",
        "default": "Regional Transportation Authority"
      },
      {
        "name": "intersection_count",
        "type": "number",
        "section": "Network",
        "label": "Signalized intersections",
        "min": 100,
        "max": 50000,
        "default": 5000
      },
      {
        "name": "peak_vehicles_per_hour",
        "type": "number",
        "section": "Network",
        "label": "Peak vehicles/hour",
        "min": 10000,
        "max": 5000000,
        "default": 850000
      },
      {
        "name": "avg_commute_min",
        "type": "number",
        "section": "Network",
        "label": "Current avg commute (min)",
        "min": 5,
        "max": 120,
        "default": 34
      },
      {
        "name": "optimize_for",
        "type": "select",
        "section": "Optimization",
        "label": "Optimize for",
        "options": [
          "commute_time",
          "co2_emissions",
          "throughput",
          "balanced"
        ],
        "default": "commute_time"
      },
      {
        "name": "av_fleet_pct",
        "type": "number",
        "section": "Optimization",
        "label": "Autonomous fleet (%)",
        "min": 0,
        "max": 100,
        "default": 12
      },
      {
        "name": "real_time_adaptation",
        "type": "boolean",
        "section": "Optimization",
        "label": "Real-time adaptive phasing",
        "default": true
      },
      {
        "name": "carbon_price_usd_ton",
        "type": "number",
        "section": "Reporting",
        "label": "Carbon price (USD/ton)",
        "min": 0,
        "max": 200,
        "default": 50
      },
      {
        "name": "include_transit_priority",
        "type": "boolean",
        "section": "Reporting",
        "label": "Prioritize bus/transit corridors",
        "default": true
      }
    ],
    "default_input": {
      "metro_name": "Greater Metro Area",
      "dot_agency": "Regional Transportation Authority",
      "intersection_count": 5000,
      "peak_vehicles_per_hour": 850000,
      "avg_commute_min": 34,
      "optimize_for": "commute_time",
      "av_fleet_pct": 12,
      "real_time_adaptation": true,
      "carbon_price_usd_ton": 50,
      "include_transit_priority": true
    },
    "skill": "route_optimizer"
  }
];

/** Always prefer bundled commercial schemas (richer than stale API). */
export function enrichUseCaseMeta(api: UseCaseMeta): UseCaseMeta {
  const bundled = BUNDLED_USE_CASE_SCHEMAS[api.id];
  if (!bundled) return api;

  const input_fields = bundled.input_fields;
  const default_input = { ...bundled.default_input, ...(api.default_input ?? {}) };

  return { ...api, input_fields, default_input };
}

/** Merge API catalog with bundled snapshot so new apps always appear in the launcher. */
export function mergeUseCaseCatalog(apiCases: UseCaseMeta[]): UseCaseMeta[] {
  const byId = new Map<string, UseCaseMeta>();
  for (const bundled of BUNDLED_USE_CASE_CATALOG) {
    byId.set(bundled.id, enrichUseCaseMeta(bundled));
  }
  for (const api of apiCases) {
    const base = byId.get(api.id);
    byId.set(api.id, enrichUseCaseMeta({ ...(base ?? {}), ...api, id: api.id }));
  }
  const order = BUNDLED_USE_CASE_CATALOG.map((c) => c.id);
  return order.filter((id) => byId.has(id)).map((id) => byId.get(id)!);
}

export function getBundledUseCaseOrNull(id: string): UseCaseMeta | null {
  const fromCatalog = BUNDLED_USE_CASE_CATALOG.find((c) => c.id === id);
  if (!fromCatalog) return null;
  return enrichUseCaseMeta(fromCatalog);
}
