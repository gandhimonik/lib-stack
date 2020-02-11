const devDomain = "https://test-github-oauth.firebaseapp.com"
const prodDomain = "https://libstack-prod.firebaseapp.com"

function getAPIDomain() {
    if (process.env.NODE_ENV === 'production') {
        return prodDomain;
    }

    return devDomain;
}

export default getAPIDomain;
