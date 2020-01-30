const devDomain = "https://test-github-oauth.firebaseapp.com"
const prodDomain = "https://libstack-prod.firebaseapp.com"

function getAPIDomain() {
    if (process.env.NODE_ENV === 'production') {
        console.log('connecting to prod...');
        return prodDomain;
    }

    console.log('connecting to local...')
    return devDomain;
}

export default getAPIDomain;
