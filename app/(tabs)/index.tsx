import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';

const RetroCalculator = () => {
    const [display, setDisplay] = useState("0");
    const [memory, setMemory] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [resetOnNextInput, setResetOnNextInput] = useState(false);

    const handleNumberClick = (num: string) => {
        if (display === "0" || resetOnNextInput) {
            setDisplay(num);
            setResetOnNextInput(false);
        } else {
            setDisplay(display + num);
        }
    };

    const handleDecimalClick = () => {
        if (resetOnNextInput) {
            setDisplay("0.");
            setResetOnNextInput(false);
            return;
        }

        if (!display.includes(".")) {
            setDisplay(display + ".");
        }
    };

    const handleOperationClick = (op: string) => {
        setOperation(op);
        setPreviousValue(parseFloat(display));
        setResetOnNextInput(true);
    };

    const handleEqualsClick = () => {
        if (operation && previousValue !== null) {
            const current = parseFloat(display);
            let result = 0;

            switch (operation) {
                case "+":
                    result = previousValue + current;
                    break;
                case "-":
                    result = previousValue - current;
                    break;
                case "×":
                    result = previousValue * current;
                    break;
                case "÷":
                    result = previousValue / current;
                    break;
            }

            setDisplay(result.toString());
            setOperation(null);
            setPreviousValue(null);
            setResetOnNextInput(true);
        }
    };

    const handleClearClick = () => {
        setDisplay("0");
        setOperation(null);
        setPreviousValue(null);
        setResetOnNextInput(false);
    };

    const handleMemoryAdd = () => {
        const currentValue = parseFloat(display);
        if (memory === null) {
            setMemory(currentValue);
        } else {
            setMemory(memory + currentValue);
        }
        setResetOnNextInput(true);
    };

    const handleMemorySubtract = () => {
        const currentValue = parseFloat(display);
        if (memory === null) {
            setMemory(-currentValue);
        } else {
            setMemory(memory - currentValue);
        }
        setResetOnNextInput(true);
    };

    const handleMemoryRecall = () => {
        if (memory !== null) {
            setDisplay(memory.toString());
        }
    };

    const handleMemoryClear = () => {
        setMemory(null);
    };

    const handlePercentage = () => {
        const currentValue = parseFloat(display);
        setDisplay((currentValue / 100).toString());
    };

    const handlePlusMinus = () => {
        if (display !== "0") {
            setDisplay((parseFloat(display) * -1).toString());
        }
    };

    const CalcButton = ({
        variant = "default",
        style = {},
        onPress,
        children,
        wide = false
    }: {
        variant?: "default" | "operation" | "function" | "memory" | "equals",
        style?: object,
        onPress: () => void,
        children: React.ReactNode,
        wide?: boolean
    }) => {
        let buttonStyle;
        let textStyle;

        switch (variant) {
            case "operation":
                buttonStyle = styles.operationButton;
                textStyle = styles.operationButtonText;
                break;
            case "function":
                buttonStyle = styles.functionButton;
                textStyle = styles.functionButtonText;
                break;
            case "memory":
                buttonStyle = styles.memoryButton;
                textStyle = styles.memoryButtonText;
                break;
            case "equals":
                buttonStyle = styles.equalsButton;
                textStyle = styles.equalsButtonText;
                break;
            default:
                buttonStyle = styles.defaultButton;
                textStyle = styles.defaultButtonText;
        }

        return (
            <TouchableOpacity
                style={[
                    styles.button,
                    buttonStyle,
                    wide && styles.wideButton,
                    style
                ]}
                activeOpacity={0.7}
                onPress={onPress}
            >
                <Text style={[styles.buttonText, textStyle]}>{children}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8e3b4" />
            <View style={styles.calculator}>
                <View style={styles.displayContainer}>
                    <View style={styles.displayHeader}>
                        <Text style={styles.displayLabel}>RETRO CALC</Text>
                        {memory !== null && (
                            <Text style={styles.memoryIndicator}>M</Text>
                        )}
                    </View>
                    <View style={styles.display}>
                        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
                            {display}
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonGrid}>
                    <View style={styles.buttonRow}>
                        <CalcButton variant="memory" onPress={handleMemoryClear}>MC</CalcButton>
                        <CalcButton variant="memory" onPress={handleMemoryRecall}>MR</CalcButton>
                        <CalcButton variant="memory" onPress={handleMemoryAdd}>M+</CalcButton>
                        <CalcButton variant="memory" onPress={handleMemorySubtract}>M-</CalcButton>
                    </View>

                    <View style={styles.buttonRow}>
                        <CalcButton variant="function" onPress={handleClearClick}>C</CalcButton>
                        <CalcButton variant="function" onPress={handlePlusMinus}>+/-</CalcButton>
                        <CalcButton variant="function" onPress={handlePercentage}>%</CalcButton>
                        <CalcButton variant="operation" onPress={() => handleOperationClick("÷")}>÷</CalcButton>
                    </View>

                    <View style={styles.buttonRow}>
                        <CalcButton onPress={() => handleNumberClick("7")}>7</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("8")}>8</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("9")}>9</CalcButton>
                        <CalcButton variant="operation" onPress={() => handleOperationClick("×")}>×</CalcButton>
                    </View>

                    <View style={styles.buttonRow}>
                        <CalcButton onPress={() => handleNumberClick("4")}>4</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("5")}>5</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("6")}>6</CalcButton>
                        <CalcButton variant="operation" onPress={() => handleOperationClick("-")}>-</CalcButton>
                    </View>

                    <View style={styles.buttonRow}>
                        <CalcButton onPress={() => handleNumberClick("1")}>1</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("2")}>2</CalcButton>
                        <CalcButton onPress={() => handleNumberClick("3")}>3</CalcButton>
                        <CalcButton variant="operation" onPress={() => handleOperationClick("+")}>+</CalcButton>
                    </View>

                    <View style={styles.buttonRow}>
                        <CalcButton wide onPress={() => handleNumberClick("0")}>0</CalcButton>
                        <CalcButton onPress={handleDecimalClick}>.</CalcButton>
                        <CalcButton variant="equals" onPress={handleEqualsClick}>=</CalcButton>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8e3b4', // amber-50 equivalent
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    calculator: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5d787', // amber-100 equivalent
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    displayContainer: {
        marginBottom: 24,
    },
    displayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    displayLabel: {
        fontSize: 12,
        color: '#92400e', // amber-800 equivalent
        opacity: 0.7,
    },
    memoryIndicator: {
        fontSize: 12,
        color: '#92400e', // amber-800 equivalent
        opacity: 0.7,
    },
    display: {
        height: 80,
        backgroundColor: 'rgba(20, 83, 45, 0.8)', // green-900/80 equivalent
        borderRadius: 6,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    displayText: {
        fontFamily: 'monospace',
        fontSize: 32,
        color: '#86efac', // green-300 equivalent
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    buttonGrid: {
        gap: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    button: {
        flex: 1,
        height: 75,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        borderBottomWidth: 4,
    },
    wideButton: {
        flex: 2,
        marginRight: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '500',
    },
    defaultButton: {
        backgroundColor: '#fde68a', // amber-200 equivalent
        borderBottomColor: '#b45309', // amber-700 equivalent
    },
    defaultButtonText: {
        color: '#78350f', // amber-950 equivalent
    },
    operationButton: {
        backgroundColor: '#f97316', // orange-500 equivalent
        borderBottomColor: '#c2410c', // orange-700 equivalent
    },
    operationButtonText: {
        color: '#ffffff',
    },
    functionButton: {
        backgroundColor: '#fbbf24', // amber-400 equivalent
        borderBottomColor: '#92400e', // amber-800 equivalent
    },
    functionButtonText: {
        color: '#78350f', // amber-950 equivalent
    },
    memoryButton: {
        backgroundColor: '#d97706', // amber-600 equivalent
        borderBottomColor: '#78350f', // amber-900 equivalent
    },
    memoryButtonText: {
        color: '#ffffff',
    },
    equalsButton: {
        backgroundColor: '#16a34a', // green-600 equivalent
        borderBottomColor: '#166534', // green-800 equivalent
    },
    equalsButtonText: {
        color: '#ffffff',
    },
});

export default RetroCalculator;
