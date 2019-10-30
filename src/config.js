const devConfig = {
    apiKey: "AIzaSyAIA_DEmS9QjdT-ULQGvuIhXEk45VH3fkQ",
    authDomain: "test-github-oauth.firebaseapp.com",
    databaseURL: "https://test-github-oauth.firebaseio.com",
    projectId: "test-github-oauth",
    storageBucket: "test-github-oauth.appspot.com",
    messagingSenderId: "677857035519",
    appId: "1:677857035519:web:35d5ad2f6b65f6df96b8ca",
    measurementId: "G-6129N1XZE9"
}

const prodConfig = {
    apiKey: "AIzaSyCBHGrzG2piFYy4nZuAWyWk-V6hnethnlo",
    authDomain: "libstack-prod.firebaseapp.com",
    databaseURL: "https://libstack-prod.firebaseio.com",
    projectId: "libstack-prod",
    storageBucket: "libstack-prod.appspot.com",
    messagingSenderId: "332957280897",
    appId: "1:332957280897:web:b611d9d136c8d875163b80",
    measurementId: "G-Z1JCB296GT"
}

function config() {
    if (process.env.NODE_ENV === 'production') {
        console.log('connecting to prod...');
        return prodConfig;
    }

    console.log('connecting to local...')
    return devConfig;
}

export default config;
