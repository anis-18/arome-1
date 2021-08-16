// Import React and Component
import React from 'react';

//Style global
import styles from '../Components/Style';

import { View, ScrollView , Button, Text, SafeAreaView, Switch} from 'react-native';

import { ListItem } from 'react-native-elements';


export default class NotificationScreen extends React.Component {

    constructor(props) {

        super(props);
		
		this.state = {
			notification: false,
			switchValue: true
		};
    }
    componentDidMount() {
		this.props.navigation.setOptions({
			headerLeft: () => (
				<View style={styles.iconMenuLeft}></View>
			),
			headerRight: () => (
			<View style={styles.iconMenuRight} >
				<Switch
					value={this.state.switchValue}
					trackColor={{ false: "#eeeeee", true: "#F4BD7F" }}
					thumbColor={this.state.switchValue ? "#BE5B26" : "#f4f3f4"}
					ios_backgroundColor="#BE5B26"
					onValueChange={(switchValue) => this.setState({ switchValue })} 
				/>
			</View>
			)
		});
		this.props.navigation.addListener('focus', () => {
			
        });
    }

    render() {

        return (
			
			(this.state.notification) ?
				<ScrollView ref={ref => this.flatList = ref} removeClippedSubviews={true}>
				  {
					this.state.notification.map((item, i) => (
					  <ListItem key={i} bottomDivider containerStyle={(item.new) ? styles.newNotification : null} >
						<ListItem.Content>
						  <ListItem.Title>
						  {item.content}
						  </ListItem.Title>
						</ListItem.Content>
					  </ListItem>
					))
					  }
				</ScrollView>
			: <View style={styles.nopage}><Text style={styles.nopageText}>Новых уведомлений нет</Text></View>
			

        );
      }
    }

