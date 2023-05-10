'use strict';

const {
	log
} = require("console");

const db = uniCloud.database()
exports.main = async (event, context) => {
	const goodsIds = await db.collection('shopping_cart').where({
		userName: event.userName
	}).get();
	if (!goodsIds.data.length) return {
		code: -1,
		msg: '没有查到该用户数据'
	}
	return {
		code: 0,
		data: goodsIds.data[0].list,
		msg: '获取成功'
	}
};