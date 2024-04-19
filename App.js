/**
 * File     -   index.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Image, Text, LogBox, Pressable, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { openDatabase } from 'expo-sqlite';
import Styles from './styles/page-styles';
import AddScreen from './components/addScreen.js';
import ModifyScreen from './components/modifyScreen';
import { openBrowserAsync } from 'expo-web-browser';
import * as SplashScreen from 'expo-splash-screen';

// Ignore warnings as they don't affect anything
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

// Open and connect to database
const db= openDatabase('link.db');

function LogoTitle() {
    return (
            <Image
                style={{ width: 50, height: 50}}
                source={require('./assets/headerLogo.png')}
             />
    );
}
function LogoSave() {
    return (
        <Image
            style={{ width: 40, height: 40 }}
            source={require('./assets/saveLogo.png')}
        />
    );
}
function LogoModify() {
    return (
        <Image
            style={{ width: 40, height: 40 }}
            source={require('./assets/modifyLogo.png')}
            />
    );
}
function LogoInfo() {
    function showInfo() {
        Alert.alert("Link Saver:", "App with a Database for keywords and links. You can add Keyword and URL link related to Database Table which can be accessed at anytime. You can navigate between screens. You can hit open Browser to open up Browser accessing a specific link. You can modify added Data and delete them.")
    }
    return (
        <Pressable onPress={() => showInfo() }>
            <Image
                style={{ width: 40, height: 40 }}
                source={require('./assets/info.png')}
                />
        </Pressable>
    )
}

function LogoAddInfo() {
    function showInfo() {
        Alert.alert("Add:", "You can add Keyword and URL link related to it which can be accessed at anytime. You can modify and delete added Data and navigate to Home! ")
    }
    return (
        <Pressable onPress={() => showInfo()}>
            <Image
                style={{ width: 40, height: 40 }}
                source={require('./assets/info.png')}
            />
        </Pressable>
    )
}

function LogoModifyInfo() {
    function showInfo() {
        Alert.alert("Modify:", "You can change the texts and hit Save to update the database with the new values. You can hit Undo to restore original data unless you navigate to different and come back. You can navigate to Add screen to add more Data or you can go back Home! Shorter vibration means 'Updated' and longer means 'Validation Issue'")
    }
    return (
        <Pressable onPress={() => showInfo()}>
            <Image
                style={{ width: 40, height: 40 }}
                source={require('./assets/info.png')}
            />
        </Pressable>
    )
}

function HomeScreen({ navigation, route }) {

    // Splash
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 2000);

    // Audio
    const [soundList, setSoundList] = useState([
        { sound: null }
    ])
    // Sound from the Internet
    const deleteSound = { uri: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/player_shoot.wav' }

    const loadSoundList = () => {
        loadSound(0, deleteSound);
    }

    const loadSound = async (id, uri) => {
        const { sound } = await Audio.Sound.createAsync(uri);
        let newA = { ...soundList }
        if (soundList[id].sound == null) {
            newA[id].sound = sound;
            setSoundList(newA)
            console.log("loaded sound at index", id)
        }
    }

    const playSound = async (id) => {
        try {
            if (soundList[id].sound != null) {
                await soundList[id].sound.replayAsync();
            }
            if (soundList[id].sound == null) {
                loadSoundList();
            }
        } catch (e) {
            console.log(e)
        };
    }

    // unload a sound
    const unloadSound = async () => {
        let x = 0;
        while (x < soundList.length) {
            // stop and unload
            if (soundList[x].sound != null) {
                await soundList[x].sound.stopAsync();
                await soundList[x].sound.unloadAsync();
                console.log("Unloaded sound")
            }
            // load after unload to be able to play sound
            loadSoundList();
            x++
        }
    }

    useEffect(() => {
        loadSoundList()
        return soundList.sound
            ? () => {
                unloadSound()
            }
            : undefined;

    }, [soundList.sound])

    // For refresh
    const isFocused = useIsFocused();

    // For database
    const [data, setData] = useState([]);
    const [updateLinks, forceUpdate] = useState(0);
    
    // Create datatable
    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists links (id integer primary key AUTOINCREMENT NOT NULL, keyword text, link text);",
                () => console.log("Table is successfully created")
            ),
                (_, error) => console.log(error),
                () => console.log("Table exists or was created")
        })
    }, []);

    // Retrieve data from database links when db or updatelinks are modified 
    useEffect(() => {
        if (db != null) {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "select * from links",
                        [],
                        (_, { rows }) => setData(rows._array),
                        (_, error) => console.log(error)
                    ),
                        (_, error) => console.log(error),
                        () => console.log("retrieving updated data failed")
                }
            )
        }

    }, [db, updateLinks, isFocused])

    // Delete Data from specific index
    const deleteData = (id) => {
        playSound(0);
        setTimeout(() => {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "delete from links where id = ?",
                        [id],
                        () => console.log("deleted Data at index", id),
                        (_, error) => console.log(error)
                    )
                },
                (_, error) => console.log('deleteData() failed: ', error),
                forceUpdate(f => f + 1)
            )
        }, 450)
    }
    return (
        <View style={Styles.home}>
            <View style={Styles.tableView}>
                    <ScrollView>
                        {data.map(
                            ({ id, keyword, link }) => {
                                return (
                                    <View key={id} style={Styles.dataView}>
                                        <TextInput
                                            style={Styles.input}
                                            value={keyword}
                                            readOnly={true}
                                        />
                                        <TextInput
                                            style={Styles.input}
                                            value={link}
                                            readOnly={true}
                                        />
                                        <View style={Styles.editView}>
                                            <Pressable
                                                style={[Styles.editButton, { backgroundColor: 'lightblue' }]}
                                                onPress={() => openBrowserAsync(link)}
                                            ><Text style={Styles.buttonText}>Open Web</Text></Pressable>

                                            <Pressable
                                                style={[Styles.editButton, { backgroundColor: 'orange' }]}
                                                onPress={() => navigation.navigate('Modify', {
                                                    database: [db], id: id, keyword: keyword, link: link
                                                })}
                                            ><Text style={Styles.buttonText}>Modify</Text></Pressable>
                                            <Pressable
                                                style={[Styles.editButton, { backgroundColor: 'red' }]}
                                                onPress={() => { deleteData(id) }}>
                                                <Text style={Styles.buttonText}>Delete</Text></Pressable>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
            </View>
            <View style={Styles.buttonView}>
                {/* For Navigation */}
                <Pressable
                    style={[Styles.button, { backgroundColor: 'green' }]}
                    onPress={() => navigation.navigate('Add', {
                        database: [db],
                    })}
                ><Text style={Styles.buttonText}>Add</Text></Pressable>
            </View>
        </View>
   
    );
}

const Stack = createNativeStackNavigator();
function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Link Saver">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                    headerBackVisible: false,
                    headerStyle: {
                            backgroundColor: 'rgb(37, 150, 190)',
                        },
                        headerTitle: (props) => <LogoTitle {...props} />,
                        headerRight: (props) => <LogoInfo {...props } />,
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',
                    }}
                />
                <Stack.Screen
                    name="Add"
                    component={AddScreen}
                    options={{
                        headerBackVisible: false,
                        headerStyle: {
                            backgroundColor: 'green',
                        },
                        headerTitle: (props) => <LogoSave {...props} />,
                        headerRight: (props) => <LogoAddInfo {...props} />,
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',
                    }}
                />
                <Stack.Screen
                    name="Modify"
                    component={ModifyScreen}
                    options={{
                        headerBackVisible: false,
                        headerStyle: {
                            backgroundColor: 'orange',
                        },
                        headerTitle: (props) => <LogoModify {...props} />,
                        headerRight: (props) => <LogoModifyInfo {...props} />,
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;