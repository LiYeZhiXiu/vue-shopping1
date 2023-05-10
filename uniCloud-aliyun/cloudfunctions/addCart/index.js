'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const cartInDB = await db.collection('shopping_cart').where({
		userName: event.userName
	}).get()
	let addCartResult = {}
	let pushResult = {}
	let addCountResult = {}
	if (cartInDB.data && cartInDB.data.length === 0) {
		addCartResult = await db.collection('shopping_cart').add({
			userName: event.userName,
			list: [event.goods]
		});
	} else {
		const goods = cartInDB.data[0].list.filter((x, i) => {
			return x.gid == event.goods.gid && x.pid == event.goods.pid
		})
		if (goods.length == 0) {
			pushResult = await db.collection('shopping_cart').doc(cartInDB.data[0]._id).update({
				list: dbCmd.push(event.goods)
			})
		} else if (goods.length == 1) {
			cartInDB.data[0].list.forEach(x => {
				if (x.gid == event.goods.gid && x.pid == event.goods.pid) {
					x.count += event.goods.count
				}
			})
			addCountResult = await db.collection('shopping_cart').doc(cartInDB.data[0]._id).update({
				list: cartInDB.data[0].list
			})
		}
	}
	if (addCartResult.inserted == 1 || addCartResult.updated === 1 || pushResult.updated === 1 || addCountResult
		.updated === 1) {
		return {
			status: 0,
			msg: '添加购物车成功'
		}
	}

	return {
		status: -1,
		msg: '添加购物车失败，请稍后重试',
		cartInDB
	}
};
