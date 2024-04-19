/**
 * File     -   modifyScreen.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Text, Pressable, TextInput} from 'react-native';
import { useState } from 'react';
import Styles from '../styles/page-styles';
import CustomInput from './customInput';

function ModifyScreen({ navigation, route}) {
    // For database
    const db = route.params.database[0];

    // Limited number of Data
    const id = route.params.id;
    const keyword = route.params.keyword;
    const link = route.params.link;
 
    const deleteData = (id) => {
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
        )
        setTimeout(() => {
            navigation.goBack();
        }, 500)
    }

    const updateData = (keyword, link, id) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    "update links set keyword = ?, link = ? where id = ?",
                    [keyword, link, id],
                    () => console.log("New values at index", id, ":", keyword, "and", link),
                    (_, error) => console.log(error)
                )
            },
            (_, error) => console.log('updateData() failed: ', error),
        )
    };

    return (
        <View style={Styles.modify}>
            <View style={Styles.modifyTableView}>        
                          
            <View style={Styles.modifyDataView}>
                    <CustomInput id={id} keyword={keyword} link={link} cb={updateData} />
                </View>     
            </View>

            <View style={Styles.buttonView}>
                {/* For adding */}
                <Pressable
                    style={[Styles.button, { backgroundColor: 'green' }]}
                    onPress={() => { navigation.navigate('Add', { database: [db] })}}
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