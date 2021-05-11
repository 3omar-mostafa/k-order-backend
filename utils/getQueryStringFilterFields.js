module.exports = (queryStringObject) => {
	const filteredQueryStringObject = {
		...queryStringObject,
	};
	const excludedFields = ["page", "sort", "limit", "fields"];
	excludedFields.forEach((el) => delete filteredQueryStringObject[el]);
	return filteredQueryStringObject;
};
