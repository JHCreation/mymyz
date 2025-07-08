import { createCookie } from "@remix-run/node";

/* export const accessTokenCookie = createCookie("accessToken", {
  path: "/", // 전체 경로에 적용
  httpOnly: true, // JS로 접근 불가 (보안)
  secure: false, // HTTPS에서만 사용 (개발 중엔 false로 가능)
  sameSite: "lax", // CSRF 방지 설정
  maxAge: 10, // 1시간 유지
});
 */
export const refreshTokenKey= 'refresh_token';
export const refreshTokenCookie = createCookie(refreshTokenKey, {
    path: "/", // 전체 경로에 적용
    httpOnly: true, // JS로 접근 불가 (보안)
    secure: false, // HTTPS에서만 사용 (개발 중엔 false로 가능)
    sameSite: "lax", // CSRF 방지 설정
    maxAge: 60 * 60 * 24 * 365 * 10, // 1시간 유지
  });