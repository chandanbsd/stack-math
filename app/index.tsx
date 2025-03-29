import * as React from 'react';
import { Appbar, Button, Card, Chip, Surface, Text, TextInput } from 'react-native-paper';
import { AppState, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { evaluate } from 'mathjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from "@react-native-community/blur";



interface Expression {
    id: number,
    input: string,
    output: number | null,
    error: string | null;
}

const MathNotes = () => {

    const [expressionList, setExpressionList] = useState<Expression[]>([]);
    const [archivedExpressionList, setArchivedExpressionList] = useState<Expression[]>([]);
    const [expression, setExpression] = useState<string>("");
    const appState = useRef(AppState.currentState);

    const updateExpression = (val: string, id: number) => {
        setExpressionList(expressionList.map(exp => {
            if (exp.id === id) {
                return { ...exp, input: val };
            } else {
                return exp;
            }
        }));
    };

    useEffect(() => {
        const example = async () => {
            const res = await getMyObject();
            setExpression(res);
        }

    }, []);

    useEffect(() => {

        const loadData = async () => {
            setObjectValue()
        };

        loadData();

    }, [expressionList]);

    const getMyObject = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('stack-calc-values')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }

        console.log('Done.')
    }

    const setObjectValue = async () => {
        try {
            const jsonValue = JSON.stringify(expressionList)
            await AsyncStorage.setItem('stack-calc-values', jsonValue)
        } catch (e) {
            // save error
        }

        console.log('Done.')
    }

    const addExpression = () => {
        const newExpression: Expression = {
            id: expressionList.length + 1,
            input: "",
            output: null,
            error: null,
        };

        setExpressionList([...expressionList, newExpression]);
    };

    const deleteExpression = (id: number) => {
        let newExpList: Array<Expression> = expressionList.filter(exp => exp.id !== id)
        setExpressionList([...newExpList]);
    };

    const evaluateExpression = (id: number) => {
        setExpressionList(expressionList.map(exp => {
            if (exp.id === id) {
                let output: number | null = 0;
                let error: string | null = null;
                try {
                    output = evaluate(exp.input);
                    if (output == null) {
                        error = "Invalid expression";
                    }
                    else {
                        error = null;
                    }
                } catch (error) {
                    output = null;
                }
                return { ...exp, output, error };

            } else {
                return exp;
            }
        }));
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Stack Math" />
            </Appbar.Header>
            <SafeAreaProvider >

                <SafeAreaView style={styles.container}>
                    <ScrollView style={styles.mainScrollView}>

                        <Surface style={styles.surface}>
                            {
                                expressionList.map((exp) => (
                                    <Card style={styles.card} key={exp.id}>

                                        <Card.Content style={styles.CardContent}>
                                            <TextInput
                                                label="Enter expression"
                                                onChangeText={(text) => updateExpression(text, exp.id)}
                                            />
                                            <Chip icon="calculator" >Result = {exp.output}</Chip>

                                        </Card.Content>
                                        <Card.Actions>
                                            <Button onPress={() => deleteExpression(exp.id)} icon="trash-can">Delete</Button>
                                            <Button onPress={() => evaluateExpression(exp.id)}>Calculate</Button>
                                        </Card.Actions>
                                    </Card>
                                ))
                            }

                            <Button style={styles.mainAction} mode="contained" icon="plus" onPress={() => addExpression()}>Add Expression</Button>
                        </Surface >
                    </ScrollView>
                </SafeAreaView >
            </SafeAreaProvider >
        </>
    );
}

export default MathNotes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    mainScrollView: {

    },
    surface: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    error: {
        color: "red"
    },
    result: {
        color: "green"
    },
    card: {
        marginBottom: 20,
        width: '90%'
    },
    CardContent: {
        display: 'flex',
    },
    mainAction: {
        marginBottom: 30,
        marginTop: 30
    }
});
