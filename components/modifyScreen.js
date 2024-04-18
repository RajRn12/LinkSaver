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
import CustomInput from './customInput';

function ModifyScreen({ navigation, route}) {

    // For refresh
    const isFocused = useIsFocused();

    // For database
    const db = route.params.database[0];

    // Limited number of Data
    const [data, setData] = useState([]);
    const id = route.params.id;
    const keyword = route.params.keyword;
    const link = route.params.link;
 
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
        )
    }

    const handleInputChange = (text, id) => {
   
    };

    return (
        <View style={Styles.modify}>
            <View style={Styles.modifyTableView}>        
                          
            <View style={Styles.modifyDataView}>
                    <CustomInput id={id} val={keyword} cb={handleInputChange} />
                    <CustomInput id={id} val={link} cb={handleInputChange} />
                    <View style={{ flexDirection: 'row' }}>
                        <Pressable style={{ marginLeft: 6, marginBottom: 6 }} onPress={() => deleteData(id)}><Text>❌ Tap Me To Delete</Text></Pressable>
                    </View>
                </View>     
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