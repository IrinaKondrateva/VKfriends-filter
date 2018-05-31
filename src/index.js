import { friendTemplate } from '../js/template';

let friendsVk;
let friendsSelected = [];
const vkFriends = document.querySelector('.friends__list_vk');
const selectFriends = document.querySelector('.friends__list_selected');
const vkInput = document.getElementsByName('search_not-selected')[0];
const selectedInput = document.getElementsByName('search_selected')[0];
const saveBtn = document.querySelector('.filter__save__btn');

// загрузка друзей из Вк

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

document.addEventListener("DOMContentLoaded", (e) => {
	if (localStorage.length > 1) {
		try {
			friendsVk = JSON.parse(localStorage['vkFriends']);
			friendsSelected = JSON.parse(localStorage['selectFriends']);
		} catch (e) {
			console.error(e);
		};
		renderFriends(friendsVk);
		renderFriends(friendsSelected, true);
	} else {
		loadVkFriends();
	};
});

// сортировка друзей по именам

document.addEventListener('input', (e) => {
	if (!e.target.closest('.search__input')) return;

	const { value } = e.target.closest('.search__input');
	
	if (e.target.name == 'search_not-selected') {
		const filteredFr = filterFrByName(friendsVk, value);
		renderFriends(filteredFr);
	} else {
		const filteredFr = filterFrByName(friendsSelected, value);
		renderFriends(filteredFr, true);
	}
});

// добавление/удаление друзей из списка избранных

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

	renderFrDueInput();
});

// сохранение списков в localStorage

saveBtn.addEventListener('click', (e) => {
	if (!confirm('Подтвердите сохранение списков')) return;
	localStorage.setItem('selectFriends', JSON.stringify(friendsSelected));
	localStorage.setItem('vkFriends', JSON.stringify(friendsVk));
});

// Drag&Drop HTML5

(() => {
	let currentDrag;

	document.addEventListener('dragstart', (e) => {
		const zone = getCurrentZone(e.target);

		if (zone) {
			currentDrag = {startZone: zone, node: e.target};
		};
	});

	document.addEventListener('dragover', (e) => {
		const zone = getCurrentZone(e.target);

		if (zone) {
			e.preventDefault();
		};
	});

	document.addEventListener('drop', (e) => {
		if (currentDrag) {
			const zone = getCurrentZone(e.target);

			e.preventDefault();

			if (zone && currentDrag.startZone !== zone) {
				const addtrigger = currentDrag.node.querySelector('.friends__add');
				
				if (e.target.closest('.friends__item')) {
					const dndtrigger = +e.target.closest('.friends__item').querySelector('.friends__remove').dataset.id;

					shiftFriend(friendsVk, friendsSelected, addtrigger, dndtrigger);
				} else {
					shiftFriend(friendsVk, friendsSelected, addtrigger);
				};

				renderFrDueInput();
			};

		currentDrag = null;
		};
	});

	function getCurrentZone(from) {
		return from.closest('.friends__list');
	}
})();

function renderFriends(friends, selected) {
	let friendsHtml = '';

	selected ? selectFriends.innerHTML = '' : vkFriends.innerHTML = '';

	for (const friend of friends) {
		friendsHtml += friendTemplate(friend);
	}

	selected ? selectFriends.innerHTML = friendsHtml : vkFriends.innerHTML = friendsHtml;
}

function renderFrDueInput() {
	if (vkInput.value || selectedInput.value) {
		renderFriends(filterFrByName(friendsVk, vkInput.value));
		renderFriends(filterFrByName(friendsSelected, selectedInput.value), true);
	} else {
		renderFriends(friendsVk);
		renderFriends(friendsSelected, true);
	};
}

function filterFrByName(friendsArr, name) {
	return friendsArr.filter(friend => {
		let fullName = `${friend.first_name} ${friend.last_name}`;
		return fullName.toLowerCase().includes(name.toLowerCase());
	});
}

function shiftFriend(from, to, trigger, dndId) {
	for (let i = 0; i < from.length; i++) {
		if (from[i].id == trigger.dataset.id) {
			let friendShifted = from.splice(i, 1)[0];

			friendShifted.selected = !friendShifted.selected;
			
			if (dndId) {
				for (let j = 0; j < to.length; j++) {
					if (to[j].id === dndId) {
						to.splice(j + 1, 0, friendShifted);
						return;
					}
				};
			} else {
				to.push(friendShifted);
			}

			return;
		};
	};
}

document.addEventListener('click', (e) => {
	if (!e.target.closest('.close')) return;
	document.querySelector('.dialog__wrapper').classList.add('hidden');
});
