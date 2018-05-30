import { friendTemplate } from '../js/template';

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

/*auth()
	.then(() => {
		return callAPI('friends.get', { fields: 'photo_50' });
	})
	.then(friends => {
		friendsVk = friends.items;
		renderFriends(friends.items);
	})
	.catch(e => {
		console.warn(e);
	});*/

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

var friendsVk = [];
var friendsSelected = [];
const vkFriends = document.querySelector('.friends__list_vk');
const selectFriends = document.querySelector('.friends__list_selected');

function renderFriends(friends, selected) {
	let friendsHtml = '';

	selected ? selectFriends.innerHTML = '' : vkFriends.innerHTML = '';

	for (const friend of friends) {
		friendsHtml += friendTemplate(friend);
	}

	selected ? selectFriends.innerHTML = friendsHtml : vkFriends.innerHTML = friendsHtml;
}

document.addEventListener('input', (e) => {
	if (!e.target.closest('.search__input')) return;

	const { value } = e.target.closest('.search__input');
	
	if (e.target.name == 'search_not-selected') {
		filterFrByName(friendsVk);
		renderFriends(filteredFr)
	} else {
		filterFrByName(friendsSelected);
		renderFriends(filteredFr, true);
	}
});

function filterFrByName(friendsArr) {
	return filteredFr = friendsArr.filter(friend => {
		let fullName = `${friend.first_name} ${friend.last_name}`;
		return fullName.toLowerCase().includes(value.toLowerCase());
	});
}

document.addEventListener('click', (e) => {
	const addOrRemove = (e.target.closest('.friends__remove') || e.target.closest('.friends__add'));
	
	if (!addOrRemove) return;

	e.preventDefault();

	if (addOrRemove.classList.contains('friends__add')) {
		shiftFriend(friendsVk, friendsSelected, addOrRemove);
	} else {
		shiftFriend(friendsSelected, friendsVk, addOrRemove);
		friendsVk = friendsVk.sort((a, b) => a.id - b.id);
	};

	renderFriends(friendsVk);
	renderFriends(friendsSelected, true);
});

function shiftFriend(from, to, trigger) {
	for (let i = 0; i < from.length; i++) {
		if (from[i].id == trigger.dataset.id) {
			let friendShifted = from.splice(i, 1)[0];
			friendShifted.selected = !friendShifted.selected;
			to.push(friendShifted);
			return;
		};
	};
}	


/*document.addEventListener('click', (e) => {
	if (!e.target.closest('.friends__remove')) return;

	e.preventDefault();
	for (let i = 0; i < friendsSelected.length; i++) {
		if (friendsSelected[i].id == e.target.closest('.friends__remove').dataset.id) {
			let friendDelete = friendsSelected.splice(i, 1)[0];
			friendDelete.selected = false;
			friendsVk.push(friendDelete); //отсортировать по айдишкам
		}
	}
	let frVkSortById = friendsVk.sort((a, b) => a.id - b.id);
	renderFriends(frVkSortById);
	renderFriends(friendsSelected, true);	
});*/
