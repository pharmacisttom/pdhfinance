import { NextResponse } from 'next/server';

export interface ApiResponseSuccess<T = any> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface ApiResponseError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiResponseSuccess<T> | ApiResponseError;

export function apiSuccess<T>(data: T, meta?: ApiResponseSuccess<T>['meta'], status = 200) {
  return NextResponse.json<ApiResponseSuccess<T>>(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function apiError(message: string, code = 'BAD_REQUEST', status = 400, details?: any) {
  return NextResponse.json<ApiResponseError>(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}
