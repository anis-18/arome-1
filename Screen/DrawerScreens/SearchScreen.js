import * as React from 'react';

import styles from '../Components/Style';

import { View, FlatList, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';


export default class SearchScreen extends React.Component {

	constructor(props) {

		super(props);

		this.state = {
			search: '',
			dataSource: [],
			index: 0
		}
	}
	componentDidMount() {
		this.props.navigation.addListener('focus', () => {
			if (this.search) {
				this.search.focus();
			}
		});
	}
	getData() {

		fetch(global.site_url, {
			method: 'POST',
			body: JSON.stringify({
				form: 'search',
				text: this.state.search
			})
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.status == 1) {
					let list_data = responseJson.data;
					if (list_data) {
						this.setState({ dataSource: list_data });
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}
	searchFilterFunction = (text) => {

		if (text && text.length > 2) {
			this.setState({ search: text });
			const timeOutId = setTimeout(() => this.getData(), 1500);
			return () => clearTimeout(timeOutId);
		} else {
			this.setState({ search: text });
		}
	};
	render() {
		return (
			<View style={styles.body}>
				<SearchBar
					round
					ref={search => this.search = search}
					searchIcon={{ size: 24 }}
					onChangeText={(text) => this.searchFilterFunction(text)}
					onClear={(text) => this.searchFilterFunction('')}
					placeholder="Введите текст"
					value={this.state.search}
					inputStyle={styles.searchInput}
					inputContainerStyle={styles.searchContainerInput}
					containerStyle={styles.searchContainer}
				/>
				{(this.state.dataSource && this.state.dataSource.length > 0) ?
					<FlatList
						contentContainerStyle={[styles.carouselBox, styles.lightBody]}
						removeClippedSubviews={true}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						data={this.state.dataSource}
						renderItem={global.product_mini}
						keyExtractor={(item) => item.id}
						extraData={this.state.dataSource}
						initialNumToRender={4}
						maxToRenderPerBatch={4}
						updateCellsBatchingPeriod={100}
						windowSize={4}
						numColumns={2}
					/>
					: <View style={styles.nopage}><Text style={styles.nopageText}>Начните вводить текст для поиска</Text></View>
				}
			</View>
		);
	}
}