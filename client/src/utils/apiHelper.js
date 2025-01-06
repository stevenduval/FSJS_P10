export const api = (obj) => {
    // destructure incoming obj param
    const { path, method, body, credentials } = obj;

    // set default url format we can use in fetch request
    const url = 'http://localhost:5000/api/' + path;

    // set options object
    const options = {
        method,
        headers: {}
    }

    // if body is passed to the api
    if (body) {
        // set body on options as a JSON string
        options.body = JSON.stringify(body);
        // set headers for content being passed into body
        options.headers['Content-Type'] = "application/json; charset=utf-8"
    }

    // if credentials are passed to api
    if (credentials) {
        // base64 encode credentials
        const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
        // set authorization header
        options.headers.Authorization = `Basic ${encodedCredentials}`;
        
    }

    // return fetch method to execute
    return fetch(url, options);
}