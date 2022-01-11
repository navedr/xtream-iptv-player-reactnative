import buildUrl from '../utils/buildUrl';

function login(url, username, password) {
  try {
    return fetch(buildUrl(url + '/player_api.php', { username, password }), { method: 'GET' })
    .then((response) => {
      if (!response.ok) {
        console.log(`Response status ${response.status}`);
      }

      const contentType = response.headers.get('content-type');

      if (!contentType || contentType.indexOf('application/json') === -1) {
        console.log('Response is not json');
      }

      return response.json();
    });
  } catch (error) {
    console.log(error);
  }
}

export default login;
