function setTokenCookie(res, token)
{
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        // Date.now() - milliseconds from 01.01.1970
        expires: new Date(Date.now() + 7*24*60*60*1000) // One week 604 800 000ms
    };
    res.cookie('refreshToken', token, cookieOptions);
}

module.exports = setTokenCookie;
