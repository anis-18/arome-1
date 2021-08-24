import { StyleSheet, Dimensions } from 'react-native';

//import { useFonts } from 'expo-font';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
/*
const [loaded] = useFonts({
	OpenSansRegular: require('../../Fonts/OpenSans-Regular.ttf'),
	OpenSansLight: require('../../Fonts/OpenSans-Light.ttf'),
	OpenSansBold: require('../../Fonts/OpenSans-Bold.ttf'),
});
*/
export default StyleSheet.create({
	mt_1: {
		marginTop: 5
	},
	mt_2: {
		marginTop: 10
	},
	mt_3: {
		marginTop: 15
	},
	mb_1: {
		marginBottom: 5
	},
	mb_2: {
		marginBottom: 10
	},
	mb_3: {
		marginBottom: 15
	},
	mainBody: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
	},
	headerTitle: {
		fontWeight: "bold",
		fontSize: 20
	},
	nopage: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		alignSelf: 'center',
		alignContent: 'center',
		backgroundColor: '#fff',
		justifyContent: "center",
		alignItems: 'center',
	},
	nopageText: {
		fontSize: 16,
		color: '#888',
		alignSelf: 'center',
	},
	nopost: {
		flex: 1,
		width: windowWidth,
		height: windowHeight / 1.6,
		alignSelf: 'center',
		alignContent: 'center',
		backgroundColor: '#fff',
		justifyContent: "center",
		alignItems: 'center',
	},
	nopostText: {
		fontSize: 16,
		color: '#888',
		alignSelf: 'center',
		marginTop: 50
	},
	loading: {
		flex: 1,
		width: '100%',
		alignSelf: 'center',
		alignContent: 'center',
		justifyContent: "center",
		alignItems: 'center',
		marginVertical: 5
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
		backgroundColor: '#23282d',
	},
	button: {
		backgroundColor: '#D4834A',
		color: '#ffffff',
		height: 45,
		paddingHorizontal: 15,
		borderRadius: 40,
		overflow: 'hidden'
	},
	buttonGray: {
		height: 45,
		borderRadius: 40,
		overflow: 'hidden',
		backgroundColor: '#f6f6f6',
	},
	buttonBorder: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderWidth: 2,
		borderColor: '#D4834A',
		borderRadius: 30,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center'
	},
	buttonBorderText: {
		color: '#333',
		fontWeight: 'bold',
		fontSize: 16
	},
	buttonCount: {
		width: 30,
		height: 30,
		paddingHorizontal: 0
	},
	sectionStyle: {
		marginLeft: 35,
		marginRight: 35,
	},
	buttonStyle: {
		backgroundColor: '#D4834A',
		marginLeft: 35,
		marginRight: 35,
		height: 45,
		borderRadius: 40,
		overflow: 'hidden'
	},
	buttonTitleStyle: {
		color: '#FFFFFF'
	},
	buttonMini: {
		backgroundColor: '#D4834A',
		height: 35,
		borderRadius: 30,
		overflow: 'hidden'
	},
	buttonMiniTitle: {
		fontSize: 13
	},
	iconInput: {
		position: 'absolute',
		zIndex: 2,
		paddingHorizontal: 15,
		paddingVertical: 12
	},
	iconInputRight: {
		position: 'absolute',
		right: 5,
		zIndex: 2,
		paddingHorizontal: 15,
		paddingVertical: 12
	},
	inputPaddingLeft: {
		paddingLeft: 50
	},
	inputPaddingRight: {
		paddingLeft: 50
	},
	inputStyle: {
		color: '#333',
		height: 50,
		paddingHorizontal: 15,
		borderWidth: 0.5,
		borderRadius: 8,
		borderColor: '#8D8D8D',
		backgroundColor: '#ffffff',
		fontSize: 16,
		marginBottom: 15,
		width: '100%'
	},
	textarea: {
		color: '#333',
		paddingHorizontal: 15,
		borderWidth: 0.5,
		borderRadius: 8,
		borderColor: '#8D8D8D',
		backgroundColor: '#ffffff',
		fontSize: 16,
		marginBottom: 15,
		width: '100%'
	},
	inputTextStyle: {
		color: '#8D8D8D'
	},
	registerTextStylePolice: {
		color: '#7B8794',
		textAlign: 'center',
		fontSize: 14,
		alignSelf: 'center',
		marginTop: 15
	},

	successTextStyle: {
		textAlign: 'center',
		fontSize: 19,
		paddingHorizontal: 10,
		fontWeight: 'bold',
		paddingVertical: 20,
	},
	successTextDescStyle: {
		textAlign: 'center',
		fontSize: 17,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},

	modalView: {
		backgroundColor: "#ffffff",
	},
	modalContent: {
		padding: 25,
		minHeight: '30%'
	},
	modalBottom: {
		paddingHorizontal: 25,
		alignItems: 'flex-end',
		alignSelf: 'flex-end'
	},
	//Общий стиль
	body: {
		flex: 1,
		backgroundColor: '#fff'
	},
	h2: {
		fontSize: 20,
		fontWeight: 'bold',
		paddingBottom: 10
	},
	p: {
		paddingBottom: 10
	},
	main: {
		paddingHorizontal: 15,
	},
	form_group: {
		paddingBottom: 15
	},
	form_label: {
		paddingBottom: 10,
		fontSize: 15,
		fontWeight: 'normal'
	},
	form_small: {
		paddingTop: 10,
		fontSize: 13,
		color: '#999'
	},
	input: {
		color: '#333',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#ffffff',
		fontSize: 16,
	},
	textarea: {
		textAlignVertical: 'top',
		justifyContent: "flex-start",
		minHeight: 70,
		maxHeight: 250,
		color: '#333',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#ffffff',
		fontSize: 16,
	},
	statusOnline: {
		alignItems: 'center',
		paddingLeft: 4,
	},
	iconMenuLeft: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginLeft: 5
	},
	iconMenuRight: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginRight: 5
	},
	textMenuRight: {
		paddingHorizontal: 15,
		paddingVertical: 5,
		marginTop: 10,
		marginRight: 10,
		backgroundColor: '#f05f5f',
		color: '#ffffff',
		fontWeight: 'bold',
		borderRadius: 20
	},
	//Кнопка новой записи
	btnNewPost: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		backgroundColor: '#fff',
		borderRadius: 8,
		margin: 7,
		flexDirection: 'row',
		alignItems: 'center',
	},
	btnNewPostIcon: {
		color: '#54a6ff',
		marginRight: 10,
		fontWeight: 'bold'
	},
	btnNewPostText: {
		color: '#54a6ff',
		fontWeight: 'bold',
		fontSize: 16
	},

	//Окно меню (Разделы)
	menuBoxHeader: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: 30
	},
	menuHeaderItem: {
		paddingVertical: 12,
		margin: '1%',
		width: '31.33%',
		borderRadius: 8,
		alignItems: 'center',
		backgroundColor: '#f6f6f6'
	},
	menuBoxHeaderIcon: {
		fontSize: 32,
		alignSelf: 'center'
	},
	menuBoxHeaderText: {
		alignSelf: 'center',
		fontSize: 16
	},

	//Фиксированное поле внизу
	fixedInputBottom: {
		flex: 1,
		position: 'absolute',
		zIndex: 2,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#eee',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	fixedInput: {
		textAlignVertical: 'top',
		justifyContent: "flex-start",
		maxHeight: 70,
		color: '#333',
		paddingHorizontal: 15,
		paddingVertical: 10,
		fontSize: 16,
	},
	fixedInputBottomBox1: {
		flex: 1,
		justifyContent: "flex-start",
	},
	fixedInputBottomBox2: {
		justifyContent: "flex-end",
		alignSelf: 'flex-end',
		width: 60,
		padding: 6,
	},

	//Поиск
	searchInput: {
		backgroundColor: '#fff',
	},
	searchContainerInput: {
		backgroundColor: '#fff',
	},
	searchContainer: {
		backgroundColor: '#fff',
		borderBottomWidth: 0,
		borderTopWidth: 0,
		shadowColor: '#333',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
		elevation: 5,
	},

	//Редактор
	bodyRedact: {
		backgroundColor: '#ffffff',
	},
	redactTextarea: {
		textAlignVertical: 'top',
		justifyContent: 'flex-start',
		minHeight: '100%',
		maxHeight: '100%',
		color: '#333',
		paddingHorizontal: 15,
		paddingTop: 15,
		borderWidth: 0,
		backgroundColor: '#ffffff',
		fontSize: 22,
		fontWeight: '100'
	},


	//Уведомления
	newNotification: {
		backgroundColor: '#f6fbff'
	},

	//Меню в читалке
	readMenu: {
		flexDirection: 'row',
	},

	//Теги книги
	badgeTagsBox: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 10,
	},
	badgeTags: {
		backgroundColor: '#eee',
		marginRight: 5,
		marginBottom: 7,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 30,
	},
	badgeTagsText: {
		color: '#333'
	},
	//Карточка ленты
	user_name: {
		fontWeight: 'bold',
	},
	textLink: {
		color: '#54a6ff'
	},
	postImageBox: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	postImage: {
		width: '33.32%',
		height: 130,
	},

	//Профиль
	profileBody: {
		paddingTop: 15,
		flex: 1,
		backgroundColor: '#fff'
	},
	profileHeader: {
		paddingTop: 15,
		backgroundColor: '#fff'
	},
	profileContainer: {
		paddingHorizontal: 15,
	},
	profileContainerState: {
		paddingHorizontal: 5
	},


	profileHeaderBoxStat: {
		padding: 10,
		alignItems: 'center',

	},
	profileHeaderBoxStatText: {
		fontSize: 22,
		fontWeight: 'bold',
	},

	//Verse list
	verseBox: {
		padding: 15,
		borderRadius: 8,
		borderColor: '#eee',
		borderWidth: 1,
		marginHorizontal: 5,
		marginVertical: 8
	},
	verseBoxTitle: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	verseBoxAuthor: {
		fontSize: 14,
		color: '#999'
	},
	verseBoxText: {
		fontSize: 16,
		marginBottom: 5,
	},

	//Book list
	bookList: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 15,
		borderBottomColor: '#eee',
		borderBottomWidth: 1,
	},
	bookImage: {
		width: 80,
		height: 105,
		borderRadius: 8,
	},
	bookImageCarousel: {
		width: '100%',
		height: 150,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	categoryImageCarousel: {
		width: '100%',
		height: 180,
		borderRadius: 8,
	},
	bookListLabel: {
		fontSize: 18,
		paddingHorizontal: 15,
		paddingTop: 20
	},
	bookListContent: {
		paddingHorizontal: 10,
		paddingRight: 20,
		flex: 1,
		flexWrap: 'nowrap',
	},
	bookListTitle: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	bookListDesc: {
		color: '#888'
	},
	theend1: {
		color: '#15c115'
	},
	theend2: {
		color: '#1978cc'
	},

	//Статистика книг мини карта
	staticBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 5
	},
	staticBoxText: {
		fontSize: 13,
		paddingRight: 2
	},

	checkbox: {
		paddingVertical: 5,
		paddingHorizontal: 0,
		backgroundColor: 'transparent',
		borderWidth: 0,
		fontWeight: 'normal'
	},
	checkboxBox: {
		paddingLeft: 10
	},
	checkboxTitle: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	checkboxDesc: {
		fontSize: 13,
		color: '#999'
	},
	//Карусель книг
	carouselBox: {
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	carouselItemBox: {
		backgroundColor: '#ffffff',
		shadowColor: "#333",
		position: 'relative',
		overflow: 'hidden',
		borderRadius: 8,
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 6,
	},
	carouselItem: {
		width: 125,
		marginHorizontal: 6,
		marginBottom: 10,
	},

	//Book Full page
	fonBookImage: {
		resizeMode: "cover",
		justifyContent: "center",
		backgroundColor: '#23282d',
		height: 230,
	},

});