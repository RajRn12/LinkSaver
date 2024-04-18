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

function CustomInput ({ id, val, cb }) {
    const [text, setText] = useState(val);

    return (
        <View style={Styles.modifyDataView}>
        <TextInput
            style={Styles.input}
            value={text}
            onChangeText={setText}
            onSubmitEditing={cb(text, id)}
            />
            </View>
        )
}

export default CustomInput;