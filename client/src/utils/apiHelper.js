export const apiHelper = (obj) => {
    const {path, method  } = obj;

    const url = 'http://localhost:5000/api/' + path;

    const options = {
        method,
        headers: {}
    }

    return fetch(url, options);
}