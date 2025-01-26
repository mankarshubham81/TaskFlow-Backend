const setTokensCookies = (res, accessToken, refreshToken, newAccessTokenExp, newRefreshTokenExp) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
    maxAge: 0
  };

  // Access Token
  cookieOptions.maxAge = (newAccessTokenExp - Math.floor(Date.now()/1000)) * 1000;
  res.cookie('accessToken', accessToken, cookieOptions);

  // Refresh Token
  cookieOptions.maxAge = (newRefreshTokenExp - Math.floor(Date.now()/1000)) * 1000;
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // is_auth flag (if required)
  res.cookie('is_auth', true, {
    ...cookieOptions,
    httpOnly: false // Only if client-side needs to read it
  });
};

export default setTokensCookies;