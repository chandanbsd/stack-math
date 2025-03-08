import { StyleSheet, Image, Platform, Button, TextInput, SafeAreaView, Text, View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState } from 'react';

export default function Calculator() {
    const [res, setResult] = useState<number>(0);
    const [operation, setOperation] = useState<string | null>(null);
    const [display, setDisplay] = useState<string>("");

    const calculateResult = (val: string) => {

        setDisplay(display + " " + val + " ");

        let isOperation: boolean = isNaN(Number(val));

        if (isOperation) {
            setOperation(val);
        }
        else {
            let numberVal = Number(val);

            if (operation === null) {
                setResult(numberVal);
            }
            else {
                switch (operation) {
                    case '+': setResult(res + numberVal);
                        break;
                    case '-': setResult(res - numberVal);
                        break;
                    case '*': setResult(res * numberVal);
                        break;
                    case '/': setResult(res / numberVal);
                        break;
                }
            }

        }
    }

    const displayResult = () => {
        setDisplay(res.toString());
    }

    const reset = () => {
        setResult(0);
        setOperation(null);
        setDisplay("");
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text style={styles.heading}>
                    Simple Calculator
                </Text>
            </SafeAreaView>
            <SafeAreaView>
                <Text style={styles.result}>
                    {display}
                </Text>
                <View>
                    <View style={styles.buttonContainer}>
                        <Button title="1" onPress={() => calculateResult("1")} />
                        <Button title="2" onPress={() => calculateResult("2")} />
                        <Button title="3" onPress={() => calculateResult("3")} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="4" onPress={() => calculateResult("4")} />
                        <Button title="5" onPress={() => calculateResult("5")} />
                        <Button title="6" onPress={() => calculateResult("6")} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="7" onPress={() => calculateResult("7")} />
                        <Button title="8" onPress={() => calculateResult("8")} />
                        <Button title="9" onPress={() => calculateResult("9")} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="CLEAR" color="red" onPress={() => reset()} />
                    </View>
                </View>
                <View>
                    <Text style={styles.viewTitle}>
                        Action Buttons
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button title="+" color="grey" onPress={() => calculateResult("+")} />
                        <Button title="-" color="grey" onPress={() => calculateResult("-")} />
                        <Button title="*" color="grey" onPress={() => calculateResult("*")} />
                        <Button title="/" color="grey" onPress={() => calculateResult("/")} />
                        <Button title="=" color="grey" onPress={() => displayResult()} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 25,

        ...Platform.select({
            android: {
                marginBottom: 10
            }
        })
    },
    btn: {
        ...Platform.select({
            ios: {

            },
            android: {
                height: 30,
                width: 30,
            }
        })
    },
    actionContainer: {

    },
    viewTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 15,
    },
    heading: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30,
        ...Platform.select({
            android: {
                marginTop: 40
            }
        })
    },
    result: {
        borderBlockColor: "black",
        padding: 5,
        marginBottom: 20,
        backgroundColor: "green",
        width: 250,
        marginLeft: "auto",
        marginRight: "auto"
    }
});
