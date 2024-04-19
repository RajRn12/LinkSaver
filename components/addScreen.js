/**
 * File     -   addScreen.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Styles from '../styles/page-styles';
import { useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { openBrowserAsync } from 'expo-web-browser';
function AddScreen({ navigation, route }) {
    // Audio
    const [soundList, setSoundList] = useState([
        { sound: null }, { sound: null }
    ])
    // Sounds from the Internet
    const addSound = { uri: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav' }
    const deleteSound = { uri: 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/player_shoot.wav' }

    const loadSoundList = () => {
        loadSound(0, addSound);
        loadSound(1, deleteSound);
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

    // Retrieve empty bool state
    const [isEmpty, setIsEmpty] = useState(true)

    // For database
    const db = route.params.database[0];
    const [updateLinks, forceUpdate] = useState(0);
    const [data, setData] = useState([]);

    // For refresh
    const isFocused = useIsFocused();

    // For TextInput
    const [keyword, onChangeKeyword] = useState("");
    const [keyword_Hint, setKeywordHint] = useState("Enter Keyword")
    const [link, onChangeLink] = useState("");
    const [link_Hint, setLinkHint] = useState("Enter URL Link starting with https")

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
                        () => console.log("failed retrieving updated data")
                }
            )
        }
    }, [db, updateLinks, isFocused])

    const addData = (keyword, link) => {
        const letters = /^[A-Za-z]+$/
        const regexL = new RegExp(letters);

        const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        const regex = new RegExp(expression);

        if (keyword.match(regexL) && link.match(regex)) {
            playSound(0)
            setTimeout(() => {
                if (keyword != "" && link != "") {
                    db.transaction(
                        (tx) => {
                            tx.executeSql(
                                "insert into links (keyword, link) values (?, ?)",
                                [keyword, link],
                                () => console.log("added", keyword, "And", link),
                                (_, error) => console.log(error)
                            )
                        },
                        (_, error) => console.log('addData() failed: ', error),
                        forceUpdate(f => f + 1)
                    )
                    onChangeKeyword("");
                    onChangeLink("")
                    setIsEmpty(false);
                }
                else {
                    Alert.alert("ERROR:", "Please fill in the boxes!")
                }
            }, 400)
        } else {
            Alert.alert("Invalid Value(s):", "Only letters allowed for Keyword. And please make sure the URL Link is valid and starts with https, and can be accessed via a Browser!")
        }
    }

    // Delete Data from specific index
    const deleteData = (id) => {
        playSound(1);
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

        }, 400)
    }
    return (
        <View style={Styles.add}>
            <View style={Styles.inputView}>
                <TextInput
                    style={Styles.input}
                    onChangeText={onChangeKeyword}
                    value={keyword}
                    placeholder={keyword_Hint}
                />
                <TextInput
                    style={Styles.input}
                    onChangeText={onChangeLink}
                    value={link}
                    placeholder={link_Hint}
                />
            </View>
            <View style={Styles.addTableView}>
                {isEmpty ? <View style={[Styles.emptyView, { marginTop: 170, }]}><Text style={Styles.emptyText}>EMPTY: Add 'keyword' and 'URL Link'</Text></View> :
                    <ScrollView>
                        {data.map(
                            ({ id, keyword, link }) => {
                                return (
                                    <View key={id} style={Styles.addDataView}>
                                        <TextInput
                                            style={Styles.input}
                                            value={keyword}
                                            readOnly={true}
                                        />
                                        <TextInput
                                            autoFocus={true}
                                            selection={{ start: 0, end: 0 }}
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
                                                onPress={() => deleteData(id)}>
                                                <Text style={Styles.buttonText}>Delete</Text></Pressable>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                }
            </View>

            <View style={Styles.buttonView}>
                {/* For adding */}
                <Pressable
                    style={[Styles.button, { backgroundColor: 'green' }]}
                    onPress={() => addData(keyword, link)}
                ><Text style={Styles.buttonText}>Add</Text></Pressable>

                {/* For Navigation */}
              
                <Pressable
                    style={[Styles.button, { backgroundColor: 'rgb(37, 150, 190)' }]}
                    onPress={() => navigation.navigate('Home')}
                ><Text style={Styles.buttonText}>Home</Text></Pressable>
            </View>
        </View>
    );
}

export default AddScreen;