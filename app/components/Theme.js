import {
	brantreatBlue50, brandtreatBlue200,
	brandtreatBlue400, brandtreatBlue700,
	blue300, blue500, blue700,
	grey100, grey300, grey500,
	lime200,
	pinkA200,
	lightBlack, darkBlack,
	white
} from 'material-ui/styles/colors'
import { fade } from 'material-ui/utils/colorManipulator'
import Spacing from 'material-ui/styles/spacing'
import zIndex from 'material-ui/styles/zIndex'

export default {
	componentThemes: {
		appBar: {
			color: brandtreatBlue700,
			textColor: white,
			zIndex: 1
		}
	},
	spacing: Spacing,
	zIndex: {
		leftNav: 900,
		leftNavOverlay: 800
	},
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: blue500,
		primary2Color: blue700,
		primary3Color: lightBlack,
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: grey500,
		textColor: lightBlack,
		alternateTextColor: white,
		canvasColor: white,
		borderColor: grey300,
		disabledColor: fade(darkBlack, 0.3),
		pickerHeaderColor: blue500,
		clockCircleColor: lime200,
	}
};