# JWT Role Decoding

## Purpose

This document records the actual JWT payload returned by the SIWES360 backend login flow and the frontend rules for deriving a user role from that token.

## Source Response

Observed login response shape:

```json
{
  "success": true,
  "message": "",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>"
  }
}
```

## Decoded Access Token

Using `jwt-decode`, the sample access token decodes to:

```json
{
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "cafc9277-4cdf-4f26-8bb0-d5667b5519b6",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "odufowokanayotomiwa@gmail.com",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Student",
  "departmentId": "c6be6169-ef27-401f-a01b-90b39fef7d6d",
  "departmentName": "Computer Engineering",
  "exp": 1773669324,
  "iss": "SIWES360",
  "aud": "https://siwes360.onrender.com"
}
```

`exp = 1773669324` resolves to `2026-03-16T13:55:24.000Z`.

## Frontend Rule

The frontend should decode `data.accessToken` and read the role from this claim key:

`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`

Observed role value format:

- `Student`
- expected equivalents:
  - `Admin`
  - `Supervisor`

## Normalized Frontend Roles

The frontend should normalize backend role values to the internal app roles:

- `Student` -> `student`
- `Admin` -> `admin`
- `Supervisor` -> `supervisor`

## Redirect Map

After login succeeds and the access token is decoded:

- `student` -> `/student`
- `admin` -> `/admin`
- `supervisor` -> `/supervisor`

## Notes

- Decoding the token on the frontend is appropriate for UI routing and session state.
- Token decoding is not token validation. Backend authorization remains the source of truth.
- `jwt.io` is useful for manual inspection, but the app should use `jwt-decode` in code.
