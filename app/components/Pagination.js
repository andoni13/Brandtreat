// React
import React, { Component } from 'react'
// Components
// import FlatButton from '../components/FlatButtonNew'
// Material-ui Components
import FlatButton from 'material-ui/FlatButton'
import TableFooter from 'material-ui/Table/TableFooter'
import TableRow from 'material-ui/Table/TableRow'
import TableRowColumn from 'material-ui/Table/TableRowColumn'
// Icons
import MdChevronRight from 'react-icons/lib/md/chevron-right'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
// Extras
import { translate } from '../utils'

const styles = {
	footerContent: {
		float: 'right',
		paddingRight: 14
	},
	footerText: {
		float: 'right',
		paddingTop: 16,
		height: 32
	},
	paginateLeft: {
		minWidth: 24,
		marginRight: 24
	},
	paginateRight: {
		minWidth: 24
	},
	paginateIcon: {
		fontSize: 24
	}
}

class Pagination extends Component {
	render() {
		let offset = this.props.offset
		let total = this.props.elements.length
		let limit = this.props.limit
		return (
			<TableFooter adjustForCheckbox={true}>
				<TableRow>
					<TableRowColumn style={styles.footerContent} >
						<FlatButton style={styles.paginateLeft}
							disabled={offset === 0} 
							onTouchTap={this.props.onPageClick.bind(null, offset - limit)}>
							<MdChevronLeft style={styles.paginateIcon} />
						</FlatButton>
						<FlatButton style={styles.paginateRight}
							disabled={offset + limit >= total}
							onTouchTap={this.props.onPageClick.bind(null, offset + limit)}>
							<MdChevronRight style={styles.paginateIcon} />
						</FlatButton>
					</TableRowColumn>
					<TableRowColumn style={styles.footerText} >
						{Math.min((offset + 1), total) + '-' + Math.min((offset + limit), total) + ` ${translate('of')} ` + total}
					</TableRowColumn>
					<TableRowColumn style={styles.footerText} >
						{this.props.elements.filter(row => row.isSelected).length + ` ${translate('selected')} `}
					</TableRowColumn>
				</TableRow>
			</TableFooter>
		)
	}
}
// <IconButton disabled={offset === 0} onClick={this.props.onPageClick.bind(null, offset - limit)}>
// 	<div>Aqui</div>
// </IconButton>
// <IconButton disabled={offset + limit >= total} onClick={this.props.onPageClick.bind(null, offset + limit)}>
// 	<div>Aqui</div>
// </IconButton>
Pagination.propTypes = {
	offset: React.PropTypes.number.isRequired, // current offset
	elements: React.PropTypes.array.isRequired, // rows
	limit: React.PropTypes.number.isRequired, // num of rows in each page
	onPageClick: React.PropTypes.func // what to do after clicking page number
}

export default Pagination