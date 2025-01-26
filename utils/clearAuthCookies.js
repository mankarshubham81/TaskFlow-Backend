// utils/clearAuthCookies.js

/**
 * Clears authentication cookies from the response
 * @param {import('express').Response} res Express response object
 */
 const clearAuthCookies = (res) => {
    // Clear access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  };
  
  export default clearAuthCookies;