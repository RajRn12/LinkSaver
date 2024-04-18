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

function AddScreen({ navigation, route }) {
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
    const [link_Hint, setLinkHint] = useState("Enter URL Link")

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
    }, [db, updateLinks, isFocused])

    const addData = (keyword, link) => {
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
                     <ScrollView>
                        {data.map(
                            ({ id, keyword, link }) => {
                                return (
                                    <View key={id} style={Styles.addDataView}>
                                        <TextInput
                                            style={Styles.input}
                                            value={keyword}
                                            editable={false}
                                        />
                                        <TextInput
                                            style={Styles.input}
                                            value={link}
                                            editable={false}
                                        />
                                        <Pressable
                                            style={[Styles.button, { backgroundColor: 'orange' }]}
                                            onPress={() => navigation.navigate('Modify', { database: [db], id:id })}
                                        ><Text style={Styles.buttonText}>Modify</Text></Pressable>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
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
                    onPress={() => navigation.navigate('Home', {
                        force: [updateLinks]
                    })}
                ><Text style={Styles.buttonText}>Home</Text></Pressable>
            </View>
        </View>
    );
}

export default AddScreen;