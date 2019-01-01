function _curry(fn) {
	return function (a, b) {
		return arguments.length === 2 ? fn(a, b) : function(b){ return fn(a, b); };
	}
}

function _curryr(fn) {
	return function (a, b) {
		return arguments.length === 2 ? fn(a, b) : function (b) { return fn(b, a); };
	};
}

var _get = _curryr(function(obj, key) {
	return obj == null ? undefined : obj[key];
});


function _filter(list, predi) {
	var new_list = [];

	_each(list, function(val){
		if (predi(val)) new_list.push(val)
	});

	return new_list;
}

function _map(list, mapper){
	var new_list = [];

	_each(list, function(val, key){
		new_list.push(mapper(val, key));
	});

	return new_list;
}

var _length = _get("length");

function _each(list, iter) {
	var keys = _keys(list);
	for (var i = 0, len = keys.length; i < len; i++){
		iter(list[keys[i]], keys[i]);
	}
	return list
}

var _map = _curryr(_map),
	_filter = _curryr(_filter);

var _slice = Array.prototype.slice;

function _rest(list, num) {
	return _slice.call(list, num || 1 );
}

function _reduce(list, iter, memo) {
	/* 내방식
	memo = memo === undefined ? 0 : memo;
	*/
	if (arguments.length == 2) {
		memo = list[0];
		list = _rest(list);
	}
	_each(  list
		, function (val) { memo = iter(memo, val);}
	);
	return memo;
}

function _pipe() {
	var fns = arguments;
	return function (arg) {
		return _reduce(fns
			, function (arg, fn) { return fn(arg); }
			, arg
		);
	};
}

function _go(arg) {
	var fns = _rest(arguments);
	return _pipe.apply(null, fns)(arg);
}

function _is_object(obj) {
	return typeof obj == 'object' && !!obj;
}

function _keys(obj) {
	return _is_object(obj) ? Object.keys(obj) : [];
}

var _values = _map(_identity);

function _identity(val) {
	return val;
}

function _pluck(data, key) {
	return _map(data, _get(key));
}

function _negate(func) {
	return function (val) {
		return !func(val);
	}
}

var _reject = _curryr(function (list, predi) {
	return _filter(list, _negate(predi));
});

var _compact = _filter(_identity);

var _find = _curryr(function (list, predi) {
	var keys = _keys(list);
	// console.log("keys", keys);
	for (var i = 0, len = keys.length; i < len; i++){
		var val = list[keys[i]];
		if(predi(val)) return val;
	}
});

var _find_index = _curryr(function (list, predi) {
	var keys = _keys(list);
	for (var i = 0, len = keys.length; i < len; i++){
		if(predi(list[keys[i]])) return i;
	}
	return -1;
});

function _some(data, predi) {
	return _find_index(data, predi || _identity ) !== -1;
}

function _every(data, predi) {
	return _find_index(data, _negate(predi || _identity) ) === -1 ;
}

function _min(data) {
	return _reduce(data, function (a, b) {
		return a < b ? a : b
	});
}

function _max(data) {
	return _reduce(data, function (a, b) {
		return a > b ? a : b
	});
}

function _min_by(data, iter) {
	return _reduce(data, function (a, b) {
		return iter(a) < iter(b) ? a : b;
	});
}

function _max_by(data, iter) {
	return _reduce(data, function (a, b) {
		return iter(a) > iter(b) ? a : b;
	});
}

var _min_by = _curryr(_min_by),
	_max_by = _curryr(_max_by);

function _push(obj, key, val) {
	(obj[key] = obj[key] || [] ).push(val);
	return obj;
}

var _group_by = _curryr(function (data, iter) {
	return _reduce(data, function (grouped, val) {
		return _push(grouped, iter(val), val);
	}, {});
});

var _head = function (list) {
	return list[0];
};

var _inc = function (count, key) {
	count[key] ? count[key]++ : count[key] = 1;
	return count;
};

var _count_by = _curryr(function (data, iter) {
	return _reduce(data, function (count, val) {
		return _inc(count, iter(val));
	}, {});
});

var _pairs = _map((val, key) => [key, val]);
