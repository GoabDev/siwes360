import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getConfiguredApiOrigin } from "@/lib/api/config";
import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  type UserRole,
} from "@/lib/auth/session-config";

type JwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  exp?: number;
};

type TokenEnvelope = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    role?: string | number | null;
  } | null;
  accessToken?: string;
  refreshToken?: string;
  role?: string | number | null;
};

const PUBLIC_AUTH_PATHS = new Set([
  "/api/Authentication/login",
  "/api/Authentication/register",
  "/api/Authentication/forgot-password",
  "/api/Authentication/reset-password",
  "/api/Authentication/confirm-email",
  "/api/Authentication/resend-email-verification",
  "/api/Authentication/set-password",
  "/api/Authentication/refresh",
]);

function getSessionCookieOptions(maxAge = 60 * 60 * 8) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function normalizeRole(value: string | null | undefined): UserRole | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "student") {
    return "student";
  }

  if (normalized === "supervisor") {
    return "supervisor";
  }

  if (normalized === "admin" || normalized === "administrator") {
    return "admin";
  }

  if (normalized === "superadmin" || normalized === "super-admin" || normalized === "super admin") {
    return "superadmin";
  }

  return null;
}

function getRoleFromAccessToken(token: string) {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return normalizeRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
  } catch {
    return null;
  }
}

function extractTokens(payload: TokenEnvelope) {
  return {
    accessToken: payload.data?.accessToken ?? payload.accessToken ?? null,
    refreshToken: payload.data?.refreshToken ?? payload.refreshToken ?? null,
  };
}

function sanitizeTokenPayload(payload: TokenEnvelope, role: UserRole | null) {
  const data =
    payload.data && typeof payload.data === "object"
      ? {
          ...payload.data,
          accessToken: undefined,
          refreshToken: undefined,
          role: role ?? payload.data.role ?? undefined,
        }
      : payload.data;

  return {
    ...payload,
    accessToken: undefined,
    refreshToken: undefined,
    role: role ?? payload.role ?? undefined,
    data,
  };
}

function createBackendUrl(pathname: string, search: string) {
  const origin = getConfiguredApiOrigin();

  if (!origin) {
    throw new Error("Backend API origin is not configured.");
  }

  return new URL(`${pathname}${search}`, origin);
}

function getForwardHeaders(request: NextRequest, accessToken?: string | null) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function forwardToBackend(request: NextRequest, accessToken?: string | null) {
  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : Buffer.from(await request.arrayBuffer());

  return fetch(createBackendUrl(request.nextUrl.pathname, request.nextUrl.search), {
    method: request.method,
    headers: getForwardHeaders(request, accessToken),
    body,
    cache: "no-store",
  });
}

async function refreshServerSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null;
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE)?.value ?? null;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const response = await fetch(createBackendUrl("/api/Authentication/refresh", ""), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as TokenEnvelope;
  const nextTokens = extractTokens(payload);

  if (!nextTokens.accessToken || !nextTokens.refreshToken) {
    return null;
  }

  return {
    accessToken: nextTokens.accessToken,
    refreshToken: nextTokens.refreshToken,
    role: getRoleFromAccessToken(nextTokens.accessToken),
  };
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(AUTH_ACCESS_COOKIE);
  response.cookies.delete(AUTH_REFRESH_COOKIE);
  response.cookies.delete(AUTH_ROLE_COOKIE);
}

function setSessionCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  role: UserRole | null,
) {
  response.cookies.set(AUTH_ACCESS_COOKIE, accessToken, getSessionCookieOptions());
  response.cookies.set(AUTH_REFRESH_COOKIE, refreshToken, getSessionCookieOptions());

  if (role) {
    response.cookies.set(AUTH_ROLE_COOKIE, role, getSessionCookieOptions());
  } else {
    response.cookies.delete(AUTH_ROLE_COOKIE);
  }
}

async function handleRequest(request: NextRequest) {
  if (!getConfiguredApiOrigin()) {
    return NextResponse.json(
      {
        success: false,
        message: "Backend API base URL is not configured.",
      },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const pathname = request.nextUrl.pathname;
  const hasPublicAuthPath = PUBLIC_AUTH_PATHS.has(pathname);
  const accessToken = cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null;

  let backendResponse = await forwardToBackend(request, hasPublicAuthPath ? null : accessToken);

  if (
    backendResponse.status === 401 &&
    !hasPublicAuthPath &&
    pathname !== "/api/Authentication/revoke"
  ) {
    const refreshedSession = await refreshServerSession();

    if (refreshedSession) {
      backendResponse = await forwardToBackend(request, refreshedSession.accessToken);

      const responseBody = await backendResponse.arrayBuffer();
      const response = new NextResponse(responseBody, {
        status: backendResponse.status,
        headers: {
          "content-type": backendResponse.headers.get("content-type") ?? "application/json",
        },
      });

      setSessionCookies(
        response,
        refreshedSession.accessToken,
        refreshedSession.refreshToken,
        refreshedSession.role,
      );

      return response;
    }
  }

  const contentType = backendResponse.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await backendResponse.json()) as TokenEnvelope;
    const response = NextResponse.json(payload, {
      status: backendResponse.status,
    });

    if (pathname === "/api/Authentication/login" || pathname === "/api/Authentication/refresh") {
      const nextTokens = extractTokens(payload);
      const role = nextTokens.accessToken ? getRoleFromAccessToken(nextTokens.accessToken) : null;

      if (backendResponse.ok && nextTokens.accessToken && nextTokens.refreshToken) {
        const sanitizedResponse = NextResponse.json(sanitizeTokenPayload(payload, role), {
          status: backendResponse.status,
        });
        setSessionCookies(sanitizedResponse, nextTokens.accessToken, nextTokens.refreshToken, role);
        return sanitizedResponse;
      }

      clearSessionCookies(response);
      return response;
    }

    if (pathname === "/api/Authentication/revoke" && backendResponse.ok) {
      clearSessionCookies(response);
    }

    if (backendResponse.status === 401) {
      clearSessionCookies(response);
    }

    return response;
  }

  const responseBody = await backendResponse.arrayBuffer();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "content-type": contentType || "application/octet-stream",
    },
  });

  if (backendResponse.status === 401) {
    clearSessionCookies(response);
  }

  return response;
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}
