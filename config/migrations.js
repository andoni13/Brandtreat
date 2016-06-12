module.exports = {
	development: {
		schema: { 'migration': {} },
		modelName: 'Migration',
		// db: 'mongodb://localhost/brandtreat-dev'
		db: 'mongodb://brandtreat:brandtreat@ds049211.mlab.com:49211/dispatch-social'
	},
	test: {
		schema: { 'migration': {} },
		modelName: 'Migration',
		// db: 'mongodb://localhost/brandtreat-test'
		db: 'mongodb://brandtreat:brandtreat@ds049211.mlab.com:49211/dispatch-social'
	},
	production: {
		schema: { 'migration': {} },
		modelName: 'Migration',
		// db: 'mongodb://localhost/brandtreat'
		db: 'mongodb://brandtreat:brandtreat@ds049211.mlab.com:49211/dispatch-social'
	}
}