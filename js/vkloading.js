import { renderFriends } from '../src/index';

let loadVkFriends = () => {
	VK.init({
		apiId: 6490087
	});

	function auth() {
		return new Promise((resolve, reject) => {
			VK.Auth.login(data => {
				if (data.session) {
					resolve();
				} else {
					reject(new Error('Не удалось авторизоваться'));
				}
			}, 2);
		});
	}

	function callAPI(method, params) {
		params.v = '5.76';

		return new Promise((resolve, reject) => {
			VK.api(method, params, (data) => {
				if (data.error) {
					reject(data.error);
				} else {
					resolve(data.response);
				}
			});
		})
	}

	(async () => {
		try {
			await auth();
			const friends = await callAPI('friends.get', { fields: 'photo_50' });
			renderFriends(friends.items);
			friendsVk = friends.items;
		} catch (e) {
			console.error(e);
		}
	})();
};

export { 
	loadVkFriends
};