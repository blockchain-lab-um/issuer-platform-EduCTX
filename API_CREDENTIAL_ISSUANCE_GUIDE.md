# API Guide: Issuing IDCard and CreditScore Credentials

## Overview
You can now issue IDCard and CreditScore credentials through the API. The system allows you to pass custom credential data directly in the `create-credential-offer` API call.

## API Endpoint
```
POST /oidc/create-credential-offer
```

## Authentication
Include your API key in the request header:
```
Authorization: Bearer YOUR_API_KEY
```

## Issuing an IDCard Credential

### Request Example:
```bash
curl -X POST 'http://localhost:3001/oidc/create-credential-offer' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "credential_type": [
      "VerifiableCredential",
      "VerifiableAttestation",
      "IDCardCredential"
    ],
    "format": "jwt_vc_json",
    "flow": "pre-authorized_code",
    "credential_subject": {
      "firstName": "Jane",
      "lastName": "Smith",
      "dateOfBirth": "1985-05-20",
      "placeOfBirth": "London",
      "country": "United Kingdom",
      "idNumber": "UK987654321",
      "nationality": "British",
      "issueDate": "2022-05-20",
      "expiryDate": "2032-05-20",
      "address": "456 Baker Street, London, W1U 6TN"
    }
  }'
```

### Response:
```json
{
  "credential_offer_uri": "openid-credential-offer://?credential_offer=...",
  "credential_offer": {
    "credential_issuer": "http://localhost:3001/oidc",
    "credentials": [
      {
        "format": "jwt_vc_json",
        "types": [
          "VerifiableCredential",
          "VerifiableAttestation",
          "IDCardCredential"
        ]
      }
    ],
    "grants": {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": "...",
        "user_pin_required": false
      }
    }
  }
}
```

## Issuing a CreditScore Credential

### Request Example:
```bash
curl -X POST 'http://localhost:3001/oidc/create-credential-offer' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "credential_type": [
      "VerifiableCredential",
      "VerifiableAttestation",
      "CreditScoreCredential"
    ],
    "format": "jwt_vc_json",
    "flow": "pre-authorized_code",
    "credential_subject": {
      "firstName": "Jane",
      "lastName": "Smith",
      "idCardNumber": "UK987654321",
      "creditScore": 820,
      "assessmentDate": "2025-12-19",
      "scoringAgency": "Global Credit Rating Agency"
    }
  }'
```

## Key Parameters

### Required Parameters:
- `credential_type` (array): Must include the three types shown above
- `format` (string): `"jwt_vc_json"` or `"sd-jwt"`
- `flow` (string): `"pre-authorized_code"` or `"authorization_code"`

### Optional Parameters:
- `credential_subject` (object): **THIS IS WHERE YOU SET YOUR CUSTOM VALUES!**
  - If not provided, demo data will be used
  - If provided, your custom values will be used in the credential
- `credential_offer_endpoint` (string): Custom endpoint for the credential offer
- `email` (string): Email address for the credential holder
- `client_id` (string): OAuth client ID

## IDCard Fields

### Required:
- `firstName` (string)
- `lastName` (string)
- `dateOfBirth` (string, format: YYYY-MM-DD)
- `placeOfBirth` (string)
- `country` (string)
- `idNumber` (string)
- `nationality` (string)
- `issueDate` (string, format: YYYY-MM-DD)
- `expiryDate` (string, format: YYYY-MM-DD)

### Optional:
- `address` (string)

## CreditScore Fields

### Required:
- `firstName` (string)
- `lastName` (string)
- `idCardNumber` (string)
- `creditScore` (number)

### Optional:
- `assessmentDate` (string, format: YYYY-MM-DD)
- `scoringAgency` (string)

## Flow Types

### Pre-Authorized Code Flow (Recommended for API)
Use `"pre-authorized_code"` when you want to generate a credential offer that can be claimed immediately without user interaction.

### Authorization Code Flow
Use `"authorization_code"` when you want the user to go through an OAuth authorization process.

## Complete Example with Authorization Code Flow

```bash
curl -X POST 'http://localhost:3001/oidc/create-credential-offer' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "credential_type": [
      "VerifiableCredential",
      "VerifiableAttestation",
      "CreditScoreCredential"
    ],
    "format": "jwt_vc_json",
    "flow": "authorization_code",
    "credential_subject": {
      "firstName": "Robert",
      "lastName": "Johnson",
      "idCardNumber": "CA123456789",
      "creditScore": 695,
      "assessmentDate": "2025-12-15",
      "scoringAgency": "TransUnion"
    },
    "client_id": "your-wallet-app",
    "email": "robert.johnson@example.com"
  }'
```

## Notes

1. **Custom Values Override Demo Data**: When you provide `credential_subject`, your values will be used instead of the default demo data.

2. **ID Field**: The `id` field in `credentialSubject` is automatically set to the subject's DID and cannot be overridden.

3. **Schema Validation**: The credential data is validated against JSON schemas. Make sure your data matches the required format.

4. **Date Format**: Use ISO 8601 date format (YYYY-MM-DD) for all date fields.

5. **Testing**: You can test the credentials using the dashboard at `http://localhost:3000` or via API calls.

## Error Handling

If you provide invalid data, you'll receive an error response:

```json
{
  "error": "Validation failed",
  "message": "credential_subject.creditScore must be a number"
}
```

Common errors:
- Missing required fields in `credential_subject`
- Invalid date format
- Unsupported credential type
- Invalid format parameter

## Next Steps

1. Get your API key from the environment configuration
2. Test with the provided curl examples
3. Integrate into your application
4. Use a wallet app (like EUDI Wallet) to claim the credentials using the generated credential offer URI
