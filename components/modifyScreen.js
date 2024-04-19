/**
 * File     -   modifyScreen.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import * as React from 'react';
import { View, Alert, Text, Pressable, Vibration} from 'react-native';
import Styles from '../styles/page-styles';
import CustomInput from './customInput';

function ModifyScreen({ navigation, route }) {
    // For Vibration feedback to indicate Update has been made
    const HALF_SECOND_IN_MS = 500;  // Updated
    const ONE_SECOND_IN_MS = 1000;  // Problem

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
        const letters = /^[A-Za-z]+$/
        const regexL = new RegExp(letters);

        const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        const regex = new RegExp(expression);

        if (keyword.match(regexL) && link.match(regex)) {
            Vibration.vibrate(HALF_SECOND_IN_MS)
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
        } else {
            Vibration.vibrate(ONE_SECOND_IN_MS);
            Alert.alert("Invalid Value(s):", "Only letters allowed for Keyword. And please make sure the URL Link is valid and starts with https, and can be accessed via a Browser!")
        }
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