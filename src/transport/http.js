/**
 * Thin layer on top of the global fetch object to make
 * HTTP requests
 */
export default class Http {

  post(headers, url, body) {
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
  }

  get(headers, url) {
    return fetch(url, {
      method: 'GET',
      headers: headers
    });
  }

  put(headers, url, body) {
    return fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body)
    });
  }

  delete(headers, url) {
    return fetch(url, {
      method: 'DELETE',
      headers: headers
    });
  }
}
