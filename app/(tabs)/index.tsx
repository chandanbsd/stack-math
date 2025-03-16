import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    FlatList
} from 'react-native';

// Define a type for history items
type HistoryItem = {
    id: string;
    expression: string;
    result: string;
    timestamp: Date;
};

const RetroCalculator = () => {
    const [display, setDisplay] = useState("0");
    const [memory, setMemory] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [resetOnNextInput, setResetOnNextInput] = useState(false);
    const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentExpression, setCurrentExpression] = useState<string>("");

    // Use a ref to track the complete expression for history
    const expressionRef = useRef<string>("");

    const addToHistory = (expression: string, result: string) => {
        const historyItem: HistoryItem = {
            id: Date.now().toString(),
            expression,
            result,
            timestamp: new Date()
        };

        setHistory(prevHistory => [historyItem, ...prevHistory]);
    };

    const handleNumberClick = (num: string) => {
        if (display === "0" || resetOnNextInput) {
            setDisplay(num);
            setResetOnNextInput(false);

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} ${num}`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = num;
                setCurrentExpression(num);
            }
        } else {
            setDisplay(display + num);

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} ${display + num}`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = display + num;
                setCurrentExpression(display + num);
            }
        }
    };

    const handleDecimalClick = () => {
        if (resetOnNextInput) {
            setDisplay("0.");
            setResetOnNextInput(false);

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} 0.`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = "0.";
                setCurrentExpression("0.");
            }
            return;
        }

        if (!display.includes(".")) {
            setDisplay(display + ".");

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} ${display}.`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = display + ".";
                setCurrentExpression(display + ".");
            }
        }
    };

    const handleOperationClick = (op: string) => {
        // If we already have an operation in progress, calculate it first
        if (operation && previousValue !== null && !resetOnNextInput) {
            handleEqualsClick();
            // Then set the new operation with the result
            const result = display;
            setOperation(op);
            setPreviousValue(parseFloat(result));
            expressionRef.current = `${result} ${op}`;
            setCurrentExpression(expressionRef.current);
        } else {
            setOperation(op);
            setPreviousValue(parseFloat(display));
            expressionRef.current = `${display} ${op}`;
            setCurrentExpression(expressionRef.current);
        }
        setResetOnNextInput(true);
    };

    const handleEqualsClick = () => {
        if (operation && previousValue !== null) {
            const current = parseFloat(display);
            let result = 0;
            const fullExpression = `${previousValue} ${operation} ${current}`;

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
                    result = current === 0 ? NaN : previousValue / current;
                    break;
            }

            const resultString = isNaN(result) ? "Error" : result.toString();

            // Add to history
            addToHistory(fullExpression, resultString);

            // Update display and reset state
            setDisplay(resultString);
            setOperation(null);
            setPreviousValue(null);
            setResetOnNextInput(true);
            expressionRef.current = `${fullExpression} = ${resultString}`;
            setCurrentExpression(expressionRef.current);
        }
    };

    const handleClearClick = () => {
        setDisplay("0");
        setOperation(null);
        setPreviousValue(null);
        setResetOnNextInput(false);
        expressionRef.current = "";
        setCurrentExpression("");
    };

    const handleMemoryAdd = () => {
        const currentValue = parseFloat(display);
        if (memory === null) {
            setMemory(currentValue);
        } else {
            setMemory(memory + currentValue);
        }
        setResetOnNextInput(true);

        // Add to history
        addToHistory(`M+ (${display})`, memory !== null ? (memory + currentValue).toString() : currentValue.toString());
    };

    const handleMemorySubtract = () => {
        const currentValue = parseFloat(display);
        if (memory === null) {
            setMemory(-currentValue);
        } else {
            setMemory(memory - currentValue);
        }
        setResetOnNextInput(true);

        // Add to history
        addToHistory(`M- (${display})`, memory !== null ? (memory - currentValue).toString() : (-currentValue).toString());
    };

    const handleMemoryRecall = () => {
        if (memory !== null) {
            setDisplay(memory.toString());

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} ${memory}`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = `MR (${memory})`;
                setCurrentExpression(expressionRef.current);
            }

            // Add to history
            addToHistory("Memory Recall", memory.toString());
        }
    };

    const handleMemoryClear = () => {
        if (memory !== null) {
            // Add to history before clearing
            addToHistory("Memory Clear", "0");
            setMemory(null);
        }
    };

    const handlePercentage = () => {
        const currentValue = parseFloat(display);
        const result = (currentValue / 100).toString();
        setDisplay(result);

        // Update expression tracking
        if (operation && previousValue !== null) {
            expressionRef.current = `${previousValue} ${operation} ${result}`;
            setCurrentExpression(expressionRef.current);
        } else {
            expressionRef.current = `${display}% = ${result}`;
            setCurrentExpression(expressionRef.current);
        }

        // Add to history
        addToHistory(`${display}%`, result);
    };

    const handlePlusMinus = () => {
        if (display !== "0") {
            const result = (parseFloat(display) * -1).toString();
            setDisplay(result);

            // Update expression tracking
            if (operation && previousValue !== null) {
                expressionRef.current = `${previousValue} ${operation} (${result})`;
                setCurrentExpression(expressionRef.current);
            } else {
                expressionRef.current = `negate(${display}) = ${result}`;
                setCurrentExpression(expressionRef.current);
            }

            // Add to history
            addToHistory(`negate(${display})`, result);
        }
    };

    const handleClearHistory = () => {
        setHistory([]);
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

    const TabButton = ({
        active,
        onPress,
        children
    }: {
        active: boolean,
        onPress: () => void,
        children: React.ReactNode
    }) => (
        <TouchableOpacity
            style={[
                styles.tabButton,
                active ? styles.activeTabButton : styles.inactiveTabButton
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.tabButtonText,
                active ? styles.activeTabButtonText : styles.inactiveTabButtonText
            ]}>
                {children}
            </Text>
        </TouchableOpacity>
    );

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyItemContent}>
                <Text style={styles.historyExpression}>{item.expression} = {item.result}</Text>
                <Text style={styles.historyTimestamp}>{formatTime(item.timestamp)}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8e3b4" />
            <View style={styles.calculator}>
                <View style={styles.tabs}>
                    <TabButton
                        active={activeTab === 'calculator'}
                        onPress={() => setActiveTab('calculator')}
                    >
                        Calculator
                    </TabButton>
                    <TabButton
                        active={activeTab === 'history'}
                        onPress={() => setActiveTab('history')}
                    >
                        History
                    </TabButton>
                </View>

                {activeTab === 'calculator' ? (
                    <>
                        <View style={styles.displayContainer}>
                            <View style={styles.displayHeader}>
                                <Text style={styles.displayLabel}>RETRO CALC</Text>
                                {memory !== null && (
                                    <Text style={styles.memoryIndicator}>M</Text>
                                )}
                            </View>
                            <View style={styles.display}>
                                <Text style={styles.currentExpression} numberOfLines={1}>
                                    {currentExpression}
                                </Text>
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
                    </>
                ) : (
                    <View style={styles.historyContainer}>
                        {history.length > 0 ? (
                            <>
                                <FlatList
                                    data={history}
                                    renderItem={renderHistoryItem}
                                    keyExtractor={item => item.id}
                                    style={styles.historyList}
                                    contentContainerStyle={styles.historyListContent}
                                />
                                <TouchableOpacity
                                    style={styles.clearHistoryButton}
                                    onPress={handleClearHistory}
                                >
                                    <Text style={styles.clearHistoryButtonText}>Clear History</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.emptyHistory}>
                                <Text style={styles.emptyHistoryText}>No calculations yet</Text>
                                <Text style={styles.emptyHistorySubtext}>Perform some calculations to see them here</Text>
                            </View>
                        )}
                    </View>
                )}
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
        padding: 16,
    },
    calculator: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#f5d787', // amber-100 equivalent
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#92400e',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: '#92400e', // amber-800 equivalent
    },
    inactiveTabButton: {
        backgroundColor: 'transparent',
    },
    tabButtonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    activeTabButtonText: {
        color: '#ffffff',
    },
    inactiveTabButtonText: {
        color: '#92400e', // amber-800 equivalent
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
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    currentExpression: {
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#86efac', // green-300 equivalent
        opacity: 0.7,
        marginBottom: 4,
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
        height: 56,
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
    historyContainer: {
        minHeight: 350,
    },
    historyList: {
        maxHeight: 350,
        marginBottom: 16,
    },
    historyListContent: {
        paddingBottom: 8,
    },
    historyItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: '#92400e', // amber-800 equivalent
    },
    historyItemContent: {
        padding: 12,
    },
    historyExpression: {
        fontFamily: 'monospace',
        fontSize: 16,
        color: '#78350f', // amber-950 equivalent
        marginBottom: 4,
    },
    historyTimestamp: {
        fontSize: 12,
        color: '#92400e', // amber-800 equivalent
        opacity: 0.7,
    },
    clearHistoryButton: {
        backgroundColor: '#b45309', // amber-700 equivalent
        borderRadius: 6,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 3,
        borderBottomColor: '#78350f', // amber-900 equivalent
    },
    clearHistoryButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    emptyHistory: {
        height: 350,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    emptyHistoryText: {
        fontSize: 18,
        color: '#92400e', // amber-800 equivalent
        fontStyle: 'italic',
        marginBottom: 8,
    },
    emptyHistorySubtext: {
        fontSize: 14,
        color: '#92400e', // amber-800 equivalent
        opacity: 0.7,
    },
});

export default RetroCalculator;
