import buildUrl from '../utils/buildUrl';

export function getSeriesCategories(url: string, username: string, password: string, category_id: string) {
	try {
		return fetch(buildUrl(url + '/player_api.php', {
			username, password, action: 'get_series', category_id,
		}), { method: 'GET' })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Response status ${response.status}`);
				}

				const contentType = response.headers.get('content-type');

				if (!contentType || contentType.indexOf('application/json') === -1) {
					throw new Error('Response is not json');
				}

				return response.json();
			});
	} catch (error) {
		throw new Error(error);
	}
}

export function getSeries(url, username, password, series_id) {
	try {
		return fetch(buildUrl(url + '/player_api.php', {
			username, password, action: 'get_series_info', series_id,
		}), { method: 'GET' })
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
