/**
 * File     -   page-styles.js 
 * Author   -   Raj Rai
 * Date     -   Apr-16-24
 **/
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    home: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',	
    },

    tableView: {
        marginTop:10,
        width: '95%',
        borderStyle: 'solid',
        borderBlockColor:'black',
        borderWidth: 2,
        borderRadius: 2,
        height:'80%'
    },
    dataView: {
        marginTop:10,
        marginLeft: 5,
        width: '97%',
        borderWidth: 1,
        borderRadius: 2,
    },

    emptyView: {
        alignItems: 'center',
    },
    emptyText: {
        textShadowColor: 'rgba(246, 35, 35, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 20,
        textAlign:'center',
        fontWeight: 'bold',
        color: 'yellow',
        fontSize: 18,
    },


    inputView: {
        width:'100%',
        backgroundColor:'white',
        marginTop:5
    },
    input: {
        borderWidth: 1,
        borderRadius: 2,
        margin: 6,
        fontSize: 15,
        paddingLeft:5,
    },

    buttonView: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems:'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },

    add: {
        height:'100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    addTableView: {
        marginTop: 10,
        width: '95%',
        borderStyle: 'solid',
        borderBlockColor: 'black',
        borderWidth: 2,
        borderRadius: 2,
        height: '65%',
    },
    addDataView: {
        marginTop: 10,
        marginLeft: 5,
        width: '97%',
        borderWidth: 1,
        borderRadius: 2,
    },

    editView: {
        flexDirection: 'row',
        marginLeft: 15,
        marginBottom:6,
    },
    editButton: {
        paddingVertical: 6,
        paddingHorizontal: 21,
        borderRadius: 3,
        elevation: 3,
    },

    saveView: {
        flexDirection: 'row',
        marginLeft: 14,
        marginBottom: 6,
    },
    saveButton: {
        paddingVertical: 6,
        paddingHorizontal: 56,
        borderRadius: 9,
        elevation: 3,
    },

    modify: {
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    modifyTableView: {
        marginTop: 10,
        width: '95%',
        borderStyle: 'solid',
        borderBlockColor: 'black',
        borderWidth: 2,
        borderRadius: 2,
        height: '80%',
    },
    modifyDataView: {
        marginTop: 10,
        marginLeft: 5,
        width: '97%',
        borderWidth: 1.4,
        borderRadius: 2,
    },
});
export default styles;