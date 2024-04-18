/**
 * File     -   index.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Image, Text, LogBox, Pressable, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { openDatabase } from 'expo-sqlite';
import Styles from './styles/page-styles';
import AddScreen from './components/addScreen.js';
import ModifyScreen from './components/modifyScreen';
import { useIsFocused } from '@react-navigation/native';

// Ignore warnings as they don't affect anything
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

// Open and connect to database
const db= openDatabase('dst.db');

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
        Alert.alert("Link Saver", "You can add Keyword and URL link related to Data Table which can be accessed at anytime. You can navigate between screens. You can modify added Data and delete them, and you can download added Data on your Phone, too!")
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
        Alert.alert("Add", "You can add Keyword and URL link related to it which can be accessed at anytime. You can navigate to Modify screen or you can go back Home! ")
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
        Alert.alert("Modify", "You can modify added Data and delete them as well. You can navigate to Add screen or you can go back Home!")
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
function HomeScreen({ navigation}) {

    // For refresh
    const isFocused = useIsFocused();

    // For database
    const [data, setData] = useState([]);

    // Create datatable
    useEffect(() => {
        console.log(db);

        db.transaction((tx) => {
            tx.executeSql(
                "create table if not exists links (id integer primary key AUTOINCREMENT NOT NULL, keyword text, link text);"
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
                        () => console.log("retrieving updated data")
                }
            )
        }

    }, [db, isFocused])

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
                        database: [db]
                    })}
                ><Text style={Styles.buttonText}>Add</Text></Pressable>
                <Pressable
                    style={[Styles.button, { backgroundColor: 'orange' }]}
                    onPress={() => navigation.navigate('Modify', {
                        database: [db]
                    })}
                ><Text style={Styles.buttonText}>Modify</Text></Pressable>

                {/* For Download */}
                <Pressable
                    style={[Styles.button, { backgroundColor: 'blue' }]}
                    onPress={() => { } }
                ><Text style={Styles.buttonText}>Download</Text></Pressable>
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