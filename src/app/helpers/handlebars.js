module.exports = {
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'oi oi-elevator',
            asc: 'oi oi-sort-ascending',
            desc: 'oi oi-sort-descending',
        };

        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        };

        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}">
          <span class="${icon}"></span>
        </a>`;
    },
    isAdmin: (user, options) => {
        if (user && user.role === 'admin') {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    eq: (a, b) => {
        if (!a || !b) return false;
        return a.toString() === b.toString();
    },
    includes: (arr, val) => {
        if (!arr || !Array.isArray(arr)) return false;
        return arr.some(item => item.toString() === val.toString());
    }
};
