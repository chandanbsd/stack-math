import * as React from 'react';
import { Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const MathNotes = () => (
    <Surface style={styles.surface}>
        <Text>Surface</Text>
    </Surface>
);

export default MathNotes;

const styles = StyleSheet.create({
    surface: {
        padding: 8,
        paddingTop: 20,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
