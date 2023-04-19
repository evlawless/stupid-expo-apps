import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView, Button, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';



const Card = ({ img, suit, value, navigation }) => {
	const [faceUp, setFaceUp] = useState(true);

	const suitColor = (suit == 'hearts' || suit == 'diamonds') ? 'red' : 'black';

	if (!faceUp) {
		return (
			<Pressable onPress={() => { navigation.navigate('Magic', { suit: suit, value: value }) }}>
				<View style={{ ...styles.card, justifyContent: "center" }}>
					<Image source={require('./assets/cardBack.png')} style={{ width: 200, height: 300 }} />
				</View>
			</Pressable>
		)
	} else {
		return (
			<Pressable onPress={() => { navigation.navigate('Magic', { suit: suit, value: value }) }}>
				<View style={styles.card}>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'left' }}>{suitEmojiMap[suit]}</Text>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'center', flexGrow: 2, fontSize: 75 }}>{value}</Text>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'right' }}>{suitEmojiMap[suit]}</Text>

				</View>
			</Pressable>
		);
	}
}
const CardScreen = ({ navigation }) => {

	const [deck, setDeck] = useState(deckBuilder());

	return (
		<View style={{ ...styles.container, height: '100%' }}>
			<View style={{ height: 50, backgroundColor: 'white', width: '100%', justifyContent: 'center' }}>
				<Text style={{ fontSize: 30, textAlign: 'center' }}>Pick a Card</Text>
			</View>
			<ScrollView horizontal style={{ height: 350, ...highlightStyle }}>
				{
					deck.map((card, i) => {
						return <Card img={require('./assets/splash.png')}
							suit={card.suit}
							value={card.value}
							key={`${card.suit}-${card.value}`}
							navigation={navigation}
						/>
					})
				}
			</ScrollView>
			<StatusBar style="auto" />
		</View>
	)
}

const MagicScreen = ({ navigation, route }) => {
	const { suit, value } = route.params;
	const [sound, setSound] = useState(new Audio.Sound());
	const [faceUp, setFaceUp] = useState(true);

	async function playSound() {
		const { sound } = await Audio.Sound.createAsync(require('./assets/poot.mp3')
		);

		setSound(sound);
		await sound.playAsync();

	}

	useEffect(() => {
		return sound
			? () => {
				console.log('Unloading Sound');
				sound.unloadAsync();
			}
			: undefined;
	}, [sound]);

	useEffect(() => {
		const interval = setInterval(() => {
			setFaceUp((f) => !f);
			playSound();
		}, 1000);
		return () => clearInterval(interval);
	}, []);


	const suitColor = (suit == 'hearts' || suit == 'diamonds') ? 'red' : 'black';
	return (
		<View style={styles.container}>
			{faceUp ? (
				<View style={styles.card}>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'left' }}>{suitEmojiMap[suit]}</Text>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'center', flexGrow: 2, fontSize: 75 }}>{value}</Text>
					<Text style={{ ...styles.cardText, color: suitColor, textAlign: 'right' }}>{suitEmojiMap[suit]}</Text>
				</View>) : (
				<View style={{ ...styles.card }}>
					<Image source={require('./assets/thebird.jpg')} style={{ width: 200, height: 300 }} />
				</View>
			)
			}
			<Text>You are a fool.</Text>
			<Button title='Try Again' onPress={() => navigation.popToTop()} />
		</View>
	);
}

const HomeScreen = ({ navigation }) => {
	return (
		<View style={{ ...styles.container, justifyContent: 'center' }}>
			<ImageBackground source={require('./assets/stars.gif')} resizeMode='cover'>
				<Text style={{ fontSize: 60, color:'white' }}>MAGIC TRICK</Text>
				<Image source={require('./assets/magichat.gif')} style={{ width: 200, height: 200 }} />
				<Button title='PROCEED to TRICK' onPress={() => navigation.navigate('Cards')} />
				<StatusBar style="auto" />
			</ImageBackground>
		</View>
	);
}

const Stack = createNativeStackNavigator();

const App = () => {

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Home'>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Cards" component={CardScreen} />
				<Stack.Screen name="Magic" component={MagicScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		flex: 1,
		borderColor: 'black',
		borderRadius: 5,
		borderWidth: 1,
		padding: 10,
		margin: 10,
		backgroundColor: 'ivory',
		width: 200,
		maxHeight: 300,
		height: 300,
		justifyContent: 'space-between',
		alignItems: 'center',

	}, cardText: {
		fontSize: 30,
		fontWeight: 'bold',
		verticalAlign: 'middle',
		width: "100%",
		padding: 5,
	}
});

const highlightStyle = {
	borderColor: 'red',
	borderWidth: 2,

}

enum cardValues {
	ace = 1,
	two = 2,
	three = 3,
	four = 4,
	five = 5,
	six = 6,
	seven = 7,
	eight = 8,
	nine = 9,
	ten = 10,
	jack = 11,
	queen = 12,
	king = 13
}

const suitEmojiMap: { [key: string]: string } = {
	hearts: '♥',
	diamonds: '♦',
	spades: '♠',
	clubs: '♣'
}


function deckBuilder() {
	const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
	const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


	let deck = [];

	suits.forEach((suit) => {
		cardValues.forEach(value => {
			deck.push({ suit, value });
		});
	});

	return deck.sort((a, b) => 0.5 - Math.random());
}

export default App;