/**
 * File     -   generatePDF.js 
 * Author   -   Raj Rai
 * Date     -   Apr-22-24
 **/
import * as React from 'react';
import { View, Text, Vibration, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import Styles from '../styles/page-styles';

function GeneratePDF({ id, keyword, link, doc, cb}) {
    const dataList = []
    useEffect(() => {
        let i = 0;
        while (i < dataList.length) {
            if (dataList[i] == null) {
                dataList.push({ id: id }, { keyword: keyword }, { link: link })
                i++
            }
            console.log("list", dataList[i])
        }
    }, [])
  
    return (
        <View style={Styles.saveView}>
            <Pressable
                style={[Styles.saveButton, { backgroundColor: 'lightgreen' }]}
                onPress={() => { cb(text, url, id) }}>
                <Text style={Styles.buttonText}>+dgdg</Text></Pressable>
        </View>
    )
}

export default GeneratePDF;