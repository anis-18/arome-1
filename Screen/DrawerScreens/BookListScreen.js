// Import React and Component
import * as React from 'react';

//Style global
import styles from '../Components/Style';

import { View, ScrollView ,FlatList, TouchableOpacity , Text, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Icon, Badge } from 'react-native-elements';

import { TabView, TabBar } from 'react-native-tab-view';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const renderTabBar = props => (
  <TabBar
    {...props}
	activeColor='#54a6ff'
	inactiveColor='#666'
    indicatorStyle={{ backgroundColor: '#54a6ff' }}
    style={{ backgroundColor: '#fff' }}
  />
);

export default class BookListScreen extends React.PureComponent {

    constructor(props) {

        super(props);

        this.state = {
			bookListData: (global.bookListData) ? global.bookListData :  false,
			genreListData: (global.bookListGenre) ? global.bookListGenre : false,
			writerListData: (global.bookListWriter) ? global.bookListWriter : false,
			index: 0,
			selectedId: null,
			routes: [
			  { key: 'group', title: 'Подборка' },
			  { key: 'genre', title: 'Жанры' },
			  { key: 'writer', title: 'Теги' },
			],
			activeIndex:0,
  
        }
		
    }

    componentDidMount() {
		this.getData();
	}


	getData() {
		if(!this.state.bookListData){
			fetch(global.site_url, {
			  method: 'POST',
			  body: JSON.stringify({
					form: 'booklist',
					user_id: global.data_user.user_id,
			  })
			})
			  .then((response) => response.json())
			  .then((responseJson) => {

				if (responseJson.status == 1) {
					let list_data = responseJson.data;
					if(list_data){
						this.setState({ bookListData: list_data });
						global.bookListData = list_data;
					}	

				}
			  })
			  .catch((error) => {
				console.error(error);
			  });	
		}		  
    }
	getGenre() {
		if(!this.state.genreListData){
			fetch(global.site_url, {
			  method: 'POST',
			  body: JSON.stringify({
					form: 'booklist',
					terms : false
			  })
			})
			  .then((response) => response.json())
			  .then((responseJson) => {

				if (responseJson.status == 1) {
					let list_data = responseJson.data;
					if(list_data){
						this.setState({ genreListData: list_data });
						global.bookListGenre = list_data;
					}
						
				} else {
				  console.log('Ошибка');
				}
			  })
			  .catch((error) => {
				console.error(error);
			  });	
		}		  
    }
	
	getWriter() {
		if(!this.state.writerListData){
			fetch(global.site_url, {
			  method: 'POST',
			  body: JSON.stringify({
					form: 'booklist',			
					terms : false,
					writer: true
			  })
			})
			  .then((response) => response.json())
			  .then((responseJson) => {

				if (responseJson.status == 1) {
					let list_data = responseJson.data;
					if(list_data){
						this.setState({ writerListData: list_data });
						global.bookListWriter = list_data;
					}
						
				} else {
				  console.log('Ошибка');
				}
			  })
			  .catch((error) => {
				console.error(error);
			  });	
		}			  
    }

	renderItem_home = ({item}) => {
	
        return (
		<View item={item.id} style={styles.carouselItem} >
			<TouchableOpacity activeOpacity={0.9} onPress={() => {this.props.navigation.navigate('BookScreen', { data: item })}}>
				{
				item.image_url ? 
				<Image style={styles.bookImageCarousel} source={{uri: item.image_url}}  /> : 
				<Image style={styles.bookImageCarousel} source={require('app/Image/imagebook.png')}/> 
				}
				<Text numberOfLines={2} style={{fontSize: 12}}>{item.title}</Text>
				<View style={{flexDirection:'row'}}>
					<View style={[styles.staticBox, styles.staticBox1]}>
						<Text style={{fontSize: 12, marginRight: 2}}>{item.rating}</Text>
						<Icon size={12} name='star' type='ionicon' color='#ffc522' />
					</View>
					<View style={[styles.staticBox, styles.staticBox2]}>
						<Text style={{fontSize: 12,marginRight: 2 }}>{item.view_count}</Text>
						<Icon size={12} name='eye-outline' type='ionicon' color='#333' />
					</View>
				</View>
			</TouchableOpacity>
		</View>
        );
    }
	
	
	homeRoute = () => {

	if(this.state.bookListData){		
		return (
		<ScrollView removeClippedSubviews={true} style={styles.lightBody}>

			<Text style={styles.bookListLabel}>Лучшее</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_popular}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			<Text style={styles.bookListLabel}>Набирающие популярность</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_popular_new}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Последние обновления</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_last_update}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Самое новое</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_new}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>

			<Text style={styles.bookListLabel}>Романы</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.roman}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Фантастика</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.fantastika}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Детективы</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.detektivy}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Фэнтези</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.fjentezi}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Драма</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.drama}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Приключения</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.prikluchenia}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
			
			<Text style={styles.bookListLabel}>Ужасы и Мистика</Text>
			<FlatList
				contentContainerStyle={styles.carouselBox}
				horizontal={true}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.bookListData.data_genre.yzasi}
				renderItem={this.renderItem_home}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
				initialNumToRender={3}
				maxToRenderPerBatch={1}
				updateCellsBatchingPeriod={100}
				windowSize={3}
			/>
	
		</ScrollView>
		);
	}else{
		return (<View style={styles.nopage}><ActivityIndicator size="large" color="#54a6ff" /></View>);
	}
		
	};
	
	renderItem_genre = ({item}) => {
        return (
			<TouchableOpacity style={styles.genreList} item={item.id} activeOpacity={0.8} onPress={() => {this.props.navigation.navigate('BookListGenreScreen', { data: item })}} >
				<Text numberOfLines={1} style={[styles.genreListText, item.sub ? styles.genreSub : styles.genreNoSub]} >{item.name}</Text>
			</TouchableOpacity>
        );
    }
	genreRoute = () => {
		if(this.state.genreListData){
			return (
			<FlatList
				contentContainerStyle={[styles.carouselBox, styles.lightBody]}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.genreListData}
				renderItem={this.renderItem_genre}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
			/>
			);
		}else{
			this.getGenre();
			return (<View style={styles.nopage}><ActivityIndicator size="large" color="#54a6ff" /></View>);
		}
	};
	renderItem_writer = ({item}) => {
        return (
			<TouchableOpacity style={styles.genreList} item={item.id} activeOpacity={0.8} onPress={() => {this.props.navigation.navigate('BookListWriterScreen', { data: item })}} >
				<Text numberOfLines={1} style={[styles.genreListText, styles.genreSub]} >#{item.name}</Text><Badge containerStyle={{position: 'absolute', top: 16,right: 15 }} value={global.countFormat(item.count)}/>
			</TouchableOpacity>
        );
    }
	writerRoute = () => {
		if(this.state.writerListData){
			return (
			<FlatList
				contentContainerStyle={[styles.carouselBox, styles.lightBody]}
				removeClippedSubviews={true}
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				data={this.state.writerListData}
				renderItem={this.renderItem_writer}
				keyExtractor={(item) => item.id}
				extraData={this.state.selectedId}
			/>
			);
		}else{
			this.getWriter();
			return (<View style={styles.nopage}><ActivityIndicator size="large" color="#54a6ff" /></View>);
		}
	};

	renderScene = ({ route }) => {
	  switch (route.key) {
		case 'group':
		  return this.homeRoute();
		case 'genre':
		  return this.genreRoute();
		case 'writer':
		  return this.writerRoute();
		default:
		  return null;
	  }
	};
	render() {
	return (
			<TabView
				lazy={true}
				removeClippedSubviews={true}
				renderTabBar={renderTabBar}
				navigationState={this.state}
				renderScene={this.renderScene}
				onIndexChange={index => this.setState({ index })}
				initialLayout={{ width: Dimensions.get('window').width }}
			/>
        );
    }
}