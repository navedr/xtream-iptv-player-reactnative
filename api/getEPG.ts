import buildUrl from '../utils/buildUrl';

function getEPG(url: string, username: string, password: string, stream_id: string) {
	try {
		return fetch(buildUrl(url + '/player_api.php', {
			username, password, action: 'get_short_epg', stream_id, limit: 1,
		}), { method: 'GET' })
			.then((response) => {
				if (!response.ok) {
					throw new Error('getEPG', new Error(`Response status ${response.status}`));
				}

				const contentType = response.headers.get('content-type');

				if (!contentType || contentType.indexOf('application/json') === -1) {
					throw new Error('getEPG', new Error('Response is not json'));
				}

				return response.json();
			});
	} catch (error) {
		throw new Error(error);
	}
}


export default getEPG;
