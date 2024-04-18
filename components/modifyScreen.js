/**
 * File     -   modifyScreen.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Styles from '../styles/page-styles';
import { useIsFocused } from '@react-navigation/native';

function ModifyScreen({ navigation, route}) {

    // For refresh
    const isFocused = useIsFocused();

    // For database
    const db = route.params.database[0];
    const [updateLinks, forceUpdate] = useState(0);
    // Limited number of Data
    const [data, setData] = useState([
    ]);
 
    useEffect(() => {
        if (db != null) {
            db.transaction(
                (tx) => {
                    tx.executeSql(
                        "select * from links",
                        [],
                        (_, { rows }) => {
                            let l = 0;
                            let newR = {...data}
                            while (l < rows.length) {
                            
                                    newR[l].id = rows._array[l].id;
                                    newR[l].keyword = rows._array[l].keyword;
                                    newR[l].link = rows._array[l].link;
                                
                                l++
                                console.log("", newR[l].keyword)
                            }
                            setData(newR)
                        },
                        (_, error) => console.log(error)
                    ),
                        (_, error) => console.log(error),
                        () => console.log("retrieving updated data")
                }
            )
        }
    }, [db, updateLinks, isFocused])


    const deleteData = (id) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "delete from links where id = ?",
                    [id],
                    () => console.log("deleted Data ", id),
                    (_, error) => console.log(error)
                )
            },
            (_, error) => console.log('deleteData() failed: ', error),
            forceUpdate(f => f + 1)
        )
    }

    const handleInputChange = (id, text) => {
        let newR = { ...data }
        newR[id].keyword = text
        setData(newR);
    };

    return (
        <View style={Styles.modify}>
            <View style={Styles.modifyTableView}>
                
                    <ScrollView>
                        {data.map(
                            (keyword, id) => {
                                return (
                                    
                                        <View key={id} style={Styles.modifyDataView}>
                                            <TextInput
                                                style={Styles.input}
                                                value={keyword}
                                                onChangeText={text => handleInputChange(id, text)}
                                            />

                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable style={{ marginLeft: 6, marginBottom: 6 }} onPress={() => { }}><Text>Save</Text></Pressable>
                                                <Pressable style={{ marginLeft: 6, marginBottom: 6 }} onPress={() => { }}><Text>Discard</Text></Pressable>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable style={{ marginLeft: 6, marginBottom: 6 }} onPress={() => deleteData(id)}><Text>❌ Tap Me To Delete</Text></Pressable>
                                            </View>

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
                    onPress={() => navigation.navigate('Add', {database: [db]})}
                ><Text style={Styles.buttonText}>ADD</Text></Pressable>

                {/* For Navigation */}
                <Pressable
                    style={[Styles.button, { backgroundColor: 'rgb(37, 150, 190)' }]}
                    onPress={() => navigation.navigate('Home')}
                ><Text style={Styles.buttonText}>HOME</Text></Pressable>
            </View>
        </View>
    );
}

export default ModifyScreen;