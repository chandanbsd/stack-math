import { Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Calculator() {
    const [exp, setExp] = useState<string>("");

    const calculateResult = (val: string) => {
        setExp(exp + val);
    }

    const displayResult = () => {
        setExp(eval(exp))
    }

    const reset = () => {
        setExp("");
    }

    return (
        <SafeAreaProvider style={styles.calculatorContainer}>
            <SafeAreaView>
                <Text style={styles.heading}>
                    A Simple Calculator
                </Text>
            </SafeAreaView>
            <SafeAreaView>
                <Text style={styles.result}>
                    {exp}
                </Text>
                <View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("1")}>
                            <Text style={styles.numpadBtn}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("2")}>
                            <Text style={styles.numpadBtn}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("3")}>
                            <Text style={styles.numpadBtn}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("4")}>
                            <Text style={styles.numpadBtn}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("5")}>
                            <Text style={styles.numpadBtn}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("6")}>
                            <Text style={styles.numpadBtn}>6</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("7")}>
                            <Text style={styles.numpadBtn}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("8")}>
                            <Text style={styles.numpadBtn}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("9")}>
                            <Text style={styles.numpadBtn}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult(".")}>
                            <Text style={styles.numpadBtn} >.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("0")}>
                            <Text style={styles.numpadBtn}>0</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <Button title="CLEAR" color="red" onPress={() => reset()} />
                        <Button title="X" color="yellow" onPress={() => reset()} />
                    </View>
                </View>
                <View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("+")}>
                            <Text style={styles.numpadBtn}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("-")}>
                            <Text style={styles.numpadBtn}>-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("*")}>
                            <Text style={styles.numpadBtn}>*</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => calculateResult("/")}>
                            <Text style={styles.numpadBtn}>/</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => displayResult()}>
                            <Text style={styles.numpadBtn}>=</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    calculatorContainer: {
        backgroundColor: 'rgba(189, 152, 149)',
    },
    numpadBtn: {
        fontSize: 30,
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto"
    },
    buttonRow: {
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
    buttonContainer: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 50,
        alignContent: "center",
        textAlign: "center",
        verticalAlign: "middle",
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
        fontSize: 45,
        borderBlockColor: "black",
        padding: 5,
        marginBottom: 20,
        backgroundColor: "green",
        width: "90%",
        height: "20%",
        marginLeft: "auto",
        marginRight: "auto"
    }
});
