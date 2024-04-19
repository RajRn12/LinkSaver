/**
 * File     -   customInput.js 
 * Author   -   Raj Rai
 * Date     -   Apr-18-24
 **/
import * as React from 'react';
import { View, Alert, Text, Vibration, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import Styles from '../styles/page-styles';

function CustomInput({ id, keyword, link, cb }) { 
    const [text, setText] = useState(keyword);
    const [url, setUrl] = useState(link)
    // For Vibration feedback to indicate restore
    const QUARTER_SECOND_IN_MS = 250;  // Restored
    return (
    <View>
        <TextInput
            style={Styles.input}
            value={text}
            onChangeText={setText}
            />
            <TextInput
                style={Styles.input}
                value={url}
                onChangeText={setUrl}
            />
            <View style={Styles.saveView}>
                <Pressable
                    style={[Styles.saveButton, { backgroundColor: 'lightgreen' }]}
                    onPress={() => { cb(text, url, id) }}>
                <Text style={Styles.buttonText}>Save</Text></Pressable>
                <Pressable
                    style={[Styles.saveButton, { backgroundColor: 'blue' }]}
                    onPress={() => { setText(keyword); setUrl(link); cb(keyword, link, id); Vibration.vibrate(QUARTER_SECOND_IN_MS) }}>
                    <Text style={Styles.buttonText}>Undo</Text></Pressable>
            </View>
        </View>
     )
}

export default CustomInput;