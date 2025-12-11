import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, PermissionsAndroid, Alert, AppState, TextInput, TouchableOpacity } from 'react-native';
import SmsListener from 'react-native-android-sms-listener';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const BACKEND_URL = 'https://bonimusik-app-mobile.onrender.com/api/payments/webhook/sms';

type Log = {
    id: number;
    time: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'sms';
};

export default function App() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [lastSms, setLastSms] = useState<any>(null);

    const addLog = (message: string, type: 'info' | 'success' | 'error' | 'sms' = 'info') => {
        const newLog = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            message,
            type
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
    };

    const requestSmsPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
                {
                    title: "Permission Lecture SMS",
                    message: "L'application a besoin d'accéder aux SMS pour valider les paiements.",
                    buttonNeutral: "Plus tard",
                    buttonNegative: "Annuler",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                addLog('Permission SMS accordée', 'success');
                startListening();
            } else {
                addLog('Permission SMS refusée', 'error');
            }
        } catch (err) {
            console.warn(err);
            addLog('Erreur permission: ' + err, 'error');
        }
    };

    const startListening = () => {
        if (isListening) return;

        setIsListening(true);
        addLog('Démarrage du Listener...', 'info');

        try {
            const subscription = SmsListener.addListener(async (message: any) => {
                addLog(`SMS Reçu de: ${message.originatingAddress}`, 'sms');
                setLastSms(message);

                processSms(message);
            });
            addLog('En attente de SMS Wave/Orange...', 'success');
        } catch (error) {
            // Mock listener for development/Expo Go (since native module won't work in Expo Go)
            addLog('Note: Le module SMS natif nécessite un Build Custom.', 'info');
        }
    };

    const processSms = async (message: any) => {
        const body = message.body;
        const sender = message.originatingAddress;

        // 1. Filter irrelevant SMS (Optional: only process known providers)
        // const knownSenders = ['Wave', 'OrangeMoney', 'Orange', 'Moov'];
        // if (!knownSenders.some(s => sender.includes(s))) {
        //    addLog(`Ignoré (Expéditeur inconnu: ${sender})`, 'info');
        //    return;
        // }

        // 2. Extract Amount (Regex for "2000 F", "50000FCFA", etc.)
        // Matches numbers followed optionally by space and F/FCFA/XOF
        const amountRegex = /(\d+[\.,]?\d*)\s*(F|FCFA|XOF)/i;
        const match = body.match(amountRegex);

        let amount = 0;
        if (match) {
            // Clean amount string (remove dots/commas if needed, though simple ints are best)
            const cleanAmount = match[1].replace(/[\.,]/g, '');
            amount = parseInt(cleanAmount, 10);
        }

        if (amount > 0) {
            addLog(`Montant détecté: ${amount} FCFA`, 'success');
            sendToBackend(amount, sender, body);
        } else {
            addLog('Aucun montant détecté dans ce SMS', 'error');
        }
    };

    const sendToBackend = async (amount: number, phoneNumber: string, rawSms: string) => {
        try {
            addLog(`Envoi au serveur... (${amount}F)`, 'info');

            // Generate a fake transaction ref if not found (or use timestamp)
            // Simple regex for ID inside SMS if possible: ID: XXXXX
            const idRegex = /(ID|Trans\. ID|Transaction)[:\s]*([A-Z0-9\.]+)/i;
            const idMatch = rawSms.match(idRegex);
            const transactionRef = idMatch ? idMatch[2] : `SMS-${Date.now()}`;

            const payload = {
                amount,
                phoneNumber,
                transactionRef,
                rawSms
            };

            const response = await axios.post(BACKEND_URL, payload);

            if (response.data.success) {
                addLog(`✅ VALIDÉ ! User: ${response.data.userId || '?'}`, 'success');
            } else {
                addLog(`❌ Refusé par serveur: ${response.data.message || 'Erreur'}`, 'error');
            }

        } catch (error) {
            addLog(`Erreur Réseau: ${error.message}`, 'error');
        }
    };

    // Dev Tool: Simulate SMS reception
    const simulateSms = () => {
        const mockMsg = {
            originatingAddress: 'Wave',
            body: 'Vous avez reçu 2000F de 0701020304. ID: TEST-123456 pour votre abonnement.',
            timestamp: Date.now()
        };
        processSms(mockMsg);
    };

    useEffect(() => {
        requestSmsPermission();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <Text style={styles.title}>Boni Listener 📡</Text>
                <View style={[styles.badge, { backgroundColor: isListening ? '#4CAF50' : '#f44336' }]}>
                    <Text style={styles.badgeText}>{isListening ? 'ACTIF' : 'INACTIF'}</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <Text style={styles.statText}>Backend: {BACKEND_URL}</Text>
            </View>

            <ScrollView style={styles.logs} contentContainerStyle={styles.logsContent}>
                {logs.length === 0 && <Text style={styles.emptyText}>En attente de SMS...</Text>}
                {logs.map(log => (
                    <View key={log.id} style={[styles.logItem, styles[`log_${log.type}`]]}>
                        <Text style={styles.logTime}>{log.time}</Text>
                        <Text style={styles.logMessage}>{log.message}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btn} onPress={simulateSms}>
                    <Text style={styles.btnText}>Simuler Réception SMS (Test)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    stats: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    statText: {
        color: '#666',
        fontSize: 10,
    },
    logs: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        marginHorizontal: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    logsContent: {
        padding: 15,
    },
    logItem: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
    },
    logTime: {
        color: '#888',
        fontSize: 12,
        marginRight: 10,
        width: 60,
    },
    logMessage: {
        color: '#eee',
        fontSize: 14,
        flex: 1,
    },
    log_info: { borderLeftWidth: 3, borderLeftColor: '#2196F3', paddingLeft: 10 },
    log_success: { borderLeftWidth: 3, borderLeftColor: '#4CAF50', paddingLeft: 10 },
    log_error: { borderLeftWidth: 3, borderLeftColor: '#F44336', paddingLeft: 10 },
    log_sms: { borderLeftWidth: 3, borderLeftColor: '#FFC107', paddingLeft: 10 },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic'
    },
    footer: {
        padding: 20,
    },
    btn: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnText: {
        color: '#aaa',
        fontWeight: '600'
    }
});
